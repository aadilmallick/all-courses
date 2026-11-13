import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve('dist');
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
const html=walk(root).filter(f=>f.endsWith('.html'));let checked=0;const errors=[];
for(const file of html){const body=fs.readFileSync(file,'utf8');for(const m of body.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)){
 const href=m[1].split('?')[0].split('#')[0];if(!href||/^(?:https?:|mailto:|data:|javascript:|tel:)/.test(href))continue;
 let target=path.resolve(href.startsWith('/')?root:path.dirname(file),'.'+(href.startsWith('/')?href:'/') );
 if(!href.startsWith('/'))target=path.resolve(path.dirname(file),decodeURIComponent(href));else target=path.join(root,decodeURIComponent(href));
 if(!target.startsWith(root+path.sep)&&target!==root){errors.push({file,href,problem:'Outside static root'});continue;}
 if(fs.existsSync(target)&&fs.statSync(target).isDirectory())target=path.join(target,'index.html');
 checked++;if(!fs.existsSync(target))errors.push({file:path.relative(root,file),href});
}}
const report={checked:'2026-11-13',htmlFiles:html.length,localReferencesChecked:checked,errors};fs.writeFileSync('research/built-link-checks.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(errors.length)process.exitCode=1;
