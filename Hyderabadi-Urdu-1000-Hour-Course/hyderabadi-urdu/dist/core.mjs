export const STORAGE_KEY='ghar-ki-baat-v1';
export const DAY=86400000;
export function normalize(text){return String(text??'').normalize('NFKC').toLowerCase().replace(/[’‘]/g,"'").replace(/[^\p{L}\p{N}\s']/gu,' ').replace(/\s+/g,' ').trim();}
export function accepts(input,answers){const n=normalize(input);return n.length>0&&answers.some(a=>normalize(a)===n);}
export function shuffled(items,random=Math.random){const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
export function emptyProgress(){return {version:1,attempts:[],reviews:{},hours:[],completed:[],notes:''};}
export function validateProgress(x){
 if(!x||x.version!==1||!Array.isArray(x.attempts)||!Array.isArray(x.hours)||!Array.isArray(x.completed)||typeof x.reviews!=='object'||!x.reviews)throw Error('This is not a Ghar ki Baat journal backup.');
 const safe=emptyProgress();
 safe.attempts=x.attempts.slice(-10000).filter(a=>a&&typeof a.id==='string'&&a.id.length<100&&typeof a.correct==='boolean'&&Number.isFinite(a.at)).map(a=>({id:a.id,correct:a.correct,at:a.at,type:String(a.type??'').slice(0,40)}));
 safe.hours=x.hours.slice(-3000).filter(h=>h&&Number.isFinite(h.minutes)&&h.minutes>0&&h.minutes<=1440&&Number.isFinite(h.at)&&typeof h.activity==='string').map(h=>({minutes:h.minutes,at:h.at,activity:h.activity.slice(0,120)}));
 safe.completed=[...new Set(x.completed.filter(c=>Number.isInteger(c)&&c>=1&&c<=12))];
 safe.notes=String(x.notes??'').slice(0,30000);
 for(const [key,r]of Object.entries(x.reviews).slice(0,2000)){if(/^(v|c)\d[\w-]{0,40}$/.test(key)&&r&&Number.isFinite(r.due)&&Number.isInteger(r.interval)&&r.interval>=0&&r.interval<=365)safe.reviews[key]={due:r.due,interval:r.interval};}
 return safe;
}
export function readProgress(storage=globalThis.localStorage){try{return validateProgress(JSON.parse(storage.getItem(STORAGE_KEY)));}catch{return emptyProgress();}}
export function saveProgress(p,storage=globalThis.localStorage){try{storage.setItem(STORAGE_KEY,JSON.stringify(validateProgress(p)));return true;}catch{return false;}}
export function reviewStep(previous,rating,now=Date.now()){
 const old=previous?.interval??0;const interval=rating==='again'?0:rating==='hard'?1:rating==='good'?Math.max(2,Math.min(180,old*2||2)):Math.max(4,Math.min(365,old*3||4));
 return {interval,due:now+(interval===0?600000:interval*DAY)};
}
export function dueCards(vocab,progress,now=Date.now()){return vocab.filter(v=>!progress.reviews['v'+v.id]||progress.reviews['v'+v.id].due<=now);}
export function makeVocabQuestion(v,direction='translate-to-english'){
 return {id:'v'+v.id+'-'+direction,chapter:v.chapter,type:direction,prompt:direction==='translate-to-english'?v.roman:v.english,roman:v.roman,english:v.english,answers:direction==='translate-to-english'?[v.english.split(';')[0].trim()]:[v.roman],explanation:`${v.roman}: ${v.english}. ${v.example} — ${v.translation}`,register:v.register};
}
export function gradeQuestion(q,answer,meaning=''){
 if(q.type==='listening')return {roman:accepts(answer,[q.roman,...(q.romanAnswers??[])]),english:accepts(meaning,[q.english,...(q.englishAnswers??[])])};
 return {correct:accepts(answer,q.answers)};
}
export function scoreResults(results){const auto=results.filter(r=>!r.manual);return {correct:auto.filter(r=>r.correct).length,total:auto.length,manual:results.filter(r=>r.manual).length};}
