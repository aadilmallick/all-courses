// Exact integer arithmetic where magnitudes can grow; bounded Number arithmetic elsewhere.
export const mod = (a,n) => ((a%n)+n)%n;
export function egcd(a,b) {
  a=BigInt(a); b=BigInt(b);
  const sa=a<0n?-1n:1n, sb=b<0n?-1n:1n;
  let r0=a*sa,r1=b*sb,s0=1n,s1=0n,t0=0n,t1=1n;
  const rows=[];
  while(r1!==0n){const q=r0/r1,r=r0-q*r1;rows.push([r0,q,r1,r]);[r0,r1]=[r1,r];[s0,s1]=[s1,s0-q*s1];[t0,t1]=[t1,t0-q*t1];}
  return {g:r0,x:s0*sa,y:t0*sb,rows};
}
export const gcd=(a,b)=>Number(egcd(a,b).g);
export const lcm=(a,b)=>a===0||b===0?0:Math.abs((a/gcd(a,b))*b);
export function powmod(a,k,n){let x=BigInt(a),e=BigInt(k),m=BigInt(n);if(m<1n||e<0n)throw Error('Positive modulus and nonnegative exponent required.');let r=1n%m;x=mod(x,m);while(e){if(e&1n)r=r*x%m;x=x*x%m;e>>=1n;}return r;}
export function crt(a,n,b,m){[a,n,b,m]=[a,n,b,m].map(BigInt);if(n<2n||m<2n)throw Error('Moduli must be at least 2.');const {g,x}=egcd(n,m),delta=b-a;if(delta%g!==0n)return {compatible:false,g};const period=n/g*m,t=mod(delta/g*x,m/g);return {compatible:true,g,x:mod(a+n*t,period),period};}
export function isPrime(n){if(!Number.isInteger(n)||n<2)return false;for(let d=2;d*d<=n;d++)if(n%d===0)return false;return true;}
export function factors(n){const a=[];let k=n;for(let p=2;p*p<=k;p++){if(k%p===0){let e=0;while(k%p===0){k/=p;e++;}a.push([p,e]);}}if(k>1)a.push([k,1]);return a;}
export function phi(n){return factors(n).reduce((r,[p])=>r/p*(p-1),n);}
export function mu(n){const f=factors(n);return f.some(([,e])=>e>1)?0:(f.length%2?-1:1);}
export const divisors=n=>Array.from({length:n},(_,i)=>i+1).filter(d=>n%d===0);
export const units=n=>Array.from({length:n},(_,i)=>i).filter(i=>gcd(i,n)===1);
export function order(a,n){if(gcd(a,n)!==1)return null;let v=1;for(let k=1;k<=phi(n);k++){v=mod(v*a,n);if(v===1)return k;}throw Error('Order bound failed.');}
export function permutation(s){const p=s.split(',').map(x=>Number(x.trim())),n=p.length;if(n<1||n>8||new Set(p).size!==n||p.some(x=>!Number.isInteger(x)||x<1||x>n))throw Error('Enter a permutation of 1,…,n with n ≤ 8.');const seen=new Set(),cycles=[];for(let i=1;i<=n;i++){if(!seen.has(i)){let j=i,c=[];while(!seen.has(j)){seen.add(j);c.push(j);j=p[j-1];}cycles.push(c);}}return {p,cycles,sign:(n-cycles.length)%2?-1:1,order:cycles.reduce((r,c)=>lcm(r,c.length),1)};}
export function necklaces(n){if(!Number.isInteger(n)||n<1||n>9)throw Error('Necklace length must be 1–9.');const rows=Array.from({length:n},(_,k)=>[k,gcd(n,k),2**gcd(n,k)]);const reps=new Set();for(let s=0;s<2**n;s++){let t=s.toString(2).padStart(n,'0');reps.add(Array.from({length:n},(_,k)=>t.slice(k)+t.slice(0,k)).sort()[0]);}return {rows,burnside:rows.reduce((r,x)=>r+x[2],0)/n,enumerated:reps.size};}
export function legendre(a,p){if(!isPrime(p)||p===2)throw Error('Use an odd prime.');const r=Number(powmod(a,(p-1)/2,p));return r===p-1?-1:r;}
export function quadraticRing(n,d,a,b){[d,a,b]=[d,a,b].map(x=>mod(x,n));const mul=(u,v)=>[mod(u[0]*v[0]+d*u[1]*v[1],n),mod(u[0]*v[1]+u[1]*v[0],n)];const norm=mod(a*a-d*b*b,n),invNorm=egcd(norm,n);const inverse=invNorm.g===1n?[mod(Number(invNorm.x)*a,n),mod(-Number(invNorm.x)*b,n)]:null;let v=[1,0],powers=[[0,...v]];for(let k=1;k<=12;k++){v=mul(v,[a,b]);powers.push([k,...v]);}return {norm,inverse,powers,isField:isPrime(n)&&n!==2&&legendre(d,n)===-1};}
export function pell(D,max=1000){if(!Number.isInteger(D)||D<2||D>100||Number.isInteger(Math.sqrt(D)))throw Error('Use a nonsquare integer D from 2 through 100.');const a0=Math.floor(Math.sqrt(D));let m=0,d=1,a=a0,hm2=0n,hm1=1n,km2=1n,km1=0n;const rows=[];for(let i=0;i<max;i++){const h=BigInt(a)*hm1+hm2,k=BigInt(a)*km1+km2,r=h*h-BigInt(D)*k*k;rows.push([i,a,h,k,r]);if(r===1n)return {x:h,y:k,rows};[hm2,hm1]=[hm1,h];[km2,km1]=[km1,k];m=d*a-m;d=(D-m*m)/d;a=Math.floor((a0+m)/d);}throw Error('No solution within the iteration bound.');}
export function abelian(a,b){const histogram={};for(let i=0;i<a;i++)for(let j=0;j<b;j++){let o=lcm(a/gcd(a,i),b/gcd(b,j));histogram[o]=(histogram[o]||0)+1;}return {g:gcd(a,b),l:lcm(a,b),histogram};}
export function gf8mul(a,b){let r=0;for(let i=0;i<3;i++){if(b&1)r^=a;b>>=1;a<<=1;if(a&8)a^=0b1011;}return r&7;}
export function gf8pow(a,k){let r=1;while(k){if(k&1)r=gf8mul(r,a);a=gf8mul(a,a);k>>=1;}return r;}
export const gf8label=x=>x===0?'0':[x&4?'α²':'',x&2?'α':'',x&1?'1':''].filter(Boolean).join(' + ');
export function galois(kind){if(kind==='biquadratic')return {degree:4,group:'C₂ × C₂',fields:[['{1}','Q(√2,√3)',4],['{1, flip √2}','Q(√3)',2],['{1, flip √3}','Q(√2)',2],['{1, flip both}','Q(√6)',2],['whole group','Q',1]],note:'All subgroups are normal. The three quadratic intermediate fields are distinct. Listed field degree is over Q.'};return {degree:6,group:'S₃',fields:[['{1}','Q(∛2, ω)',6],['A₃','Q(ω) = Q(√−3)',2],['one reflection','Q(∛2)',3],['conjugate reflection','Q(ω∛2)',3],['third reflection','Q(ω²∛2)',3],['S₃','Q',1]],note:'ω³ = 1 and ω ≠ 1. The three order-two subgroups are not normal; their cubic fixed fields are not Galois over Q. The order-three subgroup A₃ is normal.'};}
export function primeStats(N){const ps=[];for(let i=2;i<=N;i++)if(isPrime(i))ps.push(i);const harmonic=Array.from({length:N},(_,i)=>1/(i+1)).reduce((a,b)=>a+b,0);return {ps,pi:ps.length,estimate:N/Math.log(N),harmonic,reciprocalPrimes:ps.reduce((a,p)=>a+1/p,0)};}
export function eulerProduct(N,s){let z=0;for(let n=1;n<=N;n++)z+=n**(-s);let product=1;for(let p=2;p<=N;p++)if(isPrime(p))product/=1-p**(-s);return {sum:z,product,tailBound:N**(1-s)/(s-1)};}
export function hensel(p,k,r){if(!isPrime(p)||p>19||k<1||k>7)throw Error('Use prime p ≤ 19 and precision 1–7.');let x=BigInt(r),m=BigInt(p);x=mod(x,m);const f=x*x-2n;if(f%m!==0n)throw Error('Initial residue must solve x² = 2 mod p.');if(egcd(2n*x,m).g!==1n)throw Error('Derivative is not invertible; simple-root Hensel does not apply.');const rows=[[1,x,m,mod(x*x-2n,m)]];for(let i=2;i<=k;i++){let inv=mod(egcd(2n*x,BigInt(p)).x,BigInt(p));let t=mod(-((x*x-2n)/m)*inv,BigInt(p));x+=t*m;m*=BigInt(p);rows.push([i,x,m,mod(x*x-2n,m)]);}return rows;}
export function rsEncode(p,coeffs,n){if(!isPrime(p)||p>101||n<coeffs.length||n>p)throw Error('Use a prime ≤ 101 and degree < number of distinct evaluation points ≤ p.');return Array.from({length:n},(_,x)=>[x,coeffs.reduceRight((v,c)=>mod(v*x+c,p),0)]);}
export function interpolate(p,points,x){let ans=0;for(let i=0;i<points.length;i++){let num=1,den=1;for(let j=0;j<points.length;j++)if(i!==j){num=mod(num*(x-points[j][0]),p);den=mod(den*(points[i][0]-points[j][0]),p);}let e=egcd(den,p);if(e.g!==1n)throw Error('Distinct points modulo a prime are required.');ans=mod(ans+points[i][1]*num*Number(e.x),p);}return ans;}
