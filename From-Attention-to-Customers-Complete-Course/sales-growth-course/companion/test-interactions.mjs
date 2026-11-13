// Executes the real companion modules against a small deterministic DOM harness.
// This checks logic and event wiring, not browser layout, accessibility or native DOM conformance.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
class Element {
  constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.parentNode=null;this.dataset={};this.attributes={};this.listeners={};this._text='';this.value='';}
  append(...nodes){for(const node of nodes){node.parentNode=this;this.children.push(node);}}
  replaceChildren(...nodes){for(const c of this.children)c.parentNode=null;this.children=[];this._text='';this.append(...nodes);}
  set textContent(value){this._text=String(value);this.children=[];}
  get textContent(){return this._text+this.children.map(x=>x.textContent).join(' ');}
  setAttribute(key,value){this.attributes[key]=String(value);}
  removeAttribute(key){delete this.attributes[key];}
  get valueAsNumber(){return this.value===''?NaN:Number(this.value);}
  checkValidity(){const n=this.valueAsNumber;const base=Number(this.min||0);const step=Number(this.step||1);return Number.isFinite(n)&&n>=base&&n<=Number(this.max??Infinity)&&Math.abs((n-base)/step-Math.round((n-base)/step))<1e-6;}
  addEventListener(type,fn){(this.listeners[type]??=[]).push(fn);}
  removeEventListener(type,fn){this.listeners[type]=(this.listeners[type]||[]).filter(x=>x!==fn);}
  dispatch(type){for(const fn of this.listeners[type]||[])fn({target:this,preventDefault(){}});if(this.parentNode)this.parentNode.dispatch(type);}
  click(){this.dispatch('click');}
  all(){return this.children.flatMap(c=>[c,...c.all()]);}
  querySelectorAll(selector){return this.all().filter(x=>selector.startsWith('#')?x.id===selector.slice(1):x.tagName===selector.toUpperCase());}
}
const root=new Element('main');
for(const id of ['lab-nav','stage','controls','lab-title','chapter-map']){const e=new Element(id==='lab-nav'?'nav':'section');e.id=id;root.append(e);}
globalThis.document={createElement:tag=>new Element(tag),querySelector:selector=>root.querySelectorAll(selector)[0]};
await import('./app.mjs');
const find=id=>root.all().find(x=>x.id===id);
const stage=find('stage');
const result=key=>stage.all().find(x=>x.dataset.result===key)?.textContent;
const set=(key,value)=>{const e=find('input-'+key);e.value=String(value);e.dispatch('input');};
const nav=id=>find('lab-nav').children.find(x=>x.dataset.lab===id).click();
let checks=0;const equal=(a,b)=>{assert.equal(a,b);checks++;};
equal(find('lab-nav').children.length,6);
equal(result('revenue'),'$98.00');set('purchaseRate',10);equal(result('buyers'),'4');set('purchaseRate','');assert.match(find('results').textContent,/valid value/);checks++;find('reset').click();equal(result('buyers'),'2');
nav('economics');equal(result('contribution'),'$41.78');set('refundRate',100);equal(result('breakEvenROAS'),'Undefined / insufficient data');find('reset').click();equal(result('afterCAC'),'$21.78');
nav('pipeline');equal(result('clients'),'1.8');set('conversations',0);equal(result('revenue'),'$0.00');find('reset').click();equal(result('deliveryHours'),'18');
nav('video');equal(result('hoursA'),'30');equal(result('hoursB'),'33.33');set('ctrA',0);equal(result('hoursA'),'0');find('reset').click();
nav('uncertainty');equal(result('rateA'),'5.00%');set('successA',21);assert.match(find('results').textContent,/cannot exceed/);checks++;set('successA',0);set('trialsA',0);equal(result('rateA'),'Undefined / insufficient data');find('reset').click();
nav('capacity');equal(result('remaining'),'-1');assert.match(find('results').textContent,/exceeds/);checks++;set('availableHours',0);equal(result('utilization'),'Undefined / insufficient data');find('reset').click();
for(let repeat=0;repeat<3;repeat++)for(const id of ['funnel','economics','pipeline','video','uncertainty','capacity']){nav(id);equal(stage.querySelectorAll('table').length,1);equal(find('controls').querySelectorAll('form').length,1);}
nav('funnel');set('visitRate',101);assert.match(find('results').textContent,/valid value/);checks++;find('reset').click();equal(result('revenue'),'$98.00');
// Run the exact built offline script too, so bundling is not inferred from source checks.
root.replaceChildren();
for(const id of ['lab-nav','stage','controls','lab-title','chapter-map']){const e=new Element(id==='lab-nav'?'nav':'section');e.id=id;root.append(e);}
const built=readFileSync(new URL('./index.html',import.meta.url),'utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
vm.runInNewContext(built,{document:globalThis.document,Intl,console,Map,Number,Math});
equal(find('lab-nav').children.length,6);
const builtResult=key=>find('stage').all().find(x=>x.dataset.result===key)?.textContent;
equal(builtResult('revenue'),'$98.00');set('purchaseRate',10);equal(builtResult('buyers'),'4');find('reset').click();equal(builtResult('buyers'),'2');
nav('video');equal(builtResult('hoursB'),'33.33');
console.log(JSON.stringify({status:'pass',checks,method:'Actual source modules and built inline output with deterministic DOM harness; real-browser rendering unverified.'}));
