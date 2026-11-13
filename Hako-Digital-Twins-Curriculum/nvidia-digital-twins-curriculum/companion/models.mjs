export const transform=(x,y,tx,ty,angle)=>[Math.cos(angle)*x-Math.sin(angle)*y+tx,Math.sin(angle)*x+Math.cos(angle)*y+ty];
export const arm=(q1,q2,l1=.4,l2=.3)=>[l1*Math.cos(q1)+l2*Math.cos(q1+q2),l1*Math.sin(q1)+l2*Math.sin(q1+q2)];
export function wheels(v,w,r=.05,b=.3){if(!(r>0&&b>0))throw Error('Positive geometry required');return[(v-w*b/2)/r,(v+w*b/2)/r];}
export function drive(v,w,duration=10,dt=.05){let x=0,y=0,angle=0;const points=[[x,y]];for(let t=0;t<duration-1e-9;t+=dt){const h=Math.min(dt,duration-t);if(Math.abs(w)<1e-8){x+=v*Math.cos(angle)*h;y+=v*Math.sin(angle)*h;}else{x+=v/w*(Math.sin(angle+w*h)-Math.sin(angle));y-=v/w*(Math.cos(angle+w*h)-Math.cos(angle));}angle+=w*h;points.push([x,y]);}return{points,x,y,angle};}
export function project(x,y,z,f=500){if(!(z>0&&Number.isFinite(z)))throw Error('Positive optical depth required');return[320+f*x/z,240+f*y/z];}
export function capacity(robots,ports,units=2.4){return{grid:robots*30*1.5/units,pick:ports*600/units,pack:950};}
export function control(kp,lag=.2,dt=.01){let position=0,velocity=0;const points=[];for(let i=0;i<600;i++){const command=Math.max(-1,Math.min(1,kp*(1-position)));velocity+=(command-velocity)*dt/lag;position+=velocity*dt;points.push([i*dt,position]);}return{points,position};}
export function seeded(seed=17){return()=>{seed=(Math.imul(1664525,seed)+1013904223)>>>0;return seed/4294967296;};}
export function detection(threshold=.5,shift=0){const random=seeded(),counts={tp:0,fp:0,tn:0,fn:0};for(let i=0;i<1000;i++){const label=i%10===0;const score=(label?.7:.3)+(random()-.5)*.65+shift;const predicted=score>=threshold;counts[label?(predicted?'tp':'fn'):(predicted?'fp':'tn')]++;}return{...counts,precision:counts.tp/(counts.tp+counts.fp||1),recall:counts.tp/(counts.tp+counts.fn)};}
export function learnGrid(stepReward=-.01,episodes=500){const random=seeded(7),q=Array.from({length:5},()=>[0,0]);for(let i=0;i<episodes;i++){let s=0;for(let n=0;n<40;n++){const a=random()<.2?Math.floor(random()*2):(q[s][1]>q[s][0]?1:0);const next=Math.max(0,Math.min(4,s+(a?1:-1))),done=next===4;const target=(done?1:stepReward)+(done?0:.95*Math.max(...q[next]));q[s][a]+=.2*(target-q[s][a]);s=next;if(done)break;}}const route=[0];for(let i=0;i<12&&route.at(-1)!==4;i++){const s=route.at(-1),a=q[s][1]>q[s][0]?1:0;route.push(Math.max(0,Math.min(4,s+(a?1:-1))));}return{q,route};}
export function validateAction(action){if(action.revision!==3)return{ok:false,reason:'Stale revision; expected 3'};if(action.asset!=='teaching_camera')return{ok:false,reason:'Unknown asset'};if(!Number.isFinite(action.x)||Math.abs(action.x)>2)return{ok:false,reason:'X must be finite and within [-2,2] m'};return{ok:true,reason:'Accepted bounded local proposal',x:action.x};}
export function reduceEvents(events,time){const state={arrived:0,shipped:0,stations:{'pick-01':null,'pick-02':null},fault:false,assigned:{'pick-01':0,'pick-02':0}};for(const e of events){if(e.time_s>time)break;if(e.type==='order_arrived')state.arrived++;if(e.type==='assigned')state.assigned[e.resource_id]++;if(e.type==='pick_started'){state.assigned[e.resource_id]--;state.stations[e.resource_id]=e.order_id;}if(e.type==='pick_completed')state.stations[e.resource_id]=null;if(e.type==='shipped')state.shipped++;if(e.type==='fault_started')state.fault=true;if(e.type==='fault_ended')state.fault=false;}return state;}
export function validateReplay(data){
  if(!data||!Array.isArray(data.runs)||data.runs.length!==2)throw Error('Expected two teaching runs');
  const sequence=['order_arrived','assigned','pick_started','pick_completed','waiting_pack','pack_started','shipped'];
  for(const run of data.runs){
    if(!run.manifest||!Array.isArray(run.events))throw Error('Missing run manifest/events');
    let last=-Infinity;const ids=new Set(),orders=new Map();
    for(const e of run.events){
      if(e.schema_version!==1||typeof e.event_id!=='string'||ids.has(e.event_id))throw Error('Invalid or duplicate event identity');
      if(!Number.isFinite(e.time_s)||e.time_s<0||e.time_s<last)throw Error('Events must be ordered finite simulation times');
      ids.add(e.event_id);last=e.time_s;
      if(e.type==='fault_started'||e.type==='fault_ended')continue;
      const index=sequence.indexOf(e.type);
      if(index<0||typeof e.order_id!=='string'||index!==(orders.get(e.order_id)??-1)+1)throw Error('Invalid order lifecycle');
      if(['assigned','pick_started','pick_completed'].includes(e.type)&&!['pick-01','pick-02'].includes(e.resource_id))throw Error('Unknown pick resource');
      orders.set(e.order_id,index);
    }
  }
  if(data.runs[0].manifest.demand_sha256!==data.runs[1].manifest.demand_sha256)throw Error('Paired demand identity mismatch');
  return data;
}
