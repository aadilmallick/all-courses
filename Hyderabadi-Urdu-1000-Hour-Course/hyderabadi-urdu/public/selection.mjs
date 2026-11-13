import {speak,stopAudio} from './audio.mjs';
if(!globalThis.__gkbSelection){
globalThis.__gkbSelection=true;
const panel=document.createElement('div');panel.className='speak-menu';panel.hidden=true;panel.setAttribute('role','dialog');panel.setAttribute('aria-label','Hear your selection');
const title=document.createElement('p');const msg=document.createElement('p');msg.setAttribute('role','status');
const normal=document.createElement('button');normal.textContent='▶ Hear selection';
const slow=document.createElement('button');slow.textContent='◷ Hear slowly';
const close=document.createElement('button');close.textContent='Close';
panel.append(title,normal,slow,close,msg);document.body.append(panel);
const affordance=document.createElement('button');affordance.className='selection-listen';affordance.textContent='▶ Hear selection';affordance.hidden=true;affordance.setAttribute('aria-label','Hear selected Roman Urdu text');document.body.append(affordance);
let selection='',origin;
function hide(){panel.hidden=true;origin?.focus?.();}
async function play(rate){try{msg.textContent=await speak(selection,{rate});}catch(e){msg.textContent=e.message;}}
normal.onclick=()=>play(1);slow.onclick=()=>play(.72);close.onclick=hide;
function open(text,x,y){selection=text;origin=document.activeElement;title.textContent=text.length>90?text.slice(0,90)+'…':text;msg.textContent='Saved family audio first; otherwise a supported system voice. Shift + right-click opens the browser menu.';panel.hidden=false;panel.style.left='8px';panel.style.top='8px';panel.style.maxHeight=(window.innerHeight-16)+'px';panel.style.overflow='auto';const rect=panel.getBoundingClientRect();panel.style.left=Math.max(8,Math.min(x,window.innerWidth-rect.width-8))+'px';panel.style.top=Math.max(8,Math.min(y,window.innerHeight-rect.height-8))+'px';normal.focus();}
document.addEventListener('selectionchange',()=>{const text=window.getSelection()?.toString().trim(),node=window.getSelection()?.anchorNode;const parent=node?.nodeType===1?node:node?.parentElement;affordance.hidden=!(text&&text.length<=600&&parent?.closest('main,.lesson-text,.home-phrase')&&!parent?.closest('input,textarea,select,[contenteditable="true"]'));});
affordance.onpointerdown=e=>e.preventDefault();affordance.onclick=()=>{const text=window.getSelection()?.toString().trim();if(text)open(text,window.innerWidth-350,window.innerHeight-310);};
document.addEventListener('contextmenu',e=>{
 if((e.shiftKey&&e.button===2)||e.target.closest('input,textarea,select,[contenteditable="true"]'))return;
 const text=window.getSelection()?.toString().trim();
 if(!text||text.length>600||!e.target.closest('main,.lesson-text,.home-phrase'))return;
 e.preventDefault();open(text,e.clientX||20,e.clientY||100);
});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!panel.hidden){hide();stopAudio();}if(!panel.hidden&&e.key==='Tab'){const a=[normal,slow,close];const i=a.indexOf(document.activeElement);e.preventDefault();a[(i+(e.shiftKey?2:1))%3].focus();}});
document.addEventListener('pointerdown',e=>{if(!panel.hidden&&!panel.contains(e.target))hide();});
window.addEventListener('pagehide',stopAudio);
}
