// A minimal DOM test double exercises mount, recalculation, reset, and disposal.
// This is deliberately NOT a browser renderer or a full DOM implementation.
import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
class Element extends EventTarget {
  constructor(tag){super();this.tagName=tag.toUpperCase();this.children=[];this.attributes={};this._text='';this.value='';this.className='';this.classList={add:name=>{this.className+=' '+name;}};}
  append(...items){this.children.push(...items);}
  replaceChildren(...items){this.children=[...items];this._text='';}
  set textContent(value){this._text=String(value);this.children=[];}
  get textContent(){return this._text+this.children.map(child=>child.textContent).join('');}
  setAttribute(key,value){this.attributes[key]=String(value);}
  get options(){return this.children.filter(child=>child.tagName==='OPTION');}
}
globalThis.document={createElement:tag=>new Element(tag),createElementNS:(namespace,tag)=>{const element=new Element(tag);element.namespaceURI=namespace;return element;}};
const catalog=JSON.parse(await fs.readFile(new URL('./catalog.json',import.meta.url),'utf8'));
globalThis.fetch=async()=>({ok:true,json:async()=>catalog});
function descend(node,predicate){if(predicate(node))return node;for(const child of node.children){const found=descend(child,predicate);if(found)return found;}return null;}
const evidence=[];
for(const entry of catalog.experiments){
 const stage=new Element('section'),controls=new Element('section'),module=await import('./'+entry.module);
 const cleanup=module.mount(stage,controls);
 const before=stage.textContent;
 assert.ok(before.includes('Calculated from the current parameters.'));
 const form=controls.children[0],control=entry.controls[0];
 const input=descend(form,node=>node.name===control.name);
 input.value=String(control.type==='text'?'backup daily':control.options?control.options.find(value=>value!==control.value):control.value===control.min?control.max:control.min);
 form.dispatchEvent(new Event('input'));
 assert.notEqual(stage.textContent,before,entry.id+' recalculation');
 const reset=descend(form,node=>node.tagName==='BUTTON');reset.dispatchEvent(new Event('click'));
 assert.equal(stage.textContent,before,entry.id+' reset');
 if(control.type!=='text'){
  input.value='invalid';form.dispatchEvent(new Event('input'));assert.ok(stage.textContent.includes('finite value'));
  reset.dispatchEvent(new Event('click'));assert.equal(stage.textContent,before);
 }
 cleanup();assert.equal(stage.children.length,0);assert.equal(controls.children.length,0);
 form.dispatchEvent(new Event('input'));assert.equal(stage.children.length,0,'listener must be disposed');
 evidence.push({id:entry.id,recalculation:true,reset:true,disposal:true});
}
console.log('PASS: 18 mounts, parameter changes, resets, numeric failure recovery, and listener disposal in a DOM test double.');
console.log('LIMIT: no layout, native browser, keyboard routing, or visual inspection established by this harness.');
