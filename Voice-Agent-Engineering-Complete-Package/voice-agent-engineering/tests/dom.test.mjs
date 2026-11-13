/** Lightweight DOM double: exercises actual lab mounts and event cleanup.
 * This is NOT a browser render, accessibility audit, or layout test.
 */
import test from 'node:test';import assert from 'node:assert/strict';
class Element {
 constructor(tag){this.tagName=tag;this.children=[];this.attributes={};this.listeners={};this.dataset={};this.style={};this._text='';this.value='';}
 append(...nodes){this.children.push(...nodes);}
 replaceChildren(...nodes){this._text='';this.children=[...nodes];}
 set textContent(value){this._text=String(value);this.children=[];}
 get textContent(){return this._text+this.children.map(x=>x.textContent??String(x)).join(' ');}
 setAttribute(k,v){this.attributes[k]=v;}
 addEventListener(e,fn){(this.listeners[e]??=new Set()).add(fn);}
 removeEventListener(e,fn){this.listeners[e]?.delete(fn);}
 emit(event){for(const fn of this.listeners[event]??[])fn({target:this});}
}
globalThis.document={createElement:t=>new Element(t),createElementNS:(_ns,t)=>new Element(t)};
const {mount}=await import('../companion/labs.mjs');
function lab(id){const stage=new Element('section'),controls=new Element('div');stage.dataset.experiment=id;const dispose=mount(stage,controls);return {stage,controls,dispose,button(name){return controls.children.find(x=>x.tagName==='button'&&x.textContent===name);},input(name){return controls.children.flatMap(x=>x.children).find(x=>x.attributes['aria-label']===name);}};}
test('latency controls execute actual mount logic',()=>{const l=lab('latency');assert.match(l.stage.textContent,/1000 ms/);l.input('Endpoint ms').value='1500';l.input('Endpoint ms').emit('input');assert.match(l.stage.textContent,/2100 ms/);l.dispose();l.input('Endpoint ms').value='0';l.input('Endpoint ms').emit('input');assert.match(l.stage.textContent,/2100 ms/);});
test('PCM control recomputes and creates actual SVG nodes',()=>{const l=lab('pcm');assert.match(l.stage.textContent,/640 bytes/);l.input('Sample rate Hz').value='48000';l.input('Sample rate Hz').emit('input');assert.match(l.stage.textContent,/1920 bytes/);assert.ok(l.stage.children.some(x=>x.tagName==='svg'));l.dispose();});
test('endpoint threshold changes commit count',()=>{const l=lab('endpoint');assert.match(l.stage.textContent,/1 committed/);l.input('Silence threshold ms').value='100';l.input('Silence threshold ms').emit('input');assert.match(l.stage.textContent,/2 committed/);l.dispose();});
test('interrupt buttons reject a stale chunk',()=>{const l=lab('interrupt');for(const name of ['Accept current chunk','Interrupt and clear','Deliver stale chunk'])l.button(name).emit('click');assert.match(l.stage.textContent,/0 queued/);assert.match(l.stage.textContent,/stale chunk rejected/);l.dispose();});
test('transaction controls reject wrong owner and deduplicate',()=>{const l=lab('transaction');l.button('Propose Wednesday 15:00').emit('click');l.button('Confirm as wrong user').emit('click');assert.match(l.stage.textContent,/wrong owner/);l.button('Confirm / retry').emit('click');l.button('Confirm / retry').emit('click');assert.match(l.stage.textContent,/1 receipt/);l.dispose();});
test('UX states allow end while permission is pending',()=>{const l=lab('ux');l.button('Start').emit('click');l.button('End').emit('click');l.button('Grant permission').emit('click');assert.match(l.stage.textContent,/ended/);assert.match(l.stage.textContent,/Microphone off/);l.dispose();});
test('evaluation rejects malformed measurements',()=>{const l=lab('evaluation');assert.match(l.stage.textContent,/p50 300 ms/);const input=l.controls.children[0].children[0];input.value='1,,2';input.emit('input');assert.match(l.stage.textContent,/Invalid measurements/);l.dispose();});
test('cost uses input values and rejects negatives',()=>{const l=lab('cost');assert.match(l.stage.textContent,/0.230 currency/);l.input('Input minutes').value='-1';l.input('Input minutes').emit('input');assert.match(l.stage.textContent,/Invalid cost/);l.dispose();});
test('mount and cleanup repeat without sharing transaction state',()=>{for(let i=0;i<10;i++){const l=lab('transaction');assert.match(l.stage.textContent,/0 receipt/);l.dispose();}});
