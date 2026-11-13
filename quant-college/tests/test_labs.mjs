import assert from 'node:assert/strict';
import {definitions,calculate,option} from '../companion/labs.mjs';
for(const[id,def]of Object.entries(definitions)){
 const p=Object.fromEntries(def.fields.map(f=>[f[0],f[2]]));const r=calculate(id,p);
 assert(r.metrics.length>0);assert(r.metrics.every(x=>Number.isFinite(x[1])));assert.deepEqual(r,calculate(id,p));
 console.log('PASS default and deterministic reset:',id);
}
assert(Math.abs(option(100,100,.05,.2,1).call-10.450583572185565)<.00003);
assert.equal(option(90,100,.05,.2,0).call,0);
const get=(r,name)=>r.metrics.find(x=>x[0]===name)[1];
let a=calculate('convex',{a:2,b:1});assert.equal(get(a,'Optimal x'),1);assert.equal(get(a,'Constraint multiplier'),1);
let p=calculate('portfolio',{weight:1,rho:.3,volA:.2,volB:.1});assert(Math.abs(get(p,'Portfolio volatility')-.2)<1e-12);
let leak=calculate('leakage',{n:200});assert(get(leak,'INVALID future-copy feature test MSE')<1e-20);
console.log('PASS known option, constraint, portfolio and leakage invariants');
