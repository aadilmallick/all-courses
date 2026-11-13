(function(root){
  const clamp=(value,lo,hi)=>Math.min(hi,Math.max(lo,Number.isFinite(Number(value))?Number(value):lo));
  function ease(t,mode){t=clamp(t,0,1);return mode==='linear'?t:1-Math.pow(1-t,3);}
  function scene(time,hold=3,mode='ease'){hold=clamp(hold,.5,6);const total=9.5+hold,t=clamp(time,0,total);let name,progress;
    if(t<2.5){name='title';progress=ease(t/.3,mode);}else if(t<5){name='code';progress=ease((t-2.5)/.3,mode);}else if(t<5+hold){name='hold';progress=1;}else{name='diagram';progress=ease((t-5-hold)/.3,mode);}
    return {name,progress,total,time:t,scale: name==='title'?.9+.1*progress:name==='code'?1+.15*progress:1};
  }
  function narration(text,pace=150,extra=0){const count=String(text).trim().split(/\s+/).filter(Boolean).length;return {words:count,seconds:count/clamp(pace,80,220)*60+clamp(extra,0,600)};}
  const api={clamp,ease,scene,narration};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.EditLabModel=api;
})(typeof window!=='undefined'?window:globalThis);
