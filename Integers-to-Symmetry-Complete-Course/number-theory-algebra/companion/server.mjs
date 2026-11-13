import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(fileURLToPath(new URL('../',import.meta.url)));
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost');let name=decodeURIComponent(u.pathname);if(name==='/')name='/companion/index.html';const dest=path.resolve(root,'.'+name);if(!dest.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return;}if(!(await stat(dest)).isFile())throw Error('Not a file');res.writeHead(200,{'Content-Type':types[path.extname(dest)]||'application/octet-stream','X-Content-Type-Options':'nosniff','Cache-Control':'no-store'});res.end(await readFile(dest));}catch{res.writeHead(404);res.end('File not found');}});
server.listen(port,'127.0.0.1',()=>console.log(`Companion: http://127.0.0.1:${port}/companion/index.html`));
