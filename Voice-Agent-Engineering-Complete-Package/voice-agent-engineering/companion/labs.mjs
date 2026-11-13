import {frameBytes,endpoint,Playback,Ledger,percentile,cost} from './model.mjs';
export function mount(stage,controls){
 const owned=[];const listen=(node,event,fn)=>{node.addEventListener(event,fn);owned.push(()=>node.removeEventListener(event,fn));};
 const result=(text,extra='')=>{stage.replaceChildren();const p=document.createElement('p');p.className='big';p.textContent=text;stage.append(p);if(extra){const q=document.createElement('p');q.className='note';q.textContent=extra;stage.append(q);}};
 const field=(name,value,{min=0,max=1000,step=1,type='range'}={})=>{const label=document.createElement('label'),span=document.createElement('span'),input=document.createElement('input'),out=document.createElement('output');span.textContent=name;input.type=type;input.value=value;input.min=min;input.max=max;input.step=step;input.setAttribute('aria-label',name);out.textContent=value;listen(input,'input',()=>out.textContent=input.value);label.append(span,input,out);controls.append(label);return input;};
 const button=(text,fn)=>{const b=document.createElement('button');b.textContent=text;listen(b,'click',fn);controls.append(b);return b;};
 const onInputs=(nodes,draw)=>{nodes.forEach(n=>listen(n,'input',draw));draw();};
 const id=stage.dataset.experiment;
 if(id==='latency'){
  const labels=['Endpoint ms','Recognition ms','Reasoning ms','Synthesis ms','Playback buffer ms'];const inputs=labels.map((n,i)=>field(n,[400,120,250,160,70][i],{max:1500,step:10}));
  onInputs(inputs,()=>{const v=inputs.map(n=>+n.value),total=v.reduce((a,b)=>a+b,0);result(`${total} ms`, 'Serial illustrative budget. Overlapping pipelines require a measured critical path.');labels.forEach((name,i)=>{const p=document.createElement('p');p.textContent=`${name}: ${v[i]}`;const bar=document.createElement('div');bar.className='bar';bar.style.width=`${total?v[i]/total*100:0}%`;stage.append(p,bar);});});
 }else if(id==='pcm'){
  const rate=field('Sample rate Hz',16000,{min:8000,max:48000,step:8000}),ms=field('Frame duration ms',20,{min:10,max:100,step:10}),freq=field('Tone frequency Hz',440,{min:100,max:1000,step:10});
  onInputs([rate,ms,freq],()=>{const bytes=frameBytes(+rate.value,+ms.value);result(`${bytes} bytes / frame`,`${bytes/2} mono PCM16 samples · ${4*Math.ceil(bytes/3)} Base64 characters · ${+rate.value*2} raw bytes/second. Waveform: first 10 ms, 15% amplitude.`);const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 600 100');svg.setAttribute('role','img');svg.setAttribute('aria-label','Synthetic sine waveform');const line=document.createElementNS(svg.namespaceURI,'polyline');line.setAttribute('fill','none');line.setAttribute('stroke','#8de4cd');line.setAttribute('stroke-width','2');line.setAttribute('points',Array.from({length:601},(_,x)=>`${x},${50-35*Math.sin(2*Math.PI*+freq.value*x/600*.01)}`).join(' '));svg.append(line);stage.append(svg);});
 }else if(id==='endpoint'){
  const threshold=field('Silence threshold ms',500,{min:100,max:1000,step:20});
  onInputs([threshold],()=>{const frames=[...Array(10).fill(true),...Array(15).fill(false),...Array(10).fill(true),...Array(60).fill(false)];const commits=endpoint(frames,+threshold.value);result(commits.length+' committed turn(s)',`Trace: 200 ms speech, 300 ms pause, 200 ms speech, 1200 ms silence. Commit timestamps: ${commits.join(', ')} ms. Boolean activity is synthetic, not a VAD.`);});
 }else if(id==='interrupt'){
  const player=new Playback();let old=player.epoch,log=[];
  const draw=()=>result(`Epoch ${player.epoch} · ${player.queue.length} queued`,log.join(' | ')||'First accept a chunk, interrupt, then deliver an old chunk.');
  button('Accept current chunk',()=>{player.accept(player.epoch,'audio');log.push('current accepted');draw();});
  button('Interrupt and clear',()=>{old=player.epoch;player.interrupt();log.push('queue cleared');draw();});
  button('Deliver stale chunk',()=>{log.push(player.accept(old,'late audio')?'chunk accepted (same epoch)':'stale chunk rejected');draw();});draw();
 }else if(id==='transaction'){
  const ledger=new Ledger();let log=[];const draw=()=>result(`${ledger.receipts.size} receipt(s)`,log.join(' | ')||'Single-process synthetic ledger; no real booking.');
  const run=fn=>{try{log.push(fn());}catch(e){log.push(e.message);}draw();};
  button('Propose Wednesday 15:00',()=>run(()=>ledger.propose('demo-user','wed-1500','proposal-1')&&'proposal ready'));
  button('Confirm as wrong user',()=>run(()=>JSON.stringify(ledger.confirm('other-user','proposal-1'))));
  button('Confirm / retry',()=>run(()=>JSON.stringify(ledger.confirm('demo-user','proposal-1'))));draw();
 }else if(id==='ux'){
  let state='idle',mic=false;const draw=()=>result(state,`Microphone ${mic?'on':'off'} (simulation). All transition buttons are deterministic teaching events.`);
  button('Start',()=>{if(state==='idle'||state==='ended'||state==='denied'){state='permission pending';mic=false;}draw();});
  button('Grant permission',()=>{if(state==='permission pending'){state='connecting';mic=true;}draw();});
  button('Deny permission',()=>{if(state==='permission pending'){state='denied';mic=false;}draw();});
  button('Provider ready',()=>{if(state==='connecting')state='listening';draw();});
  button('Playback blocked',()=>{if(state==='listening')state='press Play to hear replies';draw();});
  button('End',()=>{state='ended';mic=false;draw();});draw();
 }else if(id==='evaluation'){
  const label=document.createElement('label');label.textContent='Latency values in ms, comma-separated';const input=document.createElement('textarea');input.value='100, 200, 300, 400, 900';label.append(input);controls.append(label);
  onInputs([input],()=>{try{const parts=input.value.split(',').map(s=>s.trim());if(parts.some(s=>!s))throw Error('Enter a nonempty list');const values=parts.map(Number);if(values.some(v=>v<0))throw Error('Latencies must be nonnegative');result(`p50 ${percentile(values,50)} ms · p95 ${percentile(values,95)} ms`,`${values.length} samples. Nearest rank; small sets do not establish reliable population tails.`);}catch(e){result('Invalid measurements',e.message);}});
 }else if(id==='cost'){
  const names=['Input minutes','Output minutes','Connected minutes','Input rate / min','Output rate / min','Platform rate / min'];const values=[3,2,6,.01,.04,.02];const inputs=names.map((name,i)=>field(name,values[i],{type:'number',min:0,max:100000,step:i<3?.1:.001}));
  onInputs(inputs,()=>{try{if(inputs.some(x=>x.value===''))throw Error('Complete every rate and usage field');const v=inputs.map(n=>+n.value);result(`${cost(...v).toFixed(3)} currency units / session`,'Illustrative editable assumptions. No vendor prices loaded; excludes tokens, infrastructure, taxes, and other services.');}catch(e){result('Invalid cost inputs',e.message);}});
 }
 return ()=>owned.forEach(dispose=>dispose());
}
