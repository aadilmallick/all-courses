'use strict';
const byId = id => document.getElementById(id);
const events = byId('events');
let activeRun = null;
let proposal = null;
let busy = false;
const seen = new Set();
function controls() {
  byId('send').disabled = busy;
  byId('cancel').disabled = !busy;
  byId('approval').hidden = !proposal;
}
function receive(event) {
  if (!event || event.version !== 1 || typeof event.runId !== 'string' ||
      !Number.isInteger(event.sequence) || typeof event.kind !== 'string') return;
  const key = event.runId + ':' + event.sequence + ':' + event.kind;
  if (seen.has(key)) return;
  seen.add(key);
  if (seen.size > 1000) seen.delete(seen.values().next().value);
  activeRun = event.runId;
  busy = ['generating', 'awaiting-approval', 'executing'].includes(event.status);
  if (event.kind === 'proposal' && typeof event.proposalId === 'string') {
    proposal = { runId: event.runId, proposalId: event.proposalId };
    byId('proposal').textContent = event.text || 'Review proposed action';
  } else if (event.kind !== 'storage-error') proposal = null;
  const item = document.createElement('li');
  item.textContent = event.kind + (event.text ? ': ' + event.text : event.prompt ? ': ' + event.prompt : '');
  events.append(item);
  while (events.children.length > 300) events.firstElementChild.remove();
  byId('status').textContent = event.status;
  if (event.kind === 'storage-error') byId('error').textContent = event.text;
  controls();
}
async function act(operation) {
  byId('error').textContent = '';
  try { return await operation(); }
  catch { byId('error').textContent = 'Operation failed. Check the current run state and try again.'; }
}
// Subscribe first, buffer live events, then apply history to avoid init ordering loss.
let loading = true;
const buffered = [];
const stop = window.desktop.onEvent(event => loading ? buffered.push(event) : receive(event));
window.desktop.history().then(history => {
  if (Array.isArray(history)) history.forEach(receive);
}).catch(() => {
  byId('error').textContent = 'History could not be loaded.';
}).finally(() => {
  buffered.forEach(receive); loading = false; controls();
});
window.addEventListener('beforeunload', stop, { once: true });
byId('composer').addEventListener('submit', event => {
  event.preventDefault();
  if (busy) return;
  const prompt = byId('prompt').value;
  if (!prompt.trim()) return;
  busy = true; controls();
  act(async () => {
    try { const result = await window.desktop.start(prompt); activeRun = result.runId; }
    catch (error) { busy = false; controls(); throw error; }
  });
});
byId('cancel').addEventListener('click', () => {
  if (activeRun) act(() => window.desktop.cancel(activeRun));
});
for (const [id, approved] of [['approve', true], ['deny', false]]) {
  byId(id).addEventListener('click', () => {
    if (proposal) act(() => window.desktop.decide({ ...proposal, approved }));
  });
}
