# 03 — A usable local workspace: React, persistence and offline behavior

[Previous](02-ipc-security-and-native-integration.md) · [Course index](../README.md) · [Next](04-auth-payments-and-entitlements.md)

**Planned workload: 120 hours.** UI and data explanations 15; accessible React workspace 25; persistence, migration and search 30; offline and synchronization experiments 25; recovery and integration evidence 25.

## 1. Local-first is a product promise

A desktop application feels broken if it cannot show yesterday's conversations because a server is temporarily unreachable. Local-first design means useful local operations remain available and durable on the device. It does not mean every feature works offline. A remote model, new login, checkout and cloud synchronization still need a network unless you explicitly implement alternatives.

Write the feature matrix before writing fallback code. Reading local history can work without a network. Drafting a message can work without a network. Sending that message to a remote model cannot. A bundled or separately installed local model might provide an alternative, but that has memory, download, licensing and capability requirements. A fallback is an implemented capability with clear semantics, not a promise that connectivity never matters.

For Atlas Desk, treat the local conversation repository as the immediate source for the interface. The cloud service, if enabled, synchronizes authorized data. A durable local message gets an identifier before networking. The UI can display “saved on this device” separately from “synced” and “sent to provider.” Those statuses describe different events and should not collapse into one checkmark.

The lesson uses original design examples. The runtime concepts build on Electron's [performance guide](https://www.electronjs.org/docs/latest/tutorial/performance) and the separation of privileged persistence from renderer code. Storage engine behavior should be checked against the selected SQLite driver's documentation before choosing production transaction and backup APIs.

## 2. Classify state before choosing a library

Not all state belongs in one global React store. A textarea's current selection is transient UI state. A conversation title is durable domain data. A provider request's progress is a running operation. A paid entitlement is cached evidence of a server decision. These categories have different lifetimes and trust requirements.

| State | Natural owner | Persistence policy |
|---|---|---|
| Focus, hover, open popover | Component | Usually none |
| Draft text | Draft service or component with persistence | Local save at controlled intervals |
| Conversation history | Repository | Transactional local storage |
| Active run status | Agent service | Durable terminal transitions and recovery markers |
| Server account summary | Identity service | Bounded cache, no token in UI storage |
| Entitlement lease | Licensing service | Verified signed data with expiry |
| Window bounds | Native preference service | Local per-device preference |

React context can distribute an interface or small state, but it is not a database. Zustand can simplify local UI coordination; Redux can help larger event-driven state flows; a query library can manage asynchronous caches. Choose each for an identified problem. Adding all of them does not automatically improve architecture.

Use selectors to prevent irrelevant rerenders. If a token stream updates text in one conversation, the entire settings tree should not rerender for every chunk. Keep rapidly changing streaming state close to the affected view or coalesce updates before publishing them. Persisting every single token as its own full-conversation rewrite is both inefficient and difficult to recover.

## 3. Build a workspace that remains understandable

Start with four regions: conversation navigation, active chat, context or preview panel and settings. On a small window, collapse secondary panels while keeping the composer reachable. Use CSS grid or flexbox with explicit minimum sizes rather than hard-coded coordinates. Desktop users resize windows, use split screen and switch displays.

Represent a conversation list as actual buttons or links, not clickable anonymous containers. The selected state must be visible without color alone. Give the composer a label, describe attachment limits and expose sending or cancellation status to assistive technology. Use a polite live region for meaningful updates rather than announcing every token.

A streaming transcript should not steal focus when text arrives. Preserve keyboard focus in the composer unless the user deliberately navigates. Auto-scroll only while the user is near the bottom; if they scroll upward to inspect earlier content, show a “new output” affordance. Remember that an agent can stream for minutes while the user reads a different region.

Markdown is untrusted input. Disable raw HTML unless you have a strong sanitized rendering pipeline, validate links and render code as text. A tool's output should never become script because it includes angle brackets. For HTML previews, use the isolated preview architecture from chapter 02 and a clear trust label. Code highlighting and copy buttons do not require granting the document native authority.

## 4. A small React streaming reducer

