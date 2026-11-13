import {definitions,mount} from './labs.mjs';
const select=document.querySelector('#lab'),controls=document.querySelector('#controls'),stage=document.querySelector('#stage');
for(const [id,def]of Object.entries(definitions)){const option=document.createElement('option');option.value=id;option.textContent=def.title;select.append(option);}
let active;
function load(){active?.cleanup();document.querySelector('#description').textContent=definitions[select.value].description;active=mount(stage,controls,select.value);}
select.addEventListener('change',load);document.querySelector('#run').addEventListener('click',()=>active.run());document.querySelector('#reset').addEventListener('click',load);load();
fetch('./labs.mjs').then(r=>{if(!r.ok)throw Error('Source unavailable');return r.text();}).then(t=>document.querySelector('#source').textContent=t).catch(e=>document.querySelector('#source').textContent=e.message);
