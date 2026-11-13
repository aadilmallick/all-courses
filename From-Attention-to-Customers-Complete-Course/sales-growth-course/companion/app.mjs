import {experiments,mount} from './experiments.mjs';
const nav=document.querySelector('#lab-nav'),stage=document.querySelector('#stage'),controls=document.querySelector('#controls');
let dispose=()=>{};
function selectLab(id){
  dispose();stage.dataset.experiment=id;
  const cfg=experiments.find(x=>x.id===id);document.querySelector('#lab-title').textContent=cfg.title;
  document.querySelector('#chapter-map').textContent=`Connected chapters: ${cfg.chapters}`;
  nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.lab===id)));
  try{dispose=mount(stage,controls);}catch(error){stage.textContent=error.message;dispose=()=>{};}
}
experiments.forEach(config=>{const button=document.createElement('button');button.textContent=config.title;button.dataset.lab=config.id;button.addEventListener('click',()=>selectLab(config.id));nav.append(button);});
selectLab('funnel');
