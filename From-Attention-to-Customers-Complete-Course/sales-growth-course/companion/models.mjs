// Teaching models, not platform forecasts. All percentages are entered 0–100.
export function nonnegative(values) {
  for (const [key, value] of Object.entries(values)) {
    if (!Number.isFinite(value) || value < 0) throw new Error(`${key}: enter a finite number at least zero.`);
  }
}
export function percent(value, name) {
  if (!Number.isFinite(value) || value < 0 || value > 100) throw new Error(`${name}: enter a percentage from 0 to 100.`);
  return value / 100;
}
export function integer(value, name) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`${name}: enter a nonnegative whole number.`);
}
export function funnel(v) {
  nonnegative(v); integer(v.impressions, 'Impressions');
  const visits=v.impressions*percent(v.visitRate,'Visit rate');
  const leads=visits*percent(v.subscribeRate,'Subscription rate');
  const buyers=leads*percent(v.purchaseRate,'Subscriber purchase rate');
  return {visits, leads, buyers, revenue:buyers*v.price};
}
export function economics(v) {
  nonnegative(v);
  const contribution=v.price*(1-percent(v.refundRate,'Refund probability'))-v.price*percent(v.feeRate,'Fee rate')-v.fixedFee-v.deliveryCost;
  return {contribution, afterCAC:contribution-v.cac, targetCAC:contribution-v.reserve,
    breakEvenROAS:contribution>0?v.price/contribution:null};
}
export function pipeline(v) {
  nonnegative(v); integer(v.conversations,'Conversations');
  const bookings=v.conversations*percent(v.bookingRate,'Booking rate');
  const attended=bookings*percent(v.attendanceRate,'Attendance rate');
  const qualified=attended*percent(v.qualificationRate,'Qualification rate');
  const proposals=qualified*percent(v.proposalRate,'Proposal rate');
  const clients=proposals*percent(v.closeRate,'Acceptance rate');
  return {bookings,attended,qualified,proposals,clients,revenue:clients*v.dealValue,deliveryHours:clients*v.hoursPerClient};
}
export function video(v) {
  nonnegative(v); integer(v.impressions,'Eligible impressions');
  const viewsA=v.impressions*percent(v.ctrA,'CTR A'), viewsB=v.impressions*percent(v.ctrB,'CTR B');
  const minutesA=viewsA*v.durationA,minutesB=viewsB*v.durationB;
  return {viewsA,viewsB,minutesA,minutesB,hoursA:minutesA/60,hoursB:minutesB/60};
}
export function wilson(successes,trials) {
  integer(successes,'Successes'); integer(trials,'Observations');
  if(successes>trials) throw new Error('Successes cannot exceed observations.');
  if(trials===0) return {rate:null,low:null,high:null};
  const z=1.96,p=successes/trials,d=1+z*z/trials;
  const center=(p+z*z/(2*trials))/d;
  const half=z*Math.sqrt(p*(1-p)/trials+z*z/(4*trials*trials))/d;
  return {rate:p,low:Math.max(0,center-half),high:Math.min(1,center+half)};
}
export function uncertainty(v) {
  nonnegative(v);
  const a=wilson(v.successA,v.trialsA),b=wilson(v.successB,v.trialsB);
  return {rateA:a.rate,lowA:a.low,highA:a.high,rateB:b.rate,lowB:b.low,highB:b.high};
}
export function capacity(v) {
  nonnegative(v);
  for(const k of ['videos','shorts','written']) integer(v[k],k);
  const production=v.videos*v.videoHours+v.shorts*v.shortHours+v.written*v.writtenHours;
  const total=production+v.reservedHours;
  return {production,total,remaining:v.availableHours-total,utilization:v.availableHours>0?total/v.availableHours:null};
}
