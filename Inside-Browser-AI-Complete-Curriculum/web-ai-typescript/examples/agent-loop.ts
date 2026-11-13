import { parseSearch, passages, retrieve, unknownRecord } from '../src/core.ts';

export type Turn = { role: 'user' | 'tool' | 'assistant'; content: string };
export type Planner = (history: readonly Turn[], signal: AbortSignal) => Promise<unknown>;
export async function runAgent(question: string, planner: Planner, signal: AbortSignal, maximumSteps = 3): Promise<string> {
  if (!Number.isInteger(maximumSteps) || maximumSteps < 1 || maximumSteps > 8) throw new RangeError('Use 1 to 8 steps.');
  const history: Turn[] = [{ role: 'user', content: question }];
  for (let step = 0; step < maximumSteps; step++) {
    signal.throwIfAborted();
    const decision = unknownRecord(await planner([...history], signal));
    signal.throwIfAborted();
    if (decision.type === 'answer' && typeof decision.text === 'string' && decision.text.length <= 8000) return decision.text;
    if (decision.type !== 'tool' || decision.name !== 'search_course_notes') throw new TypeError('Planner requested an unsupported operation.');
    const { query } = parseSearch(decision.arguments);
    const result = retrieve(query, passages, 'public');
    history.push({ role: 'assistant', content: JSON.stringify(decision) }, { role: 'tool', content: JSON.stringify(result) });
  }
  throw new Error('Agent step budget exhausted.');
}

// A deterministic planner fixture exercises control flow; no LLM is invoked.
if (process.argv[1]?.endsWith('agent-loop.ts')) {
  const fixture: Planner = async history => history.some(turn => turn.role === 'tool')
    ? { type: 'answer', text: 'Fixture completed a validated search. Inspect the tool result; no model-generated synthesis occurred.' }
    : { type: 'tool', name: 'search_course_notes', arguments: { query: 'model download' } };
  console.log(await runAgent('Find download notes.', fixture, new AbortController().signal));
}
