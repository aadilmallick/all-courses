import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {marked} from './vendor/marked.esm.mjs';
import {weeklyMinutes,cycles,reviewDays} from './daily-plan.mjs';
const root=path.dirname(fileURLToPath(import.meta.url));
const manifest=JSON.parse(await fs.readFile(path.join(root,'book.json'),'utf8'));
const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
let daily='# 90 daily actions\n\nRelative days, not scheduled dates. Shift the starting weekday to fit your life. Each timebox includes the review checkpoints appended to it. The plan uses 510 minutes per seven-day week. If you do the 90-minute start-today session, it replaces Days 1–2.\n\n';
const rows=[];
for(const [ci,cycle] of cycles.entries()){
 daily+=`## Cycle ${ci+1}: ${cycle.title} (${cycle.format})\n\n| Day | Minutes | Action | Completion condition |\n|---|---:|---|---|\n`;
 for(const [si,step] of cycle.steps.entries()){
  const day=ci*14+si+1;let action=step[0];
  const checkpoints=[];
  for(let video=1;video<=6;video++){
   const elapsed=day-video*14;
   if(elapsed===3)checkpoints.push(`Include a brief 48–72-hour check of V${String(video).padStart(2,'0')}; inspect technical issues and available feedback, not a growth verdict.`);
   if(elapsed===7)checkpoints.push(`Include the seven-day V${String(video).padStart(2,'0')} snapshot, marking sparse data.`);
   if(elapsed===28)checkpoints.push(`Include a 28-day V${String(video).padStart(2,'0')} review if data permits a useful comparison.`);
  }
  action+=' '+checkpoints.join(' ');
  rows.push({day,minutes:weeklyMinutes[(day-1)%7],action:action.trim(),done:step[1]});
  const row=rows.at(-1);daily+=`| ${row.day} | ${row.minutes} | ${row.action} | ${row.done} |\n`;
 }
 daily+='\n';
}
daily+='## Days 85–90: learn from the first season\n\n| Day | Minutes | Action | Completion condition |\n|---|---:|---|---|\n';
for(const [i,step] of reviewDays.entries()){
 const day=85+i;let action=step[0];
 if(day===87)action+=' Include the 48–72-hour technical and feedback check for V06; later seven- and 28-day reviews fall after this plan.';
 const row={day,minutes:weeklyMinutes[(day-1)%7],action,done:step[1]};rows.push(row);daily+=`| ${day} | ${row.minutes} | ${action} | ${step[1]} |\n`;
}
daily+='\nThe plan totals 6,510 minutes (108.5 hours). Do not add optional Shorts, extra experiments, or equipment shopping outside these timeboxes by default. If a video runs long, cut optional polish or move the release deliberately.\n';
await fs.writeFile(path.join(root,'daily-actions.md'),daily);
await fs.writeFile(path.join(root,'daily-actions.json'),JSON.stringify(rows,null,2)+'\n');
const entries=[...manifest.chapters,...manifest.extras];
const mapping=new Map(entries.map(e=>[path.resolve(root,e.path),e.id]));
function rewrite(md,file){return md.replace(/(!?\[[^\]]*\])\(([^\s)]+)\)/g,(all,label,url)=>{
 if(/^(?:[a-z]+:|#|\/\/)/i.test(url))return all;
 const [name,hash]=url.split('#');const resolved=path.resolve(root,path.dirname(file),decodeURIComponent(name));
 if(mapping.has(resolved))return `${label}(#${mapping.get(resolved)})`;
 return `${label}(${path.relative(root,resolved).replaceAll('\\','/')}${hash?'#'+hash:''})`;
});}
function section(md,id){let count=0,fence=false;return md.split(/\r?\n/).map(line=>{
 if(/^```/.test(line))fence=!fence;
 if(!fence&&/^#{1,5} /.test(line)){const m=line.match(/^(#+) (.*)/);const anchor=m[1].length===1?id:`${id}-section-${++count}`;return `<a id="${anchor}"></a>\n${'#'.repeat(Math.min(6,m[1].length+1))} ${m[2]}`;}
 return line;
}).join('\n');}
let md=`# ${manifest.title}\n\n${manifest.subtitle}\n\nPrepared for Aadil · 8–10 hours a week · Edition 13 November 2026\n\n<a id="preface"></a>\n## Start here\n\n${await fs.readFile(path.join(root,'preface.md'),'utf8')}\n\n<a id="contents"></a>\n## Contents\n\n`;
md+=entries.map(e=>`- [${e.title}](#${e.id})`).join('\n')+'\n';
for(const entry of entries){const content=await fs.readFile(path.join(root,entry.path),'utf8');md+='\n\n---\n\n'+section(rewrite(content,entry.path),entry.id)+'\n\n[Back to contents](#contents)\n';}
await fs.writeFile(path.join(root,'guide.md'),md);
const css=`:root{--ink:#21352f;--paper:#faf8f1;--green:#245d4a;--line:#d5ddd4;--accent:#be622e}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:24px}body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.75 Georgia,serif}aside{position:fixed;inset:0 auto 0 0;width:270px;padding:28px 23px;overflow-y:auto;background:#183d32;color:#f2f6ed;font:13px/1.5 system-ui,sans-serif}aside h2{font-size:29px;line-height:1.12;margin:14px 0 18px;color:white}aside p{color:#c2d5c8}nav{display:grid;gap:4px;margin-top:22px}nav a{color:#d7eddd;text-decoration:none;padding:8px 0;border-bottom:1px solid #426052}nav a:hover{color:white}main{margin-left:270px;max-width:1280px;padding:44px 5vw 90px}h1,h2,h3,h4{font-family:system-ui,sans-serif;line-height:1.25;letter-spacing:-.025em}h1{font-size:49px;max-width:750px}h2{font-size:31px;margin-top:44px}h3{font-size:23px;margin-top:32px}h4{font-size:19px}p{margin:17px 0}a{color:var(--green);text-underline-offset:3px}a:focus-visible{outline:3px solid var(--accent);outline-offset:4px}li{margin:6px 0}hr{margin:60px 0;border:0;border-top:1px solid var(--line)}table{display:block;max-width:100%;overflow-x:auto;border-collapse:collapse;margin:24px 0;font:13px/1.55 system-ui,sans-serif}th,td{padding:12px 13px;border:1px solid var(--line);vertical-align:top;min-width:70px}th{background:#e6ece1;text-align:left}tr:nth-child(even){background:#f1f2e9}pre{padding:20px;background:#173d32;color:#edf6ed;overflow-x:auto;border-radius:6px;font:13px/1.6 Consolas,monospace}code{font-family:Consolas,monospace;font-size:.87em}blockquote{border-left:4px solid var(--accent);padding-left:20px;margin:24px 0}img{display:block;max-width:100%;height:auto}.eyebrow{font:11px system-ui,sans-serif;text-transform:uppercase;letter-spacing:.12em;color:#6d7b6d}.quick{display:flex;flex-wrap:wrap;gap:10px;margin:24px 0 38px;font:14px system-ui,sans-serif}.quick a{padding:10px 13px;border:1px solid #91aa96;border-radius:5px;text-decoration:none}.quick a:first-child{background:var(--green);color:white}@media(max-width:800px){aside{position:relative;width:auto;padding:24px}aside h2{font-size:30px;max-width:380px}nav{grid-template-columns:1fr 1fr;column-gap:18px}main{margin:0;padding:28px 20px 60px}h1{font-size:37px}body{font-size:16px}table{font-size:12px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{aside,.quick,.eyebrow{display:none}main{margin:0;padding:0;max-width:none}body{font-size:10pt;color:black;background:white}h1{font-size:28pt}h2{break-before:page;font-size:20pt}h3{break-after:avoid;font-size:14pt}a{color:inherit}table{display:table;font-size:8pt}pre{white-space:pre-wrap;background:#eee;color:black}tr{break-inside:avoid}}`;
function html(content,title,standalone=false){return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><style>${css}</style></head><body><aside><p class="eyebrow" style="color:#b4d4bb">A practical creator guide</p><h2>Make progress.<br>Show the work.</h2><p>One audience. Two useful formats.<br>8–10 hours a week.<br>Edition 13 November 2026.</p><nav>${manifest.chapters.map((e,i)=>`<a href="${standalone?'guide.html':''}#${e.id}">${i+1}. ${esc(e.title)}</a>`).join('')}<a href="start-today.html">Record your first video</a><a href="production-playbooks.html">Production checklists</a><a href="${standalone?'guide.html':''}#daily-actions">90 daily actions</a><a href="${standalone?'guide.html':''}#sources">Research and resources</a></nav></aside><main><p class="eyebrow">Direct advice · Polished teaching · Sustainable practice</p><div class="quick"><a href="start-today.html">Start today</a><a href="production-playbooks.html">Use a checklist</a><a href="guide.html#daily-actions">Daily plan</a></div>${marked.parse(content)}</main></body></html>`;}
await fs.writeFile(path.join(root,'guide.html'),html(md,manifest.title));
for(const file of ['start-today','production-playbooks'])await fs.writeFile(path.join(root,file+'.html'),html(await fs.readFile(path.join(root,file+'.md'),'utf8'),file==='start-today'?'Record your first useful video': 'Two repeatable production playbooks',true));
console.log(JSON.stringify({built:['guide.html','guide.md','start-today.html','production-playbooks.html','daily-actions.md','daily-actions.json'],days:rows.length,totalMinutes:rows.reduce((n,r)=>n+r.minutes,0)}));
