// Exercise the documented local server in one process namespace.
import {spawn} from 'node:child_process';
import assert from 'node:assert/strict';
import {once} from 'node:events';
const server=spawn(process.execPath,['companion/server.mjs'],{cwd:new URL('../',import.meta.url),env:{...process.env,PORT:'4189'},stdio:['ignore','pipe','pipe']});
try{
 let startupTimer;
 const ready=await Promise.race([once(server.stdout,'data'),once(server,'exit').then(()=>{throw Error('Server exited before ready');}),new Promise((_,reject)=>{startupTimer=setTimeout(()=>reject(Error('Server startup timeout')),5000);})]);
 clearTimeout(startupTimer);
 assert.match(String(ready[0]),/Companion:/);
 const paths=['companion/index.html','companion/style.css','companion/app.mjs','companion/math.mjs','companion/labs.mjs','companion/catalog.json'];
 for(const path of paths){const r=await fetch('http://127.0.0.1:4189/'+path);assert.equal(r.status,200);assert.ok((await r.text()).length>50);}
 const missing=await fetch('http://127.0.0.1:4189/missing-file');assert.equal(missing.status,404);
 console.log(JSON.stringify({status:'passed',served:paths.length,missing_status:missing.status,node:process.version},null,2));
}finally{server.kill();}
