# 10. Tools, grounding, memory, and trustworthy actions

Harbor becomes useful when it can consult real information and act on the user's behalf. It also becomes easier to misunderstand. A fluent sentence saying “You're booked” is not a booking receipt. A model-generated tool request is not authorization. This chapter builds a narrow, inspectable path from conversation to an actual application operation.

The local `BookingLedger` implementations in Python and TypeScript demonstrate proposal identity, ownership checks, duplicate confirmation, and conflicting request IDs. They use in-memory synthetic data and are intentionally limited to a single process. The companion's transaction experiment exposes the same states with buttons. No real calendar is connected, and no appointment is created outside the exercise.

## Begin with a read-only tool

A lookup tool should answer a narrow question, such as which slots are available for a date and timezone. Its input has a schema, and its output contains structured facts. The model can explain those facts, but should not invent missing availability. Keep free-form explanatory text separate from fields that drive business logic.

For example, a lookup result might contain slot IDs, start timestamps, timezone names, and a freshness timestamp. The slot ID is the business system's stable identity. A spoken phrase such as “tomorrow afternoon” is an interpretation that must be resolved before lookup. If the user's timezone is unknown, ask or obtain it through an authorized application context.

Avoid deriving identity from the voice alone. A user saying “I'm Alice” does not authenticate them to Alice's calendar. The backend should obtain the application user and tenant from the authenticated request context. Tool arguments supplied by the model should not be allowed to override that trusted identity.

A read-only tool still needs limits. Restrict date ranges, result counts, execution time, and accessible accounts. A seemingly harmless lookup can reveal another user's private data or consume large resources if the model can request arbitrary ranges. Narrow interfaces are easier to validate and easier for the model to use accurately.

## Function calling is a protocol, not a permission grant

A model typically emits a tool name, structured arguments, and a call identifier. Your adapter parses and validates the arguments, dispatches an allowed function, and sends a result associated with the same identifier. The model then uses the result in its next response. The exact event names differ across providers and API generations.

Do not execute partial argument deltas before the tool call is complete. Streaming arguments can be syntactically incomplete or later extended. Wait for the protocol's completion signal, parse the complete structure, validate it, and only then consider execution. A string that resembles JSON is not a validated business command.

Use an allowlist of tool names. Never map a model-provided name to arbitrary dynamic imports, shell commands, or internal endpoints. A model requesting an unknown tool should receive a controlled error. For known tools, validate types, allowed values, ranges, and relationships between fields. A valid date string can still be outside the user's allowed booking window.

A tool result should have a clear status and structured payload. Distinguish “no slots,” “request rejected,” “service unavailable,” and “operation outcome unknown.” Collapsing all failures into an empty list makes the agent tell the user that nothing is available when the calendar service is merely down. Error taxonomy directly affects spoken truthfulness.

## Separate proposing from committing

For consequential writes, a useful pattern is proposal then confirmation. The proposal records the intended action in structured form: user, slot, relevant terms, and a stable proposal ID. The user sees or hears the important details. Confirmation applies to that exact proposal, not to any later action that happens to be in the model's context.

A proposal is not necessarily a reservation. If the business system supports holds, represent a hold explicitly with an expiration. If it does not, tell the user that availability can change before confirmation. Avoid inventing a hold merely because a conversation paused while the user considered the options.

The local ledger's `propose` method binds a proposal ID to a user and slot. Reusing the same ID with different values raises a conflict. This prevents a request identifier from silently changing meaning. The `confirm` method checks the owner and returns a receipt, creating it only once in this single-process model.

The following Python program can be saved and run from `examples/python`, or adapted by importing the included module from that directory:

```python
from core import BookingLedger
ledger = BookingLedger()
ledger.propose('demo-user', 'slot-wed-1500', 'proposal-1')
first = ledger.confirm('demo-user', 'proposal-1')
second = ledger.confirm('demo-user', 'proposal-1')
print(first)
print(first == second)
```

The equality result is `True`. Repeated confirmation returns the existing receipt rather than creating a second one. This demonstrates idempotent behavior for one stable operation identity. It does not establish durability across process restarts or correctness under concurrent database workers; those require a stronger implementation.

## Make idempotency durable in production

