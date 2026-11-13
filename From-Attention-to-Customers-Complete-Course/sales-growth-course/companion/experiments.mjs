import {funnel,economics,pipeline,video,uncertainty,capacity} from './models.mjs';
// Field: [name, label, initial value, maximum, step]. Native inputs remain editable.
export const experiments=[
 {id:'funnel',title:'Funnel',chapters:'1, 2, 8, 9',fn:funnel,
  description:'Follow one sequential, synthetic cohort. Change a conditional rate and inspect the downstream effect.',
  assumptions:'Impressions → visits → subscribers → buyers. Rates are conditional on the preceding stage. This excludes direct purchases and cross-device identity issues. Expected counts can be fractional.',
  fields:[['impressions','Impressions',20000,1e9,1],['visitRate','Visit rate (%)',2,100,.1],['subscribeRate','Visit-to-subscribe (%)',10,100,.1],['purchaseRate','Subscriber-to-purchase (%)',5,100,.1],['price','Price (USD)',49,1e7,.01]],
  outputs:[['visits','Expected visits','count'],['leads','Expected subscribers','count'],['buyers','Expected buyers','count'],['revenue','Expected gross order revenue','money']]},
 {id:'economics',title:'Economics',chapters:'1, 2, 4, 8, 9, 10',fn:economics,
  description:'Estimate first-order contribution and the acquisition cost it can support.',
  assumptions:'Full refunds occur with the entered probability. Fees and delivery costs apply to every original order and are not refunded. Reserve is a chosen contribution buffer after acquisition. Fixed overhead, tax, chargebacks, labor outside delivery, and future purchases are excluded. A negative target CAC means the desired buffer is infeasible under these inputs.',
  fields:[['price','Price (USD)',49,1e7,.01],['refundRate','Full-refund probability (%)',5,100,.1],['feeRate','Fee on original price (%)',3,100,.1],['fixedFee','Fixed fee per order (USD)',.30,1e7,.01],['deliveryCost','Delivery cost per original order (USD)',3,1e7,.01],['cac','Acquisition cost per buyer (USD)',20,1e7,.01],['reserve','Desired contribution buffer (USD)',10,1e7,.01]],
  outputs:[['contribution','Expected contribution before acquisition','money'],['afterCAC','Expected contribution after CAC','money'],['targetCAC','CAC ceiling preserving chosen buffer','money'],['breakEvenROAS','Break-even revenue/spend ratio if fully incremental','ratio']]},
 {id:'pipeline',title:'Sales pipeline',chapters:'4, 5, 6, 9, 10',fn:pipeline,
  description:'Find where a service pipeline loses progression and how demand affects delivery hours.',
  assumptions:'One sequential synthetic population; all stage rates remain constant. Revenue is expected gross agreement value, not collected cash. Delivery hours exclude prospecting and sales time. Fractions are expectations.',
  fields:[['conversations','Relevant conversations',100,1e7,1],['bookingRate','Conversation-to-booking (%)',20,100,.1],['attendanceRate','Booking-to-attendance (%)',75,100,.1],['qualificationRate','Attended-to-qualified (%)',60,100,.1],['proposalRate','Qualified-to-proposal (%)',80,100,.1],['closeRate','Proposal acceptance (%)',25,100,.1],['dealValue','Agreement value (USD)',3000,1e8,.01],['hoursPerClient','Delivery hours per client',10,10000,.1]],
  outputs:[['bookings','Expected bookings','count'],['attended','Expected attended calls','count'],['qualified','Expected qualified opportunities','count'],['proposals','Expected proposals','count'],['clients','Expected clients','count'],['revenue','Expected gross agreement value','money'],['deliveryHours','Expected delivery hours','hours']]},
 {id:'video',title:'Video packaging',chapters:'3, 7, 9',fn:video,
  description:'Compare two packages through click rate and average viewing, using the same hypothetical exposure.',
  assumptions:'CTR and average view duration apply to the same modeled impression-derived viewing population. Public view starts, autoplay and external traffic are excluded. This is watch-time arithmetic, not a YouTube ranking model or a causal experiment.',
  fields:[['impressions','Eligible thumbnail impressions',10000,1e9,1],['ctrA','Package A click rate (%)',6,100,.1],['durationA','Package A average minutes viewed',3,10000,.1],['ctrB','Package B click rate (%)',4,100,.1],['durationB','Package B average minutes viewed',5,10000,.1]],
  outputs:[['viewsA','A expected impression-derived views','count'],['hoursA','A modeled watch hours','hours'],['viewsB','B expected impression-derived views','count'],['hoursB','B modeled watch hours','hours']]},
 {id:'uncertainty',title:'Small-sample uncertainty',chapters:'9',fn:uncertainty,
  description:'Observe how the sample size changes uncertainty around a conversion proportion.',
  assumptions:'Wilson intervals with z = 1.96 for each proportion, assuming independent binary observations and stable probability. These are descriptive approximate intervals. Comparing their overlap is not a formal two-sample test. No causal winner is declared. Zero observations are undefined.',
  fields:[['successA','A purchases',1,1e9,1],['trialsA','A eligible observations',20,1e9,1],['successB','B purchases',2,1e9,1],['trialsB','B eligible observations',20,1e9,1]],
  outputs:[['rateA','A observed rate','percent'],['lowA','A interval lower limit','percent'],['highA','A interval upper limit','percent'],['rateB','B observed rate','percent'],['lowB','B interval lower limit','percent'],['highB','B interval upper limit','percent']]},
 {id:'capacity',title:'Production capacity',chapters:'3, 5, 6, 7, 10',fn:capacity,
  description:'Build a publishing plan that leaves room for research, sales, delivery and review.',
  assumptions:'Weekly production equals count × hours per piece. Reserved hours include all other commitments you choose to include. No platform reach is forecast. Counts are whole numbers. A negative remainder means the plan exceeds available time.',
  fields:[['availableHours','Available weekly hours',20,1000,.5],['reservedHours','Hours reserved for other work',10,1000,.5],['videos','Long videos per week',1,100,1],['videoHours','Hours per long video',8,1000,.5],['shorts','Short clips per week',1,100,1],['shortHours','Hours per short clip',1,1000,.5],['written','Written pieces per week',2,100,1],['writtenHours','Hours per written piece',1,1000,.5]],
  outputs:[['production','Production hours','hours'],['total','Total committed hours','hours'],['remaining','Hours remaining','hours'],['utilization','Capacity committed','percent']]}
];
export function mount(stage,controls){
  const config=experiments.find(x=>x.id===stage.dataset.experiment);
  if(!config) throw new Error('Unknown experiment. Choose an experiment from the list.');
  const intro=document.createElement('p');intro.textContent=config.description;stage.append(intro);
  const form=document.createElement('form');form.noValidate=true;
  const fields=new Map();
  config.fields.forEach(([key,label,value,max,step])=>{
    const wrap=document.createElement('label');wrap.textContent=label;
    const input=document.createElement('input');input.type='number';input.name=key;input.id=`input-${key}`;input.min='0';input.max=String(max);input.step=String(step);input.value=String(value);input.required=true;
    wrap.append(input);form.append(wrap);fields.set(key,input);
  });
  const reset=document.createElement('button');reset.type='button';reset.textContent='Reset experiment';reset.id='reset';form.append(reset);controls.append(form);
  const output=document.createElement('div');output.className='results';output.setAttribute('aria-live','polite');output.id='results';stage.append(output);
  const notes=document.createElement('details');notes.open=true;const summary=document.createElement('summary');summary.textContent='Model assumptions and limits';const para=document.createElement('p');para.textContent=config.assumptions;notes.append(summary,para);stage.append(notes);
  const source=document.createElement('details');const sourceTitle=document.createElement('summary');sourceTitle.textContent='Inspect calculation source';const code=document.createElement('pre');code.textContent=config.fn.toString();source.append(sourceTitle,code);stage.append(source);
  function update(){
    try{
      const values={};for(const [key,input] of fields){
        input.removeAttribute('aria-invalid');
        if(input.value.trim()==='' || !input.checkValidity()){input.setAttribute('aria-invalid','true');throw new Error(`${key}: enter a valid value in the displayed range.`);}
        values[key]=input.valueAsNumber;
      }
      const result=config.fn(values);output.replaceChildren();
      const table=document.createElement('table');const cap=document.createElement('caption');cap.textContent='Results calculated from your current inputs';table.append(cap);
      for(const [key,label,kind] of config.outputs){
        const row=document.createElement('tr'),th=document.createElement('th'),td=document.createElement('td');th.scope='row';th.textContent=label;
        const value=result[key];td.dataset.result=key;
        td.textContent=value===null?'Undefined / insufficient data':kind==='money'?new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:2}).format(value):kind==='percent'?`${(value*100).toFixed(2)}%`:value.toLocaleString('en-US',{maximumFractionDigits:2});
        row.append(th,td);table.append(row);
      }output.append(table);
      if(config.id==='capacity' && result.remaining<0){const warn=document.createElement('p');warn.className='warning';warn.textContent='This plan exceeds your available hours. Reduce work or allocate more time.';output.append(warn);}
      if(config.id==='video'){const p=document.createElement('p');p.textContent=`Modeled watch-time comparison: A ${result.minutesA.toFixed(0)} minutes; B ${result.minutesB.toFixed(0)} minutes. This does not predict distribution.`;output.append(p);}
    }catch(error){output.replaceChildren();const p=document.createElement('p');p.className='warning';p.textContent=error.message;output.append(p);}
  }
  function onReset(){for(const [key,,value] of config.fields)fields.get(key).value=String(value);update();}
  form.addEventListener('input',update);form.addEventListener('submit',event=>event.preventDefault());reset.addEventListener('click',onReset);update();
  return ()=>{form.removeEventListener('input',update);reset.removeEventListener('click',onReset);controls.replaceChildren();stage.replaceChildren();};
}
