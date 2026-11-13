import {speak} from './audio.mjs';
document.querySelectorAll('[data-hear]').forEach(b=>b.addEventListener('click',async()=>{const p=document.querySelector('#home-audio-status');p.hidden=false;p.textContent='Preparing audio…';try{p.textContent=await speak(b.getAttribute('data-hear'));}catch(e){p.textContent=e.message;}setTimeout(()=>p.hidden=true,14000);}));
