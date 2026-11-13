import assert from 'node:assert/strict';
import {pacing,funnel,wilson,saas,campaignUrl} from './model.mjs';
let checks=0;function test(name,fn){fn();checks++;console.log('PASS',name);}
const near=(a,b,t=1e-7)=>assert.ok(Math.abs(a-b)<t,`${a} differs from ${b}`);
test('pacing counts whitespace-separated words and demonstration time',()=>{const r=pacing('one two three',120,2);near(r.totalSeconds,3.5);assert.equal(r.words,3);assert.equal(pacing('',100,0).words,0)});
test('invalid speaking rate rejected',()=>assert.throws(()=>pacing('x',0,0)));
const base={views:100000,visitRate:.01,leadRate:.4,buyRate:.05,price:29,refundRate:.05,feeRate:.03,fixedFee:.3,variableCost:2,productionCost:140,commissionRate:.15,affiliate:false};
test('ebook full worked arithmetic',()=>{const r=funnel(base);near(r.visits,1000);near(r.leads,400);near(r.orders,20);near(r.gross,580);near(r.recognized,551);near(r.fees,23.4);near(r.contribution,347.6)});
test('affiliate revenue is commission and excludes merchant fees',()=>{const r=funnel({...base,views:20000,leadRate:1,buyRate:.04,price:40,refundRate:.1,variableCost:0,productionCost:30,affiliate:true});near(r.orders,8);near(r.recognized,43.2);near(r.contribution,13.2);near(r.fees,0)});
test('zero traffic produces no revenue',()=>near(funnel({...base,views:0}).contribution,-140));
test('impossible rates and negative costs rejected',()=>{assert.throws(()=>funnel({...base,buyRate:1.1}));assert.throws(()=>funnel({...base,productionCost:-1}))});
test('Wilson endpoints remain sensible',()=>{near(wilson(0,100).low,0);assert.ok(wilson(0,100).high>0);near(wilson(100,100).high,1);near(wilson(50,100).rate,.5)});
test('impossible count rejected',()=>{assert.throws(()=>wilson(3,2));assert.throws(()=>wilson(0,0));assert.throws(()=>wilson(1.5,4))});
test('SaaS zero and full churn',()=>{near(saas({price:12,margin:.8,churn:0,months:12}).total,115.2);near(saas({price:12,margin:.8,churn:1,months:12}).total,9.6)});
test('SaaS sum agrees with geometric form',()=>near(saas({price:12,margin:.8,churn:.05,months:12}).total,9.6*(1-.95**12)/.05));
test('URL preserves query/fragment and encodes fields',()=>{const u=new URL(campaignUrl('https://example.com/a?x=1#part',{source:'youtube shorts',medium:'organic_social'}));assert.equal(u.searchParams.get('x'),'1');assert.equal(u.searchParams.get('utm_source'),'youtube shorts');assert.equal(u.hash,'#part')});
test('non-web URLs and credentials rejected',()=>{assert.throws(()=>campaignUrl('javascript:alert(1)',{}));assert.throws(()=>campaignUrl('https://user:pass@example.com',{}))});
console.log(JSON.stringify({checks,status:'passed'}));
