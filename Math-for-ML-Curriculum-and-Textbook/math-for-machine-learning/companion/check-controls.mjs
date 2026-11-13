// DOM wiring test with a minimal in-memory surface, not a browser/rendering test.
import assert from 'node:assert/strict';
import {catalog,mount} from './experiments.mjs';
class Element{
 constructor(tag){this.tag=tag;this.children=[];this.events=new Map();this.attributes={};this._text='';this.classList={add(){},remove(){}};}
 append(...items){this.children.push(...items);}
 set innerHTML(value){this.children=[];this._text=value;}
 get innerHTML(){return this._text;}
 set textContent(value){this._text=String(value);this.children=[];}
 get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}
 set value(value){this._value=String(value);}
 get value(){return this._value;}
 setAttribute(key,value){this.attributes[key]=value;}
 addEventListener(type,fn){this.events.set(type,fn);}
 removeEventListener(type,fn){if(this.events.get(type)===fn)this.events.delete(type);}
 dispatch(type){this.events.get(type)?.();}
 getContext(){return {clearRect(){},fillRect(){},beginPath(){},moveTo(){},lineTo(){},stroke(){},fill(){},arc(){},fillText(){}};}
}
globalThis.document={createElement:tag=>new Element(tag)};
const flatten=node=>[node,...node.children.flatMap(flatten)];
let cases=0;
for(const entry of catalog){
 const stage=new Element('article'),controls=new Element('section');
 const dispose=mount(stage,controls,entry.id);
 const initial=stage.textContent,all=flatten(controls),inputs=all.filter(e=>e.tag==='input');
 inputs[0].value=inputs[0].max;inputs[0].dispatch('input');
 assert.notEqual(stage.textContent,initial,`${entry.id}: control must update output`);
 all.find(e=>e.tag==='button').dispatch('click');
 assert.equal(stage.textContent,initial,`${entry.id}: reset must restore output`);
 dispose();assert.ok(all.every(e=>e.events.size===0),`${entry.id}: listeners removed`);cases++;
}
for(const [id,indices,phrase] of [['projection',[2,3],'nonzero'],['bayes',[1,2],'undefined']]){
 const stage=new Element('article'),controls=new Element('section'),dispose=mount(stage,controls,id);
 const inputs=flatten(controls).filter(e=>e.tag==='input');
 for(const index of indices){inputs[index].value=0;inputs[index].dispatch('input');}
 assert.ok(stage.textContent.includes(phrase));dispose();
}
console.log(`${cases} control/update/reset/disposal cases passed on an in-memory DOM surface; two error paths passed. No visual/browser claim.`);
