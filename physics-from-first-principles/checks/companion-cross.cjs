const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const {models}=require('../companion/models.js');
const checks=[];
function near(name,a,b,tol=1e-8){assert.ok(Math.abs(a-b)<=tol*Math.max(1,Math.abs(b)),`${name}: ${a} versus ${b}`);checks.push({name,actual:a,expected:b});}

// An independent RK4 solution of the two complex Schrödinger amplitudes.
function propagatedProbability(Omega,delta,duration){
  let y=[1,0,0,0];const n=6000,h=duration/n;
  const f=([ar,ai,br,bi])=>[(delta*ai+Omega*bi)/2,(-delta*ar-Omega*br)/2,(Omega*ai-delta*bi)/2,(-Omega*ar+delta*br)/2];
  const add=(a,b,scale)=>a.map((x,i)=>x+scale*b[i]);
  for(let j=0;j<n;j++){
    const k1=f(y),k2=f(add(y,k1,h/2)),k3=f(add(y,k2,h/2)),k4=f(add(y,k3,h));
    y=y.map((x,i)=>x+h*(k1[i]+2*k2[i]+2*k3[i]+k4[i])/6);
  }
  near('Schrodinger ODE norm '+[Omega,delta,duration],y.reduce((s,x)=>s+x*x,0),1,1e-9);
  return y[2]*y[2]+y[3]*y[3];
}
for(const parameters of [[2,0,.71],[2,3,1.7],[.7,-2,4],[5,1,.9]]){
  near('Rabi compared with integrated amplitudes '+parameters,Object.values(models.rabi(parameters).values)[2],propagatedProbability(...parameters),1e-9);
}

// Recover intensity by averaging the actual plotted E(t)^2 over two periods.
for(const amplitude of [0,10,1000]){
  const result=models.radiation([amplitude]);const curve=result.curves[0];
  let integral=0;
  for(let j=1;j<curve.length;j++)integral+=(curve[j][0]-curve[j-1][0])*(curve[j][1]**2+curve[j-1][1]**2)/2;
  const meanE2=integral/(curve.at(-1)[0]-curve[0][0]);
  near('Plane-wave intensity from sampled field '+amplitude,Object.values(result.values)[1],8.8541878188e-12*299792458*meanE2,1e-10);
}

// Exercise the actual plot function with a recording canvas, avoiding a mock
// reimplementation of its scaling formulas. Browser screenshots are separate.
const plotSource=fs.readFileSync(path.join(__dirname,'../companion/labs.js'),'utf8');
const plotBody=plotSource.slice(plotSource.indexOf('function plot(data)'),plotSource.indexOf('\nfunction calculate()'));
for(const [name,width,args]of [['orbit',700,[1000,10]],['orbit',290,[1000,10]],['vectors',700,[3,4,-1,2]]]){
  const segments=[];let current=[];
  const ctx={strokeStyle:'',beginPath(){current=[];},moveTo(x,y){current.push([x,y]);},lineTo(x,y){current.push([x,y]);},stroke(){segments.push({color:this.strokeStyle,points:current});},fillRect(){},scale(){},fillText(){},save(){},restore(){},translate(){},rotate(){},arc(){},fill(){}};
  const canvas={getContext:()=>ctx,getBoundingClientRect:()=>({width})};
  const elements={chart:canvas,'plot-description':{textContent:''}};
  const sandbox={$:id=>elements[id],window:{devicePixelRatio:1},Math,chartData:null,input:models[name](args)};
  vm.runInNewContext(plotBody+'\nplot(input);',sandbox);
  const blue=segments.find(segment=>segment.color==='#155e75');
  if(name==='orbit'){
    const xs=blue.points.map(p=>p[0]),ys=blue.points.map(p=>p[1]);
    near('Canvas circular orbit pixel aspect at width '+width,(Math.max(...xs)-Math.min(...xs))/(Math.max(...ys)-Math.min(...ys)),1,1e-12);
  }else{
    const dx=blue.points[1][0]-blue.points[0][0],dy=blue.points[1][1]-blue.points[0][1];
    near('Canvas vector slope preserves physical 4:3 components',Math.abs(dy/dx),4/3,1e-12);
  }
}
const report={runtime:process.version,independent_checks:checks.length,checks,limits:['Recorded-canvas tests establish actual coordinate scaling, not visual browser appearance.','Numerical Schrodinger and sampled plane-wave comparisons cover selected inputs, not all model regimes.']};
fs.writeFileSync(path.join(__dirname,'companion-cross-results.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
