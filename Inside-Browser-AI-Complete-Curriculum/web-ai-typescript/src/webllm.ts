import { CreateWebWorkerMLCEngine, prebuiltAppConfig } from '@mlc-ai/web-llm';
import type { WebWorkerMLCEngine } from '@mlc-ai/web-llm';

export const modelRecords = prebuiltAppConfig.model_list;
export interface LocalEngine { generate(text: string, onDelta: (text: string) => void): Promise<void>; stop(): void; dispose(): Promise<void> }
export async function loadLocal(modelId: string, report: (text: string) => void): Promise<LocalEngine> {
  if (!('gpu' in navigator)) throw new Error('WebGPU is absent; no alternate backend was selected.');
  if (!modelRecords.some(model => model.model_id === modelId)) throw new Error('Choose an ID from this installed package catalog.');
  const worker = new Worker(new URL('./webllm-worker.ts', import.meta.url), { type: 'module' });
  let engine: WebWorkerMLCEngine;
  try { engine = await CreateWebWorkerMLCEngine(worker, modelId, { initProgressCallback: progress => report(progress.text) }); }
  catch (error) { worker.terminate(); throw error; }
  let busy = false;
  let disposed = false;
  return {
    async generate(text, onDelta) {
      if (disposed || busy) throw new Error('The engine is unavailable or already generating.');
      busy = true;
      try {
        const chunks = await engine.chat.completions.create({ messages: [{ role: 'user', content: text }], stream: true, max_tokens: 256, temperature: 0.2 });
        for await (const chunk of chunks) { if (disposed) break; onDelta(chunk.choices[0]?.delta.content ?? ''); }
      } finally { busy = false; }
    },
    stop() { engine.interruptGenerate(); },
    async dispose() {
      if (disposed) return;
      disposed = true;
      engine.interruptGenerate();
      // Termination is the final ownership boundary, even if unload rejects.
      try { await engine.unload(); } finally { worker.terminate(); }
    }
  };
}
