// Pure calculations. Rates are percentages at the interface and fractions here.
export function finiteNumber(value, label) {
  const n = Number(value);
  if (!Number.isFinite(n)) throw new Error(`${label} must be a finite number.`);
  return n;
}
function nonnegative(value, label) {const n=finiteNumber(value,label);if(n<0)throw new Error(`${label} cannot be negative.`);return n;}
function proportion(value,label){const n=nonnegative(value,label);if(n>1)throw new Error(`${label} must be between 0 and 1.`);return n;}
export function pacing(text, wpm, pauses) {
  const words=text.trim()?text.trim().split(/\s+/u).length:0;
  const speed=finiteNumber(wpm,'Speaking rate');if(speed<=0)throw new Error('Speaking rate must be greater than zero.');
  const extra=nonnegative(pauses,'Demonstration time');
  return {words, speechSeconds:words/speed*60,totalSeconds:words/speed*60+extra};
}
export function funnel({views,visitRate,leadRate,buyRate,price,refundRate,feeRate,fixedFee,variableCost,productionCost,commissionRate,affiliate}){
  views=nonnegative(views,'Views');price=nonnegative(price,'Price');
  [visitRate,leadRate,buyRate,refundRate,feeRate,commissionRate].forEach((v,i)=>proportion(v,['Visit rate','Lead rate','Purchase rate','Refund/reversal rate','Fee rate','Commission rate'][i]));
  [fixedFee,variableCost,productionCost].forEach((v,i)=>nonnegative(v,['Fixed fee','Variable cost','Production cost'][i]));
  const visits=views*visitRate,leads=visits*leadRate,orders=leads*buyRate;
  const gross=orders*price,retainedOrders=orders*(1-refundRate);
  const recognized=affiliate?gross*commissionRate*(1-refundRate):gross*(1-refundRate);
  // Owned fees are charged on original orders; do not assume refund recovery.
  const fees=affiliate?0:gross*feeRate+orders*fixedFee;
  const variable=orders*variableCost;
  return {visits,leads,orders,retainedOrders,gross,recognized,fees,variable,contribution:recognized-fees-variable-productionCost};
}
export function wilson(successes,trials,z=1.959963984540054){
  const k=nonnegative(successes,'Successes'),n=finiteNumber(trials,'Trials');
  if(!Number.isInteger(k)||!Number.isInteger(n)||n<=0||k>n)throw new Error('Use whole counts with trials greater than zero and successes no greater than trials.');
  const p=k/n,den=1+z*z/n,center=(p+z*z/(2*n))/den;
  const half=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/den;
  return {rate:p,low:Math.max(0,center-half),high:Math.min(1,center+half)};
}
export function saas({price,margin,churn,months}){
  price=nonnegative(price,'Monthly price');margin=proportion(margin,'Contribution fraction');churn=proportion(churn,'Churn');months=finiteNumber(months,'Months');
  if(!Number.isInteger(months)||months<1||months>120)throw new Error('Months must be a whole number from 1 through 120.');
  let survival=1,total=0;const rows=[];
  for(let month=1;month<=months;month++){const amount=price*margin*survival;total+=amount;rows.push({month,survival,amount,total});survival*=1-churn;}
  return {total,rows};
}
export function campaignUrl(base,fields){
  const url=new URL(base);if(!['http:','https:'].includes(url.protocol))throw new Error('Use an http or https destination.');
  if(url.username||url.password)throw new Error('Do not put credentials in a campaign URL.');
  for(const [key,value] of Object.entries(fields)){const val=value.trim();if(val)url.searchParams.set(`utm_${key}`,val);else url.searchParams.delete(`utm_${key}`);}
  return url.href;
}
