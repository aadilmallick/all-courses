# 4. Signaling that survives real users

## The missing delivery service

In Chapter 3 a function call delivered the offer directly to the other peer. Across computers, you need a service that delivers that same information. WebRTC deliberately leaves that delivery mechanism to the application. A WebSocket, an HTTP exchange, or another authenticated messaging channel can carry signaling. The transport choice does not remove the need to define who is speaking, which call the message belongs to, and how messages are ordered.

Start by separating the payload from its envelope. A description or candidate is a payload that the browser understands. The envelope identifies the application session and intended recipient. A valid candidate for yesterday's call is still wrong for today's call. Shape validation alone cannot establish session validity.

A useful production envelope contains a protocol version, call identifier, peer-connection incarnation, sender, recipient, message identifier, and payload. The server should derive the authenticated sender from the connection or token, rather than trusting a sender field supplied by the client. It should verify that both participants are authorized for the room before forwarding a description.

```ts
// Application schema sketch, not a browser API.
type Envelope = {
  version: 1;
  callId: string;
  connectionId: string;
  messageId: string;
  recipientId: string;
  payload:
    | { kind: 'description'; description: RTCSessionDescriptionInit }
    | { kind: 'candidate'; candidate: RTCIceCandidateInit };
};
```

`connectionId` identifies a particular peer connection lifecycle, not just a room. If you close a peer and construct another in the same room, delayed messages from the old instance should be rejected. An ICE restart is different: it can keep the same peer connection while changing the ICE generation. The SDP ICE credentials and candidate username fragments help distinguish those transport generations.

## Validate before invoking the browser

TypeScript cannot protect a JSON boundary at runtime. Receive text as untrusted data, enforce a size limit before parsing, parse into unknown, inspect the object, and then construct an internal message type. Reject unknown protocol versions and unexpected message kinds. Do not silently coerce an arbitrary value into a description.

```ts
// Integration fragment for the description portion of a signaling validator.
function descriptionFrom(value: unknown): RTCSessionDescriptionInit {
  if (typeof value !== 'object' || value === null) {
    throw new Error('Description must be an object');
  }
  const record = value as Record<string, unknown>;
  if (record.type !== 'offer' && record.type !== 'answer') {
    throw new Error('Unsupported description type');
  }
  if (typeof record.sdp !== 'string' || record.sdp.length > 256000) {
    throw new Error('Invalid SDP payload');
  }
  return { type: record.type, sdp: record.sdp };
}
```

The length bound is a chosen application policy, not a universal SDP limit. A real service must choose bounds that fit legitimate calls and reject abusive input before excessive resource use. This validator does not establish room membership, authenticity, or negotiation freshness. Those are envelope and server responsibilities.

Candidate validation additionally needs the candidate string and appropriate media-section association fields. You should not attempt to reimplement the full ICE candidate grammar with a casual regular expression. Validate the surrounding schema and size, then allow `addIceCandidate()` to perform its protocol validation. Preserve its failure when it concerns an accepted negotiation.

## Why hard-coded caller and callee fail

A one-shot demo assumes only the caller creates an offer. Real users add a camera, start sharing a screen, or change a transceiver after the call is established. Either endpoint may need to negotiate. If both create offers at once, each can reach `have-local-offer` before receiving the other's offer. That collision is called glare.

The solution is a deterministic conflict rule. Perfect negotiation assigns one peer the polite role and the other the impolite role. When an offer collides, the polite side accepts the incoming offer, allowing rollback of its conflicting local offer in modern implementations. The impolite side ignores the colliding offer. The roles must be complementary; two peers with the same behavior can deadlock or discard both proposals.

Polite does not mean permanently answering, and impolite does not mean permanently offering. After one exchange completes, either side can initiate another. The role resolves collisions independently of the current direction of media or who originally joined the room first.

The lab uses A as impolite and B as polite. This is convenient for two local tabs. A production service can assign complementary roles when establishing a peer pair. If client identities determine the ordering, use one consistent comparison rule and test it rather than relying on informal lexicographic behavior across mixed languages.

## Follow the negotiation controller

The canonical implementation is `companion/src/peer.ts`. It receives a peer, a role, a send function, and an error reporter. The important state variables are `makingOffer`, `ignoreOffer`, and `settingAnswer`. Their purpose is to describe application work that the browser's signaling state alone cannot fully express.

When `negotiationneeded` fires, the controller marks that it is making an offer and calls `setLocalDescription()` without an explicit argument. In a suitable stable state, the browser generates and installs an offer. The controller then sends the installed local description and clears the flag in a finally block. Clearing the flag after failure matters; otherwise one failed attempt could leave the application permanently believing an offer is in progress.

