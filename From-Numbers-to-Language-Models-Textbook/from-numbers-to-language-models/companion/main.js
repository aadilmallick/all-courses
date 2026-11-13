const navigation=document.querySelector('#experiments'),stage=document.querySelector('#stage'),controls=document.querySelector('#controls'),heading=document.querySelector('#experiment-title'),description=document.querySelector('#description');
let epoch=0,dispose=()=>{},entries=[];
async function select(id) {
  const current=++epoch;dispose();dispose=()=>{};stage.textContent='Loading experiment…';controls.replaceChildren();
  const entry=entries.find(item=>item.id===id)||entries[0];
  heading.textContent=entry.title;description.textContent=entry.description;
  document.querySelector('#chapter-link').href='../book.html#'+entry.chapter;
  document.querySelector('#chapter-link').textContent='Read chapter '+Number(entry.chapter.split('-')[1]);
  for(const button of navigation.querySelectorAll('button'))button.setAttribute('aria-current',button.dataset.id===entry.id?'page':'false');
  try {
    const module=await import('./'+entry.module);
    if(current!==epoch)return;
    stage.replaceChildren();
    const cleanup=await module.mount(stage,controls);
    if(current!==epoch){cleanup?.();return;}
    dispose=cleanup||(()=>{});
  }catch(error){if(current===epoch)stage.textContent='This experiment could not load: '+error.message+'. Start the included local server and try again.';}
}
try {
  const response=await fetch('./catalog.json');if(!response.ok)throw new Error('Catalog request failed');
  entries=(await response.json()).experiments;
  for(const entry of entries){const button=document.createElement('button');button.textContent=entry.id.slice(-2)+' · '+entry.title;button.dataset.id=entry.id;button.addEventListener('click',()=>{location.hash=entry.id;});navigation.append(button);}
  window.addEventListener('hashchange',()=>select(location.hash.slice(1)));
  await select(location.hash.slice(1)||entries[0].id);
}catch(error){stage.textContent='Start the local server with node companion/server.mjs, then open its localhost address. '+error.message;}
document.querySelector('#source-toggle').addEventListener('toggle',async event=>{
  if(!event.target.open)return;
  const target=document.querySelector('#source-code');if(target.dataset.loaded)return;
  try {const response=await fetch('./engine.js');if(!response.ok)throw new Error('Source request failed');target.textContent=await response.text();target.dataset.loaded='true';}
  catch(error){target.textContent=error.message;}
});
window.addEventListener('pagehide',()=>{epoch++;dispose();});