An idempotency key identifies a logical operation that may be retried. The backend stores the key, a hash or canonical representation of the request, and the result. A repeated request with the same key and same meaning returns the stored result. A repeated key with a different meaning is rejected as a conflict.

Store that relationship atomically with the business write. A database uniqueness constraint on the operation key prevents two concurrent workers from creating duplicate receipts. The transaction should also enforce availability and ownership rules. An in-memory dictionary cannot provide those guarantees across multiple processes or crashes.

Consider a timeout after the calendar accepted a booking but before the response reached Harbor. The correct state is unknown from the voice channel's perspective. Query by operation key or external receipt before retrying. Telling the user “It failed” can be false; telling them “It succeeded” without evidence can also be false. A truthful message explains that confirmation is being checked.

If the downstream calendar has no idempotency support, your adapter needs a documented strategy for deduplication and reconciliation. That strategy may involve a local operation record and a downstream correlation field. Do not assume that retrying a POST is safe merely because your HTTP client labels the error transient.

## Tie confirmation to the actual proposal

The user says “yes” after hearing “Wednesday at three.” Meanwhile, a delayed lookup returns Thursday at four. A poorly designed agent might overwrite its current proposal and interpret the same yes as approval of Thursday. Prevent this by binding confirmation to the proposal that was presented, including its version and key details.

A visible confirmation card is especially useful in a web app. It can show the date, time, timezone, location, and any relevant cost while the agent speaks a concise version. The user's confirmation control submits the proposal ID. The backend revalidates it and commits the exact operation. Spoken confirmation can be supported too, but must use the same binding and policy.

After commit, the agent should speak from the receipt, not from the original request. The system of record may assign a confirmation number or return a slightly changed state. Display the authoritative details and make them available even if audio is interrupted. The voice should say that booking succeeded only after the receipt exists.

If the user interrupts during a confirmation question, discard the pending interpretation of yes until the new turn is understood. A partial or noisy acknowledgement is not a good foundation for a write. The product can require an explicit click for actions where ambiguity would be costly, while preserving voice for lookup and explanation.

## Ground answers in the right source

Grounding means tying claims to evidence. For Harbor, live slot availability comes from the calendar tool. Cancellation policy might come from a maintained document. The user's preferred time might come from explicit conversation state. These sources have different freshness and authority, so do not treat them as one undifferentiated context blob.

Retrieval-augmented generation, often called RAG, supplies relevant document passages to the model. It can help answer questions about policies, setup, or product instructions. It does not guarantee that the retrieved passage is current, relevant, or accessible to the user. Filter by tenant and permission before retrieval results reach the model.

Retrieved text is reference data. It can contain instructions written by someone else, including malicious or irrelevant directions. The agent should not let a document redefine tool permissions or reveal secrets. Enforce permissions in software, and distinguish application instructions from retrieved content in the prompt and internal data model.

A useful retrieved result includes a source ID, title, date or version, and relevant text. The agent can say a short answer aloud and show a source link on screen. Reading a long URL is usually poor voice UX. If evidence is missing or conflicting, say so and offer a next step rather than filling the gap with a confident invention.

## Memory has several lifetimes

Working memory holds the current task: requested date, accepted proposal, pending lookup, and recent repair. Conversation history records what has been exchanged. Long-term preferences may store a user's explicit choice, such as preferring afternoon appointments. Business state records actual bookings. These lifetimes should not be collapsed into a single transcript.

A transcript is useful context, but it is a poor sole database. It can contain recognition errors, interrupted output, and abandoned proposals. Store important task facts in structured fields with provenance and version. For example, record that the preferred day was explicitly corrected from Tuesday to Wednesday in the latest accepted turn.

Long-term memory needs an intentional product policy. Do not infer permanent preferences from one temporary request. A user asking for an afternoon appointment today may not always prefer afternoons. If the app offers persistent preference storage, make that behavior clear and provide a way to inspect or change it.

Summarization can reduce context size, but summaries can lose negations, timezones, and operation identities. Preserve critical structured facts outside the summary. A summary saying “user discussed a booking” is not enough to determine whether the booking was proposed, confirmed, cancelled, or never executed. Receipts and transaction status belong in durable state.

## Design tools for concurrent conversation

