import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'yaml';
export const categories={
 factories:{title:'Software factories & agent boards',folder:'01-software-factories',intro:'Learn the loop from a bounded task to a reviewed change, then coordinate multiple tasks through milestones and workspaces. Start with Codex or Claude Code; add a board or orchestrator when the work actually needs it.'},
 sandboxes:{title:'Agent sandboxes & remote sessions',folder:'02-agent-sandboxes',intro:'Understand where agents execute, which state survives, and how to export evidence before cleanup. Distinguish programmatic execution infrastructure from remote developer workspaces.'},
 voice:{title:'Voice agent tooling',folder:'03-voice-agents',intro:'Understand conversation turns, audio transport, model decisions, tools, and telephony. Compare managed platforms with custom frameworks using the same synthetic conversation scenarios.'},
 video:{title:'Video generation & avatars',folder:'04-video-and-avatars',intro:'Learn to turn an approved brief into coherent footage, a scripted presenter, or an interactive audiovisual experience. Check model and API lifecycle before following older examples.'}
};
export function loadTools(){return fs.readdirSync('research').filter(f=>f.endsWith('.json')&&!f.startsWith('verification')).flatMap(f=>{const d=JSON.parse(fs.readFileSync(path.join('research',f),'utf8').replace(/^\uFEFF/,''));return Array.isArray(d)?d:(d.tools||[]);}).filter(t=>t.slug&&categories[t.category]).sort((a,b)=>{const file=t=>path.join('src/content/docs',t.category,t.slug+'.md');const order=t=>{try{return parse(fs.readFileSync(file(t),'utf8').replace(/^\uFEFF/,'').split(/^---\s*$/m)[1]).sidebar?.order??99;}catch{return 99;}};return Object.keys(categories).indexOf(a.category)-Object.keys(categories).indexOf(b.category)||order(a)-order(b);});}
export function loadDoc(file){const raw=fs.readFileSync(file,'utf8').replace(/^\uFEFF/,'');const match=raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n/);if(!match)throw new Error(`Missing frontmatter: ${file}`);return {meta:parse(match[1]),body:raw.slice(match[0].length),raw};}
