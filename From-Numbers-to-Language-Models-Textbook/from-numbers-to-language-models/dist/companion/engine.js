// Genuine small computations for the textbook experiments. No remote services.
export const sum = values => values.reduce((a,b)=>a+b,0);
export const dot = (a,b) => sum(a.map((v,i)=>v*b[i]));
export const transpose = matrix => matrix[0].map((_,j)=>matrix.map(row=>row[j]));
export const matmul = (left,right) => left.map(row=>transpose(right).map(column=>dot(row,column)));
export const sigmoid = x => x>=0 ? 1/(1+Math.exp(-x)) : Math.exp(x)/(1+Math.exp(x));
export const softplus = x => Math.max(x,0)+Math.log1p(Math.exp(-Math.abs(x)));
export function softmax(values) {
  const maximum = Math.max(...values);
  if (!Number.isFinite(maximum)) throw new Error('Each probability row needs a finite allowed score.');
  const weights=values.map(value=>Math.exp(value-maximum));
  const normalizer=sum(weights);
  return weights.map(value=>value/normalizer);
}
export function attention(query,keys,values,allowed=null,temperature=1) {
  if (!(temperature>0)) throw new Error('Temperature must be positive.');
  const raw=keys.map(key=>dot(query,key));
  const scaled=raw.map((score,i)=>allowed && !allowed[i] ? -Infinity : score/(Math.sqrt(query.length)*temperature));
  const weights=softmax(scaled);
  const output=transpose(values).map(column=>dot(weights,column));
  return {raw,scaled,weights,output};
}
export function bpe(texts,steps) {
  let corpus=texts.map(text=>[...text]);
  const merges=[];
  for(let step=0;step<steps;step++) {
    const counts=new Map();
    for(const row of corpus) for(let i=0;i<row.length-1;i++) {
      const key=JSON.stringify([row[i],row[i+1]]);
      counts.set(key,(counts.get(key)||0)+1);
    }
    if(!counts.size) break;
    const [key,count]=[...counts].sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0];
    const pair=JSON.parse(key);
    corpus=corpus.map(row=>{
      const out=[];
      for(let i=0;i<row.length;) {
        if(row[i]===pair[0] && row[i+1]===pair[1]) {out.push(pair.join(''));i+=2;}
        else out.push(row[i++]);
      }
      return out;
    });
    merges.push([step+1,JSON.stringify(pair),count]);
  }
  return {corpus,merges};
}
export function trainTable(steps,rate) {
  const logits=Array.from({length:4},()=>[0,0,0,0]);
  const losses=[];
  for(let step=0;step<=steps;step++) {
    const probabilities=logits.map(softmax);
    losses.push(-sum(probabilities.map((row,i)=>Math.log(row[(i+1)%4])))/4);
    if(step<steps) for(let i=0;i<4;i++) for(let j=0;j<4;j++) logits[i][j]-=rate*(probabilities[i][j]-(j===(i+1)%4?1:0))/4;
  }
  return {probabilities:logits.map(softmax),losses};
}
export function bellman(gamma,reward,steps) {
  const transition=[[.7,.3],[.2,.8]], rewards=[reward,0];
  let values=[0,0];
  for(let i=0;i<steps;i++) values=transition.map((row,j)=>rewards[j]+gamma*dot(row,values));
  const a=1-.7*gamma,b=-.3*gamma,c=-.2*gamma,d=1-.8*gamma;
  const determinant=a*d-b*c;
  const exact=[reward*d/determinant,-reward*c/determinant];
  const residual=Math.max(...values.map((v,j)=>Math.abs(v-rewards[j]-gamma*dot(transition[j],values))));
  return {values,exact,residual};
}
export function gae(lambda,gamma=.9) {
  const rewards=[0,0,1],values=[.2,.3,.4,0];
  const delta=rewards.map((r,i)=>r+gamma*values[i+1]-values[i]);
  const advantages=[0,0,0];
  let running=0;
  for(let i=2;i>=0;i--) {running=delta[i]+gamma*lambda*running;advantages[i]=running;}
  return {delta,advantages};
}
export function clipped(ratio,advantage,epsilon=.2) {
  const capped=Math.min(1+epsilon,Math.max(1-epsilon,ratio));
  return Math.min(ratio*advantage,capped*advantage);
}
export function dpo(gap,reference,beta) {
  const delta=gap-reference;
  return {delta,loss:softplus(-beta*delta),gradient:-beta*sigmoid(-beta*delta)};
}
const documents=[
  {id:'current',text:'Current service port 8443',current:true},
  {id:'old',text:'Old service port 443',current:false},
  {id:'backup',text:'Database backup runs daily',current:true}
];
const words=text=>text.toLowerCase().match(/[a-z0-9]+/g)||[];
export function retrieve(query,budget) {
  const terms=words(query),corpus=documents.map(d=>words(d.text)),average=sum(corpus.map(d=>d.length))/corpus.length;
  const scores=corpus.map(doc=>sum(terms.map(term=>{
    const frequency=corpus.filter(other=>other.includes(term)).length;
    const idf=Math.log(1+(corpus.length-frequency+.5)/(frequency+.5));
    const tf=doc.filter(value=>value===term).length;
    return idf*tf*2.2/(tf+1.2*(.25+.75*doc.length/average));
  })));
  const lexical=[0,1,2].sort((a,b)=>scores[b]-scores[a]||a-b),semantic=[1,0,2];
  const fusion=documents.map((_,i)=>1/(61+lexical.indexOf(i))+1/(61+semantic.indexOf(i)));
  let chosen=[],utility=-1;
  for(let mask=0;mask<8;mask++) {
    const selection=[0,1,2].filter(i=>mask&(1<<i));
    const cost=sum(selection.map(i=>corpus[i].length));
    const value=sum(selection.map(i=>fusion[i]));
    if(cost<=budget && value>utility){chosen=selection;utility=value;}
  }
  return {scores,lexical,fusion,chosen,cost:sum(chosen.map(i=>corpus[i].length)),documents};
}
export function loop(budget,available) {
  const events=[];
  let status='running',evidence=false,answer=null;
  for(let step=1;step<=budget && status==='running';step++) {
    if(!evidence) {
      if(!available){status='insufficient_evidence';events.push([step,'retrieve','source unavailable']);}
      else {evidence=true;events.push([step,'retrieve','doc-current saved']);}
    } else if(answer===null) {answer=8443;events.push([step,'draft','port 8443, citation doc-current']);}
    else {status='verified';events.push([step,'verify','citation and numeric claim checked']);}
  }
  if(status==='running') status='budget_exhausted';
  return {events,status,answer};
}
function random(seed) {
  let state=seed>>>0;
  return ()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};
}
export function selectionNoise(candidates,seed) {
  const draw=random(seed),testDraw=random(seed+10000);
  let best=-1,winner=0;
  for(let i=0;i<candidates;i++) {
    let wins=0;
    for(let j=0;j<100;j++) wins+=draw()<.6?1:0;
    if(wins/100>best){best=wins/100;winner=i;}
  }
  let test=0;for(let j=0;j<1000;j++) test+=testDraw()<.6?1:0;
  return {development:best,test:test/1000,winner};
}
function normalize(row) {const norm=Math.sqrt(dot(row,row));if(!norm)throw new Error('Cannot normalize a zero vector.');return row.map(x=>x/norm);}
export function patches(size) {
  const result=[];
  for(let y=0;y<4;y+=size)for(let x=0;x<4;x+=size){const patch=[];for(let dy=0;dy<size;dy++)for(let dx=0;dx<size;dx++)patch.push((y+dy)*4+x+dx);result.push(patch);}
  return result;
}
export function control(gain,steps=20) {let state=1;const states=[state];for(let i=0;i<steps;i++){state=(1-.1*gain)*state;states.push(state);}return states;}
export function calculate(id,p) {
  for(const value of Object.values(p)) if(typeof value==='number'&&!Number.isFinite(value))throw new Error('Enter a finite value for every numeric parameter.');
  switch(id) {
    case 'lab-01': {
      const input=[p.first,p.second],weight=[[1,-1],[2,.5]],out=matmul([input],weight)[0];
      return {metrics:{'First output':out[0],'Second output':out[1]},columns:['Input coordinate','Value','Contribution to output 0','Contribution to output 1'],rows:input.map((v,i)=>[i,v,v*weight[i][0],v*weight[i][1]]),note:'A row vector multiplies W = [[1, -1], [2, 0.5]]. Outputs sum each contribution column.'};
    }
    case 'lab-02': {
      const objective=w=>.5*(Math.tanh(2*w-.1)-1)**2;
      const v=Math.tanh(2*p.weight-.1),gradient=(v-1)*(1-v*v)*2;
      const numeric=(objective(p.weight+p.step)-objective(p.weight-p.step))/(2*p.step);
      return {metrics:{Loss:objective(p.weight),'Exact gradient':gradient,'Central difference':numeric,'After descent step':objective(p.weight-p.rate*gradient)},columns:['Stage','Value'],rows:[['u = 2w - 0.1',2*p.weight-.1],['v = tanh(u)',v],['dL/dv',v-1],['dv/du',1-v*v],['du/dw',2]],note:'Target is 1. Finite-difference step and optimizer learning rate serve different roles.'};
    }
    case 'lab-03': {
      const logits=[p.logit,0,-1],probabilities=softmax(logits),target=p.target;
      return {metrics:{'Target loss':-Math.log(probabilities[target]),Entropy:-sum(probabilities.map(v=>v*Math.log(v))),'Probability sum':sum(probabilities)},columns:['Class','Logit','Probability','Loss gradient'],rows:logits.map((v,i)=>[i,v,probabilities[i],probabilities[i]-(i===target?1:0)]),note:'Softmax normalizes over classes. The gradient is for one target negative log-likelihood.'};
    }
    case 'lab-04': {
      const texts=['low low','lower low','new low'],result=bpe(texts,p.merges);
      const vectors=[[1,0,.2],[0,1,-.1],[.5,.5,.3],[-1,0,.1]];
      return {metrics:{'Initial characters':sum(texts.map(t=>t.length)),'Final tokens':sum(result.corpus.map(t=>t.length)),'Selected embedding':JSON.stringify(vectors[p.token])},columns:['Text','Segmentation'],rows:texts.map((t,i)=>[t,JSON.stringify(result.corpus[i])]),note:'Character BPE with deterministic pair counting. The selected embedding is a supplied lookup row, not a trained text representation.'};
    }
    case 'lab-05': {
      const values=[[2,0],[0,4]],result=attention([p.qx,p.qy],[[1,0],[0,1]],values,null,p.temperature),readout=[.4,-.2];
      const gradient=result.weights.map((a,i)=>a*dot(values[i].map((v,j)=>v-result.output[j]),readout));
      return {metrics:{'Output 0':result.output[0],'Output 1':result.output[1],'Readout loss':dot(result.output,readout)},columns:['Slot','Raw score','Scaled score','Weight','d readout / d scaled score'],rows:result.weights.map((a,i)=>[i,result.raw[i],result.scaled[i],a,gradient[i]]),note:'Keys are (1,0) and (0,1); values are (2,0) and (0,4). Derivatives are with respect to the scaled row scores.'};
    }
    case 'lab-06': {
      const angle=.2*p.distance,c=Math.cos(angle),s=Math.sin(angle),q=[c,s],keys=[[1,0],[0,1],[1,1],[-1,0]],values=[[1,0],[0,1],[1,1],[-1,1]];
      const allowed=[true,true,!p.causal,!p.causal],result=attention(q,keys,values,allowed);
      return {metrics:{'Rotated query norm':Math.hypot(...q),'Allowed weight sum':sum(result.weights),'Query heads per KV group':4/p.groups},columns:['Key position','Allowed','Weight','Query-head to KV-group map'],rows:result.weights.map((w,i)=>[i,allowed[i],w,Math.floor(i/(4/p.groups))]),note:'The query is at token index 1; causality hides keys 2 and 3. Rotation uses one frequency pair. Four query heads share the selected KV groups.'};
    }
    case 'lab-07': {
      const result=trainTable(p.steps,p.rate);
      return {metrics:{'Initial cross-entropy':result.losses[0],'Final cross-entropy':result.losses.at(-1),'Learned target mean probability':sum(result.probabilities.map((r,i)=>r[(i+1)%4]))/4},columns:['Prefix token','p(0)','p(1)','p(2)','p(3)'],rows:result.probabilities.map((r,i)=>[i,...r]),series:result.losses,note:'This is a trained conditional table on the cyclic rule next = (token + 1) mod 4. The full differentiable transformer is included in Python.'};
    }
    case 'lab-08': {
      const bytes=2*24*p.batch*p.groups*p.tokens*64*2;
      const probabilities=softmax([1/p.temperature,.2/p.temperature,-.7/p.temperature]);
      const keys=[[1,0],[0,1],[1,1]],values=[[2,0],[0,4],[1,1]];
      const full=keys.map((q,i)=>attention(q,keys,values,keys.map((_,j)=>j<=i)).output);
      const cachedWeights=softmax(keys.map(key=>dot([1,1],key)/Math.sqrt(2)));
      const cached=transpose(values).map(column=>dot(cachedWeights,column));
      const cacheError=Math.max(...cached.map((value,i)=>Math.abs(value-full.at(-1)[i])));
      return {metrics:{'Ideal KV cache MiB':bytes/1048576,'Dense score entries per layer':p.batch*8*p.tokens*p.tokens,'Direct / cached last-row error':cacheError},columns:['Sampling class','Probability'],rows:probabilities.map((v,i)=>[i,v]),note:'Cache formula: 2 × layers(24) × batch × KV heads × context × head width(64) × bytes(2). The last-row equality is independently tested in engine tests; model weights and workspaces are excluded.'};
    }
    case 'lab-09': {
      const x=[[1,2]],base=[[.5,.1],[-.2,.3]],a=[[p.factor],[.1]],b=[[.4,-.3]],update=matmul(a,b).map(r=>r.map(v=>v*p.alpha));
      const adapted=matmul(x,base.map((r,i)=>r.map((v,j)=>v+update[i][j])))[0];
      const direct=matmul(x,base)[0].map((v,j)=>v+p.alpha*matmul(matmul(x,a),b)[0][j]);
      const maximum=Math.max(...base.flat().map(Math.abs)),limit=2**(p.bits-1)-1,scale=maximum/limit;
      const reconstruction=base.map(row=>row.map(v=>Math.max(-limit,Math.min(limit,Math.round(v/scale)))*scale));
      return {metrics:{'Merge error':Math.max(...adapted.map((v,i)=>Math.abs(v-direct[i]))),'Quantization scale':scale,'Weight reconstruction max error':Math.max(...base.flat().map((v,i)=>Math.abs(v-reconstruction.flat()[i])))},columns:['Output','Base','Adapted','Merged'],rows:adapted.map((v,i)=>[i,matmul(x,base)[0][i],direct[i],v]),note:'Rank is one; alpha is therefore the alpha/r scale. Quantization is uniform symmetric reconstruction, not NF4 or a packed kernel.'};
    }
    case 'lab-10': {
      const counts=[0,0,0,0],capacity=Math.ceil(p.capacity*8/4),rows=[];
      for(let i=0;i<8;i++){const logits=[p.bias+i*.1,-i*.1,.4,.1],probability=softmax(logits),e=probability.indexOf(Math.max(...probability));counts[e]++;rows.push([i,e,probability[e],counts[e]>capacity?'overflow':'within capacity']);}
      const teacher=softmax([2/p.temperature,.5/p.temperature,-1/p.temperature]),student=softmax([.2/p.temperature,-.1/p.temperature,.4/p.temperature]);
      const kl=p.temperature**2*sum(teacher.map((v,i)=>v*Math.log(v/student[i])));
      return {metrics:{'Per-expert capacity':capacity,'Assignments':JSON.stringify(counts),'Distillation KL loss':kl,'Student logit gradient':JSON.stringify(student.map((v,i)=>p.temperature*(v-teacher[i])))},columns:['Token','Selected expert','Original gate probability','Capacity status'],rows,note:'Top-one routing keeps original gate probabilities. Overflow is counted explicitly; this calculation does not silently reroute or claim distributed execution.'};
    }
    case 'lab-11': {
      const r=bellman(p.gamma,p.reward,p.steps);
      return {metrics:{'Bellman residual':r.residual,'Residual / (1 - gamma)':r.residual/(1-p.gamma)},columns:['State','Iterated value','Linear-solve value','Absolute error'],rows:r.values.map((v,i)=>[i,v,r.exact[i],Math.abs(v-r.exact[i])]),note:'P = [[0.7,0.3],[0.2,0.8]], reward = (chosen reward,0). Gamma is kept below one for the contraction argument.'};
    }
    case 'lab-12': {
      const probability=sigmoid(p.theta),g=gae(p.lambda),h=1e-5;
      return {metrics:{'Bandit expected reward':.2+.6*probability,'Exact policy gradient':.6*probability*(1-probability),'PPO surrogate':clipped(p.ratio,p.advantage),'PPO slope vs ratio':(clipped(p.ratio+h,p.advantage)-clipped(p.ratio-h,p.advantage))/(2*h)},columns:['Time','TD residual','GAE'],rows:g.delta.map((v,i)=>[i,v,g.advantages[i]]),note:'PPO epsilon is 0.2. At a clipping boundary the finite difference straddles branches; inspect nearby interior ratios for a branch derivative.'};
    }
    case 'lab-13': {
      const r=dpo(p.gap,p.reference,p.beta),rewards=Array.from({length:4},(_,i)=>i<p.successes?1:0),mean=sum(rewards)/4,std=Math.sqrt(sum(rewards.map(v=>(v-mean)**2))/4);
      return {metrics:{'Reference-adjusted gap':r.delta,'DPO loss':r.loss,'d loss / d policy gap':r.gradient,'Reward mean':mean},columns:['Response','Reward','Group advantage'],rows:rewards.map((v,i)=>[i,v,(v-mean)/(std+1e-8)]),note:'Response log-probabilities are sums over response targets. Constant reward groups yield zero centered advantages under this specified normalization.'};
    }
    case 'lab-14': {
      const r=retrieve(p.query,p.budget);
      return {metrics:{'Selected word cost':r.cost,'Selected IDs':r.chosen.map(i=>r.documents[i].id).join(', ')||'none'},columns:['Document','BM25','RRF','Selected'],rows:r.documents.map((d,i)=>[d.id,r.scores[i],r.fusion[i],r.chosen.includes(i)]),note:'The dense ranking is a supplied illustrative list; lexical scores and rank fusion are calculated. Budget units here are words, not model tokens.'};
    }
    case 'lab-15': {
      const r=loop(p.budget,p.evidence===1),noise=selectionNoise(p.candidates,p.seed);
      return {metrics:{'Loop outcome':r.status,'Selected development accuracy':noise.development,'Independent test accuracy':noise.test,'Underlying candidate success rate':.6},columns:['Step','Action','Observed result'],rows:r.events,note:'All candidate true qualities equal 0.6. A higher selected development score can reflect selection noise. The loop uses deterministic local functions and no external actions.'};
    }
    case 'lab-16': {
      const truth=[1,0,1,1,0,0,1,0],judge=truth.map((v,i)=>i<p.flips?1-v:v),observed=sum(truth.map((v,i)=>v===judge[i]?1:0))/8;
      const a=sum(truth)/8,b=sum(judge)/8,expected=a*b+(1-a)*(1-b),kappa=(observed-expected)/(1-expected);
      const brier=sum(truth.map(y=>(p.confidence-y)**2))/8;
      return {metrics:{'Raw agreement':observed,Kappa:kappa,'Brier score for constant probability':brier,'Order-swap consistency':p.bias?0:1},columns:['Case','Reference label','Judge label','Probability'],rows:truth.map((v,i)=>[i,v,judge[i],p.confidence]),note:'Synthetic judge labels expose measurement behavior. The order-bias toggle simulates a first-position-only preference; it is not an actual LLM judge evaluation.'};
    }
    case 'lab-17': {
      const imagePatches=patches(p.patch),text=[normalize([.9,.1]),normalize([.2,.8])],scores=[[1,0],[0,1]].map(v=>text.map(t=>dot(v,t)/p.temperature));
      const loss=-(sum(scores.map((r,i)=>Math.log(softmax(r)[i])))+sum(transpose(scores).map((r,i)=>Math.log(softmax(r)[i]))))/4;
      let state=.2;const series=[state];for(let i=0;i<p.steps;i++){state=Math.tanh(p.gain*state+.1);series.push(state);}
      return {metrics:{'Patch count':imagePatches.length,'Symmetric contrastive loss':loss,'Recurrent final state':state,'One-more-step residual':Math.abs(Math.tanh(p.gain*state+.1)-state)},columns:['Patch','Flattened pixels'],rows:imagePatches.map((r,i)=>[i,JSON.stringify(r)]),series,note:'Numeric image is 0..15 in row order. Contrastive vectors are supplied fixtures. Shared tanh recurrence demonstrates computation, not a trained visual reasoner.'};
    }
    case 'lab-18': {
      const states=control(p.gain),clean=.3,noise=.8,corrupted=Math.sqrt(p.alpha)*clean+Math.sqrt(1-p.alpha)*noise;
      const recovered=(corrupted-Math.sqrt(1-p.alpha)*(noise+p.error))/Math.sqrt(p.alpha);
      return {metrics:{'Control multiplier':1-.1*p.gain,'Final state':states.at(-1),'Recovered action':recovered,'Action error':recovered-clean,'Error amplification':Math.sqrt((1-p.alpha)/p.alpha)},columns:['Step','State'],rows:states.map((v,i)=>[i,v]),series:states,note:'dt = 0.1, initial state = 1. Action reconstruction uses known injected noise plus the chosen prediction error; no learned denoiser or hardware is involved.'};
    }
    default:throw new Error('Unknown experiment: '+id);
  }
}
