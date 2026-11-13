import fs from 'node:fs';
import path from 'node:path';
import {loadTools,loadDoc,categories} from './catalog.mjs';
const tools=loadTools();const root='curriculum';fs.mkdirSync(root,{recursive:true});
// Only remove numbered files produced by this exporter, so changed ordering
// cannot leave duplicate copies. Preserve unrelated files and directories.
for(const data of Object.values(categories)){
 const dir=path.resolve(root,data.folder);
 if(!dir.startsWith(path.resolve(root)+path.sep))throw new Error('Unsafe export path');
 if(fs.existsSync(dir))for(const file of fs.readdirSync(dir))if(/^\d\d-.+\.md$/.test(file))fs.unlinkSync(path.join(dir,file));
}
const routeMap=new Map();
for(const [category,data]of Object.entries(categories)){const group=tools.filter(t=>t.category===category);group.forEach((tool,i)=>routeMap.set(`/${category}/${tool.slug}/`,`${data.folder}/${String(i+1).padStart(2,'0')}-${tool.slug}.md`));routeMap.set(`/${category}/`,`${data.folder}/README.md`);}
const supporting=['foundations','learning-paths','compare','projects','research','watchlist','changes/vibe-kanban'];
for(const slug of supporting)routeMap.set(`/${slug}/`,`reference/${slug.replaceAll('/','-')}.md`);
routeMap.set('/','README.md');routeMap.set('/tools/','README.md');
function convert(body,dest){return body.replace(/\]\((\/[^\s)]*)(#[^)]*)?\)/g,(whole,url)=>{const [route,hash]=url.split('#');if(route.startsWith('/downloads/'))return `](https://ai-workbench-developer-field-guide.unison-softw-0672.chatgpt.site${url})`;const mapped=routeMap.get(route.endsWith('/')?route:route+'/');if(!mapped)return whole;const rel=path.relative(path.dirname(dest),mapped).replaceAll('\\','/');return `](${rel}${hash?'#'+hash:''})`;});}
for(const tool of tools){const dest=routeMap.get(`/${tool.category}/${tool.slug}/`);const {body,meta}=loadDoc(`src/content/docs/${tool.category}/${tool.slug}.md`);fs.mkdirSync(path.dirname(path.join(root,dest)),{recursive:true});fs.writeFileSync(path.join(root,dest),`# ${meta.title}\n\n${convert(body,dest)}`);}
for(const [category,data] of Object.entries(categories)){const dest=routeMap.get(`/${category}/`);const {body}=loadDoc(`src/content/docs/${category}/index.md`);fs.mkdirSync(path.dirname(path.join(root,dest)),{recursive:true});fs.writeFileSync(path.join(root,dest),`# ${data.title}\n\n${convert(body,dest)}`);}
for(const slug of supporting){const {body,meta}=loadDoc(`src/content/docs/${slug}.md`);const dest=routeMap.get(`/${slug}/`);fs.mkdirSync(path.dirname(path.join(root,dest)),{recursive:true});fs.writeFileSync(path.join(root,dest),`# ${meta.title}\n\n${convert(body,dest)}`);}
let readme=`# AI Workbench: developer field guide\n\nResearched November 13, 2026. Thirty-two complete tool chapters across four requested categories, plus prerequisites, learning paths, comparisons, projects, and a primary-source ledger. This is a curated ecosystem curriculum, not an exhaustive inventory of all AI products.\n\n## Start here\n\n1. Read [Foundations](reference/foundations.md).\n2. Choose a [learning path](reference/learning-paths.md).\n3. Use [Compare and choose](reference/compare.md) to shortlist a tool.\n4. Complete an optional [application project](reference/projects.md).\n5. Check [ecosystem changes](reference/watchlist.md) before using old APIs.\n\nThe full route is approximately sixteen weeks at eight to twelve hours weekly, depending on practice and prior experience. A selective survey can fit twelve to eighteen hours. Most conceptual and offline work needs no paid account. Live services may require subscriptions, API billing, eligible regions, or supported operating systems.\n\n## Tool chapters\n\n`;
for(const [category,data]of Object.entries(categories)){readme+=`### ${data.title}\n\n`;for(const t of tools.filter(t=>t.category===category))readme+=`- [${t.title}](${routeMap.get(`/${category}/${t.slug}/`)}) — ${t.description}\n`;readme+='\n';}
readme+=`## Evidence and limits\n\nEach core chapter has at least 5,000 body tokens measured using gpt-tokenizer's cl100k_base encoding; frontmatter is excluded. See the source project's research/verification.json for exact counts and final checks. Worked examples are original teaching material. Product claims link to official documentation or source. Live paid services, generated media, remote agent accounts, telephone calls, and production integrations were not executed.\n\nThese Markdown files are the offline edition of the companion Astro Starlight site. Relative guide links work in a Markdown viewer such as GitHub or an editor. Website-specific controls and full-text search belong to the site. [Sources and methodology](reference/research.md) explain research boundaries.\n`;
readme+='\n[Research ledgers and verification](research/verification.json) are included with this bundle.\n';
fs.writeFileSync(path.join(root,'README.md'),readme);
fs.mkdirSync(path.join(root,'research'),{recursive:true});
for(const file of fs.readdirSync('research').filter(f=>f.endsWith('.json')||f==='editorial-review.md'))fs.copyFileSync(path.join('research',file),path.join(root,'research',file));
let linkCount=0;const missing=[];
function walk(p){return fs.readdirSync(p,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(p,e.name)):[path.join(p,e.name)]);}
for(const file of walk(root).filter(f=>f.endsWith('.md'))){const text=fs.readFileSync(file,'utf8').replace(/```[\s\S]*?```/g,'');for(const m of text.matchAll(/\]\(([^\s)]+)\)/g)){const href=m[1].split('#')[0];if(!href||/^[a-z]+:/i.test(href))continue;linkCount++;if(!fs.existsSync(path.resolve(path.dirname(file),href)))missing.push({file,href});}}
console.log(JSON.stringify({exportedChapters:tools.length,relativeLinksChecked:linkCount,missing}));if(missing.length)process.exitCode=1;
