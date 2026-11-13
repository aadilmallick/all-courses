// Minimal local static server; no external dependencies or build step.
import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const port=Number(process.env.MATH_LAB_PORT||8765);
const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.md':'text/plain; charset=utf-8','.svg':'image/svg+xml','.py':'text/plain; charset=utf-8','.png':'image/png'};
http.createServer(async(req,res)=>{try{const url=new URL(req.url,'http://localhost');let relative=decodeURIComponent(url.pathname);if(relative==='/')relative='/companion/index.html';let file=path.resolve(root,'.'+relative);if(!file.startsWith(root+path.sep))throw Error('Invalid path');if((await stat(file)).isDirectory())file=path.join(file,'index.html');const content=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','X-Content-Type-Options':'nosniff'});res.end(content);}catch{res.writeHead(404,{'Content-Type':'text/plain'});res.end('File not found');}}).listen(port,'127.0.0.1',()=>process.stdout.write(`Open http://127.0.0.1:${port}/companion/\n`));
