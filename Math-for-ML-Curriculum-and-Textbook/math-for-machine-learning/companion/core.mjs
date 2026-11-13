// Pure mathematical functions shared by the UI and numerical checks.
export const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
export const norm=a=>Math.sqrt(dot(a,a));
export function projection(u,v){const q=dot(v,v);if(q<1e-20)throw Error('Choose a nonzero direction vector.');const t=dot(u,v)/q,p=v.map(x=>t*x);return {t,p,r:u.map((x,i)=>x-p[i])};}
export const mse=(x,y,w,b)=>x.reduce((s,v,i)=>s+(w*v+b-y[i])**2,0)/x.length;
export function lineFit(x,y){const mx=x.reduce((s,v)=>s+v,0)/x.length,my=y.reduce((s,v)=>s+v,0)/y.length;const xx=x.reduce((s,v)=>s+(v-mx)**2,0);if(xx===0)throw Error('Distances must vary to identify a slope.');const w=x.reduce((s,v,i)=>s+(v-mx)*(y[i]-my),0)/xx;return {w,b:my-w*mx};}
export function singular2(a,b,c,d){const s=a*a+b*b+c*c+d*d,det=(a*d-b*c)**2;const disc=Math.sqrt(Math.max(0,s*s-4*det));return [Math.sqrt((s+disc)/2),Math.sqrt(Math.max(0,(s-disc)/2))];}
export function pca(points){const n=points.length,m=[0,1].map(j=>points.reduce((s,p)=>s+p[j],0)/n);const z=points.map(p=>p.map((x,j)=>x-m[j]));const a=z.reduce((s,p)=>s+p[0]**2,0)/(n-1),b=z.reduce((s,p)=>s+p[0]*p[1],0)/(n-1),d=z.reduce((s,p)=>s+p[1]**2,0)/(n-1);const angle=.5*Math.atan2(2*b,a-d),v=[Math.cos(angle),Math.sin(angle)],r=z.map(p=>{const t=dot(p,v);return [m[0]+t*v[0],m[1]+t*v[1]]});const gap=Math.hypot(a-d,2*b),l1=(a+d+gap)/2,l2=(a+d-gap)/2;return {m,v,r,variance:[l1,l2],fraction:l1/(l1+l2),error:points.reduce((s,p,i)=>s+norm(p.map((x,j)=>x-r[i][j]))**2,0)};}
export function derivative(x,h){if(h<=0)throw Error('The difference step must be positive.');return {value:x*x,derivative:2*x,forward:((x+h)**2-x*x)/h,central:((x+h)**2-(x-h)**2)/(2*h)};}
export function quadrature(n){let left=0,trap=0;const h=1/n;for(let i=0;i<n;i++){left+=Math.exp(i*h)*h;trap+=(Math.exp(i*h)+Math.exp((i+1)*h))*h/2;}return {left,trap,exact:Math.E-1};}
export function backprop(x,w,b,y){const z=w*x+b,a=Math.tanh(z),loss=.5*(a-y)**2,dz=(a-y)*(1-a*a);const h=1e-5;const f=q=>.5*(Math.tanh(q*x+b)-y)**2;return {z,a,loss,dw:dz*x,db:dz,numeric:(f(w+h)-f(w-h))/(2*h)};}
export function descent(curvature,step,count=40){let x=[4,4];const history=[];for(let t=0;t<=count;t++){history.push({x:[...x],loss:.5*(x[0]**2+curvature*x[1]**2)});x=[(1-step)*x[0],(1-step*curvature)*x[1]];}return history;}
export function bayes(prior,sensitivity,background){const evidence=prior*sensitivity+(1-prior)*background;if(evidence===0)throw Error('The conditioning event has probability zero; its posterior is undefined.');return {evidence,posterior:prior*sensitivity/evidence};}
export function rng(seed=7){let a=seed>>>0;return ()=>{a=(Math.imul(a,1664525)+1013904223)>>>0;return a/4294967296;};}
export function sampleMeans(p,n,reps=1000){const random=rng(7),means=[];for(let r=0;r<reps;r++){let sum=0;for(let i=0;i<n;i++)sum+=random()<p;means.push(sum/n);}const mean=means.reduce((s,x)=>s+x,0)/reps;return {means,mean,sd:Math.sqrt(means.reduce((s,x)=>s+(x-mean)**2,0)/reps),theory:Math.sqrt(p*(1-p)/n)};}
export function posterior(alpha,beta,successes,failures){if(alpha<=0||beta<=0)throw Error('Prior shapes must be positive.');const a=alpha+successes,b=beta+failures;return {a,b,mean:a/(a+b),variance:a*b/((a+b)**2*(a+b+1))};}
export const softplus=z=>Math.max(z,0)+Math.log1p(Math.exp(-Math.abs(z)));
export const sigmoid=z=>z>=0?1/(1+Math.exp(-z)):Math.exp(z)/(1+Math.exp(z));
export function logistic(z,y){return {p:sigmoid(z),loss:Math.max(z,0)-y*z+Math.log1p(Math.exp(-Math.abs(z))),gradient:sigmoid(z)-y};}
export function coverage(n,reps=500){const random=rng(19),intervals=[];let count=0;for(let r=0;r<reps;r++){let sum=0;for(let i=0;i<n;i++){const u=Math.max(random(),1e-12),v=random();sum+=Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}const m=sum/n,radius=1.95996398454/Math.sqrt(n),ok=Math.abs(m)<=radius;count+=ok;intervals.push([m-radius,m+radius,ok]);}return {intervals,frequency:count/reps};}
