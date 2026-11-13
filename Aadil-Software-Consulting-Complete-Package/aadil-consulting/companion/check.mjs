import assert from 'node:assert/strict';
import fs from 'node:fs';
import {execFileSync} from 'node:child_process';
import * as m from './core.mjs';
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
const cases=JSON.parse(fs.readFileSync(new URL('../examples/routing-cases.json',import.meta.url),'utf8'));
let checks=0;
function check(name,fn){fn();console.log('PASS '+name);checks++;}
check('Customer value worked example',()=>{
 const r=m.businessCase({developers:6,weeklyHours:1.5,weeks:48,rate:80,addressable:50,realization:80,operating:1800,fee:9000});
 close(r.gross,34560);close(r.modeled,13824);close(r.net,12024);close(r.paybackMonths,9000/12024*12);
});
check('No positive value produces no payback',()=>{
 const r=m.businessCase({developers:0,weeklyHours:1,weeks:48,rate:80,addressable:50,realization:80,operating:100,fee:9000});assert.equal(r.paybackMonths,null);assert.equal(r.net,-100);
});
check('Time budget and exceeded budget remain visible',()=>{
 const r=m.reliability({days:30,target:99.9,observed:18});close(r.budget,43.2);close(r.remaining,25.2);
 close(m.reliability({days:30,target:99.9,observed:60}).remaining,-16.8);
 assert.equal(m.reliability({days:30,target:100,observed:0}).usedPercent,null);
});
check('Readiness total never overrides a failed gate',()=>{
 const r=m.readiness({technical:4,demonstration:2,buyer:4,safeguards:4});assert.equal(r.total,14);assert.equal(r.gates,false);
});
check('Default evaluation and modeled review effort',()=>{
 const r=m.evaluate(cases,.8);assert.equal(r.accepted,6);assert.equal(r.correct_accepted,5);assert.equal(r.review,6);close(r.precision,5/6);
 const t=m.effort(r,{manual:4,review:2,automatic:.25,rework:12});close(t.baseline,48);close(t.candidate,25.5);close(t.saved,22.5);
});
check('Threshold and no-acceptance edge cases',()=>{
 assert.equal(m.evaluate(cases,.95).correct_accepted,2);assert.equal(m.evaluate(cases,.95).accepted,3);
 assert.equal(m.evaluate(cases,1).precision,null);assert.equal(m.evaluate([],0).coverage,null);
 assert.equal(m.evaluate(cases,.85).rows.find(r=>r.id==='R05').accepted,true);
 for(const id of ['R09','R10'])assert.equal(m.evaluate(cases,0).rows.find(r=>r.id===id).accepted,false);
});
check('Commercial rate and finite capacity',()=>{
 const input={fee:9000,costs:600,allHours:75,weekly:10,reserved:5,delivery:60,prospects:50,reply:20,qualified:50,win:20};
 const r=m.commercial(input);close(r.effective,112);close(r.deliveryWeeks,12);close(r.pipelineScenario,1);
 assert.equal(m.commercial({...input,reserved:10}).deliveryWeeks,null);
 assert.throws(()=>m.commercial({...input,reserved:11}));
});
check('Invalid finite ranges reject cleanly',()=>{
 assert.throws(()=>m.reliability({days:30,target:101,observed:0}));
 assert.throws(()=>m.readiness({technical:2.5,demonstration:1,buyer:0,safeguards:1}));
 assert.throws(()=>m.evaluate(cases,NaN));assert.throws(()=>m.evaluate([...cases,cases[0]],.8));
});
check('Python and JavaScript policy agree across 101 thresholds',()=>{
 const script=new URL('../examples/evaluate_workflow.py',import.meta.url);
 const py='import json,sys;sys.path.insert(0,sys.argv[1]);from evaluate_workflow import evaluate;cases=json.load(open(sys.argv[1]+"/routing-cases.json"));print(json.dumps([evaluate(cases,i/100) for i in range(101)]))';
 const directory=new URL('../examples/',import.meta.url).pathname;
 const results=JSON.parse(execFileSync('python3',['-c',py,directory],{encoding:'utf8'}));
 for(let i=0;i<=100;i++){
  const js=m.evaluate(cases,i/100),p=results[i];
  for(const key of ['accepted','correct_accepted','wrong_automatic','review','precision','coverage'])assert.equal(js[key],p[key]);
 }
});
console.log(JSON.stringify({test_groups:checks,result:'passed',limits:'Numerical and policy execution; no browser visual or DOM control testing.'}));
