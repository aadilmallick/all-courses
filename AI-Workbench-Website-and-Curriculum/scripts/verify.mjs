import fs from 'node:fs';
import path from 'node:path';
import {encode} from 'gpt-tokenizer/encoding/cl100k_base';
import {loadTools,loadDoc,categories} from './catalog.mjs';
const tools=loadTools(), errors=[], chapters=[];
const add=message=>errors.push(message);
if(tools.length!==32)add(`Expected 32 core tools; found ${tools.length}`);
for(const category of Object.keys(categories)){const total=tools.filter(t=>t.category===category).length;if(total!==8)add(`${category}: expected 8, found ${total}`);}
const seen=new Set();
for(const tool of tools){
 const key=`${tool.category}/${tool.slug}`;if(seen.has(key))add(`Duplicate ${key}`);seen.add(key);
 const file=`src/content/docs/${key}.md`;
 if(!fs.existsSync(file)){add(`Missing chapter ${file}`);continue;}
 const {body,meta}=loadDoc(file);const tokens=encode(body).length;
 const words=body.trim().split(/\s+/).length;
 if(tokens<5000)add(`${key} below 5000 body tokens: ${tokens}`);
 if(!meta.title||!meta.description)add(`Missing title/description ${key}`);
 if((body.match(/^```/gm)||[]).length%2)add(`Unbalanced code fences ${key}`);
 if(!tool.sources?.length)add(`Missing sources ${key}`);
 if(!/## .*?(?:source|reference)/i.test(body))add(`Missing source section ${key}`);
 if(!/## .*?(?:troubleshoot|fail|debug|mistake|recover)/i.test(body))add(`Missing troubleshooting section ${key}`);
 for(const source of tool.sources||[]){try{const url=new URL(source.url);if(url.protocol!=='https:')add(`Non-HTTPS source ${source.url}`);}catch{add(`Invalid source ${source.url}`);}if(!source.accessed)add(`Missing source date ${key}`);}
 chapters.push({tool:tool.title,file,tokens,words,sources:tool.sources.length});
}
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?walk(path.join(dir,entry.name)):[path.join(dir,entry.name)]);}
const docs=walk('src/content/docs').filter(f=>/\.mdx?$/.test(f));
const routes=new Set(docs.map(f=>{let id=path.relative('src/content/docs',f).replaceAll('\\','/').replace(/\.mdx?$/,'').replace(/(^|\/)index$/,'');return '/'+(id?id+'/':'');}));
let linksChecked=0;
for(const file of docs){const {body}=loadDoc(file);const withoutCode=body.replace(/```[\s\S]*?```/g,'');
 for(const match of withoutCode.matchAll(/(?:\]\(|href=["'])(\/[^\s)"']*)/g)){
  const href=match[1].split('#')[0].split('?')[0];if(!href||href.startsWith('//'))continue;linksChecked++;
  if(href.startsWith('/downloads/')||href.startsWith('/data/')||/\.[a-z0-9]+$/i.test(href)){if(!fs.existsSync(path.join('public',href)))add(`Missing public file ${href} in ${file}`);}
  else if(!routes.has(href.endsWith('/')?href:href+'/'))add(`Broken route ${href} in ${file}`);
 }
}
const report={checked:'2026-11-13',tokenizer:{package:'gpt-tokenizer',version:JSON.parse(fs.readFileSync('node_modules/gpt-tokenizer/package.json','utf8')).version,encoding:'cl100k_base',scope:'Chapter body, frontmatter excluded'},coreTools:tools.length,uniquePrimarySources:new Set(tools.flatMap(t=>t.sources.map(s=>s.url))).size,chapters,totalBodyTokens:chapters.reduce((n,c)=>n+c.tokens,0),totalWhitespaceWords:chapters.reduce((n,c)=>n+c.words,0),minimumBodyTokens:chapters.length?Math.min(...chapters.map(c=>c.tokens)):0,contentRoutes:routes.size,internalLinksChecked:linksChecked,errors,limits:['Live SaaS accounts, paid model calls, cloud sessions, video exports, audio and telephone calls were not executed.','Source research verifies documented interfaces, not account-specific access.','Only explicitly recorded offline examples were executed.']};
fs.writeFileSync('research/verification.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({...report,chapters:undefined},null,2));if(errors.length)process.exitCode=1;
