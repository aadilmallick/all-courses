import { randomBytes, createHash, timingSafeEqual } from 'node:crypto';
export function createAttempt(now, ttlMs = 180000) {
  const verifier = randomBytes(32).toString('base64url');
  return {
    verifier,
    challenge: createHash('sha256').update(verifier).digest('base64url'),
    state: randomBytes(32).toString('base64url'),
    expiresAt: now + ttlMs,
    consumed: false
  };
}
export function consumeAttempt(attempt, callback, now) {
  if (attempt.consumed || now >= attempt.expiresAt) throw new Error('STALE_ATTEMPT');
  if (!callback || typeof callback.state !== 'string' ||
      typeof callback.code !== 'string' || !callback.code || callback.code.length > 2048) {
    throw new Error('INVALID_CALLBACK');
  }
  const expected = Buffer.from(attempt.state);
  const actual = Buffer.from(callback.state);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new Error('STATE_MISMATCH');
  }
  attempt.consumed = true;
  return { code: callback.code, verifier: attempt.verifier };
}
// Policy for an ALREADY cryptographically verified lease, not signature verification.
export function permitsVerifiedLease(lease, context) {
  return lease.subject === context.subject &&
    lease.deviceId === context.deviceId &&
    Number.isFinite(lease.expiresAt) && context.now < lease.expiresAt &&
    Array.isArray(lease.features) && lease.features.includes(context.feature);
}
