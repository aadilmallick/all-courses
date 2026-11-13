import fs from 'node:fs';
import path from 'node:path';
import { encode } from 'gpt-tokenizer/encoding/cl100k_base';
const root = process.argv[2] || 'src/content/docs';
function walk(p){return fs.statSync(p).isDirectory()?fs.readdirSync(p).flatMap(n=>walk(path.join(p,n))): /\.mdx?$/.test(p)?[p]:[];}
for(const file of walk(root)){const raw=fs.readFileSync(file,'utf8');const body=raw.replace(/^\uFEFF?---\r?\n[\s\S]*?\r?\n---\r?\n/,'');console.log(`${encode(body).length}\t${body.trim().split(/\s+/).length}\t${file}`);}
