import { bitrate, topology, summarizeSdp, textError } from './core.js';
import type { Sample } from './core.js';
import { negotiate } from './peer.js';
import { hash, sendBuffer } from './transfer.js';
function el<T extends HTMLElement>(id: string): T {
  const node = document.getElementById(id); if (!node) throw new Error(`Missing ${id}`); return node as T;
}
export function mount() {
  const local = el<HTMLVideoElement>('local'), remote = el<HTMLVideoElement>('remote');
  let peers: RTCPeerConnection[] = [], streams = new Set<MediaStream>(), disposers: (() => void)[] = [];
  let epoch = 0, dc: RTCDataChannel | undefined, sender: RTCRtpSender | undefined, current: MediaStreamTrack | undefined;
  let abort = new AbortController(), sending = false, bus: BroadcastChannel | undefined;
  let triggerGlare: (() => void) | undefined;
  let mediaOperation = 0;
  function mediaButtons(disabled: boolean) {
    for (const id of ['camera', 'screen']) el<HTMLButtonElement>(id).disabled = disabled;
  }
  async function acquireMedia(action: () => Promise<void>) {
    const operation = ++mediaOperation; mediaButtons(true);
    try { await action(); } finally { if (operation === mediaOperation) mediaButtons(false); }
  }
  let lines: string[] = [], samples = new Map<string, Sample>();
  const log = (message: string) => { lines.push(`${new Date().toLocaleTimeString()} ${message}`); lines = lines.slice(-100); el('log').textContent = lines.join('\n'); };
  const fail = (error: unknown) => log(textError(error));
  const listeners: (() => void)[] = [];
  function click(id: string, action: () => unknown) {
    const node = el(id), handler = () => { Promise.resolve().then(action).catch(fail); };
    node.addEventListener('click', handler); listeners.push(() => node.removeEventListener('click', handler));
  }
  function reset() {
    epoch++; mediaOperation++; mediaButtons(false); abort.abort(); abort = new AbortController(); sending = false;
    disposers.splice(0).forEach(fn => fn()); bus?.close(); bus = undefined; triggerGlare = undefined;
    peers.forEach(pc => pc.close()); peers = [];
    streams.forEach(stream => stream.getTracks().forEach(track => track.stop())); streams.clear();
    dc = undefined; sender = undefined; current = undefined; samples.clear();
    local.srcObject = remote.srcObject = null;
    el('state').textContent = 'Idle'; el('stats').textContent = 'No connection'; el('sdp').textContent = '';
    el('transfer-state').textContent = 'No transfer';
  }
  function synthetic() {
    const canvas = document.createElement('canvas'); canvas.width = 640; canvas.height = 360;
    const context = canvas.getContext('2d'); if (!context) throw new Error('Canvas unavailable');
    let frame = 0;
    const draw = () => {
      context.fillStyle = '#102a43'; context.fillRect(0,0,640,360); context.fillStyle = '#80f0db';
      context.fillRect((frame * 4) % 560,190,80,80); context.font = '26px sans-serif';
      context.fillText('Real WebRTC canvas video',25,65); context.fillText(`Frame ${frame++}`,25,110);
    };
    draw(); const timer = setInterval(draw,100); disposers.push(() => clearInterval(timer));
    const stream = canvas.captureStream(10); streams.add(stream); return stream;
  }
  function attach(channel: RTCDataChannel) {
    channel.binaryType = 'arraybuffer'; const version = epoch;
    let incoming: { size: number; sha: string; chunks: Uint8Array[]; count: number } | undefined;
    channel.addEventListener('open', () => { dc ??= channel; log(`Data channel open: ${channel.label}`); });
    channel.addEventListener('close', () => { if (dc === channel) dc = undefined; });
    channel.addEventListener('message', async event => {
      try {
        if (version !== epoch) return;
        if (event.data instanceof ArrayBuffer) {
          if (!incoming) throw new Error('No transfer metadata'); incoming.count += event.data.byteLength;
          if (incoming.count > incoming.size) { incoming = undefined; throw new Error('Transfer exceeded size'); }
          incoming.chunks.push(new Uint8Array(event.data)); return;
        }
        if (typeof event.data !== 'string' || event.data.length > 8192) throw new Error('Invalid control message');
        const msg = JSON.parse(event.data);
        if (msg.type === 'text' && typeof msg.text === 'string') log(`Received text: ${msg.text.slice(0,2048)}`);
        else if (msg.type === 'start') {
          if (incoming || !Number.isInteger(msg.size) || msg.size < 1 || msg.size > 8388608 || !/^[a-f0-9]{64}$/.test(msg.sha)) throw new Error('Invalid metadata');
          incoming = {size:msg.size,sha:msg.sha,chunks:[],count:0};
        } else if (msg.type === 'end') {
          const completed = incoming; incoming = undefined;
          if (!completed || completed.count !== completed.size) throw new Error('Incomplete transfer');
          const bytes = new Uint8Array(completed.size); let offset = 0;
          for (const chunk of completed.chunks) { bytes.set(chunk,offset); offset += chunk.length; }
          const valid = await hash(bytes) === completed.sha; if (version !== epoch) return;
          const result = `Received ${offset} bytes; SHA-256 ${valid ? 'verified' : 'MISMATCH'}`;
          el('transfer-state').textContent = result; log(result);
          if (channel.readyState === 'open') channel.send(JSON.stringify({type:'ack',size:offset,valid}));
        } else if (msg.type === 'ack') log(`Receiver acknowledgment: ${msg.size} bytes, valid=${msg.valid}`);
        else throw new Error('Unknown message type');
      } catch (error) { fail(error); }
    });
  }
  function peer(name: string) {
    const pc = new RTCPeerConnection({iceServers:[]}); peers.push(pc);
    const update = () => {
      el('state').textContent = peers.map((p,i) => `Peer ${i+1}: ${p.connectionState} / ICE ${p.iceConnectionState} / signaling ${p.signalingState}`).join(' | ');
      log(`${name}: ${pc.connectionState}, ICE ${pc.iceConnectionState}, signaling ${pc.signalingState}`);
    };
    for (const event of ['connectionstatechange','iceconnectionstatechange','signalingstatechange']) pc.addEventListener(event,update);
    pc.addEventListener('track', event => {
      const stream = remote.srcObject instanceof MediaStream ? remote.srcObject : new MediaStream();
      if (!stream.getTracks().includes(event.track)) stream.addTrack(event.track);
      remote.srcObject = stream; remote.play().catch(fail);
    });
    pc.addEventListener('datachannel', event => attach(event.channel)); return pc;
  }
  function addVideo(pc: RTCPeerConnection) {
    const stream = synthetic(); current = stream.getVideoTracks()[0]; local.srcObject = stream; sender = pc.addTrack(current,stream);
  }
  click('loop', () => {
    reset(); const a = peer('A'), b = peer('B');
    let na: ReturnType<typeof negotiate>, nb: ReturnType<typeof negotiate>;
    na = negotiate(a,false,s => { void nb.receive(structuredClone(s)); },fail);
    nb = negotiate(b,true,s => { void na.receive(structuredClone(s)); },fail);
    disposers.push(na.dispose,nb.dispose); attach(a.createDataChannel('lab')); addVideo(a); log('Local peer pair started');
  });
  click('stop', () => { reset(); log('Reset released owned resources'); });
  click('join', () => {
    reset(); const version = epoch, room = el<HTMLInputElement>('room').value, role = el<HTMLSelectElement>('role').value;
    if (!/^[\w-]{1,64}$/.test(room)) throw new Error('Use 1–64 letters, digits, _ or - for room');
    const id = crypto.randomUUID(); let other: string | undefined;
    const signaling = new BroadcastChannel(`webrtc-book-${room}`); bus = signaling; const pc = peer(role);
    const send = (payload: object) => signaling.postMessage({...payload,from:id,to:other});
    const n = negotiate(pc,role === 'B',signal => send({type:'signal',signal}),fail); disposers.push(n.dispose);
    function activate(remoteId: string) {
      if (other) return; other = remoteId; addVideo(pc); if (role === 'A') attach(pc.createDataChannel('tab-lab')); log(`Paired role ${role}`);
    }
    signaling.onmessage = event => {
      const m = event.data; if (version !== epoch || !m || typeof m.from !== 'string') return;
      if (m.type === 'hello' && m.role !== role && (!other || other === m.from)) {
        signaling.postMessage({type:'ready',from:id,to:m.from,role}); activate(m.from);
      } else if (m.type === 'ready' && m.to === id && m.role !== role) activate(m.from);
      else if (m.from === other && m.to === id) {
        if (m.type === 'signal' && m.signal && (m.signal.description?.type === 'offer' || m.signal.description?.type === 'answer' || typeof m.signal.candidate?.candidate === 'string')) void n.receive(m.signal);
        if (m.type === 'glare') pc.addTransceiver('audio',{direction:'recvonly'});
      }
    };
    triggerGlare = () => { if (!other) throw new Error('Wait for the other tab'); send({type:'glare'}); pc.addTransceiver('audio',{direction:'recvonly'}); log('Both peers requested a new receive slot'); };
    signaling.postMessage({type:'hello',from:id,role}); el('state').textContent = `Waiting for opposite role in ${room}`;
  });
  click('glare', () => { if (!triggerGlare) throw new Error('Use two-tab mode'); triggerGlare(); });
  click('restart', () => { if (!peers[0]) throw new Error('Start a call'); peers[0].restartIce(); log('ICE restart requested'); });
  async function replace(stream: MediaStream, restore: boolean, version: number, activeSender: RTCRtpSender) {
    if (version !== epoch) { stream.getTracks().forEach(t => t.stop()); return; }
    streams.add(stream); const track = stream.getVideoTracks()[0], previous = current;
    try { await activeSender.replaceTrack(track); } catch(error) { track.stop(); streams.delete(stream); throw error; }
    if (version !== epoch) { track.stop(); return; }
    current = track; local.srcObject = stream;
    if (!restore) previous?.stop();
    else track.addEventListener('ended', () => {
      if (version !== epoch || current !== track) return;
      const target = previous?.readyState === 'live' ? previous : null;
      void activeSender.replaceTrack(target).then(() => {
        if (version === epoch && current === track) { current = target ?? undefined; local.srcObject = target ? new MediaStream([target]) : null; }
      }).catch(fail);
    },{once:true});
  }
  click('camera', () => acquireMedia(async () => {
    const activeSender = sender, version = epoch; if (!activeSender) throw new Error('Start a call');
    const stream = await navigator.mediaDevices.getUserMedia({video:{width:{ideal:640}},audio:false});
    await replace(stream,false,version,activeSender); if (version === epoch) log('Camera replaced the video source');
  }));
  click('screen', () => acquireMedia(async () => {
    const activeSender = sender, version = epoch; if (!activeSender) throw new Error('Start a call');
    if (!navigator.mediaDevices?.getDisplayMedia) throw new Error('Screen capture unavailable');
    const stream = await navigator.mediaDevices.getDisplayMedia({video:true,audio:false});
    await replace(stream,true,version,activeSender); if (version === epoch) log('Screen active; browser Stop sharing restores the source');
  }));
  click('mute', () => { if (!current) throw new Error('No video'); current.enabled = !current.enabled; log(`Video enabled=${current.enabled}`); });
  click('apply', async () => {
    if (!sender) throw new Error('No sender'); const p = sender.getParameters(), cap = Number(el<HTMLInputElement>('cap').value);
    if (!Number.isFinite(cap) || cap < 100 || cap > 5000) throw new Error('Use 100–5000 kbps');
    if (!p.encodings?.length) throw new Error('Wait for negotiated encodings'); p.encodings[0].maxBitrate = cap*1000;
    await sender.setParameters(p); log(`Requested ceiling ${cap} kbps`);
  });
  click('send', () => { if (dc?.readyState !== 'open') throw new Error('Wait for channel open'); dc.send(JSON.stringify({type:'text',text:el<HTMLInputElement>('message').value})); log('Text enqueued'); });
  click('transfer', async () => {
    const channel = dc; if (channel?.readyState !== 'open') throw new Error('Wait for channel open'); if (sending) throw new Error('One transfer at a time');
    sending = true; const version = epoch, signal = abort.signal;
    try {
      const size = Number(el<HTMLSelectElement>('size').value), bytes = new Uint8Array(size);
      for (let i=0;i<size;i++) bytes[i]=i%251;
      const sha = await hash(bytes); if (signal.aborted) return;
      channel.send(JSON.stringify({type:'start',size,sha})); el('transfer-state').textContent = `Sending ${size} bytes`;
      await sendBuffer(channel,bytes,peers[0]?.sctp?.maxMessageSize ?? 16384,signal);
      channel.send(JSON.stringify({type:'end'})); log(`Enqueued ${size} bytes; awaiting receiver`);
    } finally { if (version === epoch) sending=false; }
  });
  click('inspect', () => { el('sdp').textContent = summarizeSdp(peers[0]?.localDescription?.sdp ?? '').join('\n') || 'No description'; });
  function calculate() {
    const r = topology(Number(el<HTMLInputElement>('participants').value),Number(el<HTMLInputElement>('rate').value));
    el('topology').textContent = `Mesh links: ${r.links}\nMesh upload per person: ${r.meshUpload.toFixed(2)} Mbps\nSFU upload per person: ${r.sfuUpload.toFixed(2)} Mbps\nAll-video download per person: ${r.allVideoDownload.toFixed(2)} Mbps\nSFU total video egress: ${r.sfuEgress.toFixed(2)} Mbps`;
  }
  click('calculate',calculate); calculate();
  let polling = false;
  const timer = setInterval(async () => {
    if (polling || !peers.length) return; polling=true; const version=epoch;
    try {
      const output: string[] = [];
      for (const [i,pc] of peers.entries()) {
        const stats = await pc.getStats(); if (version!==epoch) return;
        stats.forEach(s => {
          if (s.type==='inbound-rtp' || s.type==='outbound-rtp') {
            const bytes=s.bytesSent??s.bytesReceived; if (typeof bytes!=='number') return;
            const key=`${i}:${s.id}`, now={bytes,timestamp:s.timestamp}, rate=bitrate(samples.get(key),now); samples.set(key,now);
            output.push(`peer ${i+1} ${s.type} ${s.kind}: ${rate===null?'baseline':(rate/1000).toFixed(1)+' kbps'}, frames=${s.framesEncoded??s.framesDecoded??'n/a'}, lost=${s.packetsLost??'n/a'}`);
          }
          if (s.type==='transport' && s.selectedCandidatePairId) {
            const p=stats.get(s.selectedCandidatePairId), c=p&&stats.get(p.localCandidateId);
            output.push(`peer ${i+1} path=${c?.candidateType??'n/a'}, protocol=${c?.protocol??'n/a'}, RTT=${typeof p?.currentRoundTripTime==='number'?(p.currentRoundTripTime*1000).toFixed(1)+' ms':'n/a'}`);
          }
        });
      }
      if (version===epoch) el('stats').textContent=output.join('\n')||'Waiting for reports';
    } catch(error) { if(version===epoch) fail(error); } finally { polling=false; }
  },1000);
  const leave=()=>reset(); window.addEventListener('pagehide',leave);
  return ()=>{clearInterval(timer);reset();listeners.forEach(f=>f());window.removeEventListener('pagehide',leave);};
}
mount();
