import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {softmax,attention,bpe,trainTable,bellman,gae,clipped,dpo,retrieve,loop,patches,control,calculate} from './engine.js';
const close=(a,b,tolerance=1e-9)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
close(softmax([1000,1000])[0],.5);
assert.throws(()=>softmax([-Infinity,-Infinity]));
const a=attention([1,0],[[1,0],[0,1]],[[2,0],[0,4]]);
close(a.weights[0],.6697615493266569);
close(a.output[0],1.3395230986533138);
close(a.output[1],1.3209538026933725);
const masked=attention([1,0],[[1,0],[0,1]],[[2,0],[0,4]],[true,false]);
assert.deepEqual(masked.output,[2,0]);
const texts=['low low','lower low','new low'];
assert.deepEqual(bpe(texts,5).corpus.map(row=>row.join('')),texts);
const trained=trainTable(80,1);assert.ok(trained.losses.at(-1)<trained.losses[0]);
const value=bellman(.9,1,250);close(value.values[0],value.exact[0],1e-8);assert.ok(value.residual<1e-10);
const advantages=gae(1).advantages;close(advantages[0],.81-.2);close(advantages[1],.9-.3);close(advantages[2],1-.4);
close(clipped(1.3,2),2.4);close(clipped(.7,-2),-1.6);
const pair=dpo(.2,-.1,.4),h=1e-5;
close(pair.gradient,(dpo(.2+h,-.1,.4).loss-dpo(.2-h,-.1,.4).loss)/(2*h),1e-8);
assert.equal(retrieve('current service port',8).lexical[0],0);
assert.equal(loop(3,true).status,'verified');assert.equal(loop(1,false).status,'insufficient_evidence');assert.equal(loop(2,true).status,'budget_exhausted');
assert.deepEqual(patches(2)[0],[0,1,4,5]);
assert.ok(Math.abs(control(5).at(-1))<1);assert.ok(Math.abs(control(25).at(-1))>1);
const catalog=JSON.parse(await fs.readFile(new URL('./catalog.json',import.meta.url),'utf8'));
function inspect(value){if(typeof value==='number')assert.ok(Number.isFinite(value));else if(value&&typeof value==='object')for(const item of Object.values(value))inspect(item);}
for(const entry of catalog.experiments){
 const parameters=Object.fromEntries(entry.controls.map(c=>[c.name,c.value]));inspect(calculate(entry.id,parameters));
 for(const control of entry.controls){
  const options=control.options||((control.type==='range')?[control.min,control.max]:['',control.value]);
  for(const value of options){inspect(calculate(entry.id,{...parameters,[control.name]:value}));}
 }
}
const cached=calculate('lab-08',{tokens:1024,batch:1,groups:2,temperature:1});close(cached.metrics['Direct / cached last-row error'],0);
assert.throws(()=>calculate('lab-01',{first:NaN,second:2}));
console.log('PASS: numerical invariants, derivatives, all 18 default calculations, and individual control extremes.');
