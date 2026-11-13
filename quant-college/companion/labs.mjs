// All calculations are local. Seeded synthetic data are not market evidence.
export function random(seed=42){let s=seed>>>0;return()=>{s=(1664525*s+1013904223)>>>0;return(s+.5)/4294967296;};}
function normal(r){return Math.sqrt(-2*Math.log(r()))*Math.cos(2*Math.PI*r());}
const mean=x=>x.reduce((a,b)=>a+b,0)/x.length;
const variance=x=>{const m=mean(x);return x.reduce((a,b)=>a+(b-m)**2,0)/(x.length-1);};
function fit(x,y){let mx=mean(x),my=mean(y);let xx=x.reduce((a,b)=>a+(b-mx)**2,0);if(xx<1e-14)throw Error('Predictor has no variation');let b=x.reduce((a,v,i)=>a+(v-mx)*(y[i]-my),0)/xx;return{a:my-b*mx,b};}
function cdf(x){const a=Math.abs(x),t=1/(1+.2316419*a),d=.3989422804014327*Math.exp(-a*a/2);const p=1-d*t*(.319381530+t*(-.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));return x>=0?p:1-p;}
export function option(s,k,r,v,t){
 if(t===0)return{call:Math.max(s-k,0),put:Math.max(k-s,0),delta:s>k?1:s<k?0:.5};
 if(v===0){let c=Math.max(s-k*Math.exp(-r*t),0);return{call:c,put:c-s+k*Math.exp(-r*t),delta:s>k*Math.exp(-r*t)?1:0};}
 let d1=(Math.log(s/k)+(r+v*v/2)*t)/(v*Math.sqrt(t)),d2=d1-v*Math.sqrt(t);
 let call=s*cdf(d1)-k*Math.exp(-r*t)*cdf(d2);return{call,put:call-s+k*Math.exp(-r*t),delta:cdf(d1)};
}
export const definitions={
 growth:{title:'Growth and discounting',chapter:'chapter-01',description:'Compare three explicitly different rate conventions. Rate is a decimal annual rate; time is years.',fields:[['wealth','Initial wealth',100,1,100000],['rate','Annual rate (decimal)',.05,-.5,.5],['years','Years',10,0,50]]},
 portfolio:{title:'Diversification and a frontier',chapter:'chapter-08',description:'Assumed annual means and volatilities; two weights sum to one. Correlation changes joint risk.',fields:[['weight','Weight in asset A',.5,0,1],['rho','Correlation',.3,-1,1],['volA','A volatility',.2,.001,1],['volB','B volatility',.1,.001,1]]},
 sampling:{title:'Averages under repeated sampling',chapter:'chapter-05',description:'Two hundred independent normal samples. Each raw observation has mean zero and standard deviation one.',fields:[['n','Observations per sample',30,2,500]]},
 inference:{title:'Intervals and multiple testing',chapter:'chapter-06',description:'Normal z intervals with known standard deviation one. Coverage is a simulated frequency; family error uses independent tests.',fields:[['n','Sample size',30,2,500],['tests','Independent 5% tests',20,1,200]]},
 regression:{title:'Regression as projection',chapter:'chapter-09',description:'Fit an intercept and slope to 80 generated observations. Population intercept is one.',fields:[['slope','True slope',2,-5,5],['noise','Noise standard deviation',1,0,5]]},
 ar1:{title:'Persistence and stationarity',chapter:'chapter-10',description:'AR(1), initial zero, independent innovations of standard deviation one. Stationarity formula only applies for |phi| < 1.',fields:[['phi','AR coefficient',.8,-1.1,1.1]]},
 kalman:{title:'Filtering a hidden level',chapter:'chapter-11',description:'The same fixed synthetic state and observations are used each time. Controls change assumed filter noise variances, not the observed data.',fields:[['q','Assumed process variance Q',.04,0,2],['r','Assumed observation variance R',1,.01,10]]},
 convex:{title:'A constraint and its multiplier',chapter:'chapter-12',description:'Minimize ½(x−a)² subject to x ≤ b. The multiplier measures local value of relaxing the bound.',fields:[['a','Unconstrained target a',2,-5,5],['b','Upper bound b',1,-5,5]]},
 gbm:{title:'Brownian scaling and price paths',chapter:'chapter-13',description:'Six exact-transition GBM paths over one year; fixed normal draws. Physical drift is a simulation assumption.',fields:[['mu','Annual drift',.06,-.5,.5],['vol','Annual volatility',.2,0,1],['steps','Time steps',120,12,1000]]},
 options:{title:'Option pricing and sampling error',chapter:'chapter-14',description:'European, no dividends, constant rates and volatility. Independent antithetic pairs price a one-year call under Q.',fields:[['spot','Spot',100,1,300],['strike','Strike',100,1,300],['vol','Volatility',.2,0,1],['rate','Continuous rate',.05,-.1,.3],['pairs','Independent pairs',3000,100,20000]]},
 dynamic:{title:'Two-period dynamic choice',chapter:'chapter-15',description:'Exact enumeration over risky fractions 0%, 25%, 50%, 75%, 100%. Cash gross 1.02; risky gross 1.20 or 0.80 each period. Power utility, independent states.',fields:[['gamma','Risk aversion',3,.2,10],['p','Up probability',.6,.01,.99]]},
 learning:{title:'Flexibility and overfitting',chapter:'chapter-16',description:'Fit polynomial least squares to 22 fixed training observations and evaluate 100 independent validation observations. True response is 1 + 2x.',fields:[['degree','Polynomial degree',1,1,8],['noise','Noise standard deviation',.4,.01,2]]},
 leakage:{title:'An impossible information advantage',chapter:'chapter-17',description:'Independent future returns are unpredictable from independent past noise. A leaked feature copies the future target and is explicitly invalid. The control changes the chronological training cutoff.',fields:[['n','Training observations',200,30,250]]},
 risk:{title:'Loss quantiles and tail means',chapter:'chapter-15',description:'2,000 synthetic normal losses. Positive values are losses. Empirical expected shortfall averages a fixed upper fraction with the displayed order-statistic convention.',fields:[['sigma','Loss standard deviation',10,.1,50],['alpha','Tail confidence',.95,.5,.995]]},
};
export function calculate(id,p){
 const rng=random(42), metrics=[],series=[];let notes='';
 const add=(name,value)=>metrics.push([name,value]);
 if(id==='growth'){
  let xs=Array.from({length:101},(_,i)=>p.years*i/100);
  series.push({name:'Simple: W(1+rt)',values:xs.map(t=>p.wealth*(1+p.rate*t))},{name:'Annual-base compound: W(1+r)^t',values:xs.map(t=>p.wealth*(1+p.rate)**t)},{name:'Continuous: W exp(rt)',values:xs.map(t=>p.wealth*Math.exp(p.rate*t))});
  for(const s of series)add(s.name,s.values.at(-1));notes='Fractional compound years interpolate the annual-base convention. Simple accumulation may become negative for sufficiently negative rates and long horizons; that is a model limitation.';
 }else if(id==='portfolio'){
  const vol=w=>Math.sqrt(Math.max(0,w*w*p.volA**2+(1-w)**2*p.volB**2+2*w*(1-w)*p.rho*p.volA*p.volB));
  add('Expected return (A=8%, B=4%)',p.weight*.08+(1-p.weight)*.04);add('Portfolio volatility',vol(p.weight));
  let den=p.volA**2+p.volB**2-2*p.rho*p.volA*p.volB;
  add('Long-only minimum-variance A weight',den>1e-14?Math.max(0,Math.min(1,(p.volB**2-p.rho*p.volA*p.volB)/den)):0);
  series.push({name:'Volatility as A weight goes 0 → 1',values:Array.from({length:101},(_,i)=>vol(i/100))});
 }else if(id==='sampling'||id==='inference'){
  const n=Math.round(p.n),means=Array.from({length:200},()=>mean(Array.from({length:n},()=>normal(rng))));
  add('Mean of 200 sample means',mean(means));add('Observed SD of means',Math.sqrt(variance(means)));add('Theoretical SD',1/Math.sqrt(n));
  if(id==='inference'){add('Known-sigma 95% interval coverage',means.filter(m=>Math.abs(m)<=1.96/Math.sqrt(n)).length/means.length);add('At least one false rejection: 1−.95^m',1-.95**Math.round(p.tests));}
  series.push({name:'Repeated sample means',values:means});
 }else if(id==='regression'){
  const x=Array.from({length:80},()=>2*rng()-1),y=x.map(v=>1+p.slope*v+p.noise*normal(rng)),f=fit(x,y);
  add('Estimated intercept',f.a);add('Estimated slope',f.b);add('Residual sum',y.reduce((a,v,i)=>a+v-f.a-f.b*x[i],0));
  const order=x.map((v,i)=>[v,y[i]]).sort((a,b)=>a[0]-b[0]);series.push({name:'Observed y, sorted by x',values:order.map(v=>v[1])},{name:'Fitted y, sorted by x',values:order.map(v=>f.a+f.b*v[0])});
 }else if(id==='ar1'){
  let x=0,path=[];for(let i=0;i<300;i++){x=p.phi*x+normal(rng);path.push(x);}
  add('Empirical lag-one correlation',(()=>{let a=path.slice(0,-1),b=path.slice(1),f=fit(a,b);return f.b*Math.sqrt(variance(a)/variance(b));})());
  if(Math.abs(p.phi)<1)add('Stationary variance',1/(1-p.phi*p.phi));else notes='No finite stationary variance under this AR model. This path begins at zero; it is not initialized from stationarity.';
  series.push({name:'AR(1) path from zero',values:path});
 }else if(id==='kalman'){
  let truth=0,m=0,P=1,states=[],observed=[],filtered=[];
  for(let i=0;i<100;i++){truth+=.2*normal(rng);let y=truth+normal(rng);let pred=P+p.q,K=pred/(pred+p.r);m+=K*(y-m);P=(1-K)**2*pred+K*K*p.r;states.push(truth);observed.push(y);filtered.push(m);}
  add('Filter mean squared error against synthetic truth',mean(filtered.map((x,i)=>(x-states[i])**2)));add('Last posterior variance',P);
  series.push({name:'Known synthetic state',values:states},{name:'Noisy observations',values:observed},{name:'Filtered estimate',values:filtered});
 }else if(id==='convex'){
  const x=Math.min(p.a,p.b),lambda=Math.max(0,p.a-p.b);add('Optimal x',x);add('Objective',.5*(x-p.a)**2);add('Constraint multiplier',lambda);
  series.push({name:'Objective over x from −6 to 6',values:Array.from({length:121},(_,i)=>.5*(-6+i/10-p.a)**2)});notes='The chart shows objective shape; the bound and solution are given numerically above. Complementary slackness: λ(x−b)=0.';
 }else if(id==='gbm'){
  let n=Math.round(p.steps),h=1/n,variation=0;
  for(let j=0;j<6;j++){let s=100,path=[s];for(let i=0;i<n;i++){let dw=Math.sqrt(h)*normal(rng);if(j===0)variation+=dw*dw;s*=Math.exp((p.mu-p.vol*p.vol/2)*h+p.vol*dw);path.push(s);}series.push({name:'Path '+(j+1),values:path});}
  add('Brownian squared-increment sum, first path (target limit 1)',variation);add('Theoretical terminal mean',100*Math.exp(p.mu));add('Theoretical terminal median',100*Math.exp(p.mu-p.vol*p.vol/2));
 }else if(id==='options'){
  const bs=option(p.spot,p.strike,p.rate,p.vol,1),n=Math.round(p.pairs),a=[];
  for(let i=0;i<n;i++){let z=normal(rng),pair=[z,-z].map(v=>Math.exp(-p.rate)*Math.max(p.spot*Math.exp(p.rate-p.vol*p.vol/2+p.vol*v)-p.strike,0));a.push(mean(pair));}
  add('Closed-form call',bs.call);add('Closed-form put',bs.put);add('Delta',bs.delta);add('Antithetic MC call',mean(a));let se=Math.sqrt(variance(a)/n);add('MC standard error across independent pairs',se);add('MC 95% lower',mean(a)-1.96*se);add('MC 95% upper',mean(a)+1.96*se);add('Parity residual',bs.call-bs.put-p.spot+p.strike*Math.exp(-p.rate));
  series.push({name:'Call payoff as terminal spot goes 0 → 2×strike',values:Array.from({length:101},(_,i)=>Math.max(2*p.strike*i/100-p.strike,0))});notes='Normal CDF uses a documented elementary approximation (about 10⁻⁷ absolute error). Python reference uses math.erfc. Zero volatility is handled separately.';
 }else if(id==='dynamic'){
  const actions=[0,.25,.5,.75,1],u=w=>Math.abs(p.gamma-1)<1e-10?Math.log(w):w**(1-p.gamma)/(1-p.gamma);
  const gross=(a,up)=>1.02+a*((up?1.2:.8)-1.02);
  const last=w=>Math.max(...actions.map(a=>p.p*u(w*gross(a,true))+(1-p.p)*u(w*gross(a,false))));
  const values=actions.map(a=>p.p*last(gross(a,true))+(1-p.p)*last(gross(a,false))),best=values.indexOf(Math.max(...values));
  add('Optimal first-period risky fraction (enumerated set)',actions[best]);add('Optimal expected terminal utility (wealth normalized to 1)',values[best]);series.push({name:'Expected utility for fractions 0, .25, .5, .75, 1',values});notes='Second-period choice is reoptimized separately in each reached state. This is exact for the displayed finite model and action set.';
 }else if(id==='learning'){
  const n=22,d=Math.round(p.degree),x=Array.from({length:n},()=>2*rng()-1),y=x.map(v=>1+2*v+p.noise*normal(rng));
  const xv=Array.from({length:100},()=>2*rng()-1),yv=xv.map(v=>1+2*v+p.noise*normal(rng));
  const coeff=polynomialFit(x,y,d),predict=x=>coeff.reduce((a,c,j)=>a+c*x**j,0);
  add('Training MSE',mean(x.map((v,i)=>(predict(v)-y[i])**2)));add('Independent validation MSE',mean(xv.map((v,i)=>(predict(v)-yv[i])**2)));
  series.push({name:'True response, x from −1 to 1',values:Array.from({length:101},(_,i)=>1+2*(-1+2*i/100))},{name:'Fitted polynomial',values:Array.from({length:101},(_,i)=>predict(-1+2*i/100))});notes='A small diagonal ridge of 10⁻⁹ stabilizes this tiny teaching fit. This is not the recommended numerical method for large polynomial systems.';
 }else if(id==='leakage'){
  let y=Array.from({length:300},()=>normal(rng)),valid=y.map(()=>normal(rng)),leaked=y.map(v=>v);let n=Math.round(p.n);
  for(let [name,x]of[['Valid independent feature',valid],['INVALID future-copy feature',leaked]]){let f=fit(x.slice(0,n),y.slice(0,n));add(name+' test MSE',mean(y.slice(n).map((v,j)=>(v-f.a-f.b*x[n+j])**2)));}
  add('Zero-prediction test MSE',mean(y.slice(n).map(v=>v*v)));notes='The leaked case is impossible at decision time. Its excellent test score demonstrates that a chronological split alone cannot repair future information inside features.';
 }else if(id==='risk'){
  let losses=Array.from({length:2000},()=>p.sigma*normal(rng)).sort((a,b)=>a-b),i=Math.min(losses.length-1,Math.ceil(p.alpha*losses.length)-1),tail=losses.slice(Math.ceil(p.alpha*losses.length));
  add('Empirical left-inverse quantile VaR',losses[i]);add('Mean of largest N−ceil(αN) losses',mean(tail));add('Tail observations',tail.length);series.push({name:'Sorted loss sample',values:losses});notes='At finite N, this fixed-tail average and interpolated quantile-integral conventions can differ. The underlying normal model is illustrative, not a validated tail model.';
 }else throw Error('Unknown experiment');
 if(metrics.some(([,v])=>!Number.isFinite(v))||series.some(s=>s.values.some(v=>!Number.isFinite(v))))throw Error('Inputs produced nonfinite results; choose a less extreme setting.');
 return{metrics,series,notes};
}
function polynomialFit(x,y,d){
 let n=d+1,A=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>x.reduce((a,v)=>a+v**(i+j),0)+(i===j?1e-9:0))),b=Array.from({length:n},(_,i)=>x.reduce((a,v,j)=>a+v**i*y[j],0));
 for(let k=0;k<n;k++){let pivot=k;for(let i=k+1;i<n;i++)if(Math.abs(A[i][k])>Math.abs(A[pivot][k]))pivot=i;[A[k],A[pivot]]=[A[pivot],A[k]];[b[k],b[pivot]]=[b[pivot],b[k]];if(Math.abs(A[k][k])<1e-15)throw Error('Singular polynomial fit');for(let i=k+1;i<n;i++){let q=A[i][k]/A[k][k];for(let j=k;j<n;j++)A[i][j]-=q*A[k][j];b[i]-=q*b[k];}}
 let c=Array(n).fill(0);for(let i=n-1;i>=0;i--)c[i]=(b[i]-A[i].reduce((s,v,j)=>s+(j>i?v*c[j]:0),0))/A[i][i];return c;
}
function plot(series){
 if(!series.length)return'';let all=series.flatMap(s=>s.values),lo=Math.min(...all),hi=Math.max(...all);if(hi===lo){hi+=1;lo-=1;}const colors=['#176a61','#bb6515','#5767b0','#9a468a','#4289a2','#607d36'];
 let paths=series.map((s,j)=>{let pts=s.values.map((v,i)=>`${55+640*i/Math.max(1,s.values.length-1)},${265-220*(v-lo)/(hi-lo)}`).join(' ');return`<polyline fill="none" stroke="${colors[j%colors.length]}" stroke-width="2" points="${pts}"/>`;}).join('');
 return`<svg viewBox="0 0 720 300" role="img" aria-label="Computed experiment series; legends and numeric results follow"><line x1="55" y1="265" x2="695" y2="265" stroke="#7a8b93"/><text x="4" y="48" font-size="12">${hi.toPrecision(4)}</text><text x="4" y="265" font-size="12">${lo.toPrecision(4)}</text><text x="55" y="287" font-size="12">Start / lowest displayed input</text><text x="480" y="287" font-size="12">End / highest displayed input</text>${paths}</svg><ul>${series.map((s,j)=>`<li style="color:${colors[j%colors.length]}">${s.name}</li>`).join('')}</ul>`;
}
export function mount(stage,controls,id='growth'){
 const def=definitions[id];controls.replaceChildren();
 for(const [key,label,value,min,max]of def.fields){let l=document.createElement('label');l.textContent=label;let input=document.createElement('input');input.id='input-'+key;input.type='number';input.value=value;input.min=min;input.max=max;input.step=['n','steps','degree','pairs','tests'].includes(key)?'1':'any';l.htmlFor=input.id;controls.append(l,input);}
 const run=()=>{try{let p={};for(const [key,label,value,min,max]of def.fields){let v=Number(controls.querySelector('#input-'+key).value);if(!Number.isFinite(v)||v<min||v>max)throw Error(label+' must be between '+min+' and '+max);p[key]=v;}let result=calculate(id,p);stage.innerHTML=`<h2>${def.title}</h2><table><thead><tr><th>Computed quantity</th><th>Value</th></tr></thead><tbody>${result.metrics.map(([k,v])=>`<tr><td>${k}</td><td>${v.toPrecision(7)}</td></tr>`).join('')}</tbody></table>${plot(result.series)}<p class="note">${result.notes}</p><p><a href="../index.html#${def.chapter}">Read the associated chapter</a></p>`;}catch(e){stage.innerHTML='<p class="error"></p>';stage.firstChild.textContent=e.message;}};
 run();return{run,cleanup:()=>{controls.replaceChildren();stage.replaceChildren();}};
}
