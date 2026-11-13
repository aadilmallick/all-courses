export type ProviderRow = Readonly<{
  id: string; connectionId: string; amountMinor: number; pending: boolean;
  replacesPendingId?: string; merchant: string;
}>;
export type Annotation = Readonly<{ categoryId: string; note?: string }>;
export type LedgerState = Readonly<{
  rows: ReadonlyMap<string, ProviderRow>; annotations: ReadonlyMap<string, Annotation>; cursor: string;
}>;
export type SyncPage = Readonly<{
  connectionId: string; fromCursor: string; nextCursor: string;
  added: readonly ProviderRow[]; modified: readonly ProviderRow[]; removedIds: readonly string[];
}>;

function key(connectionId: string, id: string): string {
  // JSON tuples avoid ambiguous delimiter collisions.
  return JSON.stringify([connectionId, id]);
}

/** Pure single-page model. Production commits an entire provider sync window atomically. */
export function applySyncPage(state: LedgerState, page: SyncPage): LedgerState {
  if (state.cursor !== page.fromCursor) throw new Error('Stale sync cursor');
  const rows = new Map(state.rows), annotations = new Map(state.annotations);
  const replacementAnnotations = new Map<string, Annotation>();
  // Capture before removals: providers can remove pending and add posted in the same window.
  for (const row of [...page.added, ...page.modified]) {
    if (row.connectionId !== page.connectionId) throw new Error('Cross-connection row');
    if (!Number.isSafeInteger(row.amountMinor)) throw new Error('Invalid provider amount');
    if (row.replacesPendingId && !row.pending) {
      const prior = annotations.get(key(page.connectionId, row.replacesPendingId));
      if (prior) replacementAnnotations.set(row.id, prior);
    }
  }
  for (const id of page.removedIds) {
    rows.delete(key(page.connectionId, id));
    annotations.delete(key(page.connectionId, id));
  }
  for (const row of [...page.added, ...page.modified]) {
    if (row.replacesPendingId && !row.pending) {
      rows.delete(key(page.connectionId, row.replacesPendingId));
      annotations.delete(key(page.connectionId, row.replacesPendingId));
    }
    const rowKey = key(page.connectionId, row.id);
    rows.set(rowKey, { ...row });
    if (!annotations.has(rowKey) && replacementAnnotations.has(row.id)) {
      annotations.set(rowKey, replacementAnnotations.get(row.id)!);
    }
  }
  return { rows, annotations, cursor: page.nextCursor };
}

export function providerKey(connectionId: string, id: string): string { return key(connectionId, id); }
