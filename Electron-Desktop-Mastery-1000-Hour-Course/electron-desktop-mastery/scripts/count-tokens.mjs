import ranks from './tokenizer/cl100k_base.mjs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = join(dirname(fileURLToPath(import.meta.url)), '..');
import { readFileSync, readdirSync } from 'node:fs';
const encoder = new TextEncoder();
const map = new Map(ranks.map((value, rank) => [Buffer.from(typeof value === 'string' ? encoder.encode(value) : value).toString('base64'), rank]));
const pattern = /'(?:[sSſdDmMtT]|[lL][lL]|[vV][eE]|[rR][eE])|[^\r\n\p{L}\p{N}]?\p{L}+|\p{N}{1,3}| ?[^\p{White_Space}\p{L}\p{N}]+[\r\n]*|\p{White_Space}+$|\p{White_Space}*[\r\n]|\p{White_Space}+(?!\P{White_Space})|\p{White_Space}/gu;
const serialized = ranks.map((value, rank) => Buffer.from(typeof value === 'string' ? encoder.encode(value) : value).toString('base64') + ' ' + rank + '\n').join('');
const vocabularySha256 = createHash('sha256').update(serialized).digest('hex');
if (vocabularySha256 !== '223921b76ee99bde995b7ff738513eef100fb51d18c93597a113bcffe865b2a7') throw new Error('VOCABULARY_HASH_MISMATCH');
const cache = new Map();
function piece(text) {
 if(cache.has(text)) return cache.get(text);
 const bytes = Buffer.from(encoder.encode(text));
 const direct=map.get(bytes.toString('base64'));
 if(direct!==undefined) { const result=[direct];cache.set(text,result);return result; }
 const parts=Array.from(bytes,byte=>Buffer.from([byte]));
 while(parts.length>1){
  let best=Infinity,position=-1;
  for(let i=0;i<parts.length-1;i++){
   const rank=map.get(Buffer.concat([parts[i],parts[i+1]]).toString('base64'));
   if(rank!==undefined && rank<best){best=rank;position=i;}
  }
  if(position<0)break;
  parts.splice(position,2,Buffer.concat([parts[position],parts[position+1]]));
 }
 const result=parts.map(p=>{const rank=map.get(p.toString('base64'));if(rank===undefined)throw new Error('MISSING_BYTE');return rank;});
 cache.set(text,result);return result;
}
function encode(text){return Array.from(text.matchAll(pattern)).flatMap(match=>piece(match[0]));}
const fixtures=[['hello world',[15339,1917]],['2 + 2 = 4',[17,489,220,17,284,220,19]]];
for(const [input,expected]of fixtures){if(JSON.stringify(encode(input))!==JSON.stringify(expected))throw new Error('FIXTURE_FAILURE');}
const results={encoding:'cl100k_base',implementation:'standalone byte-pair counter; official split pattern adapted to JavaScript; ordinary-text encoding',vocabularyGitBlob:'d07f956f41dbd74e4bbbdbffd95dbc91265ddfdc',fixtures:fixtures.length,vocabularySha256,unicodeVersion:process.versions.unicode,lessons:[]};
for(const file of readdirSync(join(root, 'lessons')).sort()){
 const data=readFileSync(join(root, 'lessons', file),'utf8');
 results.lessons.push({file,words:data.split(/\s+/).filter(Boolean).length,tokens:encode(data).length});
}
console.log(JSON.stringify(results,null,2));