The following **React/TypeScript component fragment** assumes the preload contract and validated `RunEvent` decoder already exist. Its purpose is to demonstrate state ownership, not to provide the entire app.

```tsx
import { useEffect, useReducer } from 'react';

type Event =
  | { type: 'started'; runId: string }
  | { type: 'delta'; runId: string; text: string }
  | { type: 'done'; runId: string };

type View = { runId: string | null; text: string; busy: boolean };
const initial: View = { runId: null, text: '', busy: false };

function reduce(view: View, event: Event): View {
  if (event.type === 'started') {
    return { runId: event.runId, text: '', busy: true };
  }
  if (event.runId !== view.runId) return view;
  if (event.type === 'delta') {
    return { ...view, text: view.text + event.text };
  }
  return { ...view, busy: false };
}

export function Output({ subscribe }: {
  subscribe: (receive: (event: Event) => void) => () => void;
}) {
  const [view, dispatch] = useReducer(reduce, initial);
  useEffect(() => subscribe(dispatch), [subscribe]);
  return <section aria-label="Agent response" aria-busy={view.busy}>
    <pre>{view.text}</pre>
    <p role="status">{view.busy ? 'Working' : 'Ready'}</p>
  </section>;
}
```

`runId` prevents a late event from an old run changing the current view. The effect returns the subscription cleanup. Keep `subscribe` stable, for example through a service object or callback, so unrelated renders do not repeatedly reconnect. Real event handling also needs sequence checks, bounded text, cancellation and recovery; this small example deliberately isolates one concern.

Use a reducer when state transitions matter more than isolated setters. A reducer lets tests apply an exact event sequence without rendering a component. It also makes impossible transitions visible: a completion for an unknown run should not silently complete whichever run happens to be on screen.

## 5. Model durable data around domain events

Start with conversations, messages, runs and tool proposals. A conversation contains many messages; a run can produce several messages and tool events. Do not force every tool log line into the same schema as a user message. The display may combine them, but their lifecycle and retention can differ.

This **SQLite schema** can be run in a fresh SQLite database. Driver-specific execution code is intentionally separate:

```sql
PRAGMA foreign_keys = ON;
CREATE TABLE conversations (
  id TEXT PRIMARY KEY,
  account_id TEXT,
  title TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE TABLE messages (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK(role IN ('user', 'assistant', 'tool')),
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  local_status TEXT NOT NULL
);
CREATE INDEX messages_by_conversation
  ON messages(conversation_id, created_at, id);
CREATE TABLE outbox (
  operation_id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  next_attempt_at INTEGER NOT NULL
);
```

Identifiers are stable strings created before network requests. Timestamps are integer milliseconds in this design; use a consistent convention and document it. The composite index helps load messages in a known order. For messages created at the same instant, the identifier provides a deterministic tie-breaker; that is display order, not proof of causal order across devices.

Foreign keys must be enabled on the actual connection if required by the driver and configuration. An ORM does not automatically make your database settings correct. Use parameterized statements for values, and do not interpolate conversation titles or search input into SQL. Validate limits even when using prepared statements; a safe query can still be too expensive.

## 6. Transactions turn intentions into durable changes

Suppose you save a message locally and enqueue a sync operation. If these happen separately, the app can crash after the first and before the second. The user sees a saved message that never synchronizes. Perform both within one local transaction so they either commit together or neither becomes visible.

A transaction is not a magical distributed commit. The cloud request happens later. The outbox records the intent to synchronize. After a crash, the sender resumes from unsent entries. The server accepts an idempotency key so resending the same operation does not duplicate the message.

The same pattern supports runs. Record that a run began before calling a remote provider. Persist meaningful progress according to your durability needs. On startup, detect nonterminal runs from the previous process lifetime and mark them interrupted or recover them through a provider-supported mechanism. Do not label an interrupted run completed merely because the last saved text looks like a sentence.

Use a single responsible writer or well-designed connection strategy. Synchronous SQLite operations can block the main process; many apps place database work in a utility process. A worker protocol can expose repository operations without exposing raw SQL to the renderer. A database worker is an organizational and responsiveness boundary, not permission for arbitrary renderer queries.

