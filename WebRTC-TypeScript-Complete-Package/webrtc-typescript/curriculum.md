# Complete WebRTC TypeScript curriculum

The curriculum contains ten substantial lesson files, divided into five parts and forty focused study units. The continuous [textbook](book.md) expands every lesson and includes the canonical companion source. Begin with ordinary programming knowledge; browser media, networking terms, and asynchronous ownership are taught before use. Optional applications are suggestions, not required recall exercises.

## Part I — Browser and media foundations

### Lesson 1 — A real-time system you can reason about

Read [Chapter 1](chapters/01-foundations.md). Prerequisites: variables, functions, and objects.

1. Separate application control, signaling, and media/data transport.
2. Understand origins, secure contexts, modules, and browser TypeScript.
3. Trace promises, event callbacks, serialization needs, and stale async work.
4. Reason about resource ownership, rates, latency, frames, and samples.

Outcome: explain what runs in TypeScript versus the native browser, start the lab, identify what each visible result establishes, and release owned resources. Worked example: generation-based capture cancellation. Companion: local call and event log. Optional application: move source acquisition behind an explicit capture owner.

### Lesson 2 — Capture, permissions, and media lifetime

Read [Chapter 2](chapters/02-capture-and-lifecycle.md). Depends on Lesson 1.

1. Build a preview with MediaStream and MediaStreamTrack.
2. Distinguish constraints, capabilities, settings, permission, and playback.
3. Handle mute, ended sources, device selection, clones, and shared ownership.
4. Add screen capture and reason about audio, restoration, and recording.

Outcome: implement a capture flow that remains correct under denial, delayed permission, device removal, and cancellation. Worked examples: complete preview module and transactional screen replacement. Companion: camera, screen, video toggle, reset. Optional application: device picker with a default-device fallback.

## Part II — Negotiation and connectivity

### Lesson 3 — Two peers and a negotiated conversation

Read [Chapter 3](chapters/03-peer-connections-and-sdp.md). Depends on Lessons 1–2.

1. Construct endpoints and perform a complete non-trickle offer/answer exchange.
2. Read signaling-state transitions and distinguish description creation from installation.
3. Interpret SDP sections, directions, codecs, transport information, and identity fields.
4. Attach tracks, receive streamless tracks, and separate transport from publication state.

Outcome: explain every step in the first connection and isolate whether failure concerns signaling, reachability, decoding, or playback. Worked example: complete local data call. Companion: local call, SDP inspector, state log. Optional application: add a receive-only transceiver before local capture.

### Lesson 4 — Signaling and perfect negotiation

Read [Chapter 4](chapters/04-signaling-and-perfect-negotiation.md). Depends on Lesson 3.

1. Design validated envelopes with call and peer-incarnation identity.
2. Separate runtime validation from TypeScript assertions and server authorization.
3. Trace polite/impolite roles, glare, rollback behavior, and ordered async processing.
4. Compare transport choices, trickle ICE, reconnect replay, and stale-message rejection.

Outcome: implement the documented negotiation pattern under a stated ordered-transport contract. Worked example: simultaneous offers traced through both peers. Companion: two-tab mode and simultaneous-offers control. Canonical source: `companion/src/peer.ts`. Optional application: replace BroadcastChannel with authenticated remote signaling while preserving the interface.

### Lesson 5 — ICE, STUN, TURN, and recovery

Read [Chapter 5](chapters/05-ice-stun-turn-and-recovery.md). Depends on Lessons 3–4.

1. Understand NAT mappings, filtering, candidate types, pair checks, and selection.
2. Distinguish STUN discovery, TURN allocation, relay selection, and user quality.
3. Generate temporary coturn credentials and plan reachable relay infrastructure.
4. Design forced-relay tests, bounded ICE restart, rebuild escalation, and bandwidth estimates.

Outcome: diagnose the call that works locally but fails across networks and define a concrete traversal validation plan. Worked examples: mapped endpoint trace, credential derivation, 30-minute bandwidth estimate. Companion: ICE restart and selected-path display; no TURN service is bundled. Optional application: provision a relay and test valid/invalid credentials plus forced relay on independent networks.

## Part III — Media and application data

### Lesson 6 — Tracks, codecs, and media control

Read [Chapter 6](chapters/06-tracks-codecs-and-media-control.md). Depends on Lessons 2–5.

