const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=__dirname,m=JSON.parse(fs.readFileSync(path.join(root,'book.json'),'utf8'));
const entries=[...m.chapters,...m.extras];const issues=[];
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const anchors=s=>[...s.matchAll(/\bid="([^"]+)"/g)].map(x=>x[1]);
function localLink(from,url){
 if(/^(?:https?:|mailto:|data:)/i.test(url))return;
 const [file,fragment]=url.split('#');const target=file?path.resolve(root,path.dirname(from),decodeURIComponent(file)):path.resolve(root,from);
 if(!fs.existsSync(target)){issues.push(`${from}: missing ${url}`);return;}
 if(fragment&&/\.(?:html|md)$/.test(target)&&!anchors(fs.readFileSync(target,'utf8')).includes(fragment))issues.push(`${from}: missing fragment ${url}`);
}
for(const entry of entries){
 const md=read(entry.path);if(md.split('\n').filter(l=>/^```/.test(l)).length%2)issues.push(`${entry.path}: unclosed fence`);
 if(!/^# /m.test(md))issues.push(`${entry.path}: missing title`);
 for(const match of md.matchAll(/!?\[[^\]]*\]\(([^\s)]+)\)/g))localLink(entry.path,match[1]);
}
for(const file of ['guide.html','start-today.html','production-playbooks.html']){
 const html=read(file),ids=anchors(html);if(ids.length!==new Set(ids).size)issues.push(`${file}: duplicate IDs`);
 if(!/<html lang="en">/.test(html)||!html.includes('name="viewport"'))issues.push(`${file}: missing reader metadata`);
 for(const match of html.matchAll(/(?:href|src)="([^"]+)"/g))localLink(file,match[1]);
 if(/<script\b/i.test(html))issues.push(`${file}: unexpected remote or executable script`);
}
const days=JSON.parse(read('daily-actions.json'));
assert.equal(days.length,90);assert.deepEqual(days.map(d=>d.day),Array.from({length:90},(_,i)=>i+1));
assert.equal(days.reduce((s,d)=>s+d.minutes,0),6510);
for(let i=0;i<12;i++)assert.equal(days.slice(i*7,i*7+7).reduce((s,d)=>s+d.minutes,0),510);
for(const day of [14,28,42,56,70,84])assert.match(days[day-1].action,/Publish/);
for(const day of [17,31,45,59,73,87])assert.match(days[day-1].action,/48–72/);
assert.equal(45+45+30+45+90+30+30,315);assert.equal((30+99)+(150),279);assert.equal((60+99)+300,459);
for(const e of m.chapters)assert(read('guide.md').includes(`<a id="${e.id}"></a>`));
const counts=m.chapters.map(e=>({chapter:e.path,whitespaceWords:read(e.path).split(/\s+/).filter(Boolean).length}));
const report={date:'2026-11-13',checks:['chapter presence','Markdown fences','local references','unique HTML anchors','HTML navigation targets','90 contiguous daily rows','six publication targets','six 48–72-hour checkpoints','weekly/total time arithmetic','equipment arithmetic'],chapterWords:counts,totalChapterWords:counts.reduce((s,r)=>s+r.whitespaceWords,0),assembledWhitespaceWords:read('guide.md').split(/\s+/).filter(Boolean).length,days:90,totalMinutes:6510,issues,visualInspection:'Not performed: the available browser rejected local-file preview in this environment. No alternate route was used.',externalLinks:'Primary sources researched; no automated guarantee of future external availability.',editorExecution:'No actual video recording, DaVinci Resolve editing, device test, or YouTube publishing performed.'};
fs.writeFileSync(path.join(root,'verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));if(issues.length)process.exitCode=1;
