import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { encode } from 'gpt-tokenizer/encoding/cl100k_base';
const root = path.resolve(import.meta.dirname, '..');
const errors: string[] = [];
const counts: { file: string; tokens: number; proseWords: number }[] = [];
function outsideFences(text: string): string {
  let fence = '';
  return text.split('\n').filter(line => {
    const match = line.match(/^\s*(`{3,}|~{3,})/);
    if (match) { const run = match[1]!; if (!fence) fence = run; else if (run[0] === fence[0] && run.length >= fence.length) fence = ''; return false; }
    return !fence;
  }).join('\n');
}
async function checkMarkdown(relative: string): Promise<void> {
  const text = await readFile(path.join(root, relative), 'utf8');
  const fenceLines = text.split('\n').filter(line => /^\s*`{3,}/.test(line));
  if (fenceLines.length % 2) errors.push(`Unbalanced fences: ${relative}`);
  for (const match of outsideFences(text).matchAll(/!?\[[^\]]*\]\(([^\s)]+)\)/g)) {
    const target = match[1]!;
    if (/^(?:https?:|#)/.test(target)) continue;
    const resolved = path.resolve(root, path.dirname(relative), decodeURIComponent(target.split('#')[0]!));
    if (resolved === path.join(root, 'depth-and-links.json')) continue; // This invocation creates the report.
    if (!resolved.startsWith(root + path.sep)) { errors.push(`Escaping link: ${relative}: ${target}`); continue; }
    try { if (!(await stat(resolved)).isFile()) errors.push(`Not a file: ${target}`); } catch { errors.push(`Missing link: ${relative}: ${target}`); }
  }
}
for (const file of (await readdir(path.join(root, 'chapters'))).filter(file => file.endsWith('.md')).sort()) {
  const relative = `chapters/${file}`;
  const text = await readFile(path.join(root, relative), 'utf8');
  const tokens = encode(text).length;
  const proseWords = outsideFences(text).split(/\s+/).filter(Boolean).length;
  counts.push({ file: relative, tokens, proseWords });
  if (tokens < 5000) errors.push(`Below 5000 cl100k_base tokens: ${file}: ${tokens}`);
  if (proseWords < 2500) errors.push(`Below 2500 prose words: ${file}: ${proseWords}`);
  await checkMarkdown(relative);
}
for (const file of ['README.md', 'CURRICULUM.md', 'book.md', 'preface.md', 'projects/PROJECTS.md', 'research/RESEARCH.md', 'research/API-BASELINE.md', 'research/SOURCES.md']) await checkMarkdown(file);
const book = await readFile(path.join(root, 'book.md'), 'utf8');
const anchors = [...outsideFences(book).matchAll(/<a id="([^"]+)">/g)].map(match => match[1]!);
if (new Set(anchors).size !== anchors.length) errors.push('Duplicate explicit book anchors.');
for (const match of outsideFences(book).matchAll(/\]\(#([^)]+)\)/g)) if (!anchors.includes(match[1]!)) errors.push(`Missing explicit book anchor: ${match[1]}`);
const report = { encoding: 'cl100k_base', tokenizer: 'gpt-tokenizer 4.1.2', tokenScope: 'Final chapter Markdown including its code; source appendix and assembled repetition excluded', proseScope: 'Whitespace-separated words outside fenced code; headings included', chapters: counts, totalChapterTokens: counts.reduce((sum, row) => sum + row.tokens, 0), totalProseWords: counts.reduce((sum, row) => sum + row.proseWords, 0), errors };
await writeFile(path.join(root, 'depth-and-links.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (errors.length) process.exitCode = 1;
