# 06 — Testing, developer experience, performance and recovery

[Previous](05-agent-runtime-and-hermes-capstone.md) · [Course index](../README.md) · [Next](07-distribution-signing-stores-and-updates.md)

**Planned workload: 120 hours.** Test design and fixtures 20; domain and boundary automation 25; desktop E2E and platform investigation 25; profiling and performance improvements 25; crash recovery, CI and evidence 25.

## 1. Production quality is a set of observable properties

An application is not production grade because it has a test framework installed. It needs to preserve user data, respect authority boundaries, remain responsive and recover from foreseeable failures. Tests provide evidence for particular claims under particular conditions. They do not prove the absence of every bug.

Begin with a short risk map. Losing a private conversation matters more than a small icon misalignment. Executing a tool without the displayed approval matters more than a delayed animation. A broken update can prevent every user from reaching your fixes. Allocate verification effort according to consequence and likelihood rather than the easiest code to cover.

For Atlas Desk, important invariants include: only trusted frames invoke native operations; a tool executes only the exact approved proposal; account A's queue never sends under account B; a terminal run does not resume unexpectedly; local data survives restart; and the installed edition uses the correct update owner. Each invariant suggests a focused test or platform experiment.

Avoid tests that merely restate implementation details. Asserting that a helper calls another helper once is useful only when that call itself represents a meaningful contract. Prefer outcomes: the second approval is rejected, a stale callback cannot restore a session, a cancelled run has no later execution event and an interrupted migration preserves supported data.

## 2. Build a layered verification strategy

Pure domain tests run without Electron and cover state transitions, validation, idempotency and policy decisions. Adapter tests exercise IPC decoding, repository behavior, provider normalization and backend routes. Desktop tests launch the application and interact with windows. Platform and installer tests verify native behavior that a browser simulation cannot establish.

| Layer | Example claim | Suitable environment |
|---|---|---|
| Domain | An expired auth attempt is rejected | Node test runner |
| Repository | Message and outbox intent commit together | Real local database engine |
| Boundary | An iframe cannot invoke export | Electron integration test |
| UI | Keyboard user can cancel a run | Component and desktop tests |
| Backend | Duplicate payment event adds no duplicate credit | Test backend and payment fixtures |
| Distribution | Downloaded app passes signature checks | Target operating system |
| Recovery | Old data survives update and relaunch | Installed old/new builds |

A small deterministic test suite can catch more useful failures than a huge brittle suite with no risk model. Keep most logic out of Electron-dependent adapters so it can run quickly. Reserve expensive desktop tests for behavior that genuinely depends on process boundaries, rendering or native integration.

Document test data. Use synthetic conversations and fake accounts. Do not record real tokens into fixtures or screenshots. A reproducible fixture includes input, relevant version and expected outcome; it does not need a copy of your personal browser profile.

## 3. Test the state machine as a domain model

The companion uses Node's built-in test runner, so `npm test` does not need a network or a test framework download. Inspect the tests before changing the implementation. They describe lifecycle guarantees rather than styling details.

This **test fragment** shows the intended style; use the included implementation's actual exports:

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRun, transition } from './core/run.mjs';

