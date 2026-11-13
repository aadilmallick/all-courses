const byId=id=>document.getElementById(id);
const status=byId('status'), start=byId('start'), end=byId('end'), mute=byId('mute'), speaker=byId('speaker');
let generation=0, owned=null;
function dispose(resources) {
  if(!resources) return;
  resources.controller.abort(); clearTimeout(resources.timer);
  resources.dc?.close(); resources.pc?.close();
  resources.stream?.getTracks().forEach(track=>track.stop());
}
function stop(message='Ended. Microphone off.') {
  generation++;const previous=owned;owned=null;dispose(previous);
  speaker.pause();speaker.srcObject=null;start.disabled=false;end.disabled=true;mute.disabled=true;mute.textContent='Mute microphone';status.textContent=message;
}
async function gather(pc, signal) {
  if(pc.iceGatheringState==='complete')return;
  await new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>done(Error('ICE gathering timed out')),6000);
    const check=()=>{if(pc.iceGatheringState==='complete')done();};
    const abort=()=>done(Error('Setup cancelled'));
    function done(error){clearTimeout(timeout);pc.removeEventListener('icegatheringstatechange',check);signal.removeEventListener('abort',abort);error?reject(error):resolve();}
    pc.addEventListener('icegatheringstatechange',check);signal.addEventListener('abort',abort,{once:true});
    if(signal.aborted)abort();else check();
  });
}
start.onclick=async()=>{
  if(owned)return;
  const id=++generation, r={controller:new AbortController()};owned=r;
  start.disabled=true;end.disabled=false;status.textContent='Waiting for microphone permission…';byId('transcript').textContent='';
  try {
    if(!navigator.mediaDevices?.getUserMedia)throw Error('Microphone requires HTTPS or localhost and browser support');
    r.stream=await navigator.mediaDevices.getUserMedia({audio:{echoCancellation:true,noiseSuppression:true,autoGainControl:true}});
    if(id!==generation){dispose(r);return;}
    r.pc=new RTCPeerConnection();
    r.pc.ontrack=e=>{if(id===generation){speaker.srcObject=e.streams[0]??new MediaStream([e.track]);speaker.play().catch(()=>{if(id===generation)status.textContent='Connected. Press Play on the audio controls to hear replies.';});}};
    r.pc.onconnectionstatechange=()=>{
      if(id!==generation)return;
      if(r.pc.connectionState==='failed')stop('Connection failed. Start again or use text in your app.');
      else if(r.pc.connectionState==='connected'){clearTimeout(r.timer);status.textContent='Connected. Microphone on.';}
    };
    r.stream.getTracks().forEach(track=>r.pc.addTrack(track,r.stream));
    r.dc=r.pc.createDataChannel('oai-events');
    r.dc.onmessage=e=>{
      if(id!==generation)return;
      try { const event=JSON.parse(e.data);
        if(event.type==='response.output_audio_transcript.delta')byId('transcript').textContent+=event.delta;
        if(event.type==='response.created')byId('transcript').textContent='';
        if(event.type==='error')status.textContent='Provider reported a session error. End and retry.';
      }catch{status.textContent='Ignored an unrecognized event.';}
    };
    status.textContent='Connecting…';r.timer=setTimeout(()=>{if(id===generation)stop('Connection timed out. Start again.');},30000);
    await r.pc.setLocalDescription(await r.pc.createOffer());await gather(r.pc,r.controller.signal);
    const answer=await fetch('/session',{method:'POST',headers:{'Content-Type':'application/sdp'},body:r.pc.localDescription.sdp,signal:r.controller.signal});
    const body=await answer.text();if(!answer.ok)throw Error(body);
    if(id!==generation)return;
    await r.pc.setRemoteDescription({type:'answer',sdp:body});
    if(id===generation)mute.disabled=false;
  }catch(error){if(id===generation)stop(error.name==='NotAllowedError'?'Microphone permission denied. Change browser permissions or use text in your app.':error.message);}
};
end.onclick=()=>stop();
mute.onclick=()=>{
  const tracks=owned?.stream?.getAudioTracks()??[];const next=tracks.some(track=>track.enabled);
  tracks.forEach(track=>{track.enabled=!next;});mute.textContent=next?'Unmute microphone':'Mute microphone';status.textContent=next?'Microphone muted. Audio replies may continue.':'Microphone on.';
};
window.addEventListener('pagehide',()=>stop());
