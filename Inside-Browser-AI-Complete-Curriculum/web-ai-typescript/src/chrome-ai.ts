// Deliberately small, dated structural interfaces; these are not platform polyfills.
// Baseline: Chrome docs inspected 2026-11-13. See research/API-BASELINE.md.
export type Availability = 'unavailable' | 'downloadable' | 'downloading' | 'available';
interface ProgressEvent extends Event { loaded: number }
interface Monitor { addEventListener(type: 'downloadprogress', callback: (event: ProgressEvent) => void): void }
export interface CreateOptions {
  signal?: AbortSignal;
  monitor?: (monitor: Monitor) => void;
  [key: string]: unknown;
}
export interface PromptSession {
  prompt(input: string | object[], options?: { signal?: AbortSignal; responseConstraint?: object }): Promise<string>;
  promptStreaming(input: string, options?: { signal?: AbortSignal }): ReadableStream<string>;
  destroy(): void;
  contextUsage?: number;
  contextWindow?: number;
}
interface TextTask { destroy(): void }
interface SummarizerSession extends TextTask { summarize(text: string, options?: { signal?: AbortSignal }): Promise<string> }
interface TranslatorSession extends TextTask { translate(text: string, options?: { signal?: AbortSignal }): Promise<string> }
interface DetectorSession extends TextTask { detect(text: string): Promise<{ detectedLanguage: string; confidence: number }[]> }
interface WriterSession extends TextTask { write(text: string, options?: { signal?: AbortSignal }): Promise<string> }
interface RewriterSession extends TextTask { rewrite(text: string, options?: { signal?: AbortSignal }): Promise<string> }
interface ProofreaderSession extends TextTask { proofread(text: string): Promise<{ correctedInput: string; corrections: unknown[] }> }
export interface Factory<T> { availability(options?: CreateOptions): Promise<Availability>; create(options?: CreateOptions): Promise<T> }
export interface ChromeAI {
  LanguageModel?: Factory<PromptSession>;
  Summarizer?: Factory<SummarizerSession>;
  Translator?: Factory<TranslatorSession>;
  LanguageDetector?: Factory<DetectorSession>;
  Writer?: Factory<WriterSession>;
  Rewriter?: Factory<RewriterSession>;
  Proofreader?: Factory<ProofreaderSession>;
}
export function chromeAI(): ChromeAI { return globalThis as unknown as ChromeAI; }
export function downloadMonitor(report: (message: string) => void): Pick<CreateOptions, 'monitor'> {
  return { monitor: monitor => monitor.addEventListener('downloadprogress', event => report(`Downloading: ${Math.round(event.loaded * 100)}%`)) };
}

export async function promptOnce(text: string, signal: AbortSignal, report: (message: string) => void): Promise<string> {
  const factory = chromeAI().LanguageModel;
  if (!factory) throw new Error('LanguageModel is absent. Use an eligible Chrome desktop installation.');
  const options = { expectedInputs: [{ type: 'text', languages: ['en'] }], expectedOutputs: [{ type: 'text', languages: ['en'] }] };
  // Caller invokes from a button. No availability network check is awaited before create,
  // because transient user activation could expire during a delayed preflight.
  const session = await factory.create({ ...options, signal, ...downloadMonitor(report) });
  try { return await session.prompt(text, { signal }); }
  finally { session.destroy(); }
}

export type TaskName = 'summarize' | 'translate' | 'detect' | 'write' | 'rewrite' | 'proofread';
export async function runChromeTask(task: TaskName, text: string, signal: AbortSignal, report: (message: string) => void, sourceLanguage = 'en', targetLanguage = 'fr'): Promise<string> {
  const api = chromeAI();
  const base = { signal, ...downloadMonitor(report) };
  switch (task) {
    case 'summarize': {
      if (!api.Summarizer) throw new Error('Summarizer is absent.');
      const session = await api.Summarizer.create({ ...base, type: 'key-points', format: 'plain-text', length: 'short', expectedInputLanguages: ['en'], outputLanguage: 'en' });
      try { return await session.summarize(text, { signal }); } finally { session.destroy(); }
    }
    case 'translate': {
      if (!api.Translator) throw new Error('Translator is absent.');
      const session = await api.Translator.create({ ...base, sourceLanguage, targetLanguage });
      try { return await session.translate(text, { signal }); } finally { session.destroy(); }
    }
    case 'detect': {
      if (!api.LanguageDetector) throw new Error('LanguageDetector is absent.');
      const session = await api.LanguageDetector.create(base);
      try { return JSON.stringify(await session.detect(text), null, 2); } finally { session.destroy(); }
    }
    case 'write': {
      if (!api.Writer) throw new Error('Writer is absent. This remains a trial API.');
      const session = await api.Writer.create({ ...base, tone: 'neutral', format: 'plain-text', length: 'short' });
      try { return await session.write(text, { signal }); } finally { session.destroy(); }
    }
    case 'rewrite': {
      if (!api.Rewriter) throw new Error('Rewriter is absent. This remains a trial API.');
      const session = await api.Rewriter.create({ ...base, tone: 'more-formal', format: 'plain-text', length: 'shorter' });
      try { return await session.rewrite(text, { signal }); } finally { session.destroy(); }
    }
    case 'proofread': {
      if (!api.Proofreader) throw new Error('Proofreader is absent. This remains a trial API.');
      const session = await api.Proofreader.create({ ...base, expectedInputLanguages: ['en'] });
      try { return JSON.stringify(await session.proofread(text), null, 2); } finally { session.destroy(); }
    }
  }
}

export async function capabilities(): Promise<Record<string, string>> {
  const api = chromeAI();
  const result: Record<string, string> = {};
  for (const name of ['LanguageModel', 'Summarizer', 'Translator', 'LanguageDetector', 'Writer', 'Rewriter', 'Proofreader'] as const) {
    const factory = api[name];
    if (!factory) { result[name] = 'absent'; continue; }
    try {
      const options = name === 'Translator' ? { sourceLanguage: 'en', targetLanguage: 'fr' } : {};
      result[name] = await factory.availability(options);
    } catch (error) { result[name] = error instanceof Error ? `${error.name}: ${error.message}` : String(error); }
  }
  return result;
}
