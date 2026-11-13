import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.mjs':'text/javascript','.json':'application/json','.md':'text/plain; charset=utf-8','.svg':'image/svg+xml'};
http.createServer((req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);const p=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));if(!p.startsWith(root+path.sep)){res.writeHead(403).end('Forbidden');return;}const st=fs.statSync(p);if(!st.isFile())throw new Error('Not a file');res.writeHead(200,{'Content-Type':mime[path.extname(p)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});fs.createReadStream(p).pipe(res);}catch{res.writeHead(404).end('File not found');}}).listen(8765,'127.0.0.1',()=>console.log('Textbook: http://127.0.0.1:8765/ — Workbook: /companion/index.html'));
