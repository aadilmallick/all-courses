import {readFileSync,readdirSync,existsSync} from 'node:fs';
import assert from 'node:assert/strict';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8').replace(/^\uFEFF/,'');
const d=JSON.parse(read('public/data/course.json'));assert.equal(d.chapters.length,10);
const allIds=new Set();
for(const [i,c]of d.chapters.entries()){assert.equal(c.chapter,i+1);assert.equal(c.units.length,10);assert.equal(c.vocab.length,100);assert.equal(c.sentences.length,20);assert.equal(c.grammar.length,15);for(const v of c.vocab)for(const k of ['fr','en','example','translation','tag'])assert.ok(typeof v[k]==='string'&&v[k].trim(),`Missing ${k} in chapter ${c.chapter}`);assert.equal(new Set(c.vocab.map(v=>v.fr)).size,100);for(const g of c.grammar){assert.equal(g.options.length,4);assert.equal(new Set(g.options).size,4);assert.ok(Number.isInteger(g.answer)&&g.answer>=0&&g.answer<4);assert.ok(g.prompt&&g.explanation);}for(const s of c.sentences)assert.ok(s.fr&&s.en&&s.note);}
const report=JSON.parse(read('content-report.json'));assert.ok(report.chapters.every(c=>c.words>=5000));
for(const p of ['book.md','curriculum.md','grammar-reference.md','sources.md','README.md','dist/index.html','dist/practice/index.html','dist/speaking/index.html','dist/progress/index.html','dist/vocabulary/index.html','dist/data/course.json'])assert.ok(existsSync(new URL('../'+p,import.meta.url)),`Missing ${p}`);
for(let i=1;i<=10;i++)assert.ok(existsSync(new URL('../dist/course/'+String(i).padStart(2,'0')+'/index.html',import.meta.url)));
const book=read('book.md');for(const c of report.chapters)assert.ok(book.includes(`id="chapter-${String(c.chapter).padStart(2,'0')}"`));assert.equal((book.match(/^```/gm)||[]).length%2,0);
const source=read('src/scripts/speaking.ts');assert.ok(source.includes('processLocally=true'));assert.ok(!/fetch\(['"]https?:/.test(source));
console.log(JSON.stringify({passed:true,chapters:10,units:100,hours:1000,vocab:1000,sentencePairs:200,grammarItems:150,derivedPracticePrompts:2750,speakingModelPhrases:200,words:report.whitespaceWords,limits:'Static/content checks. Browser, audio, and AI need separate runtime evidence.'},null,2));
