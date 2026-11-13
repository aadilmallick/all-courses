import test from 'node:test';
import assert from 'node:assert/strict';
import { applySyncPage, providerKey, type LedgerState, type ProviderRow, type SyncPage } from './reconcile.ts';

const empty: LedgerState = { rows: new Map(), annotations: new Map(), cursor: 'c0' };
const pending: ProviderRow = { id: 'pending-1', connectionId: 'bank-1', amountMinor: -10000, pending: true, merchant: 'Demo Restaurant' };
function page(overrides: Partial<SyncPage> = {}): SyncPage {
  return { connectionId: 'bank-1', fromCursor: 'c0', nextCursor: 'c1', added: [], modified: [], removedIds: [], ...overrides };
}
test('stable provider IDs make duplicate additions idempotent within a window', () => {
  const result = applySyncPage(empty, page({ added: [pending, pending] }));
  assert.equal(result.rows.size, 1);
  assert.equal(result.cursor, 'c1');
  assert.equal(empty.rows.size, 0);
});
test('pending removal plus posted addition preserves annotation and avoids double counting', () => {
  const state: LedgerState = { rows: new Map([[providerKey('bank-1', pending.id), pending]]),
    annotations: new Map([[providerKey('bank-1', pending.id), { categoryId: 'dining', note: 'Dinner' }]]), cursor: 'c0' };
  const posted: ProviderRow = { ...pending, id: 'posted-1', pending: false, amountMinor: -12000, replacesPendingId: pending.id };
  const result = applySyncPage(state, page({ added: [posted], removedIds: [pending.id] }));
  assert.equal(result.rows.size, 1);
  assert.equal(result.rows.get(providerKey('bank-1', 'posted-1'))?.amountMinor, -12000);
  assert.equal(result.annotations.get(providerKey('bank-1', 'posted-1'))?.note, 'Dinner');
});
test('a posted annotation takes precedence over inherited pending annotation', () => {
  const posted = { ...pending, id: 'posted-1', pending: false, replacesPendingId: pending.id };
  const state: LedgerState = { rows: new Map(), cursor: 'c0', annotations: new Map([
    [providerKey('bank-1', pending.id), { categoryId: 'old' }],
    [providerKey('bank-1', posted.id), { categoryId: 'chosen' }],
  ]) };
  assert.equal(applySyncPage(state, page({ added: [posted] })).annotations.get(providerKey('bank-1', posted.id))?.categoryId, 'chosen');
});
test('modifications replace facts and removals clear only the scoped connection', () => {
  const other = { ...pending, connectionId: 'bank-2' };
  const state: LedgerState = { rows: new Map([[providerKey('bank-1', pending.id), pending],
    [providerKey('bank-2', other.id), other]]), annotations: new Map(), cursor: 'c0' };
  const updated = applySyncPage(state, page({ modified: [{ ...pending, amountMinor: -11000 }] }));
  assert.equal(updated.rows.get(providerKey('bank-1', pending.id))?.amountMinor, -11000);
  const removed = applySyncPage(updated, page({ fromCursor: 'c1', nextCursor: 'c2', removedIds: [pending.id] }));
  assert.equal(removed.rows.size, 1);
  assert.ok(removed.rows.has(providerKey('bank-2', pending.id)));
});
test('stale cursor and cross-connection writes fail without mutating source state', () => {
  assert.throws(() => applySyncPage(empty, page({ fromCursor: 'wrong' })));
  assert.throws(() => applySyncPage(empty, page({ added: [{ ...pending, connectionId: 'bank-2' }] })));
  assert.equal(empty.cursor, 'c0');
  assert.equal(empty.rows.size, 0);
});
test('ambiguous string delimiters cannot collide in provider keys', () => {
  assert.notEqual(providerKey('a:b', 'c'), providerKey('a', 'b:c'));
});
