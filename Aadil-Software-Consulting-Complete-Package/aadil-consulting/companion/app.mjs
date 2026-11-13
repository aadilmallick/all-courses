import {catalog,mount} from './labs.mjs';
const navigation=document.querySelector('#experiments');
const stage=document.querySelector('#stage');
const controls=document.querySelector('#controls');
let cleanup=()=>{};
function select(id){
 cleanup();
 navigation.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.experiment===id)));
 try{cleanup=mount(stage,controls,id);}catch(error){stage.textContent='The experiment could not start: '+error.message;cleanup=()=>{};}
}
for(const entry of catalog){
 const button=document.createElement('button');button.type='button';button.dataset.experiment=entry.id;button.textContent=entry.title;
 button.addEventListener('click',()=>select(entry.id));navigation.append(button);
}
window.addEventListener('pagehide',()=>cleanup(),{once:true});
select('readiness');
