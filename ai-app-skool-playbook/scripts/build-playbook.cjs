const fs=require('node:fs');
const path=require('node:path');
const {pathToFileURL}=require('node:url');
(async()=>{
 const root=path.resolve(__dirname,'..');
 const {marked}=await import(pathToFileURL('C:/Users/amallick.ENGINEERS/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/marked/lib/marked.esm.js').href);
 const md=fs.readFileSync(path.join(root,'playbook.md'),'utf8');
 const prior=fs.readFileSync(path.resolve(root,'..','skool-business-report.html'),'utf8');
 const css=prior.match(/<style>([\s\S]*?)<\/style>/)[1];
 const chapters=md.split(/(?=^# \d+ )/m);
 const title=chapters[0].split('\n')[0].slice(2);
 const intro=chapters[0].split('\n').slice(1).join('\n');
 const escape=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
 const headings=chapters.slice(1).map(ch=>({title:ch.split('\n')[0].slice(2),number:ch.match(/^# (\d+) /)[1]}));
 let body=marked.parse(intro);
 for(const ch of chapters.slice(1)){
   const n=ch.match(/^# (\d+) /)[1];
   let section=marked.parse(ch).replace('<h1>','<h2>').replace('</h1>','</h2>');
   section=section.replace(/<h2>(?!\d+ )([\s\S]*?)<\/h2>/g,'<h3>$1</h3>');
   section=section.replace(/<h3>Part (\d+)<\/h3>/g,'<h4>Part $1</h4>');
   body+='<section id="section-'+n+'">'+section+'</section>';
 }
 body=body.replace(/<table>/g,'<div class="table-wrap"><table>').replace(/<\/table>/g,'</table></div>');
 body=body.replace(/<a href="(https?:[^"]+)">/g,'<a href="$1" target="_blank" rel="noopener noreferrer">');
 const nav=headings.map(h=>'<a href="#section-'+h.number+'">'+escape(h.title)+'</a>').join('');
 const extra='blockquote{position:relative;background:#fafbf6;padding:18px 22px;border-left:3px solid #aa9140}blockquote p{font-size:16px}.cover .lede{font-size:19px}.pill-row{display:flex;gap:12px;flex-wrap:wrap;margin:25px 0}.pill-row span{background:#eef1e6;border-radius:4px;padding:5px 9px;font-size:13px}h4{font-size:17px;margin:24px 0 12px}a.download{font-weight:600}.sidebar{scrollbar-width:thin}.sidebar a{font-size:12.5px}.mobile-note{font-size:13px;color:#5d6557}@media print{blockquote{background:none}.pill-row{display:none}blockquote p{font-size:10pt}}';
 const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="A tailored execution playbook for Aadil Mallick to launch and grow an AI engineering Skool community with exact campaign scripts and paid curriculum."><title>'+escape(title)+'</title><style>'+css+extra+'</style></head><body><div class="layout"><aside class="sidebar"><div class="brand">AI App Shipping Lab</div><p class="small">Launch and growth playbook<br>Prepared for Aadil Mallick<br>November 13 2026</p><details open><summary>Report contents</summary><nav aria-label="Report sections"><a class="model-link" href="#section-8">Start the 30-day calendar</a>'+nav+'</nav></details></aside><main class="main"><header class="cover"><div class="eyebrow">One niche and one coherent campaign</div><h1>'+escape(title)+'</h1><p class="lede">Build a focused AI engineering membership from a small paid pilot toward a modeled $200K monthly gross-revenue target.</p><div class="pill-row"><span>26 sections</span><span>18 paid lessons</span><span>Ready-to-adapt campaign copy</span></div><div class="print-row"><button type="button" id="print-report">Print or save as PDF</button><a class="download" href="playbook.md">Editable source</a><a class="download" href="content-kit/social-posts.md">Social drafts</a><a class="download" href="content-kit/email-sequence.md">Email drafts</a></div></header>'+body+'<footer class="endnote">Planning report and draft content library. Financial inputs are illustrative; publishing requires real assets, verified links, and accurate terms.</footer></main></div><script>document.getElementById("print-report").addEventListener("click",()=>window.print());if(window.innerWidth<1000)document.querySelector("details").open=false;</script></body></html>';
 fs.writeFileSync(path.join(root,'playbook.html'),html);
 console.log(JSON.stringify({sections:headings.length,words:md.split(/\s+/).length,htmlBytes:Buffer.byteLength(html)}));
})().catch(e=>{console.error(e);process.exitCode=1;});

