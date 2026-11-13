import {mount} from './labs.mjs';
const nav=document.querySelector('#navigation'), title=document.querySelector('#title'), desc=document.querySelector('#description'), chapter=document.querySelector('#chapter'), stage=document.querySelector('#stage'), controls=document.querySelector('#controls');
let dispose=()=>{};
try{
 const response=await fetch('./catalog.json');if(!response.ok)throw new Error('The experiment catalog could not be loaded.');const catalog=await response.json();
 for(const item of catalog.experiments){const a=document.createElement('a');a.href='#'+item.id;a.textContent=item.title;nav.append(a);}
 const show=()=>{const id=location.hash.slice(1)||'niche';const item=catalog.experiments.find(e=>e.id===id)||catalog.experiments[0];dispose();controls.replaceChildren();stage.replaceChildren();title.textContent=item.title;desc.textContent=item.description;chapter.textContent=item.chapter.replace('chapter-','Chapter ');for(const a of nav.querySelectorAll('a')){a.removeAttribute('aria-current');if(a.hash==='#'+item.id)a.setAttribute('aria-current','page');}dispose=mount(stage,controls,item.id);};
 addEventListener('hashchange',show);addEventListener('pagehide',()=>dispose(),{once:true});show();
}catch(error){title.textContent='Start the local course server';desc.textContent='Open the package folder in a terminal and run: node companion/server.mjs. Then open http://127.0.0.1:4173/companion/. If you are already using the server, inspect that catalog.json is present. '+error.message;}
