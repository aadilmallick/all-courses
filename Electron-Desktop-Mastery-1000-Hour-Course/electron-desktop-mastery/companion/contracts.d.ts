export type Status = 'idle' | 'generating' | 'awaiting-approval' | 'executing' |
  'completed' | 'cancelled' | 'failed' | 'interrupted';
export type RunEvent = {
  version: 1; runId: string; sequence: number; kind: string; status: Status;
  prompt?: string; text?: string; proposalId?: string;
};
export interface DesktopBridge {
  history(): Promise<RunEvent[]>;
  start(prompt: string): Promise<{ runId: string }>;
  decide(value: { runId: string; proposalId: string; approved: boolean }): Promise<{ ok: true }>;
  cancel(runId: string): Promise<{ ok: true }>;
  onEvent(receive: (event: RunEvent) => void): () => void;
}
declare global { interface Window { desktop: DesktopBridge; } }
