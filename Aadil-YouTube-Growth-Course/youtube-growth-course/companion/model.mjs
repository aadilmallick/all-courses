export function number(value, min=0, max=1e9) { const n=Number(value); return Number.isFinite(n)?Math.min(max,Math.max(min,n)):min; }
export function weighted(scores, weights) { const total=weights.reduce((a,b)=>a+number(b),0); return total? scores.reduce((a,b,i)=>a+number(b,0,5)*number(weights[i]),0)/total:0; }
export function words(text) { return String(text).trim().split(/\s+/).filter(Boolean).length; }
export function scriptTime(text, pace, demoSeconds) { return words(text)/number(pace,60,240)*60+number(demoSeconds); }
export function storage(minutes, mbps, tracks=1, audioKbps=192) { return number(minutes)*60*(number(mbps)+number(tracks)*number(audioKbps)/1000)/8/1000; }
export function funnel(v) { const visitors=number(v.views)*number(v.visit,0,100)/100; const optins=visitors*number(v.optin,0,100)/100; const buyers=optins*number(v.buy,0,100)/100; return {visitors,optins,buyers,gross:buyers*number(v.price)}; }
export function economics(v) {
 const ads=number(v.views)*number(v.rpm)/1000;
 const notes=number(v.notes)*number(v.notesPrice), community=number(v.members)*number(v.memberPrice), tutoring=number(v.sessions)*number(v.sessionPrice), audits=number(v.audits)*number(v.auditPrice);
 const nonad=notes+community+tutoring+audits, gross=ads+nonad;
 const refunds=(notes+community)*number(v.refund,0,100)/100, fees=nonad*number(v.fee,0,100)/100, costs=number(v.costs);
 const hours=number(v.contentHours)+number(v.communityHours)+number(v.notesHours)+number(v.sessions)*number(v.sessionHours)+number(v.audits)*number(v.auditHours)+number(v.adminHours);
 return {ads,notes,community,tutoring,audits,gross,refunds,fees,costs,cash:gross-refunds-fees-costs,hours,weekly:hours*12/52,adOnly: number(v.rpm)>0?10000/number(v.rpm)*1000:null};
}
export function analytics(v) { const impressions=number(v.impressions), iv=number(v.impressionViews), views=number(v.views), avd=number(v.avd), duration=number(v.duration); return {ctr:impressions?iv/impressions*100:null,watch:views*avd/3600,apv:duration?avd/duration*100:null,estimatedImpressionWatch:iv*avd/3600,invalid:iv>impressions||avd>duration||iv>views}; }
export function schedule(v) { const minutes=v.days.reduce((a,b)=>a+number(b),0); const capacity=minutes/60; const content=number(v.content), paid=number(v.sessions)*number(v.sessionHours), other=number(v.other); return {capacity,content,paid,other,remaining:capacity-content-paid-other}; }
