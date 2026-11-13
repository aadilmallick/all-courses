import { speakFrench, stopSpeech } from './speech';
let selected='';
const menu=document.createElement('div'); menu.id='french-selection-menu'; menu.hidden=true; menu.setAttribute('role','dialog'); menu.setAttribute('aria-label','French pronunciation');
const listen=document.createElement('button');listen.textContent='▶ Hear selected French';
const slow=document.createElement('button');slow.textContent='◷ Hear slowly';
const close=document.createElement('button');close.textContent='Close';
const status=document.createElement('span');status.setAttribute('role','status');
menu.append(listen,slow,close,status);
const toolbar=document.createElement('div');toolbar.className='selection-toolbar';
const trigger=document.createElement('button');trigger.textContent='🔊 Read selected French';trigger.title='Select French text, then activate this button or press Alt+L';
const stop=document.createElement('button');stop.textContent='Stop';stop.onclick=stopSpeech;
toolbar.append(trigger,stop);
document.addEventListener('DOMContentLoaded',()=>{document.body.append(menu,toolbar);});
function inform(message:string){menu.hidden=false;status.textContent=message;if(!menu.style.left){menu.style.right='8px';menu.style.bottom='70px';}}
function play(rate=0.9){if(!selected){inform('Select a French word or sentence first.');return;}speakFrench(selected||window.getSelection()?.toString()||'',rate,undefined,inform);}
function hide(){menu.hidden=true;}
function show(x:number,y:number){
  selected=window.getSelection()?.toString().trim()||''; if(!selected)return false;
  menu.hidden=false;status.textContent='Synthetic French voice from your device.';
  menu.style.left=`${Math.max(8,Math.min(x,innerWidth-menu.offsetWidth-8))}px`;
  menu.style.top=`${Math.max(8,Math.min(y,innerHeight-menu.offsetHeight-8))}px`;
  listen.focus();return true;
}
document.addEventListener('selectionchange',()=>{const s=window.getSelection()?.toString().trim();if(s)selected=s;});
document.addEventListener('contextmenu',e=>{const target=e.target as HTMLElement; if(target.closest('input,textarea,[contenteditable="true"]'))return;if(show(e.clientX,e.clientY))e.preventDefault();});
document.addEventListener('pointerdown',e=>{if(!menu.contains(e.target as Node))hide();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')hide();if(e.altKey&&e.key.toLowerCase()==='l'){e.preventDefault();play();}});
listen.onclick=()=>play();slow.onclick=()=>play(0.65);close.onclick=()=>{hide();trigger.focus();};trigger.onclick=()=>{status.textContent='';play();};
window.addEventListener('pagehide',stopSpeech);
