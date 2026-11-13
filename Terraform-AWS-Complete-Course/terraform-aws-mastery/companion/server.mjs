import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const files=JSON.parse(await readFile(path.join(root,'companion/files.json'),'utf8'));
const allowed=new Set(files);const port=Number(process.env.PORT??4173);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.svg':'image/svg+xml','.zip':'application/zip'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let file=decodeURIComponent(url.pathname).replace(/^\/+/, '');if(!file)file='companion/index.html';if(req.method!=='GET'&&req.method!=='HEAD'){res.writeHead(405).end('Read-only local server');return;}if(!allowed.has(file)){res.writeHead(404).end('Not in the distributed course file allowlist.');return;}const data=await readFile(path.join(root,file));res.writeHead(200,{'Content-Type':mime[path.extname(file)]??'text/plain; charset=utf-8','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});res.end(req.method==='HEAD'?undefined:data);}catch{res.writeHead(404).end('Course file unavailable.');}}).listen(port,'127.0.0.1',()=>console.log(`Terraform AWS learning lab: http://127.0.0.1:${port}\nLocalhost only. Press Ctrl+C to stop.`));
