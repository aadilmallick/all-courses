import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {loadTools,loadDoc} from './catalog.mjs';
const dir=path.resolve('.qa/examples');fs.mkdirSync(dir,{recursive:true});
const syntax=[],runtime=[];
function blocks(file){return [...loadDoc(file).body.matchAll(/^```([^\n]*)\r?\n([\s\S]*?)^```\s*$/gm)].map((m,i)=>({lang:m[1].trim(),code:m[2],index:i+1}));}
for(const tool of loadTools()){
 const file=`src/content/docs/${tool.category}/${tool.slug}.md`;
 for(const b of blocks(file)){
  if(/^(js|javascript)$/.test(b.lang)){
   const target=path.join(dir,`${tool.category}-${tool.slug}-${b.index}.mjs`);fs.writeFileSync(target,b.code);
   const result=spawnSync(process.execPath,['--check',target],{encoding:'utf8'});
   syntax.push({file,block:b.index,kind:'JavaScript syntax only',passed:result.status===0,detail:result.status===0?undefined:result.stderr.trim()});
  }
 }
}
const select=(file,needle)=>{const result=blocks(file).find(b=>b.code.includes(needle));if(!result)throw new Error(`Example not found ${needle}`);return result.code;};
const root='src/content/docs/factories/';
fs.writeFileSync(path.join(dir,'notes.mjs'),select(root+'codex.md','export function renderNotes'));
fs.writeFileSync(path.join(dir,'notes.test.mjs'),select(root+'codex.md',"import test from 'node:test'"));
fs.writeFileSync(path.join(dir,'gate.mjs'),select(root+'factory.md','export function validateRelease'));
fs.writeFileSync(path.join(dir,'readiness.mjs'),select(root+'openhands.md','export function inspectIssue'));
fs.writeFileSync(path.join(dir,'issues.json'),select(root+'openhands.md','"DOC-12"'));
fs.writeFileSync(path.join(dir,'board.mjs'),select(root+'paradev.md','const tasks = ['));
fs.writeFileSync(path.join(dir,'release.json'),JSON.stringify({version:'1.4.0',changes:[{id:'RD-21',title:'Save searches',kind:'feature'}]}));
fs.writeFileSync(path.join(dir,'invalid.json'),JSON.stringify({version:'1.4.0',changes:[{id:'RD-21',title:'A',kind:'fix'},{id:'RD-21',title:'B',kind:'fix'}]}));
for(const [label,args,exit,expected]of [
 ['Codex baseline tests',['--test','notes.test.mjs'],0,'pass 2'],
 ['Factory valid release',['gate.mjs','release.json'],0,'"valid": true'],
 ['Factory duplicate release',['gate.mjs','invalid.json'],1,'duplicates RD-21'],
 ['OpenHands issue readiness',['readiness.mjs','issues.json'],0,'"ready": true'],
 ['Paradev dependency dispatch',['board.mjs'],0,'INTEGRATE']
]){const r=spawnSync(process.execPath,args,{cwd:dir,encoding:'utf8'});runtime.push({label,passed:r.status===exit&&r.stdout.includes(expected),exit:r.status,stdout:r.stdout.trim(),stderr:r.stderr.trim()});}
const report={checked:'2026-11-13',javascriptSyntax:syntax,executedOffline:runtime,limits:['Syntax checks do not validate imported SDK availability or vendor runtime behavior.','Only the explicitly listed local examples and agent-reported checks were executed.','Python and all account-backed service examples were not executed.']};
fs.writeFileSync('research/offline-checks.json',JSON.stringify(report,null,2)+'\n');
const failures=[...syntax,...runtime].filter(t=>!t.passed);console.log(JSON.stringify({syntaxBlocks:syntax.length,runtimeCases:runtime.length,failures},null,2));if(failures.length)process.exitCode=1;
