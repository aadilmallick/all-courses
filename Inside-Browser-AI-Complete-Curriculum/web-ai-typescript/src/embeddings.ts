import { pipeline } from '@huggingface/transformers';
import { cosine } from './core.ts';

// Optional download, started only by the companion's labeled button.
// This model card and tokenizer define the embedding contract; do not mix spaces.
export async function semanticRank(query: string, documents: string[]): Promise<{ text: string; score: number }[]> {
  const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', { device: 'wasm', dtype: 'q8' });
  try {
    const tensor = await extractor([query, ...documents], { pooling: 'mean', normalize: true });
    const rows = tensor.tolist() as number[][];
    const queryVector = rows[0];
    if (!queryVector || rows.length !== documents.length + 1) throw new Error('Unexpected embedding shape.');
    return documents.map((text, i) => ({ text, score: cosine(queryVector, rows[i + 1]!) })).sort((a, b) => b.score - a.score);
  } finally { await extractor.dispose(); }
}
