import http from 'node:http';
import {readFile,stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const port=Number(process.env.PORT||4173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8','.md':'text/plain; charset=utf-8','.svg':'image/svg+xml','.csv':'text/csv; charset=utf-8'};
const server=http.createServer(async(req,res)=>{
 try{
  let uri=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(uri==='/')uri='/companion/index.html';
  const file=path.resolve(root,'.'+uri);
  if(!file.startsWith(root+path.sep)||!(await stat(file)).isFile()){res.writeHead(404);res.end('File not found');return;}
  const bytes=await readFile(file);res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
 }catch{res.writeHead(404);res.end('File not found');}
});
server.listen(port,'127.0.0.1',()=>process.stdout.write(`Open http://127.0.0.1:${port}/companion/index.html\n`));
