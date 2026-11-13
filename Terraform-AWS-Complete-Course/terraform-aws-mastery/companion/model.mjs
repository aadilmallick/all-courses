export function reconcile({desired, actual, exists, owned, immutable}) {
  if (!exists) return {action:'CREATE', reason:'No remote object exists for the desired declaration.'};
  if (!owned) return {action:'ADOPTION REVIEW', reason:'An existing unowned object needs an explicit ownership/import decision.'};
  if (desired === actual) return {action:'NO CHANGE', reason:'The modeled configured value equals the observed value.'};
  return {action:immutable ? 'REPLACE' : 'UPDATE', reason:immutable ? 'The modeled schema treats this property as immutable.' : 'The modeled schema allows an in-place update.'};
}
export function identity(original, inserted) {
  const before=original.split(',').map(x=>x.trim()).filter(Boolean);
  if (new Set(before).size!==before.length) throw Error('Use unique service names for this experiment.');
  const after=[inserted.trim(),...before];
  if (!inserted.trim() || before.includes(inserted.trim())) throw Error('Insert a new nonempty service name.');
  return {count:after.map((name,index)=>({address:`service[${index}]`,before:before[index]??'(new)',after:name})),keys:after.map(name=>({address:`service["${name}"]`,before:before.includes(name)?name:'(new)',after:name}))};
}
export function iam({allow,boundary,organization,deny}) {
  return {allowed:allow&&boundary&&organization&&!deny,
    reason:deny?'Explicit deny wins in this simplified identity-policy model.':!allow?'No identity allow.':!boundary?'Boundary does not permit this action.':!organization?'Organization limit does not permit this action.':'All modeled permission limits permit the identity allow.'};
}
const toInt=ip=>{const parts=ip.split('.');if(parts.length!==4||parts.some(x=>!/^\d+$/.test(x)||+x>255))throw Error('Use an IPv4 address with four octets from 0 to 255.');return parts.reduce((n,x)=>n*256+Number(x),0);};
const fromInt=n=>[24,16,8,0].map(bits=>Math.floor(n/2**bits)%256).join('.');
export function subnet(base,add,slot) {
  const [ip,prefixText]=base.split('/');const prefix=Number(prefixText);
  if(prefixText===undefined||!Number.isInteger(prefix)||prefix<0||prefix>32||!Number.isInteger(add)||add<0||prefix+add>32||!Number.isInteger(slot)||slot<0||slot>=2**add)throw Error('Use a valid prefix, additional bits, and subnet slot.');
  const value=toInt(ip), size=2**(32-prefix),start=Math.floor(value/size)*size,child=2**(32-prefix-add),lo=start+slot*child;
  return {cidr:`${fromInt(lo)}/${prefix+add}`,first:fromInt(lo),last:fromInt(lo+child-1),total:child,ordinaryAwsUsable:Math.max(0,child-5)};
}
export function route(destination,routes) {
  const value=toInt(destination);
  return routes.filter(r=>{const [ip,p]=r.cidr.split('/');const size=2**(32-Number(p));return Math.floor(value/size)===Math.floor(toInt(ip)/size);}).sort((a,b)=>Number(b.cidr.split('/')[1])-Number(a.cidr.split('/')[1]))[0]??null;
}
export function capacity(rate,durationMs,limit) {
  if(rate<0||durationMs<0||limit<=0)throw Error('Rate and duration must be nonnegative; capacity must be positive.');
  const concurrent=rate*durationMs/1000;
  return {averageConcurrent:concurrent,utilization:concurrent/limit,minimumWholeCapacity:Math.ceil(concurrent),interpretation:concurrent>limit?'Average demand exceeds the chosen capacity.':'Average demand fits; bursts and tail latency are not modeled.'};
}
export class LockModel {
  constructor(){this.owner=null;this.serial=10;this.seen={};this.events=[];}
  read(client){this.seen[client]=this.serial;return this.log(`${client} read serial ${this.serial}.`);}
  acquire(client){if(this.owner)return this.log(`REFUSED: ${this.owner} holds the lock.`);this.owner=client;return this.log(`${client} acquired the lock.`);}
  write(client){if(this.owner!==client)return this.log('REFUSED: writer does not own the lock.');if(this.seen[client]!==this.serial)return this.log('REFUSED: stale or missing read; read the current serial.');this.serial++;this.seen[client]=this.serial;return this.log(`${client} wrote serial ${this.serial}.`);}
  release(client){if(this.owner!==client)return this.log('REFUSED: only the owner can release this modeled lock.');this.owner=null;return this.log(`${client} released the lock.`);}
  log(message){this.events.push(message);return message;}
}
export function moduleDiff(retention,oldDefault,newDefault) {
  const explicit=retention==='explicit';
  return {before:oldDefault,after:explicit?oldDefault:newDefault,reason:explicit?'Caller supplied an explicit input; changing the default does not alter this caller.':'Caller omitted the input; the changed default alters effective configuration.'};
}
export function migration(oldAddress,newAddress,moved) {
  if(!oldAddress.trim()||!newAddress.trim())throw Error('Both addresses are required.');
  return oldAddress===newAddress?{creates:0,deletes:0,continuity:true,reason:'Address unchanged.'}:moved?{creates:0,deletes:0,continuity:true,reason:'Explicit compatible move preserves modeled association.'}:{creates:1,deletes:1,continuity:false,reason:'Without a move, the old address is removed and the new address is added.'};
}
export function policy(actions,forceDestroy,publicFlag) {
  const list=actions.split(',').map(x=>x.trim());const failures=[];
  if(list.includes('delete'))failures.push('Delete or replacement requires scoped review.');
  if(forceDestroy)failures.push('Automatic object deletion is enabled.');
  if(publicFlag!=='true')failures.push('Required public-access blocking is false or unknown.');
  return {passed:failures.length===0,failures};
}
export function artifactCheck(reviewed,current,age,maxAge) {
  const failures=[];if(reviewed!==current)failures.push('Artifact identity changed.');if(age<0||maxAge<=0||age>maxAge)failures.push('Plan age is outside the permitted interval.');
  return {permitted:failures.length===0,failures,notice:'Equality model only; the portable pipeline computes real SHA-256 hashes. Protected artifacts provide trust.'};
}
export function architecture({host,kubernetes,eventDriven,team}) {
  const choice=host?'EC2 with a managed image/fleet strategy':kubernetes?'EKS after validating Kubernetes operating capacity':eventDriven?'Lambda if duration, runtime, and dependency limits fit':'ECS/Fargate as a container-service candidate';
  return {candidate:choice,operationalConcern:team==='small'?'Keep the platform simple; account for upgrades, identity, observability, and recovery.':'Make ownership and supported interfaces explicit across teams.',notice:'A transparent teaching heuristic; validate service feasibility and economics separately.'};
}
export function cost({requests,memoryMb,durationMs,requestRate,gbSecondRate,storageGb,storageRate,fixed}) {
  const values=[requests,memoryMb,durationMs,requestRate,gbSecondRate,storageGb,storageRate,fixed];
  if(values.some(v=>!Number.isFinite(v)||v<0))throw Error('Use finite nonnegative values.');
  const gbSeconds=requests*(durationMs/1000)*(memoryMb/1024);
  return {gbSeconds,requestCost:requests/1e6*requestRate,computeCost:gbSeconds*gbSecondRate,storageCost:storageGb*storageRate,fixedCost:fixed,total:requests/1e6*requestRate+gbSeconds*gbSecondRate+storageGb*storageRate+fixed};
}
