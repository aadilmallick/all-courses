import './style.css';
import { marked } from 'marked';
import { attention, chooseRoute, groundedPrompt, memoryBudget, passages, percentile, readNDJSON, retrieve, softmax, unknownRecord } from './core.ts';
import { capabilities, promptOnce, runChromeTask } from './chrome-ai.ts';
import type { TaskName } from './chrome-ai.ts';
import { nativeContext, registerSearch, searchNotes } from './webmcp.ts';
import type { LocalEngine } from './webllm.ts';
import { mountDeclarativeSearch } from './declarative.ts';

const chapters = import.meta.glob('../chapters/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const documents = import.meta.glob('../{research,projects}/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const sources = import.meta.glob(['./*.ts','../examples/*.ts'], { query: '?raw', import: 'default', eager: true }) as Record<string, string>;
const titles = ['Models, tokens & attention','TypeScript & streaming systems','Retrieval & embeddings','WebLLM & browser compute','Chrome built-in AI','WebMCP & agent tools','Evaluation & production','Document-assistant capstone'];
const keys = Object.keys(chapters).sort();
const app = document.querySelector<HTMLDivElement>('#app')!;
app.innerHTML = `<header><div class="topline"><span class="eyebrow">A first-principles field textbook</span><span class="badge">Research edition · 13 Nov 2026</span></div><h1>Inside Browser AI</h1><p>Understand the model. Choose the runtime. Build the application.</p><p class="small">TypeScript · WebLLM · Chrome AI · WebMCP · eight connected chapters</p></header><div class="shell"><nav aria-label="Chapters"><h2>Read & experiment</h2><div class="navitems"></div><hr><button id="research">Research & API baseline</button><button id="source">Browse TypeScript source</button><p class="small">No model or private input is downloaded or sent when you open this companion. Model labs start only when you choose their labeled controls.</p></nav><main id="main" tabindex="-1"><div class="toolbar"><button id="read">Read chapter</button><button id="lab">Open experiment</button></div><div id="content"></div></main></div><footer>Local learning companion · Synthetic data · Capabilities vary by browser, device, and policy</footer>`;
const content = document.querySelector<HTMLDivElement>('#content')!;
const nav = document.querySelector<HTMLDivElement>('.navitems')!;
let selected = 0;
let mode: 'read' | 'lab' = 'read';
let generation = 0;
let dispose: (() => void) | undefined;
function element<K extends keyof HTMLElementTagNameMap>(tag: K, text = '', parent: HTMLElement = content): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag); node.textContent = text; parent.append(node); return node;
}
function button(text: string, parent: HTMLElement, action: () => void): HTMLButtonElement {
  const node = element('button', text, parent); node.addEventListener('click', action); return node;
}
function field(text: string, value: string, parent: HTMLElement, multiline = false): HTMLInputElement | HTMLTextAreaElement {
  const label = element('label', text, parent);
  const node = multiline ? element('textarea', '', label) : element('input', '', label);
  node.value = value; return node;
}
function checkbox(text: string, parent: HTMLElement): HTMLInputElement {
  const label = element('label', '', parent); const node = element('input', '', label); node.type = 'checkbox'; label.append(document.createTextNode(text)); return node;
}
function showDocument(markdown: string): void { content.innerHTML = marked.parse(markdown, { async: false }) as string; content.firstElementChild?.classList.add('book-start'); }
function clear(): number { generation++; dispose?.(); dispose = undefined; content.replaceChildren(); return generation; }
function errorText(error: unknown): string { return error instanceof Error ? `${error.name}: ${error.message}` : String(error); }
function render(): void {
  const epoch = clear();
  [...nav.querySelectorAll('button')].forEach((node, i) => node.setAttribute('aria-current', String(i === selected)));
  if (mode === 'read') { const article = element('article'); article.innerHTML = marked.parse(chapters[keys[selected]!] ?? 'Chapter missing.', { async: false }) as string; return; }
  element('p', `CHAPTER ${String(selected + 1).padStart(2, '0')} · EXPERIMENT`, content).className = 'eyebrow';
  element('h1', titles[selected]!);
  const panel = element('section'); panel.className = 'panel';
  const controls = element('div', '', panel); controls.className = 'controls';
  const actions = element('div', '', panel); actions.className = 'toolbar';
  const status = element('p', 'Ready.', panel); status.className = 'status'; status.setAttribute('role', 'status');
  const output = element('pre', '', panel); output.className = 'result';
  let abort = new AbortController();
  let extraCleanup: (() => void) | undefined;
  const valid = () => epoch === generation;
  const report = (message: string) => { if (valid()) status.textContent = message; };
  const run = (action: () => Promise<void> | void) => { void Promise.resolve().then(action).catch(error => report(errorText(error))); };
  dispose = () => { abort.abort(); extraCleanup?.(); };

  if (selected === 0) {
    element('p', 'Compute real softmax probabilities and a two-position attention mixture. These are transparent toy calculations, not an LLM.', panel);
    const scores = field('Three logits (comma separated)', '2,1,0', controls);
    const temperature = field('Temperature (> 0)', '1', controls); temperature.setAttribute('type', 'number'); temperature.setAttribute('step', '0.1');
    const calculate = () => { output.textContent = JSON.stringify({ probabilities: softmax(scores.value.split(',').map(Number), Number(temperature.value)), attention: attention([1, 0], [[1, 0], [0, 1]], [[10, 0], [0, 10]]) }, null, 2); };
    button('Calculate', actions, () => run(calculate)); calculate();
  } else if (selected === 1) {
    element('p', 'Inspect an explicit routing decision, then stream a deterministic UTF-8 transport fixture from the included server. No model runs in this experiment.', panel);
    const local = checkbox('Local model available', controls); const consent = checkbox('Cloud transfer allowed', controls); const sensitive = checkbox('Sensitive input', controls);
    button('Choose route', actions, () => { output.textContent = chooseRoute({ localAvailable: local.checked, cloudAllowed: consent.checked, sensitive: sensitive.checked }); });
    button('Stream fixture (start course server first)', actions, () => run(async () => {
      abort.abort(); abort = new AbortController(); output.textContent = '';
      const response = await fetch('/api/fixture', { method: 'POST', signal: abort.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: 'fixture' }) });
      if (!response.ok || !response.body) throw new Error(`Transport returned HTTP ${response.status}; run npm run server and use npm run dev.`);
      for await (const item of readNDJSON(response.body)) { const event = unknownRecord(item); if (valid() && event.type === 'delta' && typeof event.text === 'string') output.textContent += event.text; }
      report('Fixture complete.');
    }));
  } else if (selected === 2) {
    element('p', 'Lexical retrieval runs immediately. Semantic ranking is a separate optional WASM embedding-model download; neither button generates an answer.', panel);
    const query = field('Question', 'Does local inference work offline after a model download?', controls, true);
    button('Retrieve public notes', actions, () => { output.textContent = JSON.stringify(retrieve(query.value, passages, 'public'), null, 2); });
    const semantic = button('Download embedding model & rank', actions, () => run(async () => {
      semantic.disabled = true; report('Loading optional MiniLM embedding model…');
      try { const { semanticRank } = await import('./embeddings.ts'); const rows = await semanticRank(query.value, passages.filter(doc => doc.tenant === 'public').map(doc => doc.text)); if (valid()) output.textContent = JSON.stringify(rows, null, 2); report('Semantic ranking complete.'); }
      finally { if (valid()) semantic.disabled = false; }
    }));
  } else if (selected === 3) {
    element('p', 'Estimate weights and KV memory, or explicitly download a real WebLLM model. Downloads may be large. Model files and licenses are external to this package.', panel);
    const count = field('Parameters (billions)', '3', controls); const context = field('Context tokens', '4096', controls);
    button('Estimate memory lower bounds', actions, () => run(() => { output.textContent = JSON.stringify(memoryBudget({ parametersBillions: Number(count.value), bits: 4, layers: 28, kvHeads: 8, headDimension: 128, contextTokens: Number(context.value), cacheBytes: 2 }), null, 2); }));
    const label = element('label', 'Model catalog (installed WebLLM version)', controls); const select = element('select', '', label);
    const text = field('Prompt', 'Explain one benefit and one limitation of browser AI.', controls, true);
    let engine: LocalEngine | undefined; let loading = false;
    extraCleanup = () => { void engine?.dispose().catch(() => {}); };
    const load = button('Download & load selected model', actions, () => run(async () => {
      if (loading || engine) throw new Error('Reset the experiment before loading another model.');
      if (!select.value) throw new Error('Catalog is still loading.');
      loading = true; load.disabled = true;
      try { const { loadLocal } = await import('./webllm.ts'); const created = await loadLocal(select.value, report); if (!valid()) { await created.dispose(); return; } engine = created; report('Model ready.'); }
      finally { loading = false; if (valid()) load.disabled = false; }
    }));
    button('Generate locally', actions, () => run(async () => { if (!engine) throw new Error('Load a model first.'); output.textContent = ''; await engine.generate(text.value, delta => { if (valid()) output.textContent += delta; }); report('Local generation finished or stopped.'); }));
    button('Interrupt generation', actions, () => engine?.stop());
    void import('./webllm.ts').then(({ modelRecords }) => { if (!valid()) return; for (const model of modelRecords) { const option = element('option', model.model_id, select); option.value = model.model_id; } const preferred = modelRecords.find(model => /Qwen2.5-0.5B-Instruct-q4f16_1-MLC/.test(model.model_id)); if (preferred) select.value = preferred.model_id; }).catch(error => report(errorText(error)));
  } else if (selected === 4) {
    element('p', 'These buttons call native Chrome AI. Missing capabilities are reported explicitly. Creating a session can download a browser-managed model.', panel);
    const text = field('Text / prompt', 'Our small support team needs a clear explanation of local model downloads.', controls, true);
    const taskLabel = element('label', 'Task API', controls); const select = element('select', '', taskLabel);
    for (const task of ['summarize', 'translate', 'detect', 'write', 'rewrite', 'proofread']) element('option', task, select).value = task;
    const source = field('Translation source language', 'en', controls); const target = field('Translation target language', 'fr', controls);
    button('Check native availability', actions, () => run(async () => { const result = await capabilities(); if (valid()) output.textContent = JSON.stringify(result, null, 2); }));
    // Call async function immediately in the event handler to retain activation.
    button('Run native Prompt API (may download)', actions, () => { abort.abort(); abort = new AbortController(); void promptOnce(text.value, abort.signal, report).then(result => { if (valid()) output.textContent = result; }).catch(error => report(errorText(error))); });
    button('Run native task (may download)', actions, () => { abort.abort(); abort = new AbortController(); void runChromeTask(select.value as TaskName, text.value, abort.signal, report, source.value, target.value).then(result => { if (valid()) output.textContent = result; }).catch(error => report(errorText(error))); });
  } else if (selected === 5) {
    element('p', 'A direct application call checks the shared search function. Native registration and browser-mediated discovery/execution are separate controls. Current experimental baseline: document.modelContext.', panel);
    const query = field('Public-note search', 'model download', controls);
    button('Call shared function directly', actions, () => run(() => { output.textContent = JSON.stringify(searchNotes({ query: query.value }), null, 2); report('Direct application function ran; native WebMCP was not used.'); }));
    let unregister: (() => void) | undefined;
    const removeForm = mountDeclarativeSearch(panel);
    extraCleanup = () => { unregister?.(); removeForm(); };
    button('Register native WebMCP tool', actions, () => run(async () => { if (unregister) throw new Error('Tool already registered by this view.'); const cleanup = await registerSearch(value => { if (valid()) output.textContent = JSON.stringify(value, null, 2); }); if (!valid()) { cleanup(); return; } unregister = cleanup; report('Native tool registered.'); }));
    button('Discover & execute native tool', actions, () => run(async () => { const context = nativeContext(); if (!context) throw new Error('Native WebMCP is absent.'); const tool = (await context.getTools()).find(tool => tool.name === 'search_course_notes'); if (!tool) throw new Error('Register the native tool first.'); const result = await context.executeTool(tool, { query: query.value }, { signal: abort.signal }); if (valid()) output.textContent = result ?? 'Tool navigated; no result string.'; report('Native browser-mediated execution completed.'); }));
  } else if (selected === 6) {
    element('p', 'Evaluate a deterministic retrieval fixture with exact source IDs and test a routing policy. This evaluates software behavior, not model truthfulness.', panel);
    button('Run evaluation cases', actions, () => {
      const cases = [{ query: 'download offline', expected: 'S1' }, { query: 'cloud keys', expected: 'S2' }, { query: 'WebMCP tools', expected: 'S3' }, { query: 'GPU memory', expected: 'S4' }];
      const times: number[] = []; const rows = cases.map(test => { const start = performance.now(); const hits = retrieve(test.query, passages, 'public'); times.push(performance.now() - start); return { ...test, top: hits[0]?.passage.id, pass: hits[0]?.passage.id === test.expected }; });
      output.textContent = JSON.stringify({ cases: rows, accuracy: rows.filter(row => row.pass).length / rows.length, p95Milliseconds: percentile(times, .95), privacyRoute: chooseRoute({ localAvailable: false, cloudAllowed: true, sensitive: true }) }, null, 2);
    });
  } else {
    element('p', 'Build an evidence bundle and optionally ask native Chrome AI to answer. The evidence view works without a model. There is no automatic cloud transfer.', panel);
    const question = field('Question', 'What must I do before using a local model offline?', controls, true);
    const evidence = () => retrieve(question.value, passages, 'public').map(hit => hit.passage);
    button('Inspect evidence & grounded prompt', actions, () => { output.textContent = groundedPrompt(question.value, evidence()); report('Prompt prepared. No model ran.'); });
    button('Answer with native Chrome (may download)', actions, () => {
      const hits = evidence(); if (!hits.length) { report('No evidence found; abstaining before generation.'); return; }
      abort.abort(); abort = new AbortController(); void promptOnce(groundedPrompt(question.value, hits), abort.signal, report).then(result => { if (valid()) output.textContent = result; }).catch(error => report(errorText(error)));
    });
    const consent = checkbox('Allow this question and evidence to be sent to the configured Gemini cloud service', controls);
    const sensitive = checkbox('Input contains sensitive information', controls);
    button('Answer with explicit cloud opt-in', actions, () => run(async () => {
      if (chooseRoute({ localAvailable: false, cloudAllowed: consent.checked, sensitive: sensitive.checked }) !== 'cloud') throw new Error('Cloud route is unavailable under your selections.');
      const hits = evidence(); if (!hits.length) throw new Error('No evidence; abstaining.');
      const response = await fetch('/api/generate', { method: 'POST', signal: abort.signal, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt: groundedPrompt(question.value, hits), cloudConsent: true }) });
      if (!response.ok) throw new Error(await response.text());
      const result = unknownRecord(await response.json()); if (valid() && typeof result.text === 'string') output.textContent = result.text;
      report('Cloud response received. Verify every cited claim against the evidence.');
    }));
  }
  button('Stop pending work', actions, () => { abort.abort(); report('Cancellation requested; already-completed work cannot be undone.'); });
  button('Reset experiment', actions, render);
}
titles.forEach((title, index) => button(`${String(index + 1).padStart(2, '0')}  ${title}`, nav, () => { selected = index; render(); }));
document.querySelector('#read')!.addEventListener('click', () => { mode = 'read'; render(); });
document.querySelector('#lab')!.addEventListener('click', () => { mode = 'lab'; render(); });
document.querySelector('#research')!.addEventListener('click', () => { clear(); for (const [path, markdown] of Object.entries(documents).sort()) { const details = element('details'); element('summary', path.split('/').at(-1), details); const article = element('article', '', details); article.innerHTML = marked.parse(markdown, { async: false }) as string; } });
document.querySelector('#source')!.addEventListener('click', () => { clear(); element('h1', 'TypeScript source'); for (const [path, source] of Object.entries(sources).sort()) { const details = element('details'); element('summary', path, details); element('pre', source, details); } });
content.addEventListener('click', event => {
  const link = (event.target as HTMLElement).closest('a'); if (!link) return;
  const href = link.getAttribute('href') ?? '';
  if (/^https?:/.test(href)) { link.target = '_blank'; link.rel = 'noopener noreferrer'; return; }
  const basename = href.split('#')[0]!.split('/').at(-1);
  const chapterIndex = keys.findIndex(key => key.endsWith(`/${basename}`));
  if (chapterIndex >= 0) { event.preventDefault(); selected = chapterIndex; mode = 'read'; render(); return; }
  const documentKey = Object.keys(documents).find(key => key.endsWith(`/${basename}`));
  if (documentKey) { event.preventDefault(); clear(); const article = element('article'); article.innerHTML = marked.parse(documents[documentKey]!, { async: false }) as string; return; }
  const sourceKey = Object.keys(sources).find(key => key.endsWith(`/${basename}`));
  if (sourceKey) { event.preventDefault(); clear(); element('h1', basename); element('pre', sources[sourceKey]!); }
});
export function mount(): () => void {
  render();
  return () => { clear(); };
}
mount();
