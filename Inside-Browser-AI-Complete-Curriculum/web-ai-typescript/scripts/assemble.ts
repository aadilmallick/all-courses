import { readdir, readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const files = (await readdir(path.join(root, 'chapters'))).filter(file => file.endsWith('.md')).sort();
const titles: string[] = [];
const chapters: string[] = [];
for (const file of files) {
  const text = await readFile(path.join(root, 'chapters', file), 'utf8');
  const title = text.split('\n')[0]!.replace(/^# \d+\. /, '');
  titles.push(title); chapters.push(text);
}
const ledger = JSON.parse(await readFile(path.join(root, 'sources.json'), 'utf8')) as { sources: { id: string; title: string; publisher: string; url: string; accessed: string; access_state: string; inspected_sections: string; version_notes: string }[] };
const sourceMD = '# Source ledger\n\nAccess date: 13 November 2026. Inspection labels describe the material actually consulted; an index is not a full-site reading claim. No model weights or full source documents are redistributed.\n\n' + ledger.sources.map(source => `## ${source.id}: ${source.title}\n\n[${source.title}](${source.url}) — ${source.publisher}. **${source.access_state}**.\n\nInspected: ${source.inspected_sections}.\n\nVersion/limits: ${source.version_notes}. Accessed ${source.accessed}.\n`).join('\n');
await writeFile(path.join(root, 'research/SOURCES.md'), sourceMD);
const manifest = {
  schema_version: 1, title: 'Inside Browser AI', subtitle: 'A first-principles TypeScript curriculum and companion textbook · Research edition 2026-11-13', audience: 'Developers with basic variables/functions; asynchronous TypeScript, model math and browser prerequisites taught locally.', status: 'complete', preface: 'preface.md', output: 'book.md',
  chapters: files.map((file, i) => ({ id: `chapter-${String(i + 1).padStart(2, '0')}`, title: titles[i], path: `chapters/${file}`, part: i < 3 ? 'Foundations and evidence' : i < 6 ? 'Browser inference and agent interfaces' : 'Dependable applications', status: 'complete', minimum_prose_words: 2500, prerequisites: i ? [`chapter-${String(i).padStart(2, '0')}`] : [], experiments: [`lab-${i + 1}`] })),
  assets: ['assets/architecture.svg','assets/evidence.svg'], source_listings: [], companion: { path: '.', catalog: 'catalog.json', run: 'npm run dev', starter: false }, provenance: 'sources.json', verification: 'verification.md'
};
await writeFile(path.join(root, 'book.json'), JSON.stringify(manifest, null, 2) + '\n');
await writeFile(path.join(root, 'catalog.json'), JSON.stringify({ starter: false, interface: 'Single TypeScript gallery; mount initializes the reader and chapter experiments, returned cleanup disposes the active view.', experiments: titles.map((title, i) => ({ id: `lab-${i + 1}`, title, chapter: `chapter-${String(i + 1).padStart(2, '0')}`, description: `Chapter ${i + 1} experiment in the integrated gallery. See CURRICULUM.md for the exact native/fixture boundary.`, module: 'src/main.ts' })) }, null, 2) + '\n');

function rewrite(text: string, directory: string): string {
  let fence = false;
  return text.split('\n').map(line => {
    if (/^```/.test(line)) { fence = !fence; return line; }
    if (fence) return line;
    return line.replace(/(!?\[[^\]]*\])\(([^\s)]+)\)/g, (original, label: string, target: string) => {
      if (/^(?:https?:|#)/.test(target)) return original;
      const [file, fragment] = target.split('#');
      const resolved = path.posix.normalize(path.posix.join(directory, file!));
      const index = files.findIndex(candidate => resolved === `chapters/${candidate}`);
      if (index >= 0) return `${label}(#chapter-${String(index + 1).padStart(2, '0')})`;
      return `${label}(${resolved}${fragment ? '#' + fragment : ''})`;
    });
  }).join('\n');
}
const preface = await readFile(path.join(root, 'preface.md'), 'utf8');
const volume = ['# Inside Browser AI\n\nA first-principles TypeScript curriculum and companion textbook\n\nResearch edition: 13 November 2026\n', '<a id="preface"></a>\n## Preface\n', preface, '<a id="contents"></a>\n## Contents\n', ...titles.map((title, i) => `- [${i + 1}. ${title}](#chapter-${String(i + 1).padStart(2, '0')})`), '- [Research and API baseline](#research-appendix)\n- [Projects](#projects-appendix)\n- [Complete TypeScript source](#source-appendix)\n'];
let lastPart = '';
for (let i = 0; i < chapters.length; i++) {
  const part = manifest.chapters[i]!.part;
  if (part !== lastPart) { volume.push(`\n# ${part}\n`); lastPart = part; }
  const id = `chapter-${String(i + 1).padStart(2, '0')}`;
  let text = rewrite(chapters[i]!, 'chapters');
  let section = 0;
  text = text.replace(/^## (.+)$/gm, (_match, title: string) => `<a id="${id}-section-${++section}"></a>\n### ${title}`);
  const headings = [...text.matchAll(/<a id="([^\"]+)"><\/a>\n### (.+)/g)];
  volume.push(`\n<a id="${id}"></a>\n## ${i + 1}. ${titles[i]}\n\n### In this chapter\n\n${headings.map(match => `- [${match[2]}](#${match[1]})`).join('\n')}\n\n${text.replace(/^# [^\n]+\n/, '')}\n\n[Back to contents](#contents)\n\n---\n`);
}
volume.push('<a id="research-appendix"></a>\n# Research and API baseline\n');
for (const file of ['RESEARCH.md', 'API-BASELINE.md', 'SOURCES.md']) volume.push(rewrite(await readFile(path.join(root, 'research', file), 'utf8'), 'research'));
volume.push('<a id="projects-appendix"></a>\n# Projects\n', rewrite(await readFile(path.join(root, 'projects/PROJECTS.md'), 'utf8'), 'projects'));
volume.push('<a id="source-appendix"></a>\n# Complete TypeScript source\n\nThese are canonical source listings from this edition. Browser modules require the included Vite environment. Complete UI, configuration, scripts and tests are also included in their linked directories.\n');
for (const directory of ['src', 'examples']) {
  for (const file of (await readdir(path.join(root, directory))).filter(file => file.endsWith('.ts')).sort()) {
    const source = await readFile(path.join(root, directory, file), 'utf8');
    volume.push(`\n## ${directory}/${file}\n\n[Included source](${directory}/${file})\n\n\`\`\`\`typescript\n${source}\n\`\`\`\`\n`);
  }
}
await writeFile(path.join(root, 'book.md'), volume.join('\n') + '\n');
await mkdir(path.join(root, 'public/assets'), { recursive: true });
for (const asset of ['architecture.svg', 'evidence.svg']) await copyFile(path.join(root, 'assets', asset), path.join(root, 'public/assets', asset));
console.log(`Assembled ${chapters.length} chapters, ${ledger.sources.length} source records, full code appendix and figures.`);