```ts
// Integration fragment from the negotiation algorithm.
const readyForOffer = !makingOffer &&
  (pc.signalingState === 'stable' || settingAnswer);
const collision = description.type === 'offer' && !readyForOffer;
ignoreOffer = !polite && collision;
if (ignoreOffer) return;

settingAnswer = description.type === 'answer';
try {
  await pc.setRemoteDescription(description);
} finally {
  settingAnswer = false;
}
if (description.type === 'offer') {
  await pc.setLocalDescription();
  // Send pc.localDescription through your ordered signaling transport.
}
```

The fragment assumes the surrounding flags and send operation provided by the canonical source. It is not a standalone signaling service. Its purpose is to make the decision visible before the full module adds event registration, serialization, and disposal.

The extra flag around a remote answer accounts for a brief asynchronous interval in the negotiation pattern. More generally, browser state changes occur through asynchronous operations, so application intent can become relevant before a state property changes. The controller should not replace that careful reasoning with a series of arbitrary timeouts.

## Trace simultaneous offers

Suppose A and B both add a receive transceiver. Both receive `negotiationneeded`, set makingOffer, install local offers, and send them. A receives B's offer while its own offer is pending. Because A is impolite, it ignores B's colliding offer. B receives A's offer and accepts it, rolling back its conflicting local offer through the supported remote-description behavior.

B now answers A's offer and sends that answer. A accepts B's answer and both return to stable. B's desired media change may still need another negotiation if it was not represented by A's accepted offer. The browser can raise `negotiationneeded` again once appropriate. The collision rule resolves the immediate conflict; it does not promise that every local intention fits into one offer.

Candidates related to an ignored offer can also arrive. A candidate failure associated with the intentionally ignored collision should not be reported as a new fatal connection failure. This is why the pattern keeps an ignore flag. Do not generalize that exception into ignoring all candidate failures: an error for an accepted description is useful evidence and may indicate misrouting or stale ICE information.

The lab's Simultaneous offers control requests new receive slots on both paired tabs. Browser event timing can differ, so a particular click may serialize naturally rather than producing a collision on every run. What matters is that both concurrent and nonconcurrent paths remain valid. A rigorous automated glare test uses controlled scheduling and asserts eventual stable state with working data afterward.

## Ordering and the incoming queue

A transport such as a WebSocket orders frames on one connection. It does not wait for your asynchronous handler to finish. If a description and candidate arrive one after another, two independent async callbacks can overlap. The candidate may be processed before the remote description operation has completed.

The canonical controller therefore chains incoming work:

```ts
// Complete queue pattern for an async apply function supplied by the owner.
let incoming = Promise.resolve();
function receive(message: WireSignal): Promise<void> {
  incoming = incoming
    .then(() => apply(message))
    .catch(error => report(error));
  return incoming;
}
```

Catching at the end keeps the queue usable after reporting a failure. This does not mean the application should continue indefinitely after every failure. The owner may decide that a protocol violation or unusable connection requires closing the session. Separate “the queue can accept another task” from “the call should remain active.”

The delivered negotiation module assumes one ordered stream per live peer pair, with a description preceding the candidates generated for it. If your transport can reorder across requests or reconnects, buffer candidates until their matching remote description has been accepted, bound that buffer, and associate entries with the correct connection and ICE generation. Do not blindly flush every old candidate into the newest peer.

## Trickle ICE and completion markers

Trickle ICE sends candidates as they are discovered rather than waiting for gathering to finish. This can reduce setup time because endpoints start checks earlier. Description exchange and candidate gathering therefore overlap. The signaling layer must preserve enough context to associate each candidate correctly.

An `icecandidate` event with a candidate object should be serialized with `toJSON()` and delivered. An object whose candidate string is empty can represent end-of-candidates for a generation. A null candidate has a different overall gathering-completion meaning in the event model. Applications should understand those distinctions before translating completion into their own protocol.

The companion forwards candidate objects and does not forward the final null event. Its route uses host candidates on one machine and does not depend on the null marker for connectivity. A production signaling protocol can explicitly carry the relevant completion information when needed. The omission is a bounded lab choice, not a recommendation to erase all completion semantics.

Non-trickle exchange, used in Chapter 3, is easier to transport manually but can delay setup. Trickle is usually preferable for interactive calls when both ends support it and the signaling system handles ordering correctly. Neither approach eliminates the need for TURN when direct routes are unavailable.

## What BroadcastChannel demonstrates

The two-tab lab uses a room name to choose a BroadcastChannel. Each tab has a random incarnation identifier. A hello/ready handshake pins the opposite tab before media negotiation begins. Messages are addressed to the accepted peer identifier, reducing accidental acceptance of a late message from a previous tab instance.

This is a same-origin teaching transport. Any suitably situated code in that origin may be able to participate. A room name is not authentication. BroadcastChannel is not an internet messaging service, and opening the same URL on another laptop does not bridge the two browsers. These boundaries let us teach negotiation without an account system or external infrastructure.

