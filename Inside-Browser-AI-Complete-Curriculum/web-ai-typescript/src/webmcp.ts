import { parseSearch, passages, retrieve } from './core.ts';

export interface PageTool {
  name: string;
  description: string;
  inputSchema: object;
  annotations?: { readOnlyHint?: boolean; untrustedContentHint?: boolean; consequentialHint?: boolean };
  execute(input: unknown, options: { signal: AbortSignal }): Promise<unknown>;
}
export interface ModelContext {
  registerTool(tool: PageTool, options?: { signal?: AbortSignal; exposedTo?: string[] }): Promise<void>;
  getTools(options?: { fromOrigins?: string[] }): Promise<{ name: string; [key: string]: unknown }[]>;
  executeTool(tool: object, input: object, options?: { signal?: AbortSignal }): Promise<string | null>;
}
export function nativeContext(): ModelContext | undefined {
  return (document as unknown as { modelContext?: ModelContext }).modelContext;
}

export function searchNotes(input: unknown): object {
  const { query } = parseSearch(input);
  // The educational fixture is public. Production tenant identity must come from
  // the authenticated server session, never from tool arguments or the model.
  return { results: retrieve(query, passages, 'public').map(({ passage, score }) => ({ id: passage.id, title: passage.title, text: passage.text, score })) };
}

export async function registerSearch(report: (value: unknown) => void): Promise<() => void> {
  const context = nativeContext();
  if (!context) throw new Error('Native WebMCP is absent. Direct function calls below do not test WebMCP.');
  const lifetime = new AbortController();
  await context.registerTool({
    name: 'search_course_notes',
    description: 'Search public course notes. Returns matching passages and source IDs; changes no application data.',
    inputSchema: { type: 'object', properties: { query: { type: 'string', minLength: 1, maxLength: 200 } }, required: ['query'], additionalProperties: false },
    annotations: { readOnlyHint: true, untrustedContentHint: true, consequentialHint: false },
    execute: async (input, { signal }) => {
      signal.throwIfAborted();
      const result = searchNotes(input);
      report(result);
      return result;
    }
  }, { signal: lifetime.signal });
  return () => lifetime.abort();
}
