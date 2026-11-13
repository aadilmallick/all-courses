import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const cwd=fileURLToPath(new URL('../',import.meta.url));
const server=spawn(process.execPath,['companion/server.mjs'],{cwd,env:{...process.env,WEBRTC_LAB_PORT:'4187'},stdio:['ignore','pipe','pipe']});
await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject);server.once('exit',code=>reject(new Error(`Server exited ${code}`)));});
try {
 const base='http://127.0.0.1:4187';
 for(const path of ['/','/app.js','/peer.js','/core.js','/transfer.js','/style.css']) {
  const response=await fetch(base+path);
  if(response.status!==200)throw new Error(`${path}: ${response.status}`);
 }
 for(const path of ['/missing.js','/package.json','/../package.json']) {
  const response=await fetch(base+path);
  if(response.status!==404)throw new Error(`${path}: expected 404`);
 }
 console.log('Six built resources served; three out-of-scope/missing paths rejected.');
} finally { server.kill(); }
