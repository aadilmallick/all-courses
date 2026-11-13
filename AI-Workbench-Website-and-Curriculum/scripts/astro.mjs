import { spawnSync } from 'node:child_process';
process.env.ASTRO_TELEMETRY_DISABLED='1';
const mode=process.argv[2]||'build';
const result=spawnSync(process.execPath,['node_modules/astro/bin/astro.mjs',mode,...(mode==='dev'||mode==='preview'?['--host','127.0.0.1']:[])],{stdio:'inherit',env:process.env});
process.exitCode=result.status??1;