For a remote application, replace the send function with an authenticated transport and route received payloads to the same controller. The negotiator should not import UI elements or assume a particular WebSocket library. This small interface makes the core behavior testable and allows transport changes without rewriting the media state machine.

## A concrete server contract

A practical service starts with authenticated room admission. The server allocates or confirms a call identifier and a peer-pair incarnation. It gives both sides their complementary negotiation roles. Once both are ready, it forwards validated payloads in order. On departure, it announces that this incarnation ended and discards subsequent messages for it.

A reconnecting signaling client should not automatically replay every queued offer. If the peer connection survived, the application may resume that session after checking identity and state. If it was reconstructed, old descriptions belong to a different incarnation. Decide which recovery path is active before applying messages.

| Situation | Appropriate recovery question |
| --- | --- |
| Signaling connection reconnects, media still flows | Can the existing call resume control messaging? |
| Browser tab reloads | Which old peer instance must be retired? |
| ICE path fails | Can the same peer negotiate an ICE restart? |
| Authorization is revoked | Which media and signaling resources must close? |
| Server sees duplicate message ID | Has this message already been processed? |

At-least-once delivery, retries, and reconnect replay make message identifiers useful. SDP operations are not universally safe to repeat blindly. Deduplicate at the application protocol layer and define acknowledgment behavior, instead of assuming that “reliable transport” means each semantic action will occur exactly once.

## Select a signaling transport by its contract

WebSocket is a convenient default for bidirectional control, but WebRTC does not require it. HTTP polling can work with appropriate latency and ordering. Server-sent events plus authenticated POST requests can also work, but separate POST requests may complete out of order unless the client or server serializes them. A transport name is less useful than a written contract about ordering, reconnect behavior, authentication, and delivery acknowledgment.

Suppose offer message 10 and candidate message 11 are sent in separate concurrent HTTP requests. The server receives 11 first and forwards it immediately. Even if every request succeeds, the recipient may receive a candidate before its description. A sequential send queue solves this narrow ordering problem; sequence numbers and bounded reorder buffers can solve a more general one. Choose deliberately rather than assuming HTTP's reliability orders independent requests.

A browser data channel cannot normally bootstrap its own initial peer connection. It becomes available after the necessary negotiation and transport setup. Once established, it can carry some application control, but critical recovery signaling may need an independent route precisely when that data channel is unavailable. Keep a reliable way to renegotiate or rejoin when the media path fails.

For learning, manual copy/paste of complete descriptions is a valid transport with a very different latency and trust model. It demonstrates that signaling is information delivery, not a magical WebRTC-specific server. For production, use a service whose admission and lifecycle behavior matches the room. The negotiator's small send/receive interface lets you change the mechanism without changing the browser-level decision rules.

## Security and operational boundaries

Protect the signaling route with authenticated transport and room authorization. Rate-limit connection creation and message volume. Restrict message sizes. Avoid recording full SDP and candidate addresses in routine analytics, because they may contain sensitive network or session information. A support export can be more detailed when the user deliberately enables it and appropriate redaction is applied.

A call invitation also needs lifecycle rules. Who can invite whom? How long does an unanswered invitation remain valid? Can someone join after the original participant leaves? Those product questions affect signaling state, but they should not be smuggled into low-level perfect-negotiation flags. Keep room admission, invitation status, and peer negotiation as related but separate state machines.

The server does not need to understand every codec line to route signaling. It does need to enforce the application contract. Treating SDP as an opaque bounded payload can keep the service small, while accepting it from any unauthenticated sender would make that simplicity dangerous. The right boundary is a validated, authorized message whose browser-level contents are then checked by the browser.

## Debug a negotiation failure systematically

Capture the ordered message history with call and incarnation identifiers, message kinds, description types, and state transitions. You rarely need full SDP to establish that an answer arrived before a local offer or that the same message was applied twice. Start with metadata and reveal detailed session content only when required.

If both peers remain in `have-local-offer`, inspect their role assignment and collision flags. If candidates fail before any remote description exists, inspect transport ordering and asynchronous handler serialization. If a call works once but fails after hangup and rejoin, inspect instance identifiers and stale callbacks. If a new track never arrives while data remains active, inspect whether negotiationneeded was handled and whether the updated description was delivered.

Do not add sleeps as a substitute for the correct dependency. A delay that appears to fix one machine may fail on a slower network or after a browser update. Wait for promises, handle events, and serialize the operations whose order matters. This produces code you can explain rather than code that happens to work under one timing pattern.

We now have a reliable way to carry intent between peers and resolve simultaneous changes. The remaining obstacle is physical reachability: knowing what to say does not guarantee either endpoint can send packets to the other. That is the subject of ICE, STUN, and TURN.

**References:** [MDN perfect negotiation](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Perfect_negotiation) and [official perfect-negotiation sample](https://webrtc.github.io/samples/). The lab controller is an original TypeScript implementation of the documented pattern, with an explicit ordered-transport contract.
