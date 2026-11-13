// A count-based language model. It teaches training/inference separation;
// it is not a transformer or a substitute for a pretrained browser model.
const documents = [
  'local models need downloads',
  'local models keep prompts local',
  'cloud models need network',
  'browser tools expose actions'
];
const counts = new Map<string, Map<string, number>>();
for (const document of documents) {
  const words = ['<start>', ...document.split(' '), '<end>'];
  for (let i = 0; i < words.length - 1; i++) {
    const current = words[i]!;
    const next = words[i + 1]!;
    const row = counts.get(current) ?? new Map<string, number>();
    row.set(next, (row.get(next) ?? 0) + 1);
    counts.set(current, row);
  }
}
let state = 42;
function random(): number {
  state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
  return state / 2 ** 32;
}
function generate(maximumWords = 16): string {
  let current = '<start>';
  const output: string[] = [];
  for (let step = 0; step < maximumWords; step++) {
    const row = counts.get(current);
    if (!row) break;
    const total = [...row.values()].reduce((sum, n) => sum + n, 0);
    let ticket = random() * total;
    let chosen = '<end>';
    for (const [word, count] of row) {
      ticket -= count;
      if (ticket < 0) { chosen = word; break; }
    }
    if (chosen === '<end>') break;
    output.push(chosen); current = chosen;
  }
  return output.join(' ');
}
console.log('Training counts after "models":', Object.fromEntries(counts.get('models')!));
console.log('Seeded generation:', generate());
