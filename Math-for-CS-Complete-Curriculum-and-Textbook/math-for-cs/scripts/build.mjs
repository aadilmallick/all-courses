import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {marked} from '../companion/vendor/marked/marked.esm.js';
import katex from '../companion/vendor/katex/dist/katex.mjs';
import {definitions} from '../companion/labs.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=rel=>readFile(path.join(root,rel),'utf8');
const put=(rel,text)=>writeFile(path.join(root,rel),text,'utf8');
const manifest=JSON.parse(await read('book.json'));
let equationCount=0;const mathErrors=[];
function render(text,name){const equations=[];const protectedText=text.replace(/\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g,(_,block,inline)=>{const index=equations.length;try{equations.push(katex.renderToString(block??inline,{displayMode:block!==undefined,throwOnError:true,strict:'error',trust:false,output:'htmlAndMathml'}));equationCount++;}catch(e){mathErrors.push({name,equation:block??inline,error:e.message});equations.push('<strong>Equation rendering failed</strong>');}return `MATHLOCK${index}END`;});return marked.parse(protectedText,{gfm:true}).replace(/MATHLOCK(\d+)END/g,(_,n)=>equations[Number(n)]);}
const partIntros={
 'Language and proof':'We begin with the language of quantities and statements, then learn how definitions and induction support guarantees about programs and mathematical objects.',
 'Discrete structures':'Arithmetic and graphs organize discrete information. Invariants, relations, and counting arguments become tools for designing and analyzing structures.',
 'Counting and recurrences':'Exact construction rules become sums, combinatorial counts, recurrence equations, and coefficient identities. We keep modeling and multiplicity explicit.',
 'Probability and stochastic models':'We attach weights to outcomes, extract numerical variables, control deviations, and use recurrences and graph structure to study random processes.'};
let book=`# ${manifest.title}\n\n${manifest.subtitle}\n\n<a id="preface"></a>\n\n${await read('preface.md')}\n\n<a id="contents"></a>\n\n## Contents\n\n`;
book+=manifest.chapters.map(c=>`- [${c.id.slice(-2)}. ${c.title}](#${c.id})`).join('\n')+'\n- [References and included projects](#end-material)\n';
const pages={};let lastPart='';
for(const c of manifest.chapters){const text=await read(c.path);if(c.part!==lastPart){lastPart=c.part;book+=`\n\n# ${c.part}\n\n${partIntros[c.part]}\n`;}
 let section=0;const content=text.replace(/^# [^\n]+\n/,'').replaceAll('](../assets/','](assets/').replace(/^## (.+)$/gm,(_,h)=>`<a id="${c.id}-section-${++section}"></a>\n\n### ${h}`);
 book+=`\n\n<a id="${c.id}"></a>\n\n## ${c.id.slice(-2)}. ${c.title}\n${content}\n\n[Back to contents](#contents)\n`;
 pages[c.id]={label:`${c.part.toUpperCase()} · CHAPTER ${c.id.slice(-2)}`,html:render(text,c.id).replace(/src="(?:\.\.\/)?assets\//g,'src="/assets/')};
}
book+='\n\n<a id="end-material"></a>\n\n# References and included projects\n\nSee [the curriculum and projects](curriculum.md), [separate practice hints](practice/hints.md), and [separate practice solutions](practice/solutions.md). Complete runnable example source is in [the mathematical models](companion/math.mjs) and [the laboratories](companion/labs.mjs). These modules run in the included reader; the pure models can also be imported by Node.js. No account or remote API is used.\n\n';
book+=await read('glossary.md');book+='\n\n'+await read('sources.md');
await put('book.md',book);
const resources={curriculum:'curriculum.md',preface:'preface.md',coverage:'coverage.md',hints:'practice/hints.md',solutions:'practice/solutions.md',glossary:'glossary.md',sources:'sources.md',verification:'verification.md'};
for(const [id,file] of Object.entries(resources)){const text=await read(file);pages[id]={label:id==='curriculum'?'YOUR COLLEGE STUDY SEQUENCE':'REFERENCE & SUPPORT',html:render(text,file).replace(/src="(?:\.\.\/)?assets\//g,'src="/assets/')};}
await put('companion/pages.json',JSON.stringify(pages));
const html='<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+manifest.title+'</title><link rel="stylesheet" href="companion/vendor/katex/dist/katex.min.css"><link rel="stylesheet" href="companion/style.css"><style>body{max-width:1100px;margin:auto;padding:40px clamp(18px,5vw,70px)}article{max-width:none}a[id]{scroll-margin-top:20px}</style></head><body><article>'+render(book,'book.md')+'</article></body></html>';
await put('book.html',html);
const catalog={starter:false,experiments:Object.entries(definitions).map(([id,d])=>({id,title:d.title,chapter:`chapter-${String(d.chapter).padStart(2,'0')}`,description:d.description,module:'labs.mjs'}))};await put('companion/catalog.json',JSON.stringify(catalog,null,2));
manifest.chapters[9].experiments=['graph','matching','spanning','network'];await put('book.json',JSON.stringify(manifest,null,2));
await mkdir(path.join(root,'verification'),{recursive:true});
await put('verification/render-check.json',JSON.stringify({equationRenderPasses:equationCount,errors:mathErrors,renderer:'KaTeX 0.16.22',note:'Includes canonical chapters, reference pages, and assembled volume; repeated renderings counted separately.'},null,2));
if(mathErrors.length){console.error(JSON.stringify(mathErrors,null,2));process.exitCode=1;}else console.log(`Built Markdown book, HTML book, ${Object.keys(pages).length} reader pages, ${catalog.experiments.length} labs; ${equationCount} equation render passes, no errors.`);
