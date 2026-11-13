/** Executable with Node 24's built-in type stripping. No SDK dependency. */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

type Receipt = {receipt: string; slot: string};
export class Playback {
  epoch = 0;
  queue: string[] = [];
  interrupt(): void { this.epoch++; this.queue.length = 0; }
  accept(epoch: number, chunk: string): boolean {
    if (epoch !== this.epoch) return false;
    this.queue.push(chunk); return true;
  }
}
export class BookingLedger {
  proposals = new Map<string, {user: string; slot: string}>();
  receipts = new Map<string, Receipt>();
  propose(user: string, slot: string, id: string): string {
    const old = this.proposals.get(id);
    if (old && (old.user !== user || old.slot !== slot)) throw Error('proposal ID conflict');
    this.proposals.set(id, {user, slot}); return id;
  }
  confirm(user: string, id: string): Receipt {
    const proposal = this.proposals.get(id);
    if (!proposal || proposal.user !== user) throw Error('unknown or wrong owner');
    if (!this.receipts.has(id)) this.receipts.set(id, {receipt: `booking-${this.receipts.size+1}`, slot: proposal.slot});
    return this.receipts.get(id)!;
  }
}
export function endpoint(frames: boolean[], silenceMs=500, frameMs=20): number[] {
  if (silenceMs<=0 || frameMs<=0) throw Error('positive timing required');
  let active=false, quiet=0;
  const commits: number[]=[];
  frames.forEach((speech,i)=>{
    if(speech) {active=true; quiet=0;}
    else if(active) {quiet+=frameMs; if(quiet>=silenceMs) {commits.push((i+1)*frameMs);active=false;quiet=0;}}
  });
  return commits;
}
export function wavTone(rate=16000, seconds=1): Buffer {
  const count=Math.round(rate*seconds), data=Buffer.alloc(44+count*2);
  data.write('RIFF'); data.writeUInt32LE(data.length-8,4); data.write('WAVE',8);
  data.write('fmt ',12);data.writeUInt32LE(16,16);data.writeUInt16LE(1,20);
  data.writeUInt16LE(1,22);data.writeUInt32LE(rate,24);data.writeUInt32LE(rate*2,28);
  data.writeUInt16LE(2,32);data.writeUInt16LE(16,34);data.write('data',36);data.writeUInt32LE(count*2,40);
  for(let n=0;n<count;n++) data.writeInt16LE(Math.round(0.15*Math.sin(2*Math.PI*440*n/rate)*32767),44+2*n);
  return data;
}
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync('tone-ts.wav', wavTone());
  console.log('commits:', endpoint([...Array(10).fill(true),...Array(25).fill(false)]));
}
