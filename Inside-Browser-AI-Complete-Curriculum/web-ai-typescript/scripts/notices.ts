import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = path.resolve(import.meta.dirname, '..');
const lock = JSON.parse(await readFile(path.join(root, 'package-lock.json'), 'utf8')) as { packages: Record<string, { version?: string; license?: string }> };
const notices = ['# Third-party dependency notices\n\nThe course prose, synthetic data and diagrams are independently authored. Runtime libraries and build tools retain their own licenses. External model weights and papers are not redistributed. The following license/notice texts were collected from installed package roots for this locked edition. Development-only packages are included for provenance; this list does not imply every package is shipped as executable browser code.\n'];
let files = 0;
for (const [relative, metadata] of Object.entries(lock.packages).sort()) {
  if (!relative.startsWith('node_modules/')) continue;
  const directory = path.join(root, relative);
  let names: string[];
  try { names = (await readdir(directory)).filter(file => /^(?:licen[cs]e|copying|notice)(?:\..*)?$/i.test(file)); } catch { continue; }
  notices.push(`\n## ${relative.replace(/^node_modules\//, '')} ${metadata.version ?? ''}\n\nDeclared license: ${metadata.license ?? 'See package notice'}.\n`);
  for (const name of names) {
    try { const text = await readFile(path.join(directory, name), 'utf8'); notices.push(`\n### ${name}\n\n~~~~text\n${text}\n~~~~\n`); files++; } catch { /* Some license entries can be directories. */ }
  }
}
await writeFile(path.join(root, 'THIRD-PARTY-NOTICES.md'), notices.join('\n'));
console.log(`Preserved ${files} license/notice texts from locked dependencies.`);
