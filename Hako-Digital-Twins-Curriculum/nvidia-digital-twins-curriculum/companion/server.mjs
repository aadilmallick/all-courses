// Dependency-free learning server. Loopback only; read-only; explicit roots.
import http from 'node:http';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFile,realpath,stat} from 'node:fs/promises';
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const allowedFiles=new Set(['book.html','book.md','book.json','README.md','COMPANION_GUIDE.md','COMPANION_GUIDE.html','verification.md','verification.html','SOURCES.md','SOURCES.html','ROLE_ALIGNMENT.md','ROLE_ALIGNMENT.html']);
const extensions={'.html':'text/html; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.py':'text/plain; charset=utf-8','.toml':'text/plain; charset=utf-8','.svg':'image/svg+xml','.png':'image/png'};
function allowed(relative){return allowedFiles.has(relative)||/^(companion|chapters|assets|examples)\//.test(relative);}
const server=http.createServer(async(req,res)=>{try{
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
  let url=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(url==='/'){res.writeHead(302,{Location:'/companion/index.html'}).end();return;}
  if(url.split('/').some(part=>part.startsWith('.')||part.includes('\\'))){res.writeHead(403).end('Not served');return;}
  const candidate=path.resolve(root,'.'+url),actual=await realpath(candidate);
  const relative=path.relative(root,actual).split(path.sep).join('/');
  if(!actual.startsWith(root+path.sep)||!allowed(relative)||!extensions[path.extname(actual)]||!(await stat(actual)).isFile()){res.writeHead(403).end('Not served');return;}
  const data=await readFile(actual);
  res.writeHead(200,{'Content-Type':extensions[path.extname(actual)],'X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});
  res.end(req.method==='HEAD'?undefined:data);
}catch{res.writeHead(404).end('File unavailable');}});
server.on('error',error=>{console.error('Could not start companion:',error.message);process.exitCode=1;});
server.listen(Number(process.env.PORT||4173),'127.0.0.1',()=>console.log('Learning companion: http://127.0.0.1:'+server.address().port+'/'));
