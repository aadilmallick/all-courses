# Cross-category editorial review

Reviewed November 13, 2026. Bounded review of six representative guides: Codex, Factory, Vapi, OpenAI Realtime, E2B and Daytona. Focus: product-specific assertions, setup/API examples, placeholder labeling, meaningful original instruction and current primary-source alignment. This was a sampled editorial/code review, not an exhaustive audit or live SaaS test. No guide files were changed.

## Actionable findings

### P2 — E2B analysis sample accepts structurally invalid CSV

File: `src/content/docs/sandboxes/e2b.md`, lines 103–116, beginning with `if set(reader.fieldnames or []) != required`.

The stated analysis contract fails invalid input, but converting headers to a set erases duplicates. For example, `ticket_id,status,minutes,minutes` passes this check. Python DictReader then overwrites the first minutes field with the second, so `T-1,closed,12,900` produces a plausible 900-minute observation instead of a structural error. Extra fields on a normal three-column row are also not rejected; DictReader stores them under a None key that this loop ignores.

Suggested correction: check header length and uniqueness as well as membership, reject a None key and missing field values before filtering/aggregation, and add a duplicate-header plus extra-field fixture. Preserve the distinction between intentionally excluded open tickets and malformed rows.

Evidence: deterministic code inspection against [Python DictReader semantics](https://docs.python.org/3/library/csv.html#csv.DictReader). No Python runtime was available to execute this counterexample during this review. This is an independent sample-logic defect, not an E2B API defect.

### P2 — Vapi browser fragment misses asynchronous SDK errors

File: `src/content/docs/voice/vapi.md`, lines 83–100, the start handler and call-event listeners.

The fragment catches a rejected start promise and listens for call-start/call-end, but has no error listener. The current official SDK can emit errors after start resolves, including an audio-start-failed event when assistant playback cannot begin. That path is outside the start handler's try/catch and need not produce call-end, so the UI can remain Connected while the user cannot hear the assistant.

Suggested correction: register an SDK error listener before starting; provide a user-facing failure/recovery state and appropriate retry or user-gesture recovery for the error category. Handle documented call-start-failed events where useful and inspect the nullable start result rather than relying solely on exceptions. Keep cleanup proportional because some SDK errors are nonfatal.

Evidence: [current official Web SDK source](https://github.com/VapiAI/client-sdk-web/blob/main/vapi.ts), especially start's nullable result and asynchronous playback-error emission; [Web calls documentation](https://docs.vapi.ai/quickstart/web). No live call was needed or made. This is an integration-fragment error-handling gap, not a demonstrated service outage.

## Other reviewed guides

| Guide | Primary-source checks | Result |
| --- | --- | --- |
| Codex | [CLI](https://learn.chatgpt.com/docs/cli), [Cloud](https://learn.chatgpt.com/docs/cloud) | No actionable mismatch found. CLI commands, published environments and default-environment caveats align with current pages. Local fixture and conceptual configuration are labeled. |
| Factory | [Missions overview](https://docs.factory.com/missions/overview), [CLI operation](https://docs.factory.com/missions/running-cli) | No actionable mismatch found. Both mission command aliases and active intervention guidance are documented. Teaching milestone plan is distinguished from product syntax. |
| OpenAI Realtime | [Current quickstart](https://developers.openai.com/api/docs/guides/realtime) | Current gpt-realtime-2.1 SDK example matches the fetched guide. Browser fragment and application-defined events are explicitly labeled; no invented endpoint claim found. Full live authentication and media behavior remain untested. |
| Daytona | [Process](https://www.daytona.io/docs/en/python-sdk/sync/process/), [Lifecycle](https://www.daytona.io/docs/en/python-sdk/sync/daytona/) | No actionable mismatch found in exec/code_run, v0.231 versus v2 alpha distinction, or delete(wait=True) semantics. Provider-backed execution is correctly labeled unrun. |

The sampled chapters contain tool-specific projects and instruction; no obvious copied generic padding or unlabelled learner credentials were found. Source pages used for the checks were directly opened. Account eligibility, usage limits, real audio, remote provisioning and billable operations remain verification limitations, not findings by themselves.

## Resolution in the delivered edition

Both findings were corrected before delivery. E2B now checks exact header count/membership, rejects extra CSV columns and missing required values, and discusses malformed fixtures; Python execution remains unrun. Vapi now handles asynchronous error and call-start-failed events before starting, prevents misleading connected state, and coordinates cleanup before retry. Its JavaScript syntax and four mocked lifecycle cases passed; live audio remains untested. The final source ledger includes the official SDK source.
