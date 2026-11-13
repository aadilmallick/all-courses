import assert from 'node:assert/strict';
import * as M from './math.mjs';
import {definitions} from './labs.mjs';
let checks=0;const ok=(value,message)=>{checks++;assert.ok(value,message);};const near=(a,b,t=1e-9)=>ok(Math.abs(a-b)<t,`${a} versus ${b}`);
// Direct divisibility checks and modular inverses independent of Euclid's trace.
for(let a=1;a<=70;a++)for(let b=1;b<=40;b++){let brute=1;for(let d=1;d<=Math.min(a,b);d++)if(a%d===0&&b%d===0)brute=d;ok(M.gcd(a,b)===brute);ok(M.euclid(a,b).gcd===brute);}
for(let m=2;m<=35;m++)for(let a=0;a<m;a++){const found=Array.from({length:m},(_,i)=>i).find(i=>a*i%m===1);ok(M.inverse(a,m)===(found??null));for(let e=0;e<9;e++){let brute=1n;for(let i=0;i<e;i++)brute=brute*BigInt(a)%BigInt(m);ok(M.powmod(a,e,m)===brute%BigInt(m));}}
for(let n=0;n<=12;n++){let sum=0n;for(let k=0;k<=n;k++)sum+=M.choose(n,k);ok(sum===2n**BigInt(n));}
ok(M.fib(10)===55n);ok(M.brackets('(()())()').balanced);ok(!M.brackets(')(').balanced);assert.throws(()=>M.brackets('(x)'));checks++;
ok(JSON.stringify(M.convolution([1,1,1],[1,1,1,1]))==='[1,2,3,3,2,1]');near(M.birthday(3,2),1);near(M.posterior(.01,.9,.05),2/13);ok(M.posterior(0,0,0)===null);
for(let n=1;n<=30;n++)for(const p of [0,.1,.3,.5,.8,1]){const pmf=M.binomial(n,p);near(pmf.reduce((a,b)=>a+b,0),1);near(pmf.reduce((s,x,k)=>s+k*x,0),n*p);for(let k=0;k<=n;k++){const r=M.tails(n,p,k);for(const name of ['markov','chebyshev','chernoff'])if(r[name]!==null)ok(r.exact<=r[name]+1e-10,`${name} failed ${n},${p},${k}`);}}
// Independent finite linear-system solve for hitting probability and duration.
function solve(A,b){A=A.map((r,i)=>[...r,b[i]]);const n=b.length;for(let i=0;i<n;i++){let pivot=i;for(let j=i+1;j<n;j++)if(Math.abs(A[j][i])>Math.abs(A[pivot][i]))pivot=j;[A[i],A[pivot]]=[A[pivot],A[i]];const d=A[i][i];for(let k=i;k<=n;k++)A[i][k]/=d;for(let j=0;j<n;j++)if(j!==i){const f=A[j][i];for(let k=i;k<=n;k++)A[j][k]-=f*A[i][k];}}return A.map(r=>r[n]);}
for(let N=2;N<=15;N++)for(const p of [.2,.49,.5,.51,.8]){const A=Array.from({length:N-1},(_,i)=>Array.from({length:N-1},(_,j)=>i===j?1:j===i+1?-p:j===i-1?-(1-p):0));const b=Array(N-1).fill(0);b[N-2]=p;const h=solve(A,b),t=solve(A,Array(N-1).fill(1));for(let i=1;i<N;i++){const model=M.ruin(N,i,p);near(model.success,h[i-1]);near(model.mean,t[i-1],1e-7);}}
const g=M.graph(4,[[0,1],[0,2],[1,3],[2,3]]);ok(g.square[0][3]===2);ok(g.topological.length===4);ok(g.layers.length===3);ok(M.graph(2,[[0,1],[1,0]]).topological===null);ok(!M.graph(3,[[0,1],[1,2],[2,0]],false).bipartite);
ok(M.matching([[0,1],[1],[1,2]],3).size===3);ok(M.matching([[0,1],[0,1],[0,1]],3).size===2);ok(M.mst(3,[[0,1,2],[1,2,5],[0,2,6]]).weight===7);
const rank=M.ranking(4,[[0,1],[1,2],[2,0],[2,1]],.85,200);near(rank.sum,1);ok(rank.residual<1e-12);ok(rank.distribution.every(x=>x>0));
const informed=M.monty(20000,42,'informed'),random=M.monty(20000,42,'random opener');near(informed.switchRate,2/3,.02);near(random.switchRate,.5,.02);const walk=M.simulateWalk(8,3,.5,10000,42);near(walk.successAmongCompleted,3/8,.02);near(walk.meanAmongCompleted,15,1);ok(walk.censored===0);near(M.coupon(4,10000,42).sampleMean,25/3,.25);
for(const [id,definition] of Object.entries(definitions)){const defaults=Object.fromEntries(Object.entries(definition.fields).map(([k,f])=>[k,f.value]));const result=definition.run(defaults);ok(result!==undefined,`${id} has an executable default`);}
const report={checks,labs:Object.keys(definitions).length,result:'pass',layers:['exact integer and finite enumeration checks','independent linear-system recurrence checks','tail-bound comparisons across finite parameter grids','seeded simulation agreement checks','all lab default execution'],limits:['No general formal proof verification','Finite parameter checks do not establish universal mathematical truth']};
console.log(JSON.stringify(report,null,2));
