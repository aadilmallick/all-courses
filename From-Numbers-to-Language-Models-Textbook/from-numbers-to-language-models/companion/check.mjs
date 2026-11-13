import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.dirname(fileURLToPath(import.meta.url));
const catalog=JSON.parse(await fs.readFile(path.join(root,'catalog.json'),'utf8'));
if(catalog.starter||catalog.experiments.length!==18)throw new Error('Expected 18 authored experiments.');
const ids=new Set();
for(const entry of catalog.experiments){
 if(ids.has(entry.id))throw new Error('Duplicate experiment');ids.add(entry.id);
 const source=await fs.readFile(path.join(root,entry.module),'utf8');
 if(!/export function mount\(/.test(source))throw new Error('Missing mount: '+entry.id);
}
console.log('PASS: 18 catalog entries and local mount exports. Browser execution is checked separately.');
