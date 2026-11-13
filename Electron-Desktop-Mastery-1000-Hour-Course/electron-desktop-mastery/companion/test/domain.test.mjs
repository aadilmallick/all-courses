import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createRun, transition, parsePrompt, parseDecision } from '../core/run.mjs';
import { createAttempt, consumeAttempt, permitsVerifiedLease } from '../core/auth.mjs';
import { DemoService } from '../core/service.mjs';
import { EventStore } from '../core/store.mjs';

function harness() {
  const events = [];
  const callbacks = new Map();
  let counter = 0;
  const service = new DemoService({ emit: value => events.push(value),
    id: () => 'id-' + (++counter),
    schedule: callback => { const id = ++counter; callbacks.set(id, callback); return id; },
    unschedule: id => callbacks.delete(id)
  });
  return { service, events, advance() {
    const current = [...callbacks.values()]; callbacks.clear();
    current.forEach(callback => callback());
  } };
}
test('completed runs reject subsequent execution', () => {
  let run = transition(createRun('one'), { type: 'START' });
  run = transition(run, { type: 'FINISH' });
  assert.equal(run.status, 'completed');
  assert.throws(() => transition(run, { type: 'EXECUTE' }), /INVALID_TRANSITION/);
});
test('a proposal is bound to its exact identifier', () => {
  let run = transition(createRun('one'), { type: 'START' });
  run = transition(run, { type: 'PROPOSE', proposalId: 'expected' });
  assert.throws(() => transition(run, { type: 'APPROVE', proposalId: 'other' }), /INVALID_TRANSITION/);
  assert.equal(transition(run, { type: 'APPROVE', proposalId: 'expected' }).status, 'executing');
});
test('prompt and decision decoders reject malformed requests', () => {
  for (const value of [null, {}, '', ' ', 'a'.repeat(4001)]) {
    assert.throws(() => parsePrompt(value), /INVALID_PROMPT/);
  }
  for (const value of [null, [], { runId: 'a', proposalId: 'b', approved: 'yes' }]) {
    assert.throws(() => parseDecision(value), /INVALID_DECISION/);
  }
  assert.equal(parsePrompt(' hello '), 'hello');
});
test('auth callback is one-time and yields verifier only after correlation', () => {
  const attempt = createAttempt(100);
  assert.equal(attempt.challenge.length, 43);
  const result = consumeAttempt(attempt, { state: attempt.state, code: 'code' }, 101);
  assert.equal(result.verifier, attempt.verifier);
  assert.throws(() => consumeAttempt(attempt, { state: attempt.state, code: 'code' }, 102), /STALE_ATTEMPT/);
});
test('expired and mismatched auth callbacks do not establish a session', () => {
  const attempt = createAttempt(100, 20);
  assert.throws(() => consumeAttempt(attempt, { state: 'wrong', code: 'code' }, 101), /STATE_MISMATCH/);
  assert.equal(attempt.consumed, false);
  assert.throws(() => consumeAttempt(attempt, { state: attempt.state, code: 'code' }, 120), /STALE_ATTEMPT/);
});
test('verified lease policy checks account, device, expiry and feature', () => {
  const lease = { subject: 'a', deviceId: 'd', expiresAt: 500, features: ['export'] };
  const context = { subject: 'a', deviceId: 'd', now: 200, feature: 'export' };
  assert.equal(permitsVerifiedLease(lease, context), true);
  for (const change of [{ subject: 'b' }, { deviceId: 'other' }, { now: 500 }, { feature: 'cloud' }]) {
    assert.equal(permitsVerifiedLease(lease, { ...context, ...change }), false);
  }
});
test('demo approval executes once and reaches a terminal state', () => {
  const h = harness();
  const { runId } = h.service.start('test'); h.advance();
  const proposalId = h.service.snapshot().proposalId;
  h.service.decide({ runId, proposalId, approved: true }); h.advance();
  assert.equal(h.service.snapshot().status, 'completed');
  assert.equal(h.events.filter(event => event.kind === 'tool-result').length, 1);
  assert.throws(() => h.service.decide({ runId, proposalId, approved: true }), /INVALID_TRANSITION/);
});
test('denial completes without executing a tool', () => {
  const h = harness(); const { runId } = h.service.start('test'); h.advance();
  h.service.decide({ runId, proposalId: h.service.snapshot().proposalId, approved: false });
  assert.equal(h.service.snapshot().status, 'completed');
  assert.equal(h.events.some(event => event.kind === 'tool-result'), false);
});
test('cancellation during generation prevents later proposal', () => {
  const h = harness(); const { runId } = h.service.start('test');
  h.service.cancel(runId); h.advance();
  assert.deepEqual(h.events.map(event => event.kind), ['started', 'cancelled']);
});
test('cancellation during execution suppresses simulated effect', () => {
  const h = harness(); const { runId } = h.service.start('test'); h.advance();
  h.service.decide({ runId, proposalId: h.service.snapshot().proposalId, approved: true });
  h.service.cancel(runId); h.advance();
  assert.equal(h.events.some(event => event.kind === 'tool-result'), false);
});
test('a cancelled proposal cannot be approved later', () => {
  const h = harness(); const { runId } = h.service.start('test'); h.advance();
  const proposalId = h.service.snapshot().proposalId; h.service.cancel(runId);
  assert.throws(() => h.service.decide({ runId, proposalId, approved: true }), /INVALID_TRANSITION/);
});
test('the service rejects overlapping runs and foreign cancellation', () => {
  const h = harness(); h.service.start('first');
  assert.throws(() => h.service.start('second'), /RUN_BUSY/);
  assert.throws(() => h.service.cancel('other'), /STALE_RUN/);
});
test('event snapshots serialize concurrent saves and reopen', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'atlas-test-'));
  try {
    const file = join(directory, 'events.json'); const store = new EventStore(file); await store.open();
    await Promise.all(Array.from({ length: 12 }, (_, sequence) => store.append({
      version: 1, runId: 'r', sequence, kind: 'sample', status: 'generating'
    })));
    const reopened = new EventStore(file); const events = await reopened.open();
    assert.equal(events.length, 12);
    assert.deepEqual(events.map(event => event.sequence), Array.from({ length: 12 }, (_, i) => i));
  } finally { await rm(directory, { recursive: true, force: true }); }
});
test('corrupted data fails visibly rather than silently replacing history', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'atlas-test-'));
  try {
    const file = join(directory, 'events.json'); await writeFile(file, '{broken');
    await assert.rejects(() => new EventStore(file).open());
  } finally { await rm(directory, { recursive: true, force: true }); }
});
