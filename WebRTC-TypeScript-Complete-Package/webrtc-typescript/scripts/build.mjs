import { readFile, writeFile, mkdir, readdir, copyFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = fileURLToPath(new URL('../', import.meta.url));
const out = path.join(root, 'companion/dist');
await mkdir(out, { recursive: true });
for (const name of await readdir(path.join(root, 'companion/src'))) {
  if (!name.endsWith('.ts')) continue;
  const source = await readFile(path.join(root, 'companion/src', name), 'utf8');
  const js = stripTypeScriptTypes(source, { mode: 'strip', sourceUrl: name });
  await writeFile(path.join(out, name.replace(/\.ts$/, '.js')), js);
}
for (const name of await readdir(path.join(root, 'companion/public'))) {
  await copyFile(path.join(root, 'companion/public', name), path.join(out, name));
}
console.log('Built browser JavaScript from canonical TypeScript. No type checking performed.');
