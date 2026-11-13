# Atlas Desk capstone implementation contract

[Course index](../README.md)

The course's capstone is an original Hermes-style desktop agent workspace. This is the specification the learner implements over 1,000 planned hours. The included companion demonstrates a smaller deterministic subset; it does not claim to ship all features below.

## Baseline acceptance matrix

| Workflow | Required result | Evidence | Chapter |
|---|---|---|---|
| Start locally | Useful shell and existing history without a cloud request | Offline launch recording | 01, 03 |
| Select workspace | Explicit bounded grant, visible root, revocation | Path and ownership tests | 02 |
| Send message | Stable run ID, bounded stream and visible status | Deterministic and real-adapter traces | 03, 05 |
| Use tools | Immutable proposal, scope/diff, approval or denial | Stale approval and replay tests | 02, 05 |
| Stop a run | Cancellation reaches provider/executor; actual effects explained | Generation, approval and execution cancellation cases | 05, 06 |
| Persist work | Local repository, migrations, tested backup/restore | Old fixtures and restart evidence | 03, 06 |
| Recover | Nonterminal work becomes interrupted/reconciled | Forced worker/app exit demonstration | 05, 06 |
| Sign in | System browser with correlated one-time return | Cold/warm callback, expiry, sign-out race | 04 |
| Store credentials | OS-backed storage or explicit memory-only mode | Signed-build relaunch and unavailable-keyring cases | 04, 07 |
| Buy direct edition | Browser checkout, verified backend events, reconciled entitlements | Test-mode subscription lifecycle | 04 |
| Work offline | History/drafts and implemented local functions survive | Feature-state matrix and expired-session cases | 03, 04 |
| Preview | Safe text/Markdown and isolated remote/HTML content | Navigation and bridge isolation evidence | 02, 05 |
| Native UX | Menus, shortcut failure handling, theme and window restoration | Target-OS interaction evidence | 02 |
| Release | Correctly signed artifacts for selected supported OSs | Signature and installed smoke records | 07 |
| Update | One owner per edition and compatible data migration | Previous-to-next installed update rehearsal | 07 |
| Explain product | Clear onboarding, provider/data explanation and support | First-user observation and documentation | 08 |

A course learner pursuing all three OSs must obtain access to all three target environments. A designed procedure or CI configuration is not a substitute for the corresponding installed-platform result.

## Advanced extensions within investigation blocks

| Extension | Implementation focus | Required boundary |
|---|---|---|
| Real Hermes adapter | Pin runtime, inspect supported protocol, normalize events | No invented CLI flags or undocumented file writes |
| Local model | Verified downloads, hardware/availability state, model lifecycle | No silent remote upload fallback |
| Voice | Push-to-talk, review, playback interruption | Explicit microphone and data flow |
| MCP | Versioned SDK, server identity, scoped credentials | External tools obey the same approval policy |
| Memory | Provenance, inspection, correction and deletion | Retrieved text creates no authority |
| Skills/plugins | Versioning, declared capability and review | Executable code isolated from main |
| Scheduler | Durable jobs, timezone and missed-run policy | Revalidate authority at execution |
| Browser automation | Dedicated profile and revocable account connection | Cookies treated as credentials |
| General code runner | OS/VM/container containment, resource and egress limits | Electron sandbox alone is insufficient |
| Store editions | Capability and purchase/update surface adapted by channel | No guarantee unrestricted local agent passes review |

## Architecture decision records to retain

Keep decisions for stack, process ownership, IPC policy, storage driver, migration/backup, auth transport, secret-store fallback, billing authority, entitlement lease, tool sandbox, provider adapter, extension permissions and release/update ownership. Each should state context, decision, alternatives, evidence and reconsideration trigger.

## Final demonstration sequence

1. Install a supported artifact on a clean profile and complete a sample task.
2. Inspect sources, deny a proposal, approve a different exact proposal and observe its effect.
3. Cancel while generating and while executing; explain any irreversible effect.
4. Disconnect, read history and save a draft; reconnect through an expired-session path.
5. Complete test-mode checkout and show delayed entitlement confirmation.
6. Interrupt the worker, restart and recover without duplicating a write.
7. Update from a prior installed version and preserve a real fixture database.
8. Explain unsupported targets or unrun steps in the final evidence report.
