# Authoring brief and coverage contract

Audience: a developer seeking practical beginner-to-expert WebRTC understanding in TypeScript. Assume ordinary programming familiarity; introduce browser, asynchronous ownership, media, and networking prerequisites locally. Teach with a patient, motivated narrative, worked intermediate states, complete small examples, clearly labeled fragments, failure diagnosis, and optional applications. No mandatory quizzes.

Target abilities: build and reason about capture, one-to-one negotiation, signaling, traversal infrastructure, source/encoding control, data protocols, evidence-based diagnostics, group-call choices, and production invariants.

Environment: modern browser APIs; Node 24.22.1 dependency-free build and local server; no external service used by the default lab. Advanced server and encoded-transform integrations are explicitly marked.

Conventions: A impolite/B polite, one ordered signaling stream per live peer pair, pseudonymous call/incarnation identifiers, decimal media rates, binary memory sizes, explicit units and missing-data semantics. TypeScript source is canonical; JavaScript build output is generated.

Deliverables: guide, curriculum, ten complete chapters, continuous book with stable anchors and full source appendix, local companion source/build, selected resource research and machine-readable ledger, glossary, actual verification report, portable archive.

Scope: practical browser and service engineering. The course teaches enough protocol structure to read standards and diagnose behavior. It does not implement a native codec or a complete SFU, operate public relay infrastructure, or provide a production encryption/key-distribution scheme.

## Coverage matrix

| Family | Prerequisite | Teaching location | Actual companion or source | Verification boundary |
| --- | --- | --- | --- | --- |
| TypeScript/async/ownership | Programming | 1, 2, 10 | app.ts lifecycle | Syntax and control tests; browser lifetime unexecuted |
| Capture | Secure context and async ownership | 2 | camera/screen/reset | Source/static review; permissions and hardware unexecuted |
| Offer/answer and SDP | Browser events | 3 | local pair and SDP inspector | Negotiator mock and syntax; native connection unexecuted |
| Signaling/glare | Description state | 4 | peer.ts and two-tab transport | Queue/ignored-offer mock; browser collision unexecuted |
| Traversal/recovery | Signaling | 5 | restart/path display; credential helper | Credential known vector; TURN service not deployed |
| Media and encodings | Capture and negotiation | 6 | source replacement and cap | Syntax/static contract; browser encoding unexecuted |
| Application data | Open peer transport | 7 | bounded transfer and digest | Byte preservation, hash vector, drain/abort/close tests |
| Statistics and units | Transport/media pipeline | 8 | counter deltas and path display | Rate invariants and worked arithmetic; native reports unexecuted |
| Group architecture | Media/stats | 9 | calculator and optional SDK listing | Topology tests; SFU integration unexecuted |
| Production and security | All prior families | 10 | lifecycle baseline; pass-through worker | Explicit test matrix, syntax checks; no encryption/deployment claim |
