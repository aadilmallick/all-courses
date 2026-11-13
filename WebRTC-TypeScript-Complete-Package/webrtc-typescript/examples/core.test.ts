import test from 'node:test';
import assert from 'node:assert/strict';
import { bitrate, topology, summarizeSdp } from '../companion/src/core.ts';
test('rate derives bits per second from byte and millisecond deltas', () => {
  assert.equal(bitrate({ timestamp: 1000, bytes: 200000 }, { timestamp: 3000, bytes: 500000 }), 1200000);
  assert.equal(bitrate(undefined, { timestamp: 1000, bytes: 200 }), null);
  assert.equal(bitrate({ timestamp: 1000, bytes: 200 }, { timestamp: 1000, bytes: 300 }), null);
  assert.equal(bitrate({ timestamp: 1000, bytes: 200 }, { timestamp: 2000, bytes: 0 }), null);
});
test('mesh and SFU bandwidth model', () => {
  assert.deepEqual(topology(6, 1.2), { links: 15, meshUpload: 6, sfuUpload: 1.2, allVideoDownload: 6, sfuEgress: 36 });
  assert.throws(() => topology(1, 2), RangeError);
});
test('SDP summary is read-only selection, not a negotiation parser', () => {
  assert.deepEqual(summarizeSdp('v=0\r\nm=video 9 UDP/TLS/RTP/SAVPF 96\r\na=mid:0\r\na=sendrecv\r\n'), ['m=video 9 UDP/TLS/RTP/SAVPF 96', 'a=mid:0', 'a=sendrecv']);
});

import { waitForDrain, sendBuffer, hash } from '../companion/src/transfer.ts';
import { negotiate } from '../companion/src/peer.ts';
import { turnCredentials } from './turn-credentials.mjs';
class FakeChannel extends EventTarget {
  readyState = 'open'; bufferedAmount = 0; bufferedAmountLowThreshold = 0;
  chunks: Uint8Array[] = [];
  send(bytes: Uint8Array) { this.chunks.push(bytes); }
}
test('bounded chunks preserve every byte, including a short final chunk', async () => {
  const channel = new FakeChannel(); const bytes = new Uint8Array(40001).map((_,i) => i%251);
  await sendBuffer(channel as unknown as RTCDataChannel, bytes, 8000, new AbortController().signal);
  assert.deepEqual(channel.chunks.map(chunk => chunk.length), [8000,8000,8000,8000,8000,1]);
  assert.deepEqual(Buffer.concat(channel.chunks), Buffer.from(bytes));
  assert.equal(await hash(new Uint8Array([97,98,99])), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});
test('backpressure waits for low threshold, and abort/close settle waits', async () => {
  const channel = new FakeChannel(); channel.bufferedAmount = 300000;
  let resolved = false;
  const pending = waitForDrain(channel as unknown as RTCDataChannel, new AbortController().signal).then(() => {resolved=true;});
  await Promise.resolve(); assert.equal(resolved,false);
  channel.bufferedAmount=1000;channel.dispatchEvent(new Event('bufferedamountlow'));await pending;
  channel.bufferedAmount=300000; const controller=new AbortController();
  const cancelled=waitForDrain(channel as unknown as RTCDataChannel,controller.signal);controller.abort();
  await assert.rejects(cancelled,{name:'AbortError'});
  const closed=waitForDrain(channel as unknown as RTCDataChannel,new AbortController().signal);
  channel.readyState='closed';channel.dispatchEvent(new Event('close'));await assert.rejects(closed,/closed/);
});
test('short-lived coturn credentials use fixed expiry and reject invalid lifetime', () => {
  const c=turnCredentials('synthetic-test-secret','test_user',1800000000,600);
  assert.equal(c.username,'1800000600:test_user');assert.equal(c.expires,1800000600);
  assert.equal(c.credential,'dXE8UU+L+xecUILSvybl/AXqYac=');
  assert.throws(()=>turnCredentials('test','user',0,0));
});
class FakePeer extends EventTarget {
  signalingState='stable'; localDescription: {toJSON():object}|null=null;
  applied: string[]=[]; active=0; maximum=0;
  async setLocalDescription() {this.localDescription={toJSON:()=>({type:'answer',sdp:'synthetic'})};}
  async setRemoteDescription(description: {type:string}) {
    this.active++;this.maximum=Math.max(this.maximum,this.active);
    await Promise.resolve();this.applied.push(description.type);this.active--;
  }
  async addIceCandidate() {this.applied.push('candidate');}
}
test('negotiator serializes remote work and does not apply ignored glare', async () => {
  const pc=new FakePeer();const sent: object[]=[];const errors: unknown[]=[];
  const n=negotiate(pc as unknown as RTCPeerConnection,true,s=>sent.push(s),e=>errors.push(e));
  await Promise.all([n.receive({description:{type:'offer',sdp:'one'}}),n.receive({candidate:{candidate:'synthetic'}})]);
  assert.deepEqual(pc.applied,['offer','candidate']);assert.equal(pc.maximum,1);assert.equal(sent.length,1);assert.deepEqual(errors,[]);n.dispose();
  const impolite=new FakePeer();impolite.signalingState='have-local-offer';
  const ni=negotiate(impolite as unknown as RTCPeerConnection,false,()=>{},e=>errors.push(e));
  await ni.receive({description:{type:'offer',sdp:'collision'}});assert.deepEqual(impolite.applied,[]);ni.dispose();
});