test('completed runs reject later tool execution', () => {
  let run = createRun('run-one');
  run = transition(run, { type: 'START' });
  run = transition(run, { type: 'FINISH' });
  assert.equal(run.status, 'completed');
  assert.throws(() => transition(run, { type: 'EXECUTE' }), /INVALID_TRANSITION/);
});
```

A test should establish an initial condition, perform a meaningful operation and assert the externally important outcome. Test names should explain the behavior. If a test fails after a refactor that preserves behavior, it may depend too heavily on private representation.

For state machines, test invalid transitions as well as valid ones. Add sequences such as cancel while awaiting approval, approve a stale proposal and receive a late provider event after cancellation. Property-based testing can explore many sequences, but first define the invariants clearly enough that a generated sequence can be judged.

Inject time and random identifiers where determinism matters. A function accepting `now` is easier to test than one that secretly calls the real clock. Use real cryptographic randomness in production auth attempts; inject deterministic values only through a test seam that cannot accidentally become a production configuration.

## 4. Boundary tests should assume hostile callers

Runtime types can be wrong even if TypeScript compiles. Send `null`, arrays, missing fields, enormous strings, unknown channel requests and stale identifiers. Confirm rejection happens before filesystem or network work begins. Test authorization separately from payload shape so a correctly shaped request from the wrong frame still fails.

For IPC, construct a real Electron scenario with a trusted window and an iframe or untrusted view. A pure mock cannot prove Electron's frame routing behavior. The unit-level decoder test is useful, but it complements rather than replaces the integration experiment.

For filesystem tools, test traversal, symlinks, missing files, permissions and concurrent modifications. Make destructive tests operate in disposable temporary directories. Preserve a failing fixture rather than rerunning against an actual user workspace. A test named “safe path” that checks only `notes.txt` provides almost no evidence about containment.

For payments and auth, include duplicated callbacks, delayed responses and account changes. Simulate a refresh resolving after sign-out. Simulate a webhook retry after a timeout. These are normal distributed-system conditions, not exotic edge cases, and they expose mistakes a happy-path screenshot cannot reveal.

## 5. Electron end-to-end testing with Playwright

Playwright provides experimental Electron support through its Electron API. Pin the Playwright version and confirm compatibility with your Electron build. See the [Electron API reference](https://playwright.dev/docs/api/class-electron). A browser-only test can validate many components but cannot prove your preload and main process cooperate correctly.

A **desktop test fragment** for a separately built entry looks like this:

```ts
import { test, expect, _electron as electron } from '@playwright/test';

test('a user can start a simulated run', async () => {
  const app = await electron.launch({ args: ['path/to/built/main-entry.js'] });
  try {
    const window = await app.firstWindow();
    await window.getByLabel('Message').fill('Summarize the sample workspace');
    await window.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(window.getByRole('button', { name: 'Approve', exact: true }))
      .toBeVisible();
  } finally {
    await app.close();
  }
});
```

Replace the labeled entry path with your build's actual output. The fragment is not a test executed during course authoring. Set a temporary data profile per test and keep its fixtures isolated. Otherwise one test may leave a signed-in account, pending run or migration state that changes another test's result.

Prefer role and label selectors over brittle CSS paths. They improve readability and often reveal accessibility gaps. Wait for an observable state instead of sleeping for a guessed duration. A test that waits two seconds may be slow on a fast machine and flaky on a slow machine.

Run tests against development builds for iteration, packaged builds for inclusion and path behavior, and installed artifacts for update and OS integration. These modes are distinct. Some production fuses or debug restrictions may prevent a particular automation attachment strategy; use a documented test variant and retain independent installed-release checks rather than weakening the production artifact silently.

## 6. Desktop test environments and native permissions

Linux CI may require a graphical display service such as Xvfb for desktop tests. That does not reproduce all Wayland, desktop portal, keyring or notification behavior. Keep real desktop tests for features depending on those services. Do not disable Electron's sandbox casually to make CI pass without understanding the container and host configuration.

On macOS, permissions and keychain behavior depend on signing identity and user state. A fresh CI account may not have granted microphone or screen capture. An unsigned development app may behave differently from a signed installed app. Keep an explicit permission-state matrix: never requested, granted, denied and revoked after use.

On Windows, test standard-user installation, paths with spaces and non-ASCII characters, locked files, antivirus interaction and restart behavior. WSL tests are Linux tests even when they run on a Windows laptop. They do not establish Authenticode, Start menu or protocol handler correctness for a Windows installer.

Keep native manual steps concise and repeatable. A checklist should state setup, action, expected result and captured evidence. “Test notifications” is too vague; “deny notification permission, complete a run and confirm in-app completion remains visible” is a useful procedure.

## 7. Performance starts with a user-visible question

Ask what feels slow: cold start, opening a large conversation, first model response, scrolling, typing or shutdown. Each has different causes. A smaller JavaScript bundle may help renderer startup but not a database migration. A faster provider may improve first output but not a blocked main event loop.

Electron's [performance guide](https://www.electronjs.org/docs/latest/tutorial/performance) emphasizes measurement. Our suggested product budgets are course targets, not framework guarantees: responsive typing under a synthetic stream, bounded memory growth across repeated runs and no long main-thread work during normal interaction. Set numeric budgets for your test hardware and document them.

Measure process-specific resource use. An Electron app's memory is spread across main, renderer, GPU and worker processes. A renderer heap snapshot alone is not total application memory. Likewise, CPU spent by an external agent runtime still affects battery and fan behavior even if the UI renderer is idle.

Collect repeated measurements. First launch after installation, warm launch and launch after a schema update are different workloads. Report median and tail behavior rather than selecting the best run. The purpose is to compare changes under consistent conditions, not to publish an impressive number detached from a reproducible setup.

## 8. Instrument a meaningful operation

Attach a correlation ID to the click, IPC request, repository call and UI update. Record monotonic durations within each process; wall clocks can move. If timestamps cross machines, use appropriate trace correlation rather than subtracting unrelated clocks without adjustment.

A complete **Node timing experiment** follows. Save it as `latency.mjs` and run it. It demonstrates aggregation without claiming a real app benchmark:

```js
function percentile(values, fraction) {
  if (!values.length) throw new Error('EMPTY_SAMPLE');
  const ordered = [...values].sort((left, right) => left - right);
  return ordered[Math.min(ordered.length - 1,
    Math.max(0, Math.ceil(fraction * ordered.length) - 1))];
}

