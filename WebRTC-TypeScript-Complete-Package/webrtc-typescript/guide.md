# A complete guide to learning WebRTC in TypeScript

WebRTC becomes easier when you learn it as several cooperating systems. A camera source, an offer/answer exchange, an internet route, a codec pipeline, and a room permission model are related, but each solves a different problem. This guide gives you the order for learning them and a practical way to use the included curriculum and textbook.

## The knowledge map

| Layer | The question it answers | Main browser or service concept | Chapter |
| --- | --- | --- | --- |
| Web/TypeScript foundation | Who runs this work and who owns it? | Promises, events, DOM, generations | 1 |
| Capture | What are we acquiring and releasing? | MediaStream, MediaStreamTrack, permissions | 2 |
| Negotiation | What can the endpoints exchange? | RTCPeerConnection, offer/answer, SDP | 3 |
| Signaling | How does intent reach the correct live peer? | Envelopes, ordering, perfect negotiation | 4 |
| Reachability | Which route can carry packets? | ICE, STUN, TURN, restart | 5 |
| Media control | Which source, format, and rate should be sent? | Transceivers, codecs, sender parameters | 6 |
| Application data | What do messages mean and when are they complete? | RTCDataChannel, backpressure, protocol state | 7 |
| Evidence | Which stage is failing or constrained? | getStats, deltas, selected pair, pipeline | 8 |
| Group architecture | Where does replication and selection happen? | Mesh, SFU, MCU, subscriptions | 9 |
| Production | Which invariants survive failures and adversaries? | Ownership, authorization, testing, operations | 10 |

These are dependencies rather than ten unrelated topics. Capture should work before you blame transport. Signaling should be understood before you debug stale ICE candidates. Counter units should be understood before you design automatic quality adaptation. The textbook follows this order and introduces prerequisites locally.

## Begin with the included experiment

Run `npm run build`, then `npm start`, using Node 24.22.1 from the package root. Open http://localhost:4173 and start a local call. Two native peer objects exchange a canvas video. This lets you study negotiation and media transport without permission or internet-infrastructure variables. The build requires no third-party packages and strips TypeScript annotations rather than checking types.

Read Chapter 1 while inspecting the event log. The aim is to connect each visible result to a specific responsibility. Local video demonstrates a source and presentation. Received video demonstrates another path. A data-channel open event demonstrates the application-data transport. None alone establishes that a deployed call will traverse an office firewall.

Move to Chapter 2 before adding real camera capture. Pay particular attention to stopping a call while a permission request remains pending. Correctness depends on rejecting stale ownership after the request resolves, not on hoping the browser finishes quickly.

## Build the connection in understandable increments

Chapter 3 uses a non-trickle local exchange to expose the exact offer/answer sequence. Follow the intermediate signaling states. Learn to read the important SDP lines without treating SDP as a hand-written configuration file. Then compare the small one-shot sequence with the more capable controller in `companion/src/peer.ts`.

Chapter 4 explains that controller: complementary polite/impolite roles, local-offer work flags, collision handling, an ordered receive queue, and disposal. Use two tabs with opposite roles to see how the delivery transport changes while negotiation principles remain the same. BroadcastChannel is a local teaching transport, so a remote project needs an authenticated replacement.

Chapter 5 introduces candidate gathering, checks, relay allocation, selected pairs, short-lived credentials, and recovery. Read it before adding a public STUN URL and declaring connectivity solved. A production traversal test must establish actual relay use under forced-relay policy across independent networks. The local companion does not perform that test for you.

## Learn the difference between source and arrangement

A person switching cameras changes a source. A person adding a screen alongside the camera changes the set of publications. Chapter 6 teaches which operations can preserve a negotiated relationship and which require negotiation. It also explains bitrate ceilings, codec capabilities, RTP feedback, simulcast, SVC, and quality policy.

Use the companion's camera replacement and cap controls as bounded experiments. An applied cap is a maximum, so a low-motion source may remain below it. A track replacement can reject when it exceeds what can be changed without negotiation. Treat those outcomes as part of the model rather than exceptions to memorize away.

## Give application data its own design

Chapter 7 builds from a text message to the included binary protocol. Follow metadata, chunks, the end marker, receiver hashing, and acknowledgment. Observe that successful local enqueueing is weaker than verified receipt, and verified receipt is weaker than persistent storage.

The synthetic payload is capped and held in memory. A real file-sharing feature needs user approval, storage limits, transfer identifiers, cancellation, and resumability decisions. Do not copy a send loop into a product without deciding how a receiver bounds its work.

## Diagnose before optimizing

Chapter 8 derives rates and delay averages with numbers and units. Use the included tests to inspect the arithmetic. Follow references from the transport record to the selected candidate pair instead of picking the first successful pair. Distinguish a network RTT from full conversational latency and received bytes from decoded frames.

When something looks wrong, locate the first stage without the expected evidence. If incoming bytes rise but decoded frames do not, changing a camera permission is unlikely to help. If decoded frames rise but the element is blank, inspect presentation. This method is more portable than a long collection of guessed fixes.

## Reach the expert architecture layer

Chapter 9 derives mesh costs and shows what an SFU changes. The calculator makes assumptions explicit and computes them, while the chapter explains what those assumptions exclude. It includes a documented optional LiveKit TypeScript integration and a comparison with mediasoup's lower-level responsibility model. No SFU deployment is bundled or implied.

Chapter 10 connects state ownership, authorization, encryption boundaries, recovery, testing, and operations. The encoded-transform example forwards frames unchanged; it is an extension-point demonstration, not encryption. A secure group encryption design needs a real key and membership protocol, and it affects recording and processing features.

## Use resources as a stack

Start with this textbook for the guided narrative. Use MDN for a method's parameters, errors, and compatibility caveats. Use official WebRTC samples for isolated behavior you can inspect and run. Use WebRTC for the Curious to deepen protocol understanding after the first API experiments. Use W3C and IETF definitions to resolve precise questions. Use the selected server's own documentation for deployment and SDK integration.

Research-resources.md records the actual inspection scope and links. An index inspected is not every linked sample executed; a documentation-checked SDK example is not a live SFU test. Keep the same evidence discipline when evaluating your own resources.

## Optional project progression

A useful progression is: local media lab, two-tab negotiation, authenticated remote signaling, deployed TURN, reliable one-to-one calls, then a group room with an SFU if the product needs it. Add file persistence, recording, or application-level encryption only after defining their contracts.

There is no required quiz or fixed weekly schedule. Read slowly, use each example to make one relationship concrete, and return to source and specification when an observed result differs from your model. The curriculum supplies detailed outcomes and optional application milestones; the textbook supplies the teaching and code reasoning.
