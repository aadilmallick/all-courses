// Transparent teaching models. No provider SDK, network calls, or customer data.
export function finite(value, label='Value', min=0, max=Infinity) {
  const n = Number(value);
  if (value === '' || value === null || !Number.isFinite(n) || n < min || n > max) throw new Error(`${label} must be between ${min} and ${max}.`);
  return n;
}
export function readiness(v) {
  const scores=['technical','demonstration','buyer','safeguards'].map(k=>finite(v[k],k,0,4));
  if(scores.some(n=>!Number.isInteger(n))) throw new Error('Readiness scores must be whole numbers.');
  const total=scores.reduce((a,b)=>a+b,0);
  const gates=scores[0]>=3&&scores[1]>=3&&scores[3]>=3;
  return {total,gates,diagnostic:scores[0]>=2&&scores[3]>=2,
    message:gates?'Evidence supports discussing a bounded production scope; this is not a certification.':
    'Keep the promise narrow. Strengthen the missing evidence or use an experienced delivery partner.'};
}
export function businessCase(v) {
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
export function reliability(v) {
  const days=finite(v.days,'Days',1,366);
  const target=finite(v.target,'Target percent',0,100);
  const observed=finite(v.observed,'Observed unavailable minutes',0,days*1440);
  const windowMinutes=days*1440;
  const budget=windowMinutes*(1-target/100);
  return {windowMinutes,budget,remaining:budget-observed,usedPercent:budget>0?observed/budget*100:null};
}
export function evaluate(cases, threshold=.8) {
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
export function effort(result,v) {
  const manual=finite(v.manual,'Manual minutes per case');
  const review=finite(v.review,'Review minutes per routed case');
  const automatic=finite(v.automatic,'Handling minutes per accepted case');
  const rework=finite(v.rework,'Rework minutes per wrong automatic case');
  const baseline=result.cases*manual;
  const candidate=result.review*review+result.accepted*automatic+result.wrong_automatic*rework;
  return {baseline,candidate,saved:baseline-candidate};
}
export function commercial(v) {
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
