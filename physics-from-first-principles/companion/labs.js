(function(){
'use strict';
const p=(label,value,step=0.1)=>({label,value,step});
const definitions=[
['units','Units and scaling',[1],[p('Speed (km/h)',72,1),p('Square side (cm)',20,1)],'Convert units and see how distance accumulates.'],
['vectors','Adding directions',[2],[p('Vector A x (m)',3),p('Vector A y (m)',4),p('Vector B x (m)',-1),p('Vector B y (m)',2)],'Add components, then compare magnitude and alignment.'],
['projectile','Projectile laboratory',[3,4],[p('Launch speed (m/s)',10),p('Launch angle (degrees)',45,1),p('Downward g (m/s²)',9.81,.01)],'Constant gravity, equal launch and landing heights, no air drag.'],
['orbit','Circular orbits',[5],[p('Gravitational parameter μ (m³/s²)',1000,10),p('Orbital radius (m)',10,1)],'Explore circular speed, period and binding energy.'],
['rotation','A spinning solid disk',[6],[p('Mass (kg)',2),p('Radius (m)',.5,.01),p('Angular speed (rad/s)',4)],'Link moment of inertia, angular momentum and energy.'],
['resonance','Driven resonance',[7],[p('Mass (kg)',1),p('Stiffness (N/m)',4),p('Viscous damping b (kg/s)',.3,.01),p('Drive force amplitude (N)',1)],'Compute the linear oscillator steady-state response over drive frequency.'],
['fourier','Building a wave from harmonics',[8],[p('Number of odd harmonics',8,1)],'Add sine waves and observe sharp edges and Gibbs oscillations.'],
['diffraction','A slit makes a pattern',[9],[p('Wavelength (nm)',500,10),p('Slit width (μm)',10,.5)],'Compute a Fraunhofer single-slit intensity, including its central limit.'],
['relativity','Clocks and inertial motion',[10],[p('Signed speed v/c',.8,.01),p('Clock proper-time interval (s)',1)],'Compare proper time, lab time and Lorentz contraction.'],
['pendulum','Beyond the small-angle pendulum',[7,11],[p('Pendulum length (m)',1,.01),p('Amplitude (degrees)',60,1),p('Downward g (m/s²)',9.81,.01)],'Integrate the exact ideal pendulum period and compare the small-angle limit.'],
['diffusion','Spreading without losing amount',[12],[p('Diffusion coefficient (m²/s)',.1,.01),p('Elapsed time (s)',2),p('Initial Gaussian width (m)',.3,.01)],'Compare initial and evolved normalized Gaussian densities on an infinite line.'],
['thermal','Heat engine limits',[13],[p('Hot reservoir (K)',600,10),p('Cold reservoir (K)',300,10),p('Heat absorbed (J)',1000,10)],'Compute the reversible two-reservoir work bound.'],
['boltzmann','Thermal occupation of two levels',[14],[p('Energy gap divided by kT',2)],'Compare the occupation probabilities of two nondegenerate levels.'],
['electrostatic','Potential and electric field',[15,16],[p('Point charge (nC)',1),p('Observation x (m)',1),p('Observation y (m)',1)],'Evaluate the point-charge field away from its singularity.'],
['rc','Discharging a capacitor',[17],[p('Resistance (Ω)',1000,100),p('Capacitance (μF)',100,10),p('Initial voltage (V)',5)],'Connect a differential equation, time constant and stored energy.'],
['radiation','Energy carried by light',[18],[p('Vacuum plane-wave E amplitude (V/m)',10,1)],'Relate electric amplitude, magnetic amplitude and time-averaged intensity.'],
['rabi','Coherent two-state dynamics',[19,22],[p('Coupling angular frequency Ω (1/s)',2),p('Detuning Δ (1/s)',0),p('Duration (s)',10)],'The displayed convention is H = ℏ(Δσz + Ωσx)/2; start in a basis state.'],
['well','Quantum confinement',[20,21],[p('Infinite-well width (nm)',1,.1),p('Quantum number n',1,1)],'Compute electron energy and normalized position density in an ideal one-dimensional box.'],
['band','A one-dimensional energy band',[23],[p('On-site energy (eV)',0),p('Hopping parameter (eV)',1)],'Explore E(k)=ε₀−2t cos(ka) for an ideal nearest-neighbor tight-binding chain.'],
['decay','Expected radioactive decay',[24],[p('Initial expected population',1000,10),p('Half-life (s)',10,1)],'Relate half-life, expected survivors and initial activity.'],
['cosmology','An expanding model universe',[25,26],[p('Constant H (reciprocal model time)',.5,.05)],'Explore constant-H expansion with an explicitly stated idealization.'],
['numerics','When an integrator adds energy',[27],[p('Time step',.1,.01),p('Duration',30,1)],'Compare forward and symplectic Euler against an exact conserved energy.'],
['regression','What a shared offset changes',[28],[p('Shared squared-period offset (s²)',0,.01)],'Fit the chapter’s synthetic pendulum data and inspect a calibration effect.']
].map(([id,title,chapters,parameters,description])=>({id,title,chapters,parameters,description}));
let current,chartData;
const $=id=>document.getElementById(id);
const format=x=>x===null?'Outside this model’s angular range':Number.isInteger(x)&&Math.abs(x)<1e6?String(x):Math.abs(x)!==0&&(Math.abs(x)<.001||Math.abs(x)>=1e6)?x.toExponential(5):Number(x.toPrecision(7)).toString();
function plot(data){
  chartData=data;
  const canvas=$('chart'),ctx=canvas.getContext('2d');
  if(!ctx){$('plot-description').textContent='This browser cannot draw the plot; numerical results remain available.';return;}
  const rect=canvas.getBoundingClientRect(),w=Math.max(280,rect.width),h=340,dpr=window.devicePixelRatio||1;
  canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);ctx.scale(dpr,dpr);
  const curves=data.curves||[],points=curves.flat();
  if(!points.length)return;
  let xmin=Math.min(...points.map(p=>p[0])),xmax=Math.max(...points.map(p=>p[0]));
  let ymin=Math.min(...points.map(p=>p[1])),ymax=Math.max(...points.map(p=>p[1]));
  if(xmin===xmax){xmin--;xmax++;}
  if(ymin===ymax){ymin-=.5;ymax+=.5;}
  const pad=(ymax-ymin)*.07;
  ymin-=pad;ymax+=pad;
  const l=76,r=24,top=26,b=66;
  if(data.equalAspect){
    // Both axes use the same physical units: preserve distances and angles.
    const unitsPerPixel=Math.max((xmax-xmin)/(w-l-r),(ymax-ymin)/(h-top-b));
    const cx=(xmin+xmax)/2,cy=(ymin+ymax)/2;
    const halfX=unitsPerPixel*(w-l-r)/2,halfY=unitsPerPixel*(h-top-b)/2;
    xmin=cx-halfX;xmax=cx+halfX;ymin=cy-halfY;ymax=cy+halfY;
  }
  const px=x=>l+(x-xmin)/(xmax-xmin)*(w-l-r);
  const py=y=>h-b-(y-ymin)/(ymax-ymin)*(h-top-b);
  ctx.fillStyle='#fffdf8';ctx.fillRect(0,0,w,h);ctx.font='12px system-ui';
  ctx.strokeStyle='#d9dfdf';ctx.lineWidth=1;ctx.fillStyle='#526469';
  for(let i=0;i<=4;i++){
    const x=xmin+(xmax-xmin)*i/4,y=ymin+(ymax-ymin)*i/4;
    ctx.beginPath();ctx.moveTo(px(x),top);ctx.lineTo(px(x),h-b);ctx.stroke();
    ctx.fillText(Number(x.toPrecision(3)).toString(),px(x)-12,h-b+21);
    ctx.beginPath();ctx.moveTo(l,py(y));ctx.lineTo(w-r,py(y));ctx.stroke();
    ctx.textAlign='right';ctx.fillText(Number(y.toPrecision(3)).toString(),l-10,py(y)+4);ctx.textAlign='left';
  }
  const colors=['#155e75','#c56627','#408263'];
  curves.forEach((curve,j)=>{
    ctx.strokeStyle=colors[j%3];ctx.lineWidth=2.5;ctx.beginPath();
    curve.forEach(([x,y],i)=>{if(i)ctx.lineTo(px(x),py(y));else ctx.moveTo(px(x),py(y));});
    ctx.stroke();
    if(curve.length<10)for(const [x,y]of curve){
      ctx.beginPath();ctx.arc(px(x),py(y),3,0,2*Math.PI);ctx.fillStyle=colors[j%3];ctx.fill();
    }
  });
  ctx.fillStyle='#253c44';ctx.textAlign='center';
  ctx.fillText(data.axes?.[0]||'x',w/2,h-12);ctx.save();ctx.translate(15,h/2);
  ctx.rotate(-Math.PI/2);ctx.fillText(data.axes?.[1]||'y',0,0);ctx.restore();
  $('plot-description').textContent=(data.axes||[]).join(' versus ')+'. '+(data.note||'The curve is recalculated from the controls above.');
}
function calculate(){try{const args=current.parameters.map((_,i)=>{const input=$('parameter-'+i);if(input.value.trim()==='')throw Error('Fill in every parameter.');return Number(input.value);}),result=PhysicsModels.models[current.id](args);if(Object.values(result.values).some(x=>x!==null&&!Number.isFinite(x))||result.curves.flat().some(p=>p.some(x=>!Number.isFinite(x))))throw Error('These inputs exceed the model’s finite numerical range.');$('result').replaceChildren();for(const [name,value]of Object.entries(result.values)){const item=document.createElement('div'),label=document.createElement('span'),number=document.createElement('strong');label.textContent=name;number.textContent=format(value);item.append(label,number);$('result').append(item);}$('lab-error').hidden=true;$('chart').hidden=false;plot(result);$('lab-note').textContent=result.note||'Use the chapter derivation to identify the assumptions before applying this model to measurements.';$('source').textContent=PhysicsModels.models[current.id].toString();}catch(e){$('lab-error').textContent=e.message;$('lab-error').hidden=false;$('chart').hidden=true;$('result').replaceChildren();$('plot-description').textContent='No plot is shown until valid inputs are supplied.';}}
function show(id){current=definitions.find(d=>d.id===id)||definitions[0];$('lab-title').textContent=current.title;$('lab-description').textContent=current.description;$('lab-chapters').textContent='CHAPTER'+(current.chapters.length>1?'S ':' ')+current.chapters.join(' · ');$('parameters').replaceChildren();current.parameters.forEach((p,i)=>{const label=document.createElement('label');label.textContent=p.label;const input=document.createElement('input');input.type='number';input.id='parameter-'+i;input.value=p.value;input.step=p.step;input.required=true;label.append(input);$('parameters').append(label);});$('lab-reading').replaceChildren();for(const n of current.chapters){const a=document.createElement('a');a.href='#read/chapter-'+String(n).padStart(2,'0');a.textContent='Read chapter '+n;$('lab-reading').append(a);}calculate();}
document.getElementById('calculate').addEventListener('click',calculate);document.getElementById('reset').addEventListener('click',()=>show(current.id));document.getElementById('parameters').addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();calculate();}});window.addEventListener('resize',()=>{if(chartData&&!$('laboratory').hidden&&$('lab-error').hidden)plot(chartData);});
window.PhysicsLabs={definitions,show};
})();
