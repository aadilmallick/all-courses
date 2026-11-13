import {normalize} from './core.mjs';
import {lexicon} from './speech-lexicon.mjs';
import {extraLexicon} from './speech-extra.mjs';
for(const [key,value]of extraLexicon)lexicon.set(key,value);
// Local particles need a family recording; ordinary Urdu voices substitute a shared form.
for(const key of ['hau','ich'])lexicon.delete(key);
let database,player,playerUrl,generation=0;
export async function db(){if(database)return database;database=await new Promise((resolve,reject)=>{const r=indexedDB.open('ghar-ki-baat-audio',1);r.onupgradeneeded=()=>r.result.createObjectStore('clips');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});return database;}
export async function getClip(roman){try{const d=await db();return await new Promise((resolve,reject)=>{const r=d.transaction('clips').objectStore('clips').get(normalize(roman));r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}catch{return null;}}
export async function putClip(roman,blob){if(!normalize(roman)||!(blob instanceof Blob)||!blob.type.startsWith('audio/')||blob.size>20000000)throw Error('Choose an audio file under 20 MB and enter its Roman transcript.');const d=await db();await new Promise((resolve,reject)=>{const t=d.transaction('clips','readwrite');t.objectStore('clips').put(blob,normalize(roman));t.oncomplete=resolve;t.onerror=()=>reject(t.error);});}
export async function removeClip(roman){const d=await db();await new Promise((resolve,reject)=>{const t=d.transaction('clips','readwrite');t.objectStore('clips').delete(normalize(roman));t.oncomplete=resolve;t.onerror=()=>reject(t.error);});}
export function voices(){return globalThis.speechSynthesis?.getVoices().filter(v=>/^(ur|hi)(-|_)/i.test(v.lang)||/^(ur|hi)$/i.test(v.lang))??[];}
export function settings(){try{return JSON.parse(localStorage.getItem('gkb-audio-settings'))??{};}catch{return {};}}
export function setSettings(x){localStorage.setItem('gkb-audio-settings',JSON.stringify(x));}
export function nativeInput(text,lang){const normalized=normalize(text).replace(/'/g,'');const key=lang.startsWith('ur')?'ur':'hi';if(lexicon.has(normalized))return {text:lexicon.get(normalized)[key],missing:[]};const words=normalized.split(' ');const missing=words.filter(w=>!lexicon.has(w));if(missing.length)return {missing:[...new Set(missing)]};return {text:words.map(w=>lexicon.get(w)[key]).join(' '),missing:[]};}
export function stopAudio(){generation++;globalThis.speechSynthesis?.cancel();if(player){player.pause();player=null;}if(playerUrl){URL.revokeObjectURL(playerUrl);playerUrl=null;}}
export async function speak(text,{rate=1}={}){
 if(!String(text).trim())throw Error('Select a Roman Urdu word or sentence first.');
 stopAudio();
 const request=generation;
 const clip=await getClip(text);if(request!==generation)return 'Playback stopped.';
 if(clip){playerUrl=URL.createObjectURL(clip);player=new Audio(playerUrl);player.playbackRate=rate;await player.play();if(request!==generation)return 'Playback stopped.';return 'Playing your saved family recording.';}
 const available=voices();const opts=settings();const voice=available.find(v=>v.voiceURI===opts.voice)||available.find(v=>/^ur/i.test(v.lang))||available[0];
 if(!voice)throw Error('No Urdu or Hindi system voice is available. Add a language voice in your device settings, then reload; or save a family recording in Listening & speaking.');
 const input=nativeInput(text,voice.lang);
 if(input.missing.length&&!opts.approximate)throw Error(`No verified speech spelling for: ${input.missing.slice(0,4).join(', ')}. Save a family recording for this exact selection, or enable approximate Roman TTS in audio settings.`);
 const u=new SpeechSynthesisUtterance(input.missing.length?text:input.text);u.voice=voice;u.lang=voice.lang;u.rate=Math.max(.5,Math.min(1.25,rate));
 const finished=new Promise((resolve,reject)=>{u.onend=resolve;u.onerror=e=>request!==generation?resolve():reject(Error('Speech playback failed: '+e.error));});
 globalThis.speechSynthesis.speak(u);await finished;
 if(request!==generation)return 'Playback stopped.';
 return input.missing.length?'Approximate Roman TTS; pronunciation may be wrong.':'Synthetic '+(voice.lang.startsWith('ur')?'Urdu':'Hindi')+' voice. Compare with a family speaker for Hyderabadi pronunciation.';
}