## 7. Migrations and backups before you need them

A schema migration changes the database structure while preserving supported old data. Give migrations ordered identifiers, record applied versions and run them through a controlled startup phase. A migration should be repeatably tested against representative old databases. Do not discover on release day that a populated table violates your new constraint.

For example, adding an optional conversation color is simpler than splitting one message body into multiple attachment rows. The latter needs data transformation and a rollback strategy. “Roll back the application binary” is not enough if the old binary cannot read the new schema. Prefer backward-compatible changes and staged removals when practical.

A backup must represent a consistent database state. Copying a live database file without understanding WAL and engine backup behavior can omit recent committed data or create an inconsistent snapshot. Use the selected driver's supported backup mechanism, or close/checkpoint correctly according to documented guarantees. Test restoration into a separate profile; an untested backup is only an optimistic file copy.

Encrypting token storage does not automatically encrypt conversation data or backups. Decide what data is sensitive, which threat model matters and whether database encryption, OS disk encryption or a user-managed encrypted export is appropriate. Explain recovery consequences. A key unavailable after OS account changes can make encrypted local data unrecoverable.

## 8. Search, attachments and indexing

For a small dataset, indexed title search may be enough. For larger message bodies, SQLite FTS can support lexical search if the selected build includes the required extension. Check availability in the actual packaged runtime. Avoid assuming every system SQLite or native package has identical extensions.

Search results should contain stable message IDs and small snippets, not full histories for every match. Bound results and paginate. Debounce input enough to avoid redundant work while keeping typing responsive. Cancel or ignore stale queries so a slow result for “auth” does not replace a newer result for “authentication.”

Keep large attachments outside the main message rows. Store metadata, content hash, size, MIME type and a controlled local path or object identifier. Validate type and size before processing. Thumbnail generation and document parsing can fail or be expensive; run them in a constrained worker and preserve the original attachment independently.

An indexing service needs a queue, progress, retry policy and cancellation. If a workspace changes while it is being indexed, incremental updates may be better than restarting everything. File watchers are hints, not perfect historical logs. Reconcile periodically or on focus, and handle missed events, directory renames and large bursts without leaking watcher resources.

## 9. Offline state is more than a boolean

A network interface being connected does not prove your provider is reachable. DNS can fail, a captive portal can intercept traffic, a company proxy can block a hostname and an expired session can produce an HTTP error. Treat the operating system's network signal as a hint and actual requests as evidence.

Distinguish `offline`, `connecting`, `authentication required`, `service unavailable`, `rate limited` and `available`. A 401 should not trigger endless anonymous retries; a 429 should honor retry information and back off. A timeout after a mutation does not prove the mutation failed. Use idempotency keys and reconciliation rather than blindly repeating actions.

For remote generation, offer “Save draft” when disconnected. Do not automatically send every saved prompt on reconnect unless the user chose that behavior. A prompt may contain time-sensitive instructions or private context that the user no longer wants transmitted. A queue should display pending actions and allow cancellation.

A local-model fallback should be explicit. Show which model is active, whether tools or context limits differ and where data is processed. If the local model is not installed, present the download requirements rather than claiming the feature works offline. If no suitable model is available, local history and drafts still provide value.

## 10. Synchronization and conflicts

Synchronization must be scoped to an authenticated account. An outbox created for account A must not be sent under account B after a user switches accounts. Keep account identity on every queued operation and pause queues when the identity changes. Reconcile or discard stale queues through an explicit policy.

For append-only messages with stable IDs, merging can be straightforward. Editing a title on two devices creates a conflict. You can use last-writer-wins with a documented limitation, optimistic concurrency with a revision number, a user-visible conflict copy or a more sophisticated data type when collaboration truly requires it. Do not adopt a CRDT merely because “offline” appears in the requirements.

Server time and local time differ. Wall clocks can move backward or be set incorrectly. Use server-issued revisions or logical sequence values for authoritative synchronization ordering, and reserve local timestamps for display and scheduling hints. An entitlement's expiry needs its own anti-rollback policy; it should not depend solely on a naive local clock comparison.

