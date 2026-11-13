import { test } from 'node:test';
import assert from 'node:assert/strict';
import { attention, chooseRoute, cosine, groundedPrompt, memoryBudget, parseSearch, passages, percentile, readNDJSON, retrieve, softmax } from '../src/core.ts';
import { runAgent } from '../examples/agent-loop.ts';
import type { Planner } from '../examples/agent-loop.ts';

const near = (actual: number, expected: number, tolerance = 1e-10) => assert.ok(Math.abs(actual - expected) < tolerance, `${actual} != ${expected}`);
test('softmax normalizes and preserves logit shifts', () => {
  const values = softmax([2, 1, 0]);
  near(values.reduce((sum, n) => sum + n), 1);
  softmax([1002, 1001, 1000]).forEach((n, i) => near(n, values[i]!));
  assert.ok(softmax([2, 1, 0], .5)[0]! > values[0]!);
});
test('invalid numerical inputs fail explicitly', () => {
  assert.throws(() => softmax([], 1)); assert.throws(() => softmax([1], 0));
  assert.throws(() => softmax([NaN])); assert.throws(() => cosine([1], [1, 2]));
  assert.throws(() => attention([1], [], []));
});
test('cosine known values and zero-vector convention', () => {
  near(cosine([1, 0], [1, 1]), 1 / Math.sqrt(2));
  near(cosine([1, 2], [1, 2]), 1); near(cosine([1, 0], [0, 1]), 0);
  assert.equal(cosine([0, 0], [1, 2]), 0);
});
test('attention mixture uses normalized weights and matches worked arithmetic', () => {
  const result = attention([1, 0], [[1, 0], [0, 1]], [[10, 0], [0, 10]]);
  near(result.output[0]!, 6.697615493266569); near(result.output[1]!, 3.302384506733431);
  near(result.weights.reduce((sum, n) => sum + n), 1);
});
test('memory lower bounds match bytes and double with context', () => {
  const input = { parametersBillions: 3, bits: 4, layers: 28, kvHeads: 8, headDimension: 128, contextTokens: 4096, cacheBytes: 2 };
  const base = memoryBudget(input); near(base.weightsGiB, 1.5e9 / 2 ** 30); near(base.kvGiB, .4375);
  near(memoryBudget({ ...input, contextTokens: 8192 }).kvGiB, base.kvGiB * 2);
});
test('public retrieval never returns another tenant even for its unique code', () => {
  assert.equal(retrieve('SAMPLE-ONLY-742', passages, 'public').length, 0);
  assert.ok(retrieve('SAMPLE-ONLY-742', passages, 'private-demo').some(hit => hit.passage.id === 'S5'));
});
test('retrieval fixture finds expected sources and abstains on unrelated terms', () => {
  for (const [query, expected] of [['download offline', 'S1'], ['cloud keys', 'S2'], ['WebMCP tools', 'S3'], ['GPU memory', 'S4']]) {
    assert.equal(retrieve(query!, passages, 'public')[0]?.passage.id, expected);
  }
  assert.deepEqual(retrieve('zzzznomatch', passages, 'public'), []);
});
test('tool parser rejects oversized, missing, extra and invalid fields', () => {
  assert.deepEqual(parseSearch({ query: ' hello ' }), { query: 'hello' });
  for (const value of [null, [], {}, { query: '' }, { query: '   ' }, { query: 12 }, { query: 'a'.repeat(201) }, { query: 'x', tenant: 'private-demo' }]) assert.throws(() => parseSearch(value));
});
test('routing never silently transfers sensitive or unapproved input', () => {
  assert.equal(chooseRoute({ localAvailable: true, cloudAllowed: false, sensitive: true }), 'local');
  assert.equal(chooseRoute({ localAvailable: false, cloudAllowed: true, sensitive: true }), 'unavailable');
  assert.equal(chooseRoute({ localAvailable: false, cloudAllowed: false, sensitive: false }), 'unavailable');
  assert.equal(chooseRoute({ localAvailable: false, cloudAllowed: true, sensitive: false }), 'cloud');
});
test('grounding includes only the explicitly selected evidence', () => {
  const prompt = groundedPrompt('What about downloads?', [passages[0]!]);
  assert.ok(prompt.includes('S1')); assert.ok(!prompt.includes('SAMPLE-ONLY-742'));
  const bundle = JSON.parse(prompt.split('\n').at(-1)!);
  assert.equal(bundle.evidence.length, 1);
});
test('nearest-rank percentile is explicit and rejects invalid inputs', () => {
  assert.equal(percentile([400, 100, 200, 300], .95), 400);
  assert.equal(percentile([400, 100, 200, 300], .5), 200);
  assert.throws(() => percentile([], .95));
});
function splitStream(bytes: Uint8Array, boundary: number): ReadableStream<Uint8Array> {
  return new ReadableStream({ start(controller) { controller.enqueue(bytes.slice(0, boundary)); controller.enqueue(bytes.slice(boundary)); controller.close(); } });
}
test('NDJSON survives every byte split, including multibyte UTF-8 and final missing newline', async () => {
  const bytes = new TextEncoder().encode('{"text":"café ☕"}\n{"done":true}');
  for (let boundary = 0; boundary <= bytes.length; boundary++) {
    const rows = [];
    for await (const row of readNDJSON(splitStream(bytes, boundary))) rows.push(row);
    assert.deepEqual(rows, [{ text: 'café ☕' }, { done: true }]);
  }
});
test('NDJSON rejects malformed and oversized records', async () => {
  for (const [text, maximum] of [['not-json\n', 100], ['{"text":"oversized"}\n', 4], ['{}', 0], ['{}', NaN]] as const) {
    await assert.rejects(async () => { for await (const _row of readNDJSON(splitStream(new TextEncoder().encode(text), 1), maximum)) { /* consume */ } });
  }
});
test('closing the iterator cancels the underlying stream', async () => {
  let cancelled = false;
  const stream = new ReadableStream<Uint8Array>({ start(controller) { controller.enqueue(new TextEncoder().encode('{"ok":true}\n')); }, cancel() { cancelled = true; } });
  for await (const _row of readNDJSON(stream)) break;
  assert.equal(cancelled, true);
});
test('agent permits a validated read and bounded final answer', async () => {
  const planner: Planner = async history => history.some(turn => turn.role === 'tool') ? { type: 'answer', text: 'Finished.' } : { type: 'tool', name: 'search_course_notes', arguments: { query: 'model download' } };
  assert.equal(await runAgent('Find notes.', planner, new AbortController().signal), 'Finished.');
});
test('agent rejects unsupported operations and endless planning', async () => {
  await assert.rejects(runAgent('Send.', async () => ({ type: 'tool', name: 'send_email', arguments: {} }), new AbortController().signal));
  await assert.rejects(runAgent('Loop.', async () => ({ type: 'tool', name: 'search_course_notes', arguments: { query: 'model' } }), new AbortController().signal, 2), /budget/);
});
test('agent observes cancellation before planning', async () => {
  const controller = new AbortController(); controller.abort(); let called = false;
  await assert.rejects(runAgent('Stop.', async () => { called = true; return {}; }, controller.signal));
  assert.equal(called, false);
});
