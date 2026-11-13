// Transparent teaching models. No provider SDK, network calls, or customer data.
function finite(value, label='Value', min=0, max=Infinity) {
  const n = Number(value);
  if (value === '' || value === null || !Number.isFinite(n) || n < min || n > max) throw new Error(`${label} must be between ${min} and ${max}.`);
  return n;
}
function readiness(v) {
  const scores=['technical','demonstration','buyer','safeguards'].map(k=>finite(v[k],k,0,4));
  if(scores.some(n=>!Number.isInteger(n))) throw new Error('Readiness scores must be whole numbers.');
  const total=scores.reduce((a,b)=>a+b,0);
  const gates=scores[0]>=3&&scores[1]>=3&&scores[3]>=3;
  return {total,gates,diagnostic:scores[0]>=2&&scores[3]>=2,
    message:gates?'Evidence supports discussing a bounded production scope; this is not a certification.':
    'Keep the promise narrow. Strengthen the missing evidence or use an experienced delivery partner.'};
}
function businessCase(v) {
  const developers=finite(v.developers,'People');
  const weeklyHours=finite(v.weeklyHours,'Hours per person');
  const weeks=finite(v.weeks,'Working weeks',0,53);
  const rate=finite(v.rate,'Customer-supplied hourly value');
  const addressable=finite(v.addressable,'Addressable share',0,100)/100;
  const realization=finite(v.realization,'Realization',0,100)/100;
  const operating=finite(v.operating,'Annual operating cost');
  const fee=finite(v.fee,'One-time fee');
  const gross=developers*weeklyHours*weeks*rate;
  const modeled=gross*addressable*realization;
  const net=modeled-operating;
  return {gross,modeled,net,paybackMonths:net>0?fee/net*12:null,firstYearAfterFee:net-fee};
}
function reliability(v) {
  const days=finite(v.days,'Days',1,366);
  const target=finite(v.target,'Target percent',0,100);
  const observed=finite(v.observed,'Observed unavailable minutes',0,days*1440);
  const windowMinutes=days*1440;
  const budget=windowMinutes*(1-target/100);
  return {windowMinutes,budget,remaining:budget-observed,usedPercent:budget>0?observed/budget*100:null};
}
function evaluate(cases, threshold=.8) {
  threshold=finite(threshold,'Threshold',0,1);
  const validCategories=new Set(['docs','technical','billing']);
  const ids=new Set();
  const rows=cases.map(c=>{
    if(ids.has(c.id))throw new Error('Duplicate case ID');ids.add(c.id);
    if(!validCategories.has(c.reference))throw new Error('Invalid reference category');
    const score=finite(c.score,'Synthetic score',0,1);
    if(typeof c.allowed!=='boolean')throw new Error('Permission flag must be boolean');
    const valid=validCategories.has(c.candidate);
    const accepted=valid&&c.allowed&&score>=threshold;
    return {...c,accepted,correct:c.candidate===c.reference,
      reason:!valid?'invalid category':!c.allowed?'permission gate':score<threshold?'below threshold':'accepted'};
  });
  const accepted=rows.filter(c=>c.accepted).length;
  const correct=rows.filter(c=>c.accepted&&c.correct).length;
  return {cases:rows.length,accepted,correct_accepted:correct,wrong_automatic:accepted-correct,
    review:rows.length-accepted,coverage:rows.length?accepted/rows.length:null,
    precision:accepted?correct/accepted:null,rows};
}
function effort(result,v) {
  const manual=finite(v.manual,'Manual minutes per case');
  const review=finite(v.review,'Review minutes per routed case');
  const automatic=finite(v.automatic,'Handling minutes per accepted case');
  const rework=finite(v.rework,'Rework minutes per wrong automatic case');
  const baseline=result.cases*manual;
  const candidate=result.review*review+result.accepted*automatic+result.wrong_automatic*rework;
  return {baseline,candidate,saved:baseline-candidate};
}
function commercial(v) {
  const fee=finite(v.fee,'Fee');const costs=finite(v.costs,'Costs');
  const allHours=finite(v.allHours,'All-in hours',Number.EPSILON);
  const weekly=finite(v.weekly,'Available hours weekly');
  const reserved=finite(v.reserved,'Reserved business hours');
  const delivery=finite(v.delivery,'Delivery hours');
  if(reserved>weekly)throw new Error('Reserved hours cannot exceed available hours.');
  const prospects=finite(v.prospects,'Accounts');
  const reply=finite(v.reply,'Relevant reply percent',0,100)/100;
  const qualified=finite(v.qualified,'Qualified share percent',0,100)/100;
  const win=finite(v.win,'Win share percent',0,100)/100;
  const capacity=weekly-reserved;
  return {contribution:fee-costs,effective:(fee-costs)/allHours,capacity,
    deliveryWeeks:capacity>0?delivery/capacity:null,pipelineScenario:prospects*reply*qualified*win};
}

