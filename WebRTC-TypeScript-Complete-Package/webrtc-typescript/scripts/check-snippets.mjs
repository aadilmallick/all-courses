import { readFileSync, readdirSync } from 'node:fs';
import { stripTypeScriptTypes } from 'node:module';
import { spawnSync } from 'node:child_process';
const root = new URL('../', import.meta.url);
let count = 0;
for (const name of readdirSync(new URL('chapters/', root))) {
  const text = readFileSync(new URL('chapters/' + name, root), 'utf8');
  for (const match of text.matchAll(/```(ts|js)\n([\s\S]*?)\n```/g)) {
    const raw = /^\s*(?:import|export)\s/m.test(match[2]) ? match[2] : `async function snippetContext() {\n${match[2]}\n}`;
    const code = match[1] === 'ts' ? stripTypeScriptTypes(raw, { mode:'strip' }) : raw;
    const result = spawnSync(process.execPath, ['--input-type=module','--check'], {input:code,encoding:'utf8'});
    if(result.status!==0) throw new Error(`${name}: ${result.stderr}`);
    count++;
  }
}
console.log(`${count} TypeScript/JavaScript chapter snippets passed syntax parsing; fragments not executed or type-checked.`);
