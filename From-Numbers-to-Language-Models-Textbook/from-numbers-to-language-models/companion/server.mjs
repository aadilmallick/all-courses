import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const project=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const root=process.argv.includes('--dist')?path.join(project,'dist'):project;
const portIndex=process.argv.indexOf('--port'),port=portIndex<0?8765:Number(process.argv[portIndex+1]);
if(!Number.isInteger(port)||port<1||port>65535)throw new Error('Choose a valid local port.');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.md':'text/plain; charset=utf-8','.py':'text/plain; charset=utf-8','.txt':'text/plain; charset=utf-8'};
http.createServer(async(req,res)=>{
  try {
    let request=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if(request==='/'){res.writeHead(302,{'Location':'/companion/index.html'});res.end();return;}
    const target=path.resolve(root,'.'+request);
    if(!target.startsWith(root+path.sep)||!types[path.extname(target)]){res.writeHead(403);res.end('Unavailable path.');return;}
    const bytes=await fs.readFile(target);res.writeHead(200,{'Content-Type':types[path.extname(target)],'Cache-Control':'no-store'});res.end(bytes);
  }catch(error){res.writeHead(error.code==='ENOENT'?404:400);res.end('File unavailable.');}
}).listen(port,'127.0.0.1',()=>console.log(`Open http://127.0.0.1:${port}/ (${process.argv.includes('--dist')?'built output':'source output'})`));
