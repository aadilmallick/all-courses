function percentile(values, fraction) {
  if (!values.length) throw new Error('EMPTY_SAMPLE');
  const ordered = [...values].sort((left, right) => left - right);
  return ordered[Math.min(ordered.length - 1,
    Math.max(0, Math.ceil(fraction * ordered.length) - 1))];
}

const samples = [];
for (let attempt = 0; attempt < 40; attempt++) {
  const start = performance.now();
  await new Promise(resolve => setTimeout(resolve, 3));
  samples.push(performance.now() - start);
}
console.log({
  medianMs: percentile(samples, 0.5).toFixed(2),
  p95Ms: percentile(samples, 0.95).toFixed(2),
  sampleCount: samples.length
});
