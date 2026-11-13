import { stripTypeScriptTypes } from 'node:module';
import { readFileSync } from 'node:fs';

// Parse and strip TypeScript without executing imports or resolving dependencies.
// TSX and semantic type checking remain outside this deliberately narrow check.
const snippets = JSON.parse(readFileSync(0, 'utf8'));
const results = snippets.map(({ file, code }) => {
  try {
    stripTypeScriptTypes(code, { mode: 'strip' });
    return { file, ok: true };
  } catch (error) {
    return { file, error: String(error.message) };
  }
});
process.stdout.write(JSON.stringify(results));
