const KEY='atelier-francais-v1';
const emptyState=()=>({reviews:{},hours:[],units:{}});
const isObject=(value:any):value is Record<string,any>=>value!==null&&typeof value==='object'&&!Array.isArray(value)&&(Object.getPrototypeOf(value)===Object.prototype||Object.getPrototypeOf(value)===null);
const reviewID=/^(?:[1-9]|10)-(?:g-[0-9]{1,4}|v-[0-9]{1,4}-vocab-(?:en-fr|fr-en)|s-[0-9]{1,4}-(?:en-fr|fr-en|listening))$/;
const unitID=/^(?:[1-9]|10)-[0-9]$/;
export function validateState(value:any){
  if(!isObject(value)||value.version!==1||!Array.isArray(value.hours)||!isObject(value.units)||!isObject(value.reviews))throw Error('This is not an Atelier progress export.');
  if(value.hours.length>10000||value.hours.some((entry:any)=>!isObject(entry)||!Number.isFinite(entry.hours)||entry.hours<=0||entry.hours>24||typeof entry.activity!=='string'||!entry.activity.trim()||entry.activity.length>160||typeof entry.date!=='string'||!entry.date.trim()||entry.date.length>100))throw Error('Invalid study log. Each entry needs positive study hours up to 24, an activity, and a date.');
  const units:Record<string,boolean>={};
  for(const[id,completed]of Object.entries(value.units)){if(!unitID.test(id)||typeof completed!=='boolean')throw Error('Invalid learning-unit progress.');units[id]=completed;}
  const reviews:Record<string,any>={},entries=Object.entries(value.reviews);
  if(entries.length>20000)throw Error('The review log is too large.');
  for(const[id,review]of entries){
    if(!reviewID.test(id)||!isObject(review)||!Number.isSafeInteger(review.due)||review.due<0||!Number.isSafeInteger(review.attempts)||review.attempts<0||!Number.isSafeInteger(review.correct)||review.correct<0||review.correct>review.attempts||!Number.isSafeInteger(review.streak)||review.streak<0||review.streak>9||review.streak>review.correct)throw Error('Invalid review data.');
    reviews[id]={due:review.due,attempts:review.attempts,correct:review.correct,streak:review.streak};
  }
  return{hours:value.hours.map((entry:any)=>({hours:entry.hours,activity:entry.activity,date:entry.date})),units,reviews};
}
export function readState():any{
  try{const value=JSON.parse(localStorage.getItem(KEY)||'{}');if(!isObject(value))return emptyState();return validateState({...emptyState(),...value,version:1});}
  catch{return emptyState();}
}
export function saveState(state:any){try{const validated=validateState({...state,version:1});localStorage.setItem(KEY,JSON.stringify(validated));return true;}catch{return false;}}
export function exportState(){
  const link=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify({version:1,...readState()},null,2)],{type:'application/json'}));
  link.href=url;link.download='atelier-progress.json';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
