export const terminal = new Set(['completed', 'cancelled', 'failed', 'interrupted']);
export function createRun(id) {
  if (typeof id !== 'string' || !id) throw new Error('INVALID_ID');
  return { id, status: 'idle', proposalId: null, sequence: 0 };
}
export function transition(run, event) {
  if (terminal.has(run.status)) throw new Error('INVALID_TRANSITION: terminal');
  const next = { ...run, sequence: run.sequence + 1 };
  if (event.type === 'CANCEL' && run.status !== 'idle') {
    return { ...next, status: 'cancelled', proposalId: null };
  }
  if (event.type === 'FAIL' && run.status !== 'idle') {
    return { ...next, status: 'failed', proposalId: null };
  }
  if (event.type === 'START' && run.status === 'idle') {
    return { ...next, status: 'generating' };
  }
  if (event.type === 'PROPOSE' && run.status === 'generating' &&
      typeof event.proposalId === 'string' && event.proposalId) {
    return { ...next, status: 'awaiting-approval', proposalId: event.proposalId };
  }
  if (event.type === 'APPROVE' && run.status === 'awaiting-approval' &&
      event.proposalId === run.proposalId) {
    return { ...next, status: 'executing' };
  }
  if (event.type === 'DENY' && run.status === 'awaiting-approval' &&
      event.proposalId === run.proposalId) {
    return { ...next, status: 'generating', proposalId: null };
  }
  if (event.type === 'TOOL_DONE' && run.status === 'executing') {
    return { ...next, status: 'generating', proposalId: null };
  }
  if (event.type === 'FINISH' && run.status === 'generating') {
    return { ...next, status: 'completed' };
  }
  throw new Error('INVALID_TRANSITION');
}
export function parsePrompt(value) {
  if (typeof value !== 'string' || !value.trim() || value.length > 4000) {
    throw new Error('INVALID_PROMPT');
  }
  return value.trim();
}
export function parseDecision(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      typeof value.runId !== 'string' || value.runId.length > 100 ||
      typeof value.proposalId !== 'string' || value.proposalId.length > 100 ||
      typeof value.approved !== 'boolean') throw new Error('INVALID_DECISION');
  return { runId: value.runId, proposalId: value.proposalId, approved: value.approved };
}
