import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {marked} from '../reader/vendor/marked.esm.js';
const require=createRequire(import.meta.url),katex=require('../reader/vendor/katex/katex.cjs');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
let md=fs.readFileSync(path.join(root,'book.md'),'utf8'),math=[],errors=[];
md=md.replace(/\$\$([\s\S]*?)\$\$/g,(_,tex)=>{
 let value;try{value=katex.renderToString(tex.trim(),{displayMode:true,throwOnError:true,strict:'error',trust:false});}catch(e){errors.push({tex,message:e.message});value='<pre class="math-error">'+escape(tex)+'</pre>';}
 let id=math.push(value)-1;return`\n\nMATHBLOCKPLACEHOLDER${id}END\n\n`;
});
let body=marked.parse(md,{gfm:true});
body=body.replace(/<p>MATHBLOCKPLACEHOLDER(\d+)END<\/p>/g,(_,n)=>`<div class="equation">${math[Number(n)]}</div>`);
const manifest=JSON.parse(fs.readFileSync(path.join(root,'book.json'),'utf8'));
const nav=manifest.chapters.map(c=>`<a href="#${c.id}">${escape(c.title)}</a>`).join('');
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Quantitative Finance from First Principles</title><link rel="stylesheet" href="reader/vendor/katex/katex.min.css"><link rel="stylesheet" href="reader/style.css"></head><body><a class="skip" href="#textbook">Skip to textbook</a><aside><a class="brand" href="#">QUANT / FIRST PRINCIPLES</a><p>18 chapters · mathematics to research</p><a class="lab" href="companion/index.html">Open the interactive laboratory →</a><details open><summary>Chapter navigation</summary><nav>${nav}</nav></details><hr><a href="resources/catalog.html">Browse 1,321 resource links</a><a href="book.md">Markdown edition</a><a href="README.md">Setup and study guide</a></aside><main id="textbook">${body}</main></body></html>`;
fs.writeFileSync(path.join(root,'index.html'),html);
let catalog=marked.parse(fs.readFileSync(path.join(root,'resources/RESOURCE-CATALOG.md'),'utf8'));
fs.writeFileSync(path.join(root,'resources/catalog.html'),`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Quant resource library</title><link rel="stylesheet" href="../reader/style.css"></head><body class="catalog"><main><a href="../index.html">← Textbook</a>${catalog}</main></body></html>`);
fs.writeFileSync(path.join(root,'outputs/math-render-report.json'),JSON.stringify({renderer:'KaTeX 0.16.22',expressions:math.length,errors},null,2));
console.log('Reader built;',math.length,'display equations;',errors.length,'render errors');
if(errors.length)process.exitCode=1;
function escape(s){return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');}
