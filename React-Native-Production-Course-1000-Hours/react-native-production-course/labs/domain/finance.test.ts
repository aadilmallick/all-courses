import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMoney, addMoney, validDateOnly, addMonthsClamped, spendingMinor,
  budgetRemaining, detectMonthly, premiumAllowed, type LedgerRow, type RecurringObservation } from './finance.ts';

test('decimal money parsing uses integer minor units', () => {
  assert.deepEqual(parseMoney('42.35', 'USD'), { minor: 4235, currency: 'USD' });
  assert.equal(parseMoney(' -12.5 ', 'USD').minor, -1250);
  assert.equal(parseMoney('-0.00', 'USD').minor, 0);
});
test('currency exponent is explicit', () => {
  assert.equal(parseMoney('42', 'JPY').minor, 42);
  assert.equal(parseMoney('1.234', 'KWD').minor, 1234);
  assert.throws(() => parseMoney('42.01', 'JPY'));
});
test('rejects malformed and overprecise amounts', () => {
  for (const value of ['', '12.', '1,200.00', 'NaN', '1e3', '1.234', '+1', '--1']) {
    assert.throws(() => parseMoney(value, 'USD'), value);
  }
});
test('safe-integer boundary is exact', () => {
  assert.equal(parseMoney('90071992547409.91', 'USD').minor, Number.MAX_SAFE_INTEGER);
  assert.throws(() => parseMoney('90071992547409.92', 'USD'));
});
test('money addition rejects currency mixing and overflow', () => {
  assert.equal(addMoney(parseMoney('0.10', 'USD'), parseMoney('0.20', 'USD')).minor, 30);
  assert.throws(() => addMoney(parseMoney('1', 'USD'), parseMoney('1', 'CAD')));
  assert.throws(() => addMoney({ minor: Number.MAX_SAFE_INTEGER, currency: 'USD' }, { minor: 1, currency: 'USD' }));
});
test('dates reject impossible values and accept leap years', () => {
  assert.equal(validDateOnly('2024-02-29'), true);
  assert.equal(validDateOnly('2026-02-29'), false);
  assert.equal(validDateOnly('2026-13-01'), false);
  assert.equal(validDateOnly('2026-2-01'), false);
});
test('month addition clamps without assuming thirty days', () => {
  assert.equal(addMonthsClamped('2024-01-31', 1), '2024-02-29');
  assert.equal(addMonthsClamped('2026-01-31', 1), '2026-02-28');
  assert.equal(addMonthsClamped('2026-12-31', 1), '2027-01-31');
  assert.equal(addMonthsClamped('2026-01-15', -1), '2025-12-15');
  assert.throws(() => addMonthsClamped('2026-02-30', 1));
});

const period = { currency: 'USD' as const, categoryId: 'food', from: '2026-10-01', until: '2026-11-01' };
function row(id: string, amountMinor: number, overrides: Partial<LedgerRow> = {}): LedgerRow {
  return { id, amountMinor, currency: 'USD', postedOn: '2026-10-05', pending: false, categoryId: 'food', ...overrides };
}
test('posted expenses net refunds under the documented cash-activity policy', () => {
  assert.equal(spendingMinor([row('a', -1000), row('b', 300)], period), 700);
});
test('pending, transfers, exclusions, other categories and currencies are excluded', () => {
  const rows = [row('a', -1000), row('b', -900, { pending: true }), row('c', -900, { transfer: true }),
    row('d', -900, { excluded: true }), row('e', -900, { currency: 'CAD' }), row('f', -900, { categoryId: 'rent' })];
  assert.equal(spendingMinor(rows, period), 1000);
});
test('budget period is half-open and dates are validated', () => {
  assert.equal(spendingMinor([row('a', -100, { postedOn: '2026-10-01' }),
    row('b', -200, { postedOn: '2026-11-01' })], period), 100);
  assert.throws(() => spendingMinor([row('a', -100, { postedOn: '2026-02-30' })], period));
  assert.throws(() => spendingMinor([], { ...period, until: period.from }));
});
test('budget overage remains negative', () => {
  assert.equal(budgetRemaining(1000, 1250), -250);
  assert.throws(() => budgetRemaining(-1, 0));
});
test('spending overflow fails rather than losing precision', () => {
  assert.throws(() => spendingMinor([row('a', -Number.MAX_SAFE_INTEGER), row('b', -1)], period));
});
const observations: RecurringObservation[] = ['2026-08-15', '2026-09-15', '2026-10-15'].map((postedOn, index) => ({
  id: `subscription-${index}`, merchant: 'Demo Cloud', currency: 'USD', amountMinor: -1200, postedOn,
}));
test('monthly detection returns evidence and a candidate, not a confirmed subscription', () => {
  const candidate = detectMonthly(observations);
  assert.equal(candidate?.confidence, 'candidate');
  assert.equal(candidate?.estimatedNextDate, '2026-11-15');
  assert.equal(candidate?.evidenceIds.length, 3);
});
test('recurrence rejects too little evidence, irregular timing, and variable amounts', () => {
  assert.equal(detectMonthly(observations.slice(0, 2)), null);
  assert.equal(detectMonthly([observations[0], observations[1], { ...observations[2], postedOn: '2026-12-15' }]), null);
  assert.equal(detectMonthly([observations[0], observations[1], { ...observations[2], amountMinor: -3000 }]), null);
});
test('recurrence enforces grouping and unique source identity', () => {
  assert.throws(() => detectMonthly([observations[0], observations[1], { ...observations[2], currency: 'CAD' }]));
  assert.throws(() => detectMonthly([observations[0], observations[1], observations[0]]));
});
test('entitlement expires at the exact boundary and rejects revoked access', () => {
  const entitlement = { status: 'active' as const, expiresAt: '2026-11-14T00:00:00Z', verifiedAt: '2026-11-12T00:00:00Z' };
  assert.equal(premiumAllowed(entitlement, '2026-11-13T00:00:00Z'), true);
  assert.equal(premiumAllowed(entitlement, entitlement.expiresAt), false);
  assert.equal(premiumAllowed({ ...entitlement, status: 'revoked' }, '2026-11-13T00:00:00Z'), false);
  assert.equal(premiumAllowed(null, '2026-11-13T00:00:00Z'), false);
});
test('invalid entitlement dates and future verification are rejected', () => {
  assert.equal(premiumAllowed({ status: 'active', expiresAt: 'invalid', verifiedAt: '2026-11-12T00:00:00Z' }, '2026-11-13T00:00:00Z'), false);
  assert.equal(premiumAllowed({ status: 'active', expiresAt: '2026-11-15T00:00:00Z', verifiedAt: '2026-11-14T00:00:00Z' }, '2026-11-13T00:00:00Z'), false);
});