A lookup may take longer than a spoken turn. Give it an operation ID and the task version that requested it. When it completes, compare those values with the current conversation. If the user has changed the date, an old result can be discarded or retained as historical information, but must not overwrite the current proposal.

For a still-relevant slow lookup, a short acknowledgement can reduce uncertainty. The agent can say “I'm checking Wednesday afternoon.” Avoid claiming progress that the system cannot observe, such as “I found a slot” before a result arrives. Also avoid repeating acknowledgements every few seconds; a visible waiting state can carry some of that information.

Tool concurrency should be deliberate. Independent read-only requests can run in parallel when it helps. Writes that depend on one another may need sequencing. A model's ability to request multiple tools does not mean every combination is safe to execute simultaneously. The backend orchestrator owns these dependencies.

Cancellation should preserve the difference between no longer relevant and not executed. A cancelled HTTP wait can leave a downstream operation running. Record the operation's durable status and reconcile uncertain outcomes. This is the same principle as stale audio rejection, but business actions require stronger persistence because their effects outlive a response.

## Keep credentials and authority out of prompts

A tool description should explain what a tool does and how to supply arguments. It should not contain API keys or database passwords. The backend attaches credentials after validating the request. A model cannot leak a secret it was never given, and your application can rotate or scope credentials independently of conversational context.

Use narrow service accounts where appropriate. A calendar lookup service does not need unrestricted organization administration. Bind tenant and user scope on the backend. Reject arbitrary URLs if the tool is intended to query one approved service; otherwise a model-generated URL can turn a lookup into an unintended network request.

Treat transcripts and tool outputs as potentially sensitive. A trace can often record operation ID, duration, status, and a redacted error category without storing full payloads. If detailed recordings are needed for evaluation, make their purpose, access, and retention explicit. The delivered examples use synthetic IDs and no real user data.

Voice identity is not authentication. An expressive or cloned voice must not bypass login or confirmation policy. Likewise, a confident model statement is not evidence of authorization. Keep user identity, user intent, model interpretation, and business permission as distinct inputs to an action decision.

## Walk through an uncertain confirmation outcome

A user confirms proposal P for Wednesday at three. The backend records operation K and sends it to the calendar. The calendar commits, but the network drops before the receipt returns. From the browser's perspective, the request timed out. From the business system's perspective, the appointment exists. Neither viewpoint alone is enough for a truthful spoken answer.

The recovery path queries operation K. If a receipt exists, return it and mark the proposal confirmed. If the downstream system reports that K was rejected, report that rejection. If its state remains uncertain, preserve the pending status and offer a clear next step. Do not create a new operation key merely to get a fresh request through; that can turn a communication failure into a duplicate booking.

Now suppose the user says “Never mind” during recovery. End the conversational output promptly, but keep the operation record. The user may be withdrawing intent after a transaction has already committed. A cancellation of the appointment, if supported, is a separate authorized business operation with its own receipt. Closing the voice channel cannot substitute for it.

The local ledger does not simulate this distributed uncertainty, and the package does not claim otherwise. It supplies the simpler identity and ownership invariants you can understand first. When integrating a real calendar, add a durable pending state and reconciliation workflow, then test the exact failure window between downstream commit and receipt delivery.

## Test the meaningful invariants

The supplied tests check that repeated confirmation returns one receipt, another user cannot confirm the proposal, and a reused proposal ID cannot change its slot. These tests establish the intended behavior of the local model. They do not mirror every line of implementation; they target the failures that would create duplicate or unauthorized actions.

A production integration needs additional tests for concurrent confirmation, expired proposals, slot contention, downstream timeout after commit, and reconnect recovery. Test the system of record and durable operation ledger together. A unit test that mocks away every database behavior cannot establish transactional correctness.

Evaluate the spoken layer separately. Verify that the agent does not announce success before commit, does not read internal exception messages aloud, and does not confuse a lookup with a reservation. Include interrupted confirmations and corrections. A correct transaction backend can still have a misleading voice experience if its result is described poorly.

The companion's transaction lab makes the basic states visible: propose, attempt confirmation as the wrong user, confirm, retry, and reset. It is a small model you can inspect completely. The next chapter turns these state boundaries into a web experience that users can understand, control, and recover from.
