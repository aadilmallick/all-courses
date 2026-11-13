import {pacing,funnel,wilson,saas,campaignUrl} from './model.mjs';
export const experiments=[
{id:'script',title:'Script timing',chapter:'chapter-01',description:'Estimate speech and demonstration time from your own script.'},
{id:'frame',title:'Vertical frame',chapter:'chapter-02',description:'Inspect caption placement in an illustrative phone frame.'},
{id:'funnel',title:'Funnel economics',chapter:'chapter-04',description:'Compare owned-product revenue and affiliate commissions.'},
{id:'utm',title:'Campaign links',chapter:'chapter-05',description:'Build labeled URLs locally without personal data.'},
{id:'saas',title:'SaaS retention',chapter:'chapter-05',description:'Explore a finite contribution model by paid-customer month.'},
{id:'uncertainty',title:'Conversion uncertainty',chapter:'chapter-06',description:'Inspect Wilson intervals for two observed proportions.'}
];
const money=n=>n.toLocaleString('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2});
const pct=n=>(n*100).toFixed(2)+'%';
const number=n=>n.toLocaleString('en-US',{maximumFractionDigits:2});
function field(container,label,value,type='number',attrs={}){
 const wrap=document.createElement('label');wrap.className='field';const span=document.createElement('span');span.textContent=label;
 const input=document.createElement(type==='textarea'?'textarea':type==='select'?'select':'input');if(!['textarea','select'].includes(type))input.type=type;
 if(type==='select'){for(const [value,label] of [['owned','My own product'],['affiliate','Affiliate commission']]){const o=document.createElement('option');o.value=value;o.textContent=label;input.append(o);}}
 input.value=value;for(const [k,v]of Object.entries(attrs))input.setAttribute(k,v);
 wrap.append(span,input);container.append(wrap);return input;
}
function table(stage,headers,rows){const t=document.createElement('table'),head=t.createTHead().insertRow();headers.forEach(h=>{const th=document.createElement('th');th.scope='col';th.textContent=h;head.append(th)});const body=t.createTBody();rows.forEach(row=>{const tr=body.insertRow();row.forEach(val=>{const td=tr.insertCell();td.textContent=val;});});stage.append(t);}
function card(stage,label,value){const d=document.createElement('div');d.className='result';const a=document.createElement('span');a.textContent=label;const b=document.createElement('strong');b.textContent=value;d.append(a,b);stage.append(d);}
function note(stage,text){const p=document.createElement('p');p.className='note';p.textContent=text;stage.append(p);}
export function mount(stage, controls, id){
 const inputs=[];const add=(...args)=>{const x=field(controls,...args);inputs.push(x);return x;};let render;
 if(id==='script'){
  const script=add('Script','I kept losing the useful moment inside long coding tutorials, so I made this timestamp button. Save the moment, reopen the item, and the video returns to that time. This version is for desktop Chrome. The free build checklist is on my profile.','textarea');
  const wpm=add('Speaking rate (words/minute)',140,'number',{min:60,max:240,step:5});const pause=add('Extra demonstration time (seconds)',8,'number',{min:0,max:120});
  render=()=>{const r=pacing(script.value,wpm.value,pause.value);card(stage,'Script words',r.words);card(stage,'Estimated speech',number(r.speechSeconds)+' seconds');card(stage,'Speech + demonstration',number(r.totalSeconds)+' seconds');note(stage,'Arithmetic estimate only. Read aloud and leave time to inspect the result. The tool does not score a hook or predict reach.');};
 }else if(id==='frame'){
  const top=add('Caption top (% of frame)',68,'range',{min:0,max:90});const width=add('Caption width (%)',78,'range',{min:30,max:95});const size=add('Caption text size (preview pixels)',18,'range',{min:12,max:32});
  const text=add('Caption text','Save the moment. Reopen it later.','text',{maxlength:160});
  render=()=>{const p=document.createElement('div');p.className='phone';const screen=document.createElement('div');screen.className='demo-screen';screen.textContent='A real demonstration belongs here';const safe=document.createElement('div');safe.className='safe';const overlay=document.createElement('div');overlay.className='platform-ui';overlay.textContent='Illustrative interface area';const cap=document.createElement('div');cap.className='caption';cap.textContent=text.value;cap.style.top=top.value+'%';cap.style.width=width.value+'%';cap.style.fontSize=size.value+'px';p.append(screen,safe,overlay,cap);stage.append(p);note(stage,`Top ${top.value}%, width ${width.value}%, text ${size.value}px. Shaded areas and dashed guides are illustrative, not official platform safe zones. Preview the actual upload on a phone.`);};
 }else if(id==='funnel'){
  const mode=add('Revenue model','owned','select');
  const defs=[['views','Video views',100000],['visitRate','Views → page visits (%)',1],['leadRate','Visits → leads (%) — use 100 for direct purchase',40],['buyRate','Leads → initial orders (%)',5],['price','Product price / commission base (USD)',29],['refundRate','Refund or reversal rate (%)',5],['commissionRate','Affiliate commission (%)',15],['feeRate','Owned: fee on gross sales (%)',3],['fixedFee','Owned: fee per initial order (USD)',.30],['variableCost','Your variable cost per initial order (USD)',2],['productionCost','Allocated production/tools cost (USD)',140]];
  const fields=Object.fromEntries(defs.map(([key,label,val])=>[key,add(label,val,'number',{min:0,step:'any'})]));
  render=()=>{if(!['owned','affiliate'].includes(mode.value.trim()))throw new Error('Mode must be owned or affiliate.');const args=Object.fromEntries(Object.entries(fields).map(([key,v])=>[key,Number(v.value)]));for(const k of ['visitRate','leadRate','buyRate','refundRate','feeRate','commissionRate'])args[k]/=100;args.affiliate=mode.value.trim()==='affiliate';const r=funnel(args);table(stage,['Stage','Expected result'],[['Page visits',number(r.visits)],['Leads / eligible direct visits',number(r.leads)],['Initial orders',number(r.orders)],['Orders after modeled reversals',number(r.retainedOrders)],['Customer gross spend',money(r.gross)],['Your retained revenue / commission',money(r.recognized)],['Modeled payment fees',money(r.fees)],['Your variable cost',money(r.variable)],['Contribution after entered costs',money(r.contribution)]]);note(stage,'All inputs are hypothetical. Affiliate mode excludes merchant payment fees; enter your own relevant variable cost. No labor, tax or unentered overhead is deducted. Fractional orders are expectations.');};
 }else if(id==='utm'){
  const base=add('Destination URL','https://example.com/extension-starter','url');const fs=Object.fromEntries([['source','tiktok'],['medium','organic_social'],['campaign','extension_starter'],['content','storage_mistake_a']].map(([k,v])=>[k,add(k,v,'text')]));
  render=()=>{const url=campaignUrl(base.value,Object.fromEntries(Object.entries(fs).map(([k,v])=>[k,v.value])));const out=document.createElement('textarea');out.readOnly=true;out.setAttribute('aria-label','Generated campaign URL');out.value=url;out.rows=5;stage.append(out);note(stage,'Copy the URL manually. Existing unrelated query parameters and fragments are preserved. This tool sends nothing and does not measure attribution. Use campaign identifiers, never names, emails or secrets.');};
 }else if(id==='saas'){
  const price=add('Monthly price (USD)',12,'number',{min:0,step:'any'}),margin=add('Contribution after variable service costs (%)',80,'number',{min:0,max:100}),churn=add('Churn before each later billing month (%)',5,'number',{min:0,max:100}),months=add('Model horizon (months)',12,'number',{min:1,max:120});
  render=()=>{const r=saas({price:Number(price.value),margin:Number(margin.value)/100,churn:Number(churn.value)/100,months:Number(months.value)});card(stage,'Contribution per initial paid customer',money(r.total));note(stage,'First billing month included. Constant churn, price and margin; no expansion, reactivation, acquisition cost, tax or fixed overhead. This is a finite scenario, not a lifetime-value promise.');table(stage,['Month','Expected active fraction','Contribution','Cumulative'],r.rows.map(x=>[x.month,pct(x.survival),money(x.amount),money(x.total)]));};
 }else if(id==='uncertainty'){
  const ak=add('A successes',12,'number',{min:0,step:1}),an=add('A eligible trials',400,'number',{min:1,step:1}),bk=add('B successes',18,'number',{min:0,step:1}),bn=add('B eligible trials',400,'number',{min:1,step:1});
  render=()=>{const a=wilson(Number(ak.value),Number(an.value)),b=wilson(Number(bk.value),Number(bn.value));table(stage,['Variant','Observed rate','95% Wilson interval'],[['A',pct(a.rate),pct(a.low)+' – '+pct(a.high)],['B',pct(b.rate),pct(b.low)+' – '+pct(b.high)]]);note(stage,'Independent-binomial illustration only. Interval overlap is not a formal test. Organic distribution, repeat viewers, sequential peeking and audience differences limit causal conclusions. No winner is automatically declared.');};
 }else throw new Error('Unknown experiment.');
 const update=()=>{stage.replaceChildren();try{if(inputs.some(x=>x.type==='number'&&x.value===''))throw new Error('Complete each numeric field to calculate the result.');render();}catch(e){const p=document.createElement('p');p.className='error';p.setAttribute('role','alert');p.textContent=e.message;stage.append(p);}};
 inputs.forEach(x=>x.addEventListener('input',update));update();
 return ()=>inputs.forEach(x=>x.removeEventListener('input',update));
}
export function boot(){
 const nav=document.querySelector('#lab-nav'),controls=document.querySelector('#controls'),stage=document.querySelector('#stage'),heading=document.querySelector('#lab-title'),description=document.querySelector('#lab-description');let dispose=()=>{};let active=experiments.some(e=>e.id===location.hash.slice(1))?location.hash.slice(1):'script';
 const activate=id=>{dispose();controls.replaceChildren();stage.replaceChildren();active=id;const e=experiments.find(x=>x.id===id);heading.textContent=e.title;description.textContent=e.description;nav.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.id===id)));dispose=mount(stage,controls,id);};
 experiments.forEach(e=>{const b=document.createElement('button');b.type='button';b.dataset.id=e.id;b.textContent=e.title;b.addEventListener('click',()=>activate(e.id));nav.append(b);});
 document.querySelector('#reset').addEventListener('click',()=>activate(active));activate(active);window.addEventListener('pagehide',()=>dispose(),{once:true});
}