Deletion requires propagation too. A tombstone records that an item was deleted so another device does not reintroduce it as a newly discovered record. Define retention, account deletion and export semantics. The ability to delete a conversation in the UI is not the same as deleting its provider logs, backups or synchronized replicas.

## 11. A worked failure scenario

A user writes a prompt while connected. The app commits the message and outbox entry locally, sends it to the server, and the server commits it. Before the response reaches the desktop, Wi-Fi drops. If you mark the operation failed and generate a new ID on retry, you can create duplicates. Instead, retain the original operation ID and retry or query status using that identifier.

Now suppose the user signs out before reconnecting. Stop the outbox sender and prevent background refresh from restoring the previous account. Do not clear unrelated local conversations without explaining the product's data policy. An account's credentials and its locally retained history are separate lifecycle concerns.

Finally suppose an update starts while a database migration is running. The updater should wait for the migration or use a startup strategy that cannot expose a half-migrated database. Record the migration state transactionally and keep a tested recovery route. This is why persistence and release design must meet before your first commercial update.

Represent these scenarios in logs with operation IDs, state transitions and error categories. Avoid putting prompt content in routine diagnostics. A useful diagnostic explains “outbox operation 123 awaiting account A” without copying the user's source files or private instructions into a support system.

## 12. Guided implementation blocks

Build a conversation repository first with create, rename, append and list operations. Begin with an in-memory implementation to make UI behavior easy to explore, then replace it with SQLite behind the same interface. Confirm that changing the implementation does not require importing the database driver into React.

Add migrations and create three old-version fixture databases with meaningful data: empty, normal and large. Upgrade each and verify message counts, IDs and content hashes. Test an intentionally interrupted migration using a disposable fixture, then restore from backup. Record the exact engine and driver versions used.

Build the UI around repository subscriptions and paged queries. Add a large synthetic history, inspect rendering and storage costs, and implement virtualization only where measurement justifies it. Make keyboard navigation and copy behavior work with virtualized rows. The user should not lose their reading location every time a token arrives.

Add offline mode and an outbox simulator before using a production service. Simulate delayed responses, duplicates, out-of-order delivery, account switching and service failure. Explain each state in the interface. You are practicing behavior that a happy-path backend cannot reveal on demand.

## 13. Debugging data without making it worse

If messages disappear after restart, inspect whether the write committed, whether the app reopened a different profile and whether the UI query filters the account correctly. Do not immediately delete the database as a troubleshooting step; preserve a copy for analysis. The first task is to establish which data still exists.

If the app becomes slow as history grows, inspect query plans, result sizes, serialization and rendering separately. An efficient SQL query can still return too much data across IPC. A small payload can still trigger an expensive React tree. Measure each segment before choosing an optimization.

If a migration fails only on one user's machine, compare actual schema version and engine configuration. Your test database may have been recreated from the newest schema instead of upgraded through the real history. Migration tests need old artifacts, not just fresh tables with a version number changed.

If synchronization resurrects deletions, inspect tombstone retention and identity scoping. If it duplicates messages, inspect operation IDs and server uniqueness constraints. If it loses edits, inspect revision handling. Each symptom points to a different invariant; a larger retry count will not repair a missing model.

## 14. Completion evidence and advanced applications

Deliver a local workspace that opens without a network, preserves drafts, displays a large conversation history, survives an interrupted run and restores a tested backup. Include migration fixtures, an offline feature matrix, a conflict-policy decision record and measured query/render behavior. The evidence should distinguish actual tests from designed-but-unrun scenarios.

For advanced practice, implement encrypted export with a user-controlled passphrase and a documented recovery warning. Keep its format versioned and test export/import round trips. Do not invent a custom cryptographic construction; use a reviewed library and authenticated encryption appropriate to the format, with its parameters recorded.

Another extension is a read-only guest profile. Let a user explore a sample conversation before authenticating, then choose whether to import that data into an account. This forces you to think about data ownership, identity transitions and account-specific storage instead of tying all app startup to a successful login request.

You now have durable local behavior and a clear distinction between local and cloud capabilities. The next chapter adds identity and money while preserving that distinction: network failure should reduce available services in a deliberate way, and neither a renderer flag nor a browser success page should become proof of authorization.