const samples = [];
for (let attempt = 0; attempt < 40; attempt++) {
  const start = performance.now();
  await new Promise(resolve => setTimeout(resolve, 3));
  samples.push(performance.now() - start);
}
console.log({
  medianMs: percentile(samples, 0.5).toFixed(2),
  p95Ms: percentile(samples, 0.95).toFixed(2),
  sampleCount: samples.length
});
```

Real results depend on scheduling and hardware. For the app, measure a fixed synthetic conversation load or token stream rather than an uncontrolled live model response when comparing renderer changes. Keep provider latency as a separate measurement. Otherwise network variation can hide or falsely suggest a local performance improvement.

Do not log full private content for profiling. Sizes, event counts, durations and correlation IDs often provide enough evidence. For deeper support traces, explain what is captured and let the user review or opt in where appropriate.

## 9. Common bottlenecks and targeted fixes

If startup is slow, inspect eager imports, synchronous initialization, database work and remote requests in the critical path. Show the local shell before optional cloud checks when the product can function locally. Defer large optional features until needed, but ensure their later loading has a visible state and error route.

If streaming causes typing lag, measure rerender frequency, Markdown parsing and IPC message volume. Batch small deltas, keep stable component boundaries and render expensive rich text at controlled intervals. Do not solve a text rendering problem by turning off security features or sending raw HTML directly to the DOM.

If a conversation consumes too much memory, inspect duplicate copies across provider context, event log, UI state and persistence buffers. A large string can exist several times in different processes. Bound retained events, paginate history and avoid sending the entire conversation on every incremental update.

If indexing blocks the app, move CPU work off the main process and reduce redundant work. A utility process still needs concurrency and memory limits. Starting one process per file can create a different performance disaster. Use a measured worker pool or incremental queue suited to the task.

## 10. Memory leaks, CPU leaks and battery use

Repeated open-close cycles are a useful leak experiment. Open a conversation, start and cancel runs, switch settings, open previews and return to idle. Watch whether listeners, timers, workers and buffers return to a stable baseline. A temporary peak is different from unbounded growth.

React effects need cleanup for subscriptions, timers and observers. Native resources need explicit ownership too: message ports, file watchers, utility processes and tray objects can outlive a component. A cleanup function should release the exact resource created by its owner, not indiscriminately remove every listener for a shared event.

An idle app should not poll aggressively. Use events where practical, back off background checks and pause unnecessary work on suspend or when a feature is inactive. A global shortcut feature does not justify a tight loop checking the active window hundreds of times per second.

Power blockers should have a specific purpose and a defined end. A long user-requested task may justify preventing sleep temporarily; leaving the blocker active after completion harms battery behavior. Test suspend, resume, network changes and display sleep as state transitions, not merely as exceptional errors.

## 11. Crash recovery and observability

A crash can occur in main, renderer, utility process or external runtime. Define what survives each failure. A renderer restart should reconstruct state from the service and repository. A worker restart should mark uncertain operations appropriately. A main-process crash requires startup recovery from durable data.

Record run state before irreversible work and store sufficient identifiers to reconcile uncertain results. A tool may finish just before the worker crashes; rerunning it blindly can duplicate an external write. Prefer idempotent operation IDs or a reconciliation step. If the result cannot be established safely, tell the user the operation's outcome is uncertain.

Crash reporting needs consent, retention and redaction decisions. Stack traces can reveal paths, usernames or content snippets. Source maps and native symbols can improve diagnostics without sending full private conversations. Keep a documented support bundle format and preview what it includes.

Use error categories that support action: configuration missing, permission denied, provider unavailable, protocol incompatible, disk full and data migration failed. A single “Something went wrong” toast helps neither the user nor support. Include a stable incident reference while keeping sensitive diagnostics out of the UI.

## 12. Continuous integration and dependency upgrades

Split fast verification from platform builds and signing. Every change can run domain tests, type checks and linting. Integration changes can run database and backend tests. Release candidates need packaged desktop tests and platform evidence. Signing jobs should consume approved artifacts and use protected credentials.

Do not expose release secrets to untrusted pull-request code. Pin third-party CI actions to reviewed immutable references in the real repository, and restrict token permissions. A workflow's exact syntax depends on your hosting provider and current tool versions; the included release template states stages without inventing runnable credentials.

Upgrade Electron regularly using a branch and representative fixtures. Read breaking changes, verify native modules and run packaged tests. Test transitions from the previous production version, not just fresh installation. A security patch that prevents startup is still a release problem requiring fast diagnosis and a safe recovery route.

A dependency audit is an input, not a final decision. Investigate reachability, available fixes and integration impact. Do not automatically apply a major upgrade across the whole stack and call the result secure. Keep a short record of the version change, reason, checks and any accepted limitation.

## 13. Guided reliability laboratory

Start with domain tests for run transitions, auth attempt consumption and entitlements. Introduce faults intentionally and confirm the suite catches them: allow a stale state, remove a duplicate-event guard or accept an expired lease in a temporary branch. A test that never fails when its invariant is broken may not test the intended behavior.

Add repository tests using real temporary databases. Include a failed transaction, an old schema migration and backup restore. Verify content, not merely file existence. Measure larger fixtures so your UI development does not remain optimized for three messages forever.

Add desktop tests for keyboard flow, approval, cancellation, restart recovery and untrusted preview isolation. Keep a small stable smoke suite for each target platform. Store traces and screenshots only with synthetic data and only as necessary for diagnosis.

Profile the synthetic stream, make one targeted improvement and rerun the identical workload. Report the before/after measurements and functional checks. Keep the change only if the benefit justifies complexity. “It feels faster” is a useful starting observation, but it is not the final engineering evidence.

## 14. Completion evidence and practical limits

Deliver the test map, runnable domain suite, desktop test recipe, migration fixtures, platform permission matrix, performance report and crash recovery demonstration. State exactly which tests ran on which OS and which remain designed procedures. A Linux syntax check cannot verify notarization, and a browser component test cannot verify a Windows installer.

For advanced practice, add fault injection behind a development-only interface: fail the next database commit, delay the next provider event, drop a worker connection or simulate low disk space in a disposable environment. Keep those controls out of production user flows and avoid building a hidden remote control channel.

The next chapter uses this evidence to create release candidates. A signed artifact is not automatically correct, and a correct development build is not automatically installable. You need both behavioral verification and a distribution pipeline whose ownership, credentials and update rules are explicit.

## 15. Worked recovery test: the application dies between two effects

A useful fault test begins with an operation whose effects are visible. For example, a run proposes an approved report write and records completion in the database. There is a gap between writing the file and saving the completion event. If the process dies in that gap, startup recovery must not assume no file was written.

Give the operation an ID and write enough metadata to reconcile. A report could contain a format header or sidecar reference identifying its creating operation, provided that fits the file format and privacy policy. On recovery, inspect the expected target and revision, then mark the operation completed, uncertain or safe to retry. Do not overwrite an independently edited file just because the original run remains nonterminal.

Construct the test in a temporary workspace. Inject a failure immediately after the write and before the completion record. Restart the service against the same data. Assert both file contents and recovered state. A test that only checks the application opens misses the original failure. Then change the file before recovery and confirm the reconciler detects that the target is no longer the expected result.

This exercise illustrates a general principle: two durable systems rarely commit atomically without a specific transaction mechanism. The filesystem, local database and remote provider each have their own commit points. Recovery code needs evidence about each one.

## 16. Worked performance investigation: token storms

Prepare a deterministic stream with 20,000 small text deltas and a fixed total text size. Record elapsed time, main-process responsiveness, renderer update count and final output hash. Start with the simplest implementation and retain its measurements. The final output hash confirms that optimization did not silently drop content.

If the renderer receives every delta immediately and reparses all Markdown each time, work can grow much faster than the final document size. Updating a small text accumulator is cheap; reparsing the entire accumulated document thousands of times is not. Coalesce transport events and render rich output at bounded intervals, then perform a final render on completion.

Keep cancellation responsive while batching. A batch interval should not hide a tool proposal or delay a Stop action until a huge buffer drains. Control events and text deltas can have different scheduling priorities while preserving sequence and terminal-state rules. Test the exact moment cancellation occurs under the same synthetic workload.

Compare before and after using the same hardware, profile, text and build mode. Report the sample count, median, tail duration and any tradeoff such as slightly delayed visible text. A lower CPU number with missing output is a regression, not an optimization.

## 17. Test data design is an engineering skill

A small conversation fixture should contain a Unicode filename, Markdown with raw HTML-like text, a very long line, an empty tool result and a cancelled run. These values exercise different boundaries without requiring private data. A large fixture should stress expected realistic scale rather than arbitrarily filling memory until the machine fails.

For auth, create attempts that are valid, expired, replayed, mismatched and cancelled. For billing, create an active account, a delinquent account, duplicate events and an account switch while checkout is pending. For release tests, retain a genuine prior-version database and a package-installed profile. Each fixture should state which invariant it exists to test.

Avoid snapshots that bury the meaningful change in thousands of incidental characters. Snapshot stable structured output when it helps review; assert specific behavioral fields when that is clearer. An updated snapshot is not evidence that a behavior change was intended. Read the difference and connect it to a product decision.

A development simulator can expose these fixtures through a local test harness. Keep the simulator separate from real credentials and production service endpoints. You should be able to reproduce a failed provider, delayed entitlement or interrupted worker without deliberately breaking a paying user's environment.

## 18. Meaningful CI failure reports

When a desktop test fails, preserve the build version, OS, test name, safe logs and a trace or screenshot using synthetic data. Avoid dumping every environment variable into the job output. A useful failure report points to an operation and observed mismatch, such as “approval panel remained visible after cancellation,” instead of merely “timeout exceeded.”

If a failure is flaky, investigate the underlying race. Add event-based waits, isolate profiles and remove shared state. Repeating the same test until it passes can temporarily classify instability, but it should not turn an unreliable release into a green check without explanation. Track any quarantine and its effect on release confidence.

Keep the fast suite fast enough that developers run it before review. Separate platform checks with clear triggers, and make the release candidate's evidence visible in one place. The aim is a trustworthy feedback loop: a failure should be actionable, and a pass should correspond to a known claim rather than an opaque ritual.

A final useful regression test disconnects the renderer while a service continues running. Recreate the window and request an authoritative snapshot followed by events after its sequence number. Confirm that the UI neither misses the terminal result nor renders duplicated deltas. This tests reconstruction, which a single uninterrupted happy-path run cannot establish.

For performance measurements, retain the fixture generator and environment description with the report. If a future developer cannot reproduce the same event count, document size and build mode, the number loses much of its diagnostic value. Keep the workload stable while comparing one change at a time, then broaden testing when a new behavior or unresolved risk justifies it.

When measuring a support fix, include the failure condition in the fixture. A repair for large histories should be exercised with large histories, and a repair for reconnect races should actually reorder or delay events. Passing the old happy-path suite after a fix is useful, but the new regression case explains why the original failure should stay fixed. Preserve that case with a concise name and synthetic data so future maintainers can understand its purpose.

A final interpretation check asks whether your test environment represents the claimed outcome. A fake bridge can validate renderer wiring but cannot establish Electron sender isolation. A mocked payment event can validate a reducer but cannot establish signature verification. Keep those distinctions in names and reports so passing tests remain useful evidence.