1. Choose between enabled, stop, replaceTrack, addTrack, and transceiver direction.
2. Model source replacement as a transaction with ownership and failure handling.
3. Understand encoding, RTP/RTCP, feedback, codec preferences, and bitrate ceilings.
4. Derive resolution/rate tradeoffs and explain simulcast, SVC, and quality policy.

Outcome: change sources and encoding policy without confusing device, sender, negotiation, or participant identity. Worked examples: replacement transaction, cap function, simulcast configuration. Companion: source replacement and encoding ceiling. Optional application: camera versus screen quality profiles with measured output.

### Lesson 7 — Data channels and bounded protocols

Read [Chapter 7](chapters/07-data-channels-and-protocols.md). Depends on Lessons 3–5.

1. Establish channels and select ordered/reliable or partial-reliability semantics.
2. Handle binary boundaries, negotiated message limits, and safe rendering.
3. Implement bounded backpressure, cancellation, and asynchronous receiver work.
4. Define metadata/chunks/end/verification/acknowledgment and file-storage trust boundaries.

Outcome: explain exactly what send, drain, receipt, verification, and persistence mean. Worked example: 1 MiB transfer in 64 chunks at a 16 KiB chunk cap. Companion: text and synthetic transfer with receiver SHA-256 verification. Canonical source: `companion/src/transfer.ts`. Optional application: transfer IDs and streaming storage with approved size limits.

## Part IV — Evidence and scale

### Lesson 8 — Statistics, performance, and debugging

Read [Chapter 8](chapters/08-stats-performance-and-debugging.md). Depends on Lessons 3–7.

1. Read a stats graph and establish record identity and pipeline stages.
2. Derive byte rates, jitter-buffer averages, processing averages, and valid denominators.
3. Distinguish RTT, jitter, buffering, loss, repair, decoding, and presentation.
4. Design bounded polling, correct aggregation, missing-data semantics, and incident traces.

Outcome: diagnose with evidence and correct units instead of changing unrelated settings. Worked examples: 1.2 Mbps rate, 50 ms jitter-buffer average, 20 ms decode average. Companion: live counter-delta statistics. Optional application: a bounded diagnostic export with redaction and sample coverage.

### Lesson 9 — Group calls and SFU architecture

Read [Chapter 9](chapters/09-group-calls-and-sfu-architecture.md). Depends on Lessons 4–8.

1. Derive mesh links and bandwidth growth from stated assumptions.
2. Compare mesh, SFU, and MCU responsibility, cost, and trust boundaries.
3. Model participants/publications/subscriptions and integrate a documented TypeScript room SDK.
4. Plan adaptive subscriptions, placement, recording, gateways, and late-join/departure lifecycle.

Outcome: choose an architecture from product constraints and validate its real resource model. Worked examples: six-person bandwidth model and optional LiveKit 2.24.0 integration. Companion: topology calculator; no server SDK is installed. Optional application: a real SFU room with two publications per participant and receiver-specific subscriptions.

## Part V — Expert engineering

### Lesson 10 — Production, security, and expert practice

Read [Chapter 10](chapters/10-production-security-and-expert-practice.md). Depends on all preceding lessons.

1. Define session invariants, idempotent cleanup, layered failure, and bounded recovery.
2. Threat-model admission, credentials, signaling, relays, SFUs, and media access.
3. Understand encoded-transform placement and the additional contracts required by end-to-end encryption.
4. Design pure/browser/network tests, interoperability matrices, observability, and deployment gates.

Outcome: review a real-time system for correctness under concurrency, failure, and authorization changes. Worked examples: late-permission test design, glare/backpressure contracts, pass-through worker. Companion: source and reset behavior provide the baseline; the advanced transform is optional and unexecuted. Optional application: extend one invariant at a time into a deployed product.

## Three optional capstones

| Capstone | Concrete deliverable | Evidence to collect |
| --- | --- | --- |
| Reliable one-to-one tool | Authenticated remote signaling, camera/mic/screen, deployed TURN | Independent-network calls, forced relay, stale-session rejection, cleanup |
| Data collaboration tool | Bounded messages, file approval, acknowledgments, cancellation/resume policy | Exact receiver bytes, storage completion, interrupted/replayed transfers |
| Group room | SFU integration, publication model, adaptive subscriptions, authorized recording policy | Late join, multiple sources/person, weak receiver, node failure, permissions |

These capstones are extension specifications, not deployed features of the included lab. The companion, chapter content, and actual verification evidence are documented separately so the learning path remains concrete and honest.
