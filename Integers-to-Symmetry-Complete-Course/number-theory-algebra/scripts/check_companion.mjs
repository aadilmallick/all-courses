import assert from 'node:assert/strict';
import * as M from '../companion/math.mjs';
import {experiments} from '../companion/labs.mjs';
let checks=0;const check=(condition,message)=>{assert.ok(condition,message);checks++;};
for(let a=-30;a<=30;a++)for(let b=-30;b<=30;b++){let r=M.egcd(a,b);check(BigInt(a)*r.x+BigInt(b)*r.y===r.g,'Bézout');check(r.g>=0n,'gcd nonnegative');if(r.g){check(BigInt(a)%r.g===0n&&BigInt(b)%r.g===0n,'common divisor');}}
for(let n=2;n<=18;n++)for(let m=2;m<=18;m++)for(let a=0;a<n;a++)for(let b=0;b<m;b++){const r=M.crt(a,n,b,m),g=M.gcd(n,m);check(r.compatible===((b-a)%g===0),'CRT compatibility');if(r.compatible){check(r.x%BigInt(n)===BigInt(a)&&r.x%BigInt(m)===BigInt(b),'CRT remainders');check(r.period===BigInt(M.lcm(n,m))&&r.x>=0n&&r.x<r.period,'CRT period/canonical solution');}}
for(let n=2;n<=100;n++){check(M.units(n).length===M.phi(n),'totient count');for(const a of M.units(n)){check(M.powmod(a,M.phi(n),n)===1n,'Euler');check(M.phi(n)%M.order(a,n)===0,'order divides group size');}check(M.divisors(n).reduce((s,d)=>s+M.phi(d),0)===n,'totient divisor sum');check(M.divisors(n).reduce((s,d)=>s+M.mu(d),0)===0,'Mobius identity');}
check(M.mu(1)===1&&M.phi(1)===1,'conventions at one');
const perm=M.permutation('2,3,1,5,4');check(perm.order===6&&perm.sign===-1,'permutation example');
assert.throws(()=>M.permutation('1,1'));checks++;
for(let n=1;n<=9;n++){const b=M.necklaces(n);check(b.burnside===b.enumerated,'Burnside vs orbit enumeration');}
for(let p=3;p<=31;p+=2)if(M.isPrime(p))for(let q=3;q<=31;q+=2)if(M.isPrime(q)&&p!==q)check(M.legendre(p,q)*M.legendre(q,p)===(((p-1)/2*(q-1)/2)%2?-1:1),'quadratic reciprocity');
for(let n=2;n<=15;n++)for(let d=0;d<n;d++)for(let a=0;a<n;a++)for(let b=0;b<n;b++){let r=M.quadraticRing(n,d,a,b);if(r.inverse){let [c,e]=r.inverse;check(M.mod(a*c+d*b*e,n)===1&&M.mod(a*e+b*c,n)===0,'quadratic quotient inverse');}else{check(M.gcd(r.norm,n)!==1,'norm obstruction');}}
const pellKnown={2:[3n,2n],3:[2n,1n],5:[9n,4n],13:[649n,180n],61:[1766319049n,226153980n]};for(const [D,[x,y]]of Object.entries(pellKnown)){let r=M.pell(Number(D));check(r.x===x&&r.y===y,'Pell known minimal solution');check(x*x-BigInt(D)*y*y===1n,'Pell exact equation');}
for(let a=2;a<=18;a++)for(let b=2;b<=18;b++){const r=M.abelian(a,b),s=M.abelian(r.g,r.l);check(r.g*r.l===a*b&&r.l%r.g===0,'invariant factors');check(JSON.stringify(r.histogram)===JSON.stringify(s.histogram),'abelian order distribution');}
for(let a=0;a<8;a++){check(M.gf8pow(a,8)===a,'Frobenius cubed identity');if(a)check(M.gf8mul(a,M.gf8pow(a,6))===1,'field inverse');for(let b=0;b<8;b++)for(let c=0;c<8;c++){check(M.gf8mul(a,b^c)===(M.gf8mul(a,b)^M.gf8mul(a,c)),'field distributivity');check(M.gf8mul(M.gf8mul(a,b),c)===M.gf8mul(a,M.gf8mul(b,c)),'field associativity');}}
for(const kind of ['biquadratic','cubic']){const r=M.galois(kind);check(r.fields.every(([, ,d])=>r.degree%d===0),'Galois example degree identity');}
check(M.primeStats(100).pi===25,'pi(100)');const e=M.eulerProduct(1000,2);check(e.sum<Math.PI**2/6&&Math.PI**2/6-e.sum<e.tailBound,'zeta(2) integral tail bound');check(e.product>e.sum&&e.product<Math.PI**2/6,'Euler finite product bounds');
for(const p of [7,17])for(let r=0;r<p;r++)if((r*r-2)%p===0){const rows=M.hensel(p,6,r);check(rows.every(([,x,m,z])=>z===0n&&(x*x-2n)%m===0n),'Hensel residues');for(let i=1;i<rows.length;i++)check(rows[i][1]%rows[i-1][2]===rows[i-1][1],'Hensel compatibility');}
assert.throws(()=>M.hensel(2,3,0));checks++;
for(const p of [5,7,11])for(let c0=0;c0<p;c0++)for(let c1=0;c1<p;c1++){const pts=M.rsEncode(p,[c0,c1,2],5),surv=pts.slice(2);check(pts.every(([x,y])=>M.interpolate(p,surv,x)===y),'RS erasure recovery');}
for(const e of experiments){const values=Object.fromEntries(e.fields.map(f=>[f.name,f.value]));check(e.run(values).length>0,'all experiment defaults execute');}
const residues=experiments.find(e=>e.id==='residues');
check(residues.run({p:211,q:7,a:123}).some(s=>s.text?.includes('40, 171')),'square root example 123 modulo 211');
check(experiments.length===14,'14 real experiments');
console.log(JSON.stringify({status:'passed',checks,experiments:experiments.length,node:process.version},null,2));
