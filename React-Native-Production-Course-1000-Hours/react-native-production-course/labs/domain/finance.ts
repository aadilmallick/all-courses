export const currencyExponents = { USD: 2, CAD: 2, JPY: 0, KWD: 3 } as const;
export type Currency = keyof typeof currencyExponents;
export type Money = Readonly<{ minor: number; currency: Currency }>;

function safe(value: bigint): number {
  if (value > BigInt(Number.MAX_SAFE_INTEGER) || value < BigInt(Number.MIN_SAFE_INTEGER)) {
    throw new Error('Money exceeds the supported safe-integer range');
  }
  return Number(value);
}

export function assertMinor(value: number): void {
  if (!Number.isSafeInteger(value)) throw new Error('Expected safe integer minor units');
}

/** A deliberately nonlocalized input format: optional minus, digits, optional fraction. */
export function parseMoney(text: string, currency: Currency): Money {
  if (!(currency in currencyExponents)) throw new Error('Unsupported currency');
  const normalized = text.trim();
  if (normalized.length > 120) throw new Error('Amount input is too long');
  const match = /^(-?)(\d+)(?:\.(\d+))?$/.exec(normalized);
  if (!match) throw new Error('Invalid decimal amount');
  const exponent = currencyExponents[currency];
  const fraction = match[3] ?? '';
  if (fraction.length > exponent) throw new Error('Too many fractional digits');
  const units = 10n ** BigInt(exponent);
  const magnitude = BigInt(match[2]) * units + BigInt(fraction.padEnd(exponent, '0') || '0');
  return { minor: safe(match[1] ? -magnitude : magnitude), currency };
}

export function addMoney(left: Money, right: Money): Money {
  if (left.currency !== right.currency) throw new Error('Cannot add different currencies');
  assertMinor(left.minor); assertMinor(right.minor);
  return { currency: left.currency, minor: safe(BigInt(left.minor) + BigInt(right.minor)) };
}

export function validDateOnly(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  if (year < 1000 || year > 9999 || month < 1 || month > 12 || day < 1 || day > 31) return false;
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

export function addMonthsClamped(dateOnly: string, months: number): string {
  if (!validDateOnly(dateOnly) || !Number.isSafeInteger(months)) throw new Error('Invalid calendar input');
  const [year, month, day] = dateOnly.split('-').map(Number);
  const index = year * 12 + month - 1 + months;
  const nextYear = Math.floor(index / 12);
  const nextMonth = index - nextYear * 12;
  if (nextYear < 1000 || nextYear > 9999) throw new Error('Calendar result out of range');
  const lastDay = new Date(Date.UTC(nextYear, nextMonth + 1, 0)).getUTCDate();
  return `${String(nextYear).padStart(4, '0')}-${String(nextMonth + 1).padStart(2, '0')}-${String(Math.min(day, lastDay)).padStart(2, '0')}`;
}

export type LedgerRow = Readonly<{
  id: string; amountMinor: number; currency: Currency; postedOn: string;
  pending: boolean; categoryId: string; excluded?: boolean; transfer?: boolean;
}>;

/** Cash-activity policy: refunds reduce category spending in the selected period. */
export function spendingMinor(rows: readonly LedgerRow[], input: {
  currency: Currency; categoryId: string; from: string; until: string;
}): number {
  if (!validDateOnly(input.from) || !validDateOnly(input.until) || input.until <= input.from) {
    throw new Error('Invalid half-open budget period');
  }
  let net = 0n;
  for (const row of rows) {
    if (!validDateOnly(row.postedOn)) throw new Error('Invalid transaction date');
    assertMinor(row.amountMinor);
    if (row.currency !== input.currency || row.categoryId !== input.categoryId ||
        row.pending || row.excluded || row.transfer || row.postedOn < input.from || row.postedOn >= input.until) continue;
    net += BigInt(row.amountMinor);
  }
  return safe(net < 0n ? -net : 0n);
}

export function budgetRemaining(limitMinor: number, spentMinor: number): number {
  assertMinor(limitMinor); assertMinor(spentMinor);
  if (limitMinor < 0 || spentMinor < 0) throw new Error('Budget inputs must be non-negative');
  return safe(BigInt(limitMinor) - BigInt(spentMinor));
}

export type RecurringObservation = Readonly<{
  id: string; merchant: string; currency: Currency; amountMinor: number; postedOn: string;
}>;
export type RecurringCandidate = Readonly<{
  merchant: string; currency: Currency; evidenceIds: readonly string[];
  cadence: 'monthly'; confidence: 'candidate'; estimatedNextDate: string;
  reason: string;
}>;

/** Transparent educational heuristic; not proof of an active merchant agreement. */
export function detectMonthly(observations: readonly RecurringObservation[]): RecurringCandidate | null {
  if (observations.length < 3) return null;
  const normalize = (value: string) => value.trim().toLowerCase().replace(/\s+/g, ' ');
  const first = observations[0];
  if (!normalize(first.merchant)) throw new Error('Merchant required');
  const ids = new Set<string>();
  for (const row of observations) {
    assertMinor(row.amountMinor);
    if (!validDateOnly(row.postedOn)) throw new Error('Invalid observation date');
    if (ids.has(row.id)) throw new Error('Duplicate observation identity');
    ids.add(row.id);
    if (normalize(row.merchant) !== normalize(first.merchant) || row.currency !== first.currency) {
      throw new Error('Group observations by merchant and currency first');
    }
    if (row.amountMinor >= 0) return null;
  }
  const sorted = [...observations].sort((a, b) => a.postedOn.localeCompare(b.postedOn));
  const gaps = sorted.slice(1).map((row, index) =>
    (Date.parse(`${row.postedOn}T00:00:00Z`) - Date.parse(`${sorted[index].postedOn}T00:00:00Z`)) / 86_400_000);
  const values = sorted.map(row => -row.amountMinor);
  const max = Math.max(...values), min = Math.min(...values);
  if (!gaps.every(gap => gap >= 25 && gap <= 35) || (max - min) / max > 0.15) return null;
  return {
    merchant: first.merchant.trim(), currency: first.currency,
    evidenceIds: sorted.map(row => row.id), cadence: 'monthly', confidence: 'candidate',
    estimatedNextDate: addMonthsClamped(sorted.at(-1)!.postedOn, 1),
    reason: 'At least three similar posted expenses, 25–35 days apart; user confirmation required.',
  };
}

export type Entitlement = Readonly<{
  status: 'active' | 'grace' | 'expired' | 'revoked'; expiresAt: string; verifiedAt: string;
}>;

/** Local policy example. A trusted server clock and verified provider state authorize APIs. */
export function premiumAllowed(entitlement: Entitlement | null, nowIso: string): boolean {
  if (!entitlement || !['active', 'grace'].includes(entitlement.status)) return false;
  const now = Date.parse(nowIso), expiry = Date.parse(entitlement.expiresAt), verified = Date.parse(entitlement.verifiedAt);
  return [now, expiry, verified].every(Number.isFinite) && verified <= now && expiry > now;
}
