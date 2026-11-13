// Symmetric per-vector int8 quantization, deliberately smaller than a real
// grouped-weight model format. No pretrained model artifacts are modified.
function quantize(values: number[]): { scale: number; packed: Int8Array; restored: number[] } {
  if (!values.length || values.some(n => !Number.isFinite(n))) throw new RangeError('Use finite values.');
  const maximum = Math.max(...values.map(Math.abs));
  const scale = maximum === 0 ? 1 : maximum / 127;
  const packed = Int8Array.from(values.map(n => Math.max(-127, Math.min(127, Math.round(n / scale)))));
  return { scale, packed, restored: [...packed].map(n => n * scale) };
}
const original = [-1, -0.1, 0, 0.5, 1];
const result = quantize(original);
console.log({ ...result, packed: [...result.packed] });
console.log('Maximum absolute error:', Math.max(...result.restored.map((n, i) => Math.abs(n - original[i]!))));
console.log('LoRA parameter illustration:', { full4096Square: 4096 ** 2, rank8Factors: 2 * 4096 * 8 });
