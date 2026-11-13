import './assemble.mjs';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const pkg=JSON.parse(readFileSync(new URL('../node_modules/astro/package.json',import.meta.url),'utf8'));
const bin=typeof pkg.bin==='string'?pkg.bin:pkg.bin.astro;
const cli=fileURLToPath(new URL('../node_modules/astro/'+bin,import.meta.url));
const result=spawnSync(process.execPath,[cli,'build'],{stdio:'inherit',env:{...process.env,ASTRO_TELEMETRY_DISABLED:'1'}});
if(result.error)throw result.error;process.exitCode=result.status??1;
