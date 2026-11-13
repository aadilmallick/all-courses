/** Local learning server, not a public authenticated service. Node 24+. */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
const port=3000;
const web=new URL('../web/',import.meta.url);
const allowed=new Set([`http://localhost:${port}`,`http://127.0.0.1:${port}`]);
createServer(async(req,res)=>{
  const reply=(status:number, body:string, type='text/plain')=>{
    res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store'});res.end(body);
  };
  try {
    if(!new Set([`localhost:${port}`,`127.0.0.1:${port}`]).has(req.headers.host??'')) return reply(403,'Invalid host');
    if(req.method==='GET' && (req.url==='/' || req.url==='/client.mjs')) {
      const name=req.url==='/'?'index.html':'client.mjs';
      return reply(200,await readFile(new URL(name,web),'utf8'),name.endsWith('html')?'text/html':'text/javascript');
    }
    if(req.method!=='POST' || req.url!=='/session') return reply(404,'Not found');
    if(!allowed.has(req.headers.origin??'')) return reply(403,'Use the same-origin local page');
    if(!(req.headers['content-type']??'').startsWith('application/sdp')) return reply(415,'Expected application/sdp');
    if(!process.env.OPENAI_API_KEY) return reply(503,'Set OPENAI_API_KEY on the server');
    const chunks: Buffer[]=[];let size=0;
    for await(const chunk of req) {size+=chunk.length;if(size>131072) return reply(413,'Offer too large');chunks.push(chunk);}
    const sdp=Buffer.concat(chunks).toString('utf8');
    if(!sdp.startsWith('v=0')) return reply(400,'Invalid SDP');
    const form=new FormData(); form.set('sdp',sdp);
    form.set('session',JSON.stringify({type:'realtime',model:process.env.OPENAI_REALTIME_MODEL??'gpt-realtime-2.1',
      instructions:'You are a voice demo. Use short, clear answers. Do not claim to perform bookings.',
      audio:{output:{voice:'marin'}}}));
    const upstream=await fetch('https://api.openai.com/v1/realtime/calls',{method:'POST',
      headers:{Authorization:`Bearer ${process.env.OPENAI_API_KEY}`},body:form,signal:AbortSignal.timeout(20000)});
    if(!upstream.ok) return reply(502,`Provider rejected session (${upstream.status}); check server configuration`);
    reply(201,await upstream.text(),'application/sdp');
  } catch { if(!res.headersSent) reply(502,'Session setup failed or timed out');else res.end(); }
}).listen(port,'127.0.0.1',()=>console.log(`Open http://localhost:${port}`));