## 15. Worked example: one message and one sync intention

The following **SQLite transaction** extends the schema earlier in this chapter. Run it in a disposable database after creating that schema. It demonstrates that local content and sync intent belong to one commit.

```sql
BEGIN IMMEDIATE;
INSERT INTO conversations(id, account_id, title, created_at, updated_at)
VALUES ('conversation-demo', 'account-demo', 'Repository notes', 1000, 1000);
INSERT INTO messages(id, conversation_id, role, body, created_at, local_status)
VALUES ('message-demo', 'conversation-demo', 'user',
        'Explain the sample project', 1001, 'saved');
INSERT INTO outbox(operation_id, account_id, payload_json, next_attempt_at)
VALUES ('operation-demo', 'account-demo',
        '{"messageId":"message-demo","conversationId":"conversation-demo"}', 1001);
COMMIT;
SELECT m.id, o.operation_id
FROM messages AS m
JOIN outbox AS o ON json_extract(o.payload_json, '$.messageId') = m.id;
```

The expected row contains `message-demo` and `operation-demo`. The query assumes SQLite JSON functions are available; verify them in your selected build. A production schema may store the message ID as its own indexed column instead of extracting it from JSON. The JSON payload demonstrates an intent envelope, not a recommendation to put every queryable field inside an opaque blob.

If the third insertion fails and the transaction rolls back, the message and conversation insertion roll back too. Your repository adapter must actually issue rollback on failure; throwing a JavaScript exception alone does not prove that the connection rolled back correctly. Use the driver's transaction helper or explicit `try`/rollback handling according to its documented behavior.

After the server acknowledges `operation-demo`, mark or remove that outbox entry in a separate local transaction. If the app crashes after server acceptance but before local acknowledgement, it resends the same operation ID. The server's uniqueness rule prevents duplication. This is an example of at-least-once delivery made safe by idempotency, rather than a claim of exactly-once network delivery.

## 16. Worked example: reconciling edits with revisions

Suppose conversation title revision 7 is “Service notes.” Device A renames it to “Service onboarding” while device B renames it to “API notes.” Both send an update with expected revision 7. The server accepts one, produces revision 8 and rejects the other with a conflict. The rejected device now has a concrete choice: keep the server title, retry its title against revision 8 or preserve both in an explicit conflict UI.

A **request contract fragment** makes that expectation visible:

```ts
type RenameConversation = {
  operationId: string;
  conversationId: string;
  expectedRevision: number;
  title: string;
};
type RenameReply =
  | { ok: true; revision: number; title: string }
  | { ok: false; code: 'CONFLICT'; revision: number; title: string };
```

The server must authenticate the caller and check conversation ownership before applying the revision condition. A matching revision is a concurrency condition, not an authorization check. On the client, preserve the pending local title until the user or product policy resolves the conflict; silently discarding it makes offline editing feel unreliable.

Do not use a device's wall-clock timestamp to decide that its edit must win. A clock can be wrong, and “latest timestamp” may describe clock skew rather than user intent. Revisions make the conflict explicit. For collaborative documents with complex concurrent changes, a richer merge model may be justified, but you can understand this simple conditional update before adopting it.

## 17. Pagination without losing the user's place

Loading the first hundred messages is easy; loading the next hundred while new messages arrive is less obvious. Offset pagination can shift when rows are inserted or deleted. A cursor based on a stable sort key can give more predictable navigation. The cursor should encode the ordering fields and be validated before use, not expose arbitrary SQL.

Preserve a visible message anchor when loading older history. If the user is reading message M and earlier rows appear above it, adjust scrolling to keep M in view. A virtualized list must also retain useful keyboard and screen-reader behavior. Treat scroll position as a user interaction state, not as an incidental number to reset after every query.

For attachments, avoid keeping full binary contents in React state. Store a safe reference and request a bounded preview when needed. Release object URLs and image resources when their owners unmount. Data architecture and UI resource lifetime meet here: a well-designed repository can still produce a memory leak if the view retains every preview forever.
