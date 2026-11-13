import {catalog,mount} from './experiments.mjs';
const select=document.getElementById('experiment'),stage=document.getElementById('stage'),controls=document.getElementById('controls');
for(const entry of catalog){const option=document.createElement('option');option.value=entry.id;option.textContent=entry.title;select.append(option);}
let dispose=()=>{};
function show(){dispose();try{dispose=mount(stage,controls,select.value);location.hash=select.value;}catch(error){stage.textContent=`Experiment could not start: ${error.message}`;dispose=()=>{};}}
select.addEventListener('change',show);
const initial=location.hash.slice(1);if(catalog.some(c=>c.id===initial))select.value=initial;
show();window.addEventListener('pagehide',()=>dispose());
