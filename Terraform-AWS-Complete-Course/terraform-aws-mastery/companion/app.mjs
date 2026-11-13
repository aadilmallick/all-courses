import * as M from './model.mjs';
const $=id=>document.getElementById(id);
const catalog=[
['reconcile','01','Reconciliation','Compare desired values, observation, and ownership.'],
['identity','02','Collection identity','See why inserting a list element differs from adding a stable key.'],
['iam','03','Policy reasoning','Combine an identity allow with modeled permission limits.'],
['network','04','CIDR and route explorer','Calculate subnet ranges and choose the longest matching route.'],
['capacity','05','Capacity explorer','Calculate average in-flight work from request rate and duration.'],
['lock','06','State lock','Coordinate two modeled writers and reject stale state writes.'],
['modules','07','Module contract','Observe the effect of changing a default on different callers.'],
['migration','08','Migration planner','Compare a resource rename with and without explicit continuity.'],
['policy','09','Plan policy','Evaluate delete/replacement and selected storage guardrails.'],
['artifact','10','Reviewed artifact','Check identity and age before modeled authorization.'],
['architecture','11','Architecture tradeoffs','Explore a transparent compute selection heuristic.'],
['cost','12','Cost sensitivity','Compute an estimate with rates you supply. No live pricing.']
];
let current='reconcile',lock=new M.LockModel();
function input(label,key,value,type='number',options=null){const wrap=document.createElement('label');wrap.className='field';const caption=document.createElement('span');caption.textContent=label;wrap.append(caption);let el;if(options){el=document.createElement('select');for(const [val,title] of options){const option=document.createElement('option');option.value=val;option.textContent=title;el.append(option);}el.value=String(value);}else{el=document.createElement('input');el.type=type;if(type==='checkbox')el.checked=value;else el.value=value;if(type==='number'){el.min='0';el.step='any';}}el.id=key;el.name=key;wrap.append(el);$('controls').append(wrap);return el;}
function read(key){const el=$(key);return el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.value;}
function table(rows){const el=document.createElement('table');if(!rows.length)return el;const headers=Object.keys(rows[0]);const head=el.createTHead().insertRow();headers.forEach(key=>{const th=document.createElement('th');th.textContent=key;head.append(th);});const body=el.createTBody();rows.forEach(row=>{const tr=body.insertRow();headers.forEach(key=>{const td=tr.insertCell();td.textContent=String(row[key]);});});return el;}
function result(value){$('result').replaceChildren();const pre=document.createElement('pre');pre.textContent=JSON.stringify(value,null,2);$('result').append(pre);}
function render(){try{
 switch(current){
 case'reconcile':result(M.reconcile({desired:read('desired'),actual:read('actual'),exists:read('exists'),owned:read('owned'),immutable:read('immutable')}));break;
 case'identity':{const values=M.identity(read('names'),read('newName'));$('result').replaceChildren();for(const [title,rows]of Object.entries(values)){const h=document.createElement('h3');h.textContent=title==='count'?'Count addresses':'Stable key addresses';$('result').append(h,table(rows));}break;}
 case'iam':result(M.iam({allow:read('allow'),boundary:read('boundary'),organization:read('organization'),deny:read('deny')}));break;
 case'network':{const network=M.subnet(read('base'),read('bits'),read('slot'));const routes=[{cidr:read('base'),target:'VPC local'},{cidr:'0.0.0.0/0',target:read('publicRoute')?'Internet gateway':'(no default route)'}];const selected=M.route(read('destination'),read('publicRoute')?routes:routes.slice(0,1));result({subnet:network,destination:read('destination'),selectedRoute:selected??'NO MATCH',note:'Five reserved addresses shown only as an ordinary IPv4 AWS subnet teaching rule. Routing model omits endpoints, firewalls, and DNS.'});break;}
 case'capacity':result(M.capacity(read('rate'),read('duration'),read('limit')));break;
 case'lock':result({owner:lock.owner??'(unlocked)',serial:lock.serial,clientReads:lock.seen,events:lock.events});break;
 case'modules':result(M.moduleDiff(read('caller'),read('oldDefault'),read('newDefault')));break;
 case'migration':result(M.migration(read('oldAddress'),read('newAddress'),read('moved')));break;
 case'policy':result(M.policy(read('actions'),read('forceDestroy'),read('publicFlag')));break;
 case'artifact':result(M.artifactCheck(read('reviewed'),read('currentArtifact'),read('age'),read('maxAge')));break;
 case'architecture':result(M.architecture({host:read('host'),kubernetes:read('kubernetes'),eventDriven:read('eventDriven'),team:read('team')}));break;
 case'cost':result(M.cost(Object.fromEntries(['requests','memoryMb','durationMs','requestRate','gbSecondRate','storageGb','storageRate','fixed'].map(k=>[k,read(k)]))));break;
 }
 $('status').textContent='Results recalculated from the current controls.';
}catch(error){$('result').textContent=error.message;$('status').textContent='Check the input values.';}}
export function mount(id){current=id;lock=new M.LockModel();const entry=catalog.find(x=>x[0]===id);$('title').textContent=entry[2];$('description').textContent=entry[3];$('chapter').textContent=`Chapter ${Number(entry[1])}`;$('chapter').href=`/book.html#chapter-${entry[1]}`;$('controls').replaceChildren();
 switch(id){
 case'reconcile':input('Desired replicas','desired',2);input('Observed replicas','actual',1);input('Object exists','exists',true,'checkbox');input('State owns object','owned',true,'checkbox');input('Property is immutable','immutable',false,'checkbox');break;
 case'identity':input('Existing names (comma separated)','names','api,worker','text');input('Insert at list beginning','newName','scheduler','text');break;
 case'iam':input('Identity policy allows action','allow',true,'checkbox');input('Boundary permits action','boundary',true,'checkbox');input('Organization limit permits action','organization',true,'checkbox');input('Explicit deny applies','deny',false,'checkbox');break;
 case'network':input('VPC CIDR','base','10.42.0.0/16','text');input('Additional subnet bits','bits',8);input('Subnet slot','slot',128);input('Packet destination','destination','8.8.8.8','text');input('Default internet route exists','publicRoute',false,'checkbox');break;
 case'capacity':input('Requests per second','rate',20);input('Mean duration (milliseconds)','duration',200);input('Concurrent capacity','limit',10);break;
 case'lock':for(const client of ['Alice','Ben']){const group=document.createElement('fieldset');const legend=document.createElement('legend');legend.textContent=client;group.append(legend);for(const action of ['read','acquire','write','release']){const b=document.createElement('button');b.textContent=`${client}: ${action}`;b.type='button';b.addEventListener('click',()=>{lock[action](client);render();});group.append(b);}$('controls').append(group);}break;
 case'modules':input('Caller input','caller','omitted','text',[['omitted','Uses module default'],['explicit','Explicitly supplies old value']]);input('Old retention default (days)','oldDefault',7);input('New retention default (days)','newDefault',30);break;
 case'migration':input('Old address','oldAddress','terraform_data.old_name','text');input('New address','newAddress','terraform_data.new_name','text');input('Compatible moved mapping exists','moved',true,'checkbox');break;
 case'policy':input('Action array','actions','create','text',[['create','create'],['update','update'],['delete','delete'],['create,delete','create then delete'],['delete,create','delete then create']]);input('force_destroy enabled','forceDestroy',false,'checkbox');input('Public blocking value','publicFlag','true','text',[['true','Known true'],['false','Known false'],['unknown','Unknown']]);break;
 case'artifact':input('Reviewed artifact identifier','reviewed','release-sha-A','text');input('Current artifact identifier','currentArtifact','release-sha-A','text');input('Plan age (hours)','age',1);input('Maximum age (hours)','maxAge',4);break;
 case'architecture':input('Requires host-level control','host',false,'checkbox');input('Requires Kubernetes APIs','kubernetes',false,'checkbox');input('Fits event/request execution','eventDriven',true,'checkbox');input('Operating team','team','small','text',[['small','Small team'],['platform','Dedicated platform team']]);break;
 case'cost':input('Monthly requests','requests',1000000);input('Function memory (MiB)','memoryMb',128);input('Mean duration (ms)','durationMs',100);input('Request rate ($ per million; illustrative)','requestRate',0.2);input('Compute rate ($ per GB-second; illustrative)','gbSecondRate',0.0000166667);input('Storage (GB-month)','storageGb',5);input('Storage rate ($ per GB-month; illustrative)','storageRate',0.023);input('Other monthly cost allowance ($)','fixed',2);break;
 }
 $('modelNote').textContent=id==='cost'?'Illustrative rates only. Excludes free tiers, API Gateway, tables, recovery, detailed logging, transfers, taxes, and other costs unless included in your allowance. Enter current regional rates.':id==='iam'?'Simplified identity-policy limit model. Does not implement AWS resource policies, principal/session exceptions, or the complete IAM evaluation algorithm.':'Educational model only. No Terraform process, AWS API call, credential, or account access occurs in this browser.';
 document.querySelectorAll('nav button').forEach(b=>b.setAttribute('aria-current',String(b.dataset.id===id)));render();}
for(const entry of catalog){const button=document.createElement('button');button.type='button';button.dataset.id=entry[0];button.textContent=`${entry[1]}  ${entry[2]}`;button.addEventListener('click',()=>mount(entry[0]));$('experiments').append(button);}
$('controls').addEventListener('input',render);$('controls').addEventListener('change',render);$('reset').addEventListener('click',()=>mount(current));$('sourceToggle').addEventListener('click',async()=>{const panel=$('source');panel.hidden=!panel.hidden;if(!panel.hidden&&!panel.textContent){try{const response=await fetch('/companion/model.mjs');if(!response.ok)throw Error('Source could not be loaded.');panel.textContent=await response.text();}catch(error){panel.textContent=error.message;}}});
mount('reconcile');