const model = {finite,readiness,businessCase,reliability,evaluate,effort,commercial};
const CASES=[{"id": "R01", "input": "Where is the integration guide?", "reference": "docs", "candidate": "docs", "score": 0.99, "allowed": true}, {"id": "R02", "input": "The service returns an error during setup.", "reference": "technical", "candidate": "technical", "score": 0.96, "allowed": true}, {"id": "R03", "input": "Please explain the invoice line item.", "reference": "billing", "candidate": "billing", "score": 0.94, "allowed": true}, {"id": "R04", "input": "I need the configuration reference.", "reference": "docs", "candidate": "docs", "score": 0.9, "allowed": true}, {"id": "R05", "input": "An API request fails with the documented example.", "reference": "technical", "candidate": "technical", "score": 0.85, "allowed": true}, {"id": "R06", "input": "An API charge on my invoice needs explanation.", "reference": "billing", "candidate": "technical", "score": 0.95, "allowed": true}, {"id": "R07", "input": "The setup guide link is hard to find.", "reference": "docs", "candidate": "docs", "score": 0.79, "allowed": true}, {"id": "R08", "input": "Can someone review this billing question?", "reference": "billing", "candidate": "billing", "score": 0.75, "allowed": true}, {"id": "R09", "input": "This needs an unsupported category.", "reference": "technical", "candidate": "unrecognized", "score": 0.99, "allowed": true}, {"id": "R10", "input": "A privileged request must go to a human owner.", "reference": "technical", "candidate": "technical", "score": 0.99, "allowed": false}, {"id": "R11", "input": "The account view is unclear about an invoice.", "reference": "billing", "candidate": "docs", "score": 0.35, "allowed": true}, {"id": "R12", "input": "How should I begin reading the documentation?", "reference": "docs", "candidate": "docs", "score": 0.6, "allowed": true}];
const catalog = [
 {id:'readiness',title:'1 · Evidence before the offer',chapter:'chapter-01',description:'A transparent readiness worksheet. A total score never overrides a missing production gate.'},
 {id:'value',title:'1 & 4 · Model customer value',chapter:'chapter-01',description:'Change the assumptions behind recoverable capacity. This is a hypothetical model, not a savings guarantee.'},
 {id:'reliability',title:'2 · Explore an error budget',chapter:'chapter-02',description:'A time-based teaching model. It is not equivalent to every request-based availability measure.'},
 {id:'evaluation',title:'3 · Evaluate a workflow policy',chapter:'chapter-03',description:'Twelve synthetic stored candidate outputs. No model call, provider benchmark, or external action occurs.'},
 {id:'commercial',title:'4 · Price and capacity',chapter:'chapter-04',description:'Inspect total effort, available delivery time, and a hypothetical pipeline scenario.'}
];
const fields={
 readiness:[['technical','Technical understanding',2,0,4,1],['demonstration','Reproducible demonstration',1,0,4,1],['buyer','Observed buyer evidence',0,0,4,1],['safeguards','Delivery safeguards and ownership',1,0,4,1]],
 value:[['developers','People affected',6,0,10000,1],['weeklyHours','Friction hours / person / week',1.5,0,168,.25],['weeks','Working weeks / year',48,0,53,1],['rate','Customer-supplied labor value (USD/hour)',80,0,100000,1],['addressable','Share the change can address (%)',50,0,100,1],['realization','Share of potential value realized (%)',80,0,100,1],['operating','Recurring operating cost (USD/year)',1800,0,100000000,100],['fee','One-time engagement fee (USD)',9000,0,100000000,100]],
 reliability:[['days','Window length (days)',30,1,366,1],['target','Time-based availability target (%)',99.9,0,100,.01],['observed','Unavailable minutes in the window',18,0,527040,.1]],
 evaluation:[['threshold','Synthetic score threshold (0–1)',.8,0,1,.01],['manual','Current manual minutes / case',4,0,1440,.25],['review','Review minutes / routed case',2,0,1440,.25],['automatic','Handling minutes / accepted case',.25,0,1440,.05],['rework','Rework minutes / wrong automatic case',12,0,1440,1]],
 commercial:[['fee','Engagement fee (USD)',9000,0,100000000,100],['costs','Direct engagement costs (USD)',600,0,100000000,10],['allHours','All-in engagement hours',75,.01,100000,.5],['weekly','Available hours / week',10,0,168,.5],['reserved','Sales, admin, support, slack / week',5,0,168,.5],['delivery','Implementation delivery hours',60,0,100000,.5],['prospects','Researched accounts in scenario',50,0,100000,1],['reply','Relevant reply share (%)',20,0,100,1],['qualified','Qualified share of replies (%)',50,0,100,1],['win','Win share of qualified cases (%)',20,0,100,1]]
};
const number=n=>n===null?'Undefined':new Intl.NumberFormat('en-US',{maximumFractionDigits:2}).format(n);
const money=n=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n);
const pct=n=>n===null?'Undefined':number(n*100)+'%';
const metric=(label,value)=>`<div class="metric"><span>${label}</span><strong>${value}</strong></div>`;
function render(id,v){
 if(id==='readiness'){
  const r=model.readiness(v);
  return `<div class="metrics">${metric('Evidence total (not a credential)',r.total+' / 16')}${metric('Production discussion gates',r.gates?'Met in worksheet':'Missing evidence')}</div><p>${r.message}</p><p>Scoring: 0 = absent; 1 = claimed or studied; 2 = explained with partial evidence; 3 = demonstrated and documented; 4 = repeated relevant evidence. Production discussion gates require at least 3 in technical understanding, demonstration, and delivery safeguards. Buyer evidence remains a separate commercial question.</p><p>A diagnostic or partner role can have a narrower promise. This worksheet does not authorize access, certify competence, or establish buyer demand.</p>`;
 }
 if(id==='value'){
  const r=model.businessCase(v);
  return `<div class="metrics">${metric('Gross annual friction value',money(r.gross))}${metric('Modeled annual realized value',money(r.modeled))}${metric('After recurring cost, before fee',money(r.net))}${metric('Simple modeled payback',r.paybackMonths===null?'No positive annual value':number(r.paybackMonths)+' months')}${metric('First year after fee',money(r.firstYearAfterFee))}</div><p>Gross = people × weekly friction hours × working weeks × supplied hourly value. Realized = gross × addressable share × realization. Net annual value = realized − recurring cost. Payback = fee ÷ positive net annual value × 12.</p><p>This models capacity value, not guaranteed cash savings, revenue, or causal impact. Check the baseline and assumptions with the buyer.</p>`;
 }
 if(id==='reliability'){
  const r=model.reliability(v);
  return `<div class="metrics">${metric('Window length',number(r.windowMinutes)+' minutes')}${metric('Allowed unavailable time',number(r.budget)+' minutes')}${metric('Remaining budget',number(r.remaining)+' minutes')}${metric('Budget used',r.usedPercent===null?'Undefined at zero budget':number(r.usedPercent)+'%')}</div><p>${r.remaining<0?'The modeled budget is exceeded.':r.remaining===0?'The modeled budget is exactly exhausted.':'Some modeled budget remains.'} A policy decision requires the agreed indicator, context, and owner.</p><p>Budget = days × 1,440 × (1 − target ÷ 100). A 30-day month is a teaching window, not every calendar month. The result does not imply a contractual SLA or a request-based budget.</p>`;
 }
 if(id==='evaluation'){
  const r=model.evaluate(CASES,Number(v.threshold));const time=model.effort(r,v);
  const rows=r.rows.map(c=>`<tr><td>${c.id}</td><td>${c.reference}</td><td>${c.candidate}</td><td>${number(c.score)}</td><td>${c.allowed?'Allowed':'Denied'}</td><td>${c.accepted?(c.correct?'Accepted / correct':'Accepted / WRONG'):'Review / '+c.reason}</td></tr>`).join('');
  return `<div class="metrics">${metric('Automatic decisions',r.accepted+' / '+r.cases)}${metric('Accepted precision',pct(r.precision))}${metric('Coverage',pct(r.coverage))}${metric('Wrong automatic decisions',number(r.wrong_automatic))}${metric('Cases needing review',number(r.review))}${metric('Modeled minutes saved',number(time.saved))}</div><p>Current manual effort: ${number(time.baseline)} minutes. Candidate modeled effort: ${number(time.candidate)} minutes. Reviewed cases are assumed corrected in this teaching model; actual human error is not measured.</p><p>Category validity and permission are checked before the threshold. Scores are synthetic and are not calibrated probabilities. Higher thresholds do not guarantee better precision on these cases.</p><div class="table-scroll"><table><thead><tr><th>Case</th><th>Reference</th><th>Candidate</th><th>Score</th><th>Permission</th><th>Decision</th></tr></thead><tbody>${rows}</tbody></table></div>`;
 }
 const r=model.commercial(v);
 return `<div class="metrics">${metric('Contribution before tax / overhead',money(r.contribution))}${metric('Contribution per total hour',money(r.effective))}${metric('Delivery capacity / week',number(r.capacity)+' hours')}${metric('Minimum delivery duration',r.deliveryWeeks===null?'No delivery capacity':number(r.deliveryWeeks)+' weeks')}${metric('Pipeline arithmetic scenario',number(r.pipelineScenario)+' wins')}</div><p>Effective contribution = (fee − direct costs) ÷ all-in hours. Delivery duration uses implementation hours and available delivery capacity only; customer dependencies can extend it. Include all sales, calls, revisions, and support in the all-in effort estimate.</p><p>The pipeline number multiplies assumed stage shares. It is not a probability forecast, sales benchmark, or revenue guarantee.</p>`;
}
function mount(stage,controls,id='readiness'){
 const entry=catalog.find(c=>c.id===id);if(!entry)throw new Error('Unknown experiment');
 stage.replaceChildren();controls.replaceChildren();
 const form=document.createElement('form');
 form.innerHTML=fields[id].map(([key,label,value,min,max,step])=>`<label>${label}<input name="${key}" type="number" value="${value}" min="${min}" max="${max}" step="${step}" required></label>`).join('')+'<button type="reset">Reset experiment</button>';
 controls.append(form);
 const heading=document.createElement('h2');heading.textContent=entry.title;
 const intro=document.createElement('p');intro.textContent=entry.description;
 const result=document.createElement('div');result.className='results';result.setAttribute('aria-live','polite');
 const source=document.createElement('details');source.innerHTML='<summary>Inspect the calculation source</summary><pre></pre>';
 const names={readiness:['readiness'],value:['businessCase'],reliability:['reliability'],evaluation:['evaluate','effort'],commercial:['commercial']}[id];
 source.querySelector('pre').textContent=names.map(name=>model[name].toString()).join('\n\n');
 stage.append(heading,intro,result,source);
 function update(){
  try{
   if(!form.checkValidity())throw new Error('Enter valid numbers within the displayed limits.');
   const values=Object.fromEntries(new FormData(form));
   result.innerHTML=render(id,values);
  }catch(error){result.replaceChildren();const p=document.createElement('p');p.className='error';p.textContent=error.message;result.append(p);}
 }
 // A reset listener is cancelled, then native values are restored after removing it.
 function onReset(event){event.preventDefault();form.removeEventListener('reset',onReset);form.reset();form.addEventListener('reset',onReset);update();}
 function onSubmit(event){event.preventDefault();update();}
 form.addEventListener('input',update);form.addEventListener('reset',onReset);form.addEventListener('submit',onSubmit);
 update();
 return ()=>{form.removeEventListener('input',update);form.removeEventListener('reset',onReset);form.removeEventListener('submit',onSubmit);stage.replaceChildren();controls.replaceChildren();};
}

const navigation=document.querySelector('#experiments');
const stage=document.querySelector('#stage');
const controls=document.querySelector('#controls');
let cleanup=()=>{};
function select(id){
 cleanup();
 navigation.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.experiment===id)));
 try{cleanup=mount(stage,controls,id);}catch(error){stage.textContent='The experiment could not start: '+error.message;cleanup=()=>{};}
}
for(const entry of catalog){
 const button=document.createElement('button');button.type='button';button.dataset.experiment=entry.id;button.textContent=entry.title;
 button.addEventListener('click',()=>select(entry.id));navigation.append(button);
}
window.addEventListener('pagehide',()=>cleanup(),{once:true});
select('readiness');
