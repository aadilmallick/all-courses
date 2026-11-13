# WebRTC resource research and reading strategy

Research date: **November 12, 2026**. This selection prioritizes primary documentation, project-maintained examples, standards, and explanations written by implementers. Pages were inspected selectively for relevant content and API contracts; this is not a claim that every linked document or sample was read or executed in full. The machine-readable ledger is [sources.json](sources.json).

## The most useful resource stack

| Resource | Best use | Where to use it in this course | Limitation to keep in mind |
| --- | --- | --- | --- |
| [MDN WebRTC reference](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection) | Method behavior, errors, event semantics, compatibility | Alongside every browser API chapter | Reference pages need a teaching sequence around them; some advanced options vary by platform |
| [Official WebRTC samples](https://webrtc.github.io/samples/) | Small inspectable experiments for one behavior | After the corresponding chapter's explanation | Sample index inspected; linked demos were not executed here; examples are not full production services |
| [WebRTC for the Curious](https://webrtcforthecurious.com/) | Protocol intuition and the relationship among signaling, connection, security, media, and data | After the first working call, then during Chapters 5–10 | Its authors explicitly position it as protocol-focused, with minimal code, so pair it with TypeScript experiments |
| [W3C WebRTC API specification](https://www.w3.org/TR/webrtc/) | Exact object behavior and state/operation rules | Resolve precise questions after learning the model | Normative algorithms are dense and are not a gentle first tutorial |
| [W3C stats definitions](https://www.w3.org/TR/webrtc-stats/) | Units, accumulation semantics, and relationships behind metrics | Chapter 8 and diagnostic implementation | A defined field is not proof that every target browser reports it |
| [WebRTC getting-started guides](https://webrtc.org/getting-started/peer-connections) | Short architectural orientation and basic connection flow | Chapters 1, 3, 5 | Their simple signaling abstraction does not implement your authenticated room service |
| [coturn](https://github.com/coturn/coturn) | Real TURN implementation, credential/configuration documentation | Chapter 5 and traversal capstone | Network placement, relay ports, credentials, and certificates must match the deployment |
| [LiveKit SDK and architecture docs](https://docs.livekit.io/reference/client-sdk-js/) | A room-oriented TypeScript SFU path | Chapter 9 and group-call capstone | Requires a real service and backend-issued tokens; SDK example was not installed or run here |
| [mediasoup documentation](https://mediasoup.org/documentation/v3/mediasoup/design/) | A lower-level media toolkit and explicit client/server responsibilities | Compare architecture choices in Chapter 9 | Your application supplies signaling and considerable room/control logic |
| [IETF RFCs](https://www.rfc-editor.org/) | Protocol definitions for ICE, TURN, data channels, and security | Advanced questions in Chapters 5, 7, 10 | Read the relevant RFC and errata with a concrete question, not as your first coding lesson |

For this learner, the strongest sequence is the included guided textbook → a relevant official sample → MDN details → deeper protocol reading → exact standards when a behavior remains uncertain. This ordering is an instructional recommendation based on each resource's inspected scope, not a benchmark of learning outcomes.

## High-value API reading

Read [perfect negotiation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation) after the first one-shot call. Concentrate on offer collision, complementary roles, and why application flags are needed alongside signalingState. Our controller additionally states an ordered transport contract and serializes incoming asynchronous operations.

For capture, compare [getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia), [getDisplayMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia), and [track.stop](https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamTrack/stop). The important relationships are permission versus playback, source lifetime versus transport lifetime, and application stop versus externally ended capture.

For media changes, compare [replaceTrack](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender/replaceTrack), [setParameters](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender/setParameters), and [setCodecPreferences](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpTransceiver/setCodecPreferences). They operate on different aspects of the session. Check rejection conditions and negotiation requirements before treating a property update as an observed result.

For data, read [RTCDataChannel](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel) and [send](https://developer.mozilla.org/en-US/docs/Web/API/RTCDataChannel/send) while tracing the bounded transfer. For recovery, read [restartIce](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/restartIce) together with the negotiation handler that must carry its new description.

## Standards and protocol reading

- [RFC 8445: ICE](https://www.rfc-editor.org/rfc/rfc8445.html) — candidate checks, roles, and selection.
- [RFC 8656: TURN](https://www.rfc-editor.org/rfc/rfc8656.html) — relay allocations, permissions, and refresh.
- [RFC 8831: data channels](https://www.rfc-editor.org/rfc/rfc8831.html) — SCTP's role in WebRTC application data.
- [RFC 8827: security architecture](https://www.rfc-editor.org/rfc/rfc8827.html) — origin, consent, communications security, and trust relationships.
- [WebRTC Encoded Transform](https://www.w3.org/TR/webrtc-encoded-transform/) — advanced compressed-frame extension surface. The inspected publication is a Working Draft, so support and semantics must be checked for the deployment.

The book explains these relationships in original prose and examples. It does not mirror the standards or redistribute external books. Full protocol implementation and native codec internals are outside the practical browser TypeScript implementation scope; the references provide a path when a concrete problem requires that depth.

## Version and inspection record

| Component | Recorded baseline | Meaning |
| --- | --- | --- |
| Core runtime/build | Node 24.22.1 actually used | Build strips TypeScript; no separate compiler was available |
| Browser APIs | Current inspected MDN/W3C contracts | No claim of universal browser support or executed browser tests |
| WebRTC W3C publication | Recommendation dated March 13, 2025 in inspected page | API reference baseline, including its noted amendments |
| Stats W3C publication | Candidate Recommendation Draft dated September 25, 2025 | Field definitions remain capability-sensitive |
| Encoded Transform publication | Working Draft dated June 25, 2026 | Optional advanced example, unexecuted |
| Optional LiveKit example | JS SDK reference v2.24.0 | Exact SDK version suggested for a separate integration project; not bundled |
| mediasoup material | v3 documentation | Architecture and integration responsibilities, no installed deployment |
| coturn material | Current repository README and authentication comments | Configuration concepts inspected; no server installed |

Node's unversioned documentation resolved to a newer documentation branch during research. The actual included build was verified against the installed 24.22.1 runtime, which is stronger evidence for this package than assuming the unversioned documentation matches it exactly.

## How to evaluate another tutorial

Prefer material that states its environment, shows complete setup, uses current track/transceiver APIs, explains signaling and TURN separately, handles cleanup, and names what was actually tested. Treat callback-era APIs, addStream/Plan B assumptions, hard-coded TURN secrets, unbounded send loops, and blanket claims about browser support as reasons to inspect carefully.

A tutorial can still contain useful intuition while its exact implementation is old. Translate the idea through current primary documentation, then test a minimal example. Avoid mixing snippets from incompatible eras until the result compiles: a successful build does not establish correct asynchronous protocol behavior.

No paid course recommendation or pricing comparison is included because this research did not verify one. The selected free official/project-maintained materials already cover the reference, experiment, protocol, and implementation roles needed by the curriculum.
