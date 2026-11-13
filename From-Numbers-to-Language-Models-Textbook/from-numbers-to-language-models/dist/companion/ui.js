import {calculate} from './engine.js';
export const catalog = await fetch('./catalog.json').then(response=>{if(!response.ok)throw new Error('Experiment catalog could not load.');return response.json();});
const format=value=>typeof value==='number'?(Number.isFinite(value)?Number(value.toPrecision(7)).toString():String(value)):String(value);
function element(tag,text,className){const node=document.createElement(tag);if(text!==undefined)node.textContent=text;if(className)node.className=className;return node;}
export function mountExperiment(id,stage,controls) {
  const spec=catalog.experiments.find(entry=>entry.id===id),lifetime=new AbortController(),inputs=new Map();
  const form=element('form');form.setAttribute('aria-label','Experiment parameters');
  for(const control of spec.controls) {
    const wrap=element('div',undefined,'field'),label=element('label',control.label),value=element('output');
    const input=document.createElement(control.type==='select'?'select':'input');
    input.id=id+'-'+control.name;input.name=control.name;label.htmlFor=input.id;value.setAttribute('for',input.id);
    if(control.type==='select')for(const option of control.options){const item=element('option',String(option));item.value=option;input.append(item);}
    else {input.type=control.type;for(const key of ['min','max','step'])if(control[key]!==undefined)input[key]=control[key];}
    input.value=control.value;input.defaultValue=control.value;
    if(control.type==='select')for(const option of input.options)option.defaultSelected=option.value===String(control.value);
    value.textContent=input.value;inputs.set(control.name,{input,value,control});
    wrap.append(label,input,value);form.append(wrap);
  }
  const reset=element('button','Reset experiment');reset.type='button';reset.className='reset';form.append(reset);controls.append(form);
  const status=element('p','Computing…','status');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  stage.append(status);
  const results=element('div');stage.append(results);
  const render=()=>{
    try {
      const parameters={};
      for(const [name,{input,value,control}] of inputs){value.textContent=input.value;parameters[name]=control.type==='text'?input.value:Number(input.value);}
      const result=calculate(id,parameters);results.replaceChildren();
      const metrics=element('dl',undefined,'metrics');
      for(const [name,value] of Object.entries(result.metrics)){const cell=element('div');cell.append(element('dt',name),element('dd',format(value)));metrics.append(cell);}
      results.append(metrics);
      if(result.series && result.series.length>1){
        const series=result.series,minimum=Math.min(...series),maximum=Math.max(...series),range=maximum-minimum||1;
        const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 640 160');svg.classList.add('plot');svg.setAttribute('role','img');svg.setAttribute('aria-label','Computed series; the accompanying metrics and table provide numerical values.');
        const line=document.createElementNS(svg.namespaceURI,'polyline');line.setAttribute('points',series.map((v,i)=>`${10+620*i/(series.length-1)},${145-130*(v-minimum)/range}`).join(' '));line.setAttribute('fill','none');line.setAttribute('stroke','#157565');line.setAttribute('stroke-width','3');svg.append(line);results.append(svg);
        results.append(element('p',`Series starts at ${format(series[0])} and ends at ${format(series.at(-1))}; vertical range ${format(minimum)} to ${format(maximum)}.`,'caption'));
      }
      const scroll=element('div',undefined,'table-wrap'),table=element('table'),caption=element('caption','Computed intermediate values');table.append(caption);
      const head=element('thead'),headRow=element('tr');for(const column of result.columns){const th=element('th',column);th.scope='col';headRow.append(th);}head.append(headRow);table.append(head);
      const body=element('tbody');for(const row of result.rows){const tr=element('tr');for(const value of row)tr.append(element('td',format(value)));body.append(tr);}table.append(body);scroll.append(table);results.append(scroll,element('p',result.note,'note'));
      status.textContent='Calculated from the current parameters.';status.className='status';
    }catch(error){results.replaceChildren();status.textContent=error.message;status.className='status error';}
  };
  form.addEventListener('input',render,{signal:lifetime.signal});form.addEventListener('submit',event=>event.preventDefault(),{signal:lifetime.signal});
  reset.addEventListener('click',()=>{for(const {input,control} of inputs.values())input.value=control.value;render();},{signal:lifetime.signal});
  render();
  return ()=>{lifetime.abort();controls.replaceChildren();stage.replaceChildren();};
}
