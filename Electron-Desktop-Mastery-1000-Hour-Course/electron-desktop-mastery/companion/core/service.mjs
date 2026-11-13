import { randomUUID } from 'node:crypto';
import { createRun, transition, terminal, parsePrompt, parseDecision } from './run.mjs';

export class DemoService {
  constructor({ emit, schedule = setTimeout, unschedule = clearTimeout, id = randomUUID }) {
    this.emit = emit;
    this.schedule = schedule;
    this.unschedule = unschedule;
    this.id = id;
    this.run = null;
    this.timer = null;
  }
  publish(kind, data = {}) {
    this.emit({ version: 1, runId: this.run.id, sequence: this.run.sequence,
      kind, status: this.run.status, ...data });
  }
  later(callback) {
    this.timer = this.schedule(() => { this.timer = null; callback(); }, 120);
  }
  start(input) {
    const prompt = parsePrompt(input);
    if (this.run && !terminal.has(this.run.status)) throw new Error('RUN_BUSY');
    this.run = transition(createRun(this.id()), { type: 'START' });
    this.publish('started', { prompt });
    this.later(() => {
      if (this.run.status !== 'generating') return;
      this.run = { ...this.run, sequence: this.run.sequence + 1 };
      this.publish('delta', { text: 'I can prepare a sample summary. Please review the proposed action.' });
      const proposalId = this.id();
      this.run = transition(this.run, { type: 'PROPOSE', proposalId });
      this.publish('proposal', { proposalId,
        text: 'Demo proposal: generate a sample summary. No files, network or shell are used.' });
    });
    return { runId: this.run.id };
  }
  decide(input) {
    const decision = parseDecision(input);
    if (!this.run || decision.runId !== this.run.id) throw new Error('STALE_RUN');
    this.run = transition(this.run, {
      type: decision.approved ? 'APPROVE' : 'DENY', proposalId: decision.proposalId
    });
    this.publish(decision.approved ? 'approved' : 'denied');
    if (decision.approved) {
      this.later(() => {
        if (this.run.status !== 'executing') return;
        this.run = transition(this.run, { type: 'TOOL_DONE' });
        this.publish('tool-result', { text: 'Sample summary created in memory; no external side effects.' });
        this.run = transition(this.run, { type: 'FINISH' });
        this.publish('completed');
      });
    } else {
      this.run = transition(this.run, { type: 'FINISH' });
      this.publish('completed', { text: 'No action taken.' });
    }
    return { ok: true };
  }
  cancel(runId) {
    if (!this.run || runId !== this.run.id) throw new Error('STALE_RUN');
    this.run = transition(this.run, { type: 'CANCEL' });
    if (this.timer !== null) this.unschedule(this.timer);
    this.timer = null;
    this.publish('cancelled');
    return { ok: true };
  }
  snapshot() { return this.run ? { ...this.run } : null; }
}
