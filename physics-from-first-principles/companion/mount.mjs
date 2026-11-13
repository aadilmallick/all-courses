// Optional embedding interface. The full offline reader uses labs.js directly.
import './models.js';
export function mount(stage,controls,options={}){
 const id=options.id||'projectile',initial=options.parameters||[10,45,9.81];
 const fields=initial.map((value,i)=>{const label=document.createElement('label');label.textContent=options.labels?.[i]||`Parameter ${i+1}`;const input=document.createElement('input');input.type='number';input.step='any';input.value=value;label.append(input);controls.append(label);return input;});
 const button=document.createElement('button'),output=document.createElement('pre');button.textContent='Calculate';controls.append(button);stage.append(output);
 const calculate=()=>{try{const result=globalThis.PhysicsModels.models[id](fields.map(f=>Number(f.value)));output.textContent=JSON.stringify(result.values,null,2);}catch(e){output.textContent=e.message;}};
 button.addEventListener('click',calculate);calculate();
 return ()=>{button.removeEventListener('click',calculate);controls.replaceChildren();stage.replaceChildren();};
}
