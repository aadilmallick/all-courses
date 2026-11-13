# 5. Reachability, relays, and recovery

## The call that works only at home

Your application works between two tabs and between two laptops on the same Wi-Fi. A customer joins from an office network and the call never connects. This is a classic boundary between application correctness and network reachability. The endpoints may agree perfectly about codecs and still have no usable route for packets.

Most browser applications initiate connections to stable public servers. Two browsers are different: either can be behind address translation, filtering, a VPN, or a network that blocks particular transport traffic. Their private addresses may not be meaningful to one another. WebRTC uses Interactive Connectivity Establishment, or ICE, to discover and test possible routes rather than assuming a single destination will work.

ICE is not a synonym for STUN or TURN. It is the process that uses gathered candidates and connectivity checks to choose a viable path. STUN supplies useful address and checking mechanisms. TURN supplies relayed transport addresses when direct connectivity is unavailable or when relay-only policy is desired. Signaling carries the information the endpoints need, but signaling itself is not the ICE route.

The local companion deliberately sets `iceServers: []`. It exercises same-machine host connectivity without relying on a public service. It will not demonstrate an internet TURN allocation merely because its log says connected. When you later test relay infrastructure, the selected candidate pair is the evidence to inspect.

## A concrete NAT example

Suppose a laptop sends a UDP packet from private endpoint `192.168.20.5:52000` to a public service. Its router may create a mapping so that the public service sees `203.0.113.40:62000`. These are documentation addresses used to illustrate the relationship, not real endpoints to contact.

The router maintains state connecting the internal socket to its external mapping. Another peer cannot safely assume that sending to the laptop's private address will work. Even learning the mapped address is not sufficient in every network: filtering rules or destination-dependent mappings may prevent incoming traffic from an unrelated endpoint.

NAT mapping behavior and filtering behavior are distinct. A simplistic label such as “symmetric NAT” often hides details. You rarely need to classify every home router before attempting a call. ICE gathers possibilities and performs checks; the application supplies the infrastructure and observes the result.

A VPN can change routing tables, DNS, source addresses, and filtering. Two applications on the same physical laptop can therefore observe different reachability, particularly when one runs inside a virtualized network environment. A working web signaling request only establishes that this one HTTP route works. It says little about UDP media routes or a TURN TLS connection.

## Candidate types as hypotheses

A host candidate represents an address associated with the endpoint's local networking environment. Browsers may conceal local addresses behind mDNS names for privacy. A server-reflexive candidate represents an externally observed mapped address learned using STUN. A relayed candidate represents an allocation on a TURN server. Peer-reflexive candidates can be learned during connectivity checks.

Treat each candidate as a hypothesis about reachability. Exchanging a candidate is not the same as selecting it. ICE forms local/remote candidate pairs and checks them. Some pairs fail, some succeed, and one suitable pair becomes selected for the transport. Gathering relay candidates does not establish that the call is using TURN.

| Candidate observation | What it establishes | What it does not establish |
| --- | --- | --- |
| Host candidate appears | Local candidate gathering succeeded | Remote reachability |
| Server-reflexive candidate appears | A STUN exchange produced an observed address | Direct media will pass |
| Relay candidate appears | TURN allocation succeeded | That relay is the selected path |
| Selected pair references relay | The transport selected a relayed candidate | End-to-end user quality |

The distinction saves money and debugging time. If you are testing TURN, force relay policy in a controlled test and inspect the selected path. Otherwise a direct route can succeed while the relay service is misconfigured, hiding the problem until a user needs it.

## What STUN can and cannot do

A STUN server can tell an endpoint the source address it sees. STUN messages are also used in ICE connectivity checks. This gives the system information and a checking mechanism; it does not create a universal permission through every firewall.

A public STUN server is not a free TURN service. Adding more STUN URLs does not solve every connection failure, and an unavailable or slow server can complicate setup. Use infrastructure with understood operating terms and performance for a deployed product. The book does not assume any third-party public server is a production entitlement.

If STUN works but direct traffic fails, the observed mapping might not be usable by that peer or the relevant traffic may be blocked. TURN provides a different hypothesis: both clients use addresses reachable through a relay service. The browser can establish a connection to a reachable relay even when it cannot receive direct traffic from the other endpoint.

## TURN adds a reachable intermediary

A TURN client authenticates and requests an allocation. That allocation supplies a relayed transport address. The browser manages permissions, channel binding, refresh, and packet forwarding under the protocol. Your application usually configures the server and credentials rather than implementing those exchanges.

A browser configuration can include different routes to the service:

```ts
// Configuration template: substitute your real service and short-lived credentials.
const configuration: RTCConfiguration = {
  iceServers: [{
    urls: [
      'turn:relay.example.com:3478?transport=udp',
      'turn:relay.example.com:3478?transport=tcp',
      'turns:relay.example.com:5349?transport=tcp'
    ],
    username: temporaryUsername,
    credential: temporaryCredential
  }],
  iceTransportPolicy: 'all'
};
const pc = new RTCPeerConnection(configuration);
```

The variables come from an authenticated application endpoint. They are not shared server secrets embedded in JavaScript. The domains are reserved examples and do not provide a service. Different URLs expose different client-to-relay transports; they do not imply the relayed media magically becomes an ordinary HTTPS request.

TURN over TCP or TLS can help on restricted networks, but enterprise proxies and firewalls may still reject it. Port 443 can improve reachability in some deployments when configured appropriately, yet “uses port 443” does not guarantee that an HTTP-only proxy will accept arbitrary TURN TLS. Measure your target environments.

A relay forwards transport-encrypted packets. It is not the same as an SFU that terminates the WebRTC media session. This makes TURN useful both for connectivity and for limiting peer-visible network addresses under relay-only policy. The relay operator still observes traffic metadata and volume; privacy statements should reflect the full system.

## Short-lived credentials step by step

Coturn supports a shared-secret credential mechanism commonly called its TURN REST API authentication. Despite that name, the credential generation itself can be performed by your own backend. The shared secret is known to the application backend and coturn. Clients receive derived temporary credentials.

A typical username contains an expiration timestamp and an identifier. The credential is a base64-encoded HMAC-SHA1 of that username using the shared secret. HMAC here is a keyed authentication computation used by this interoperability mechanism; it is not an example of inventing your own media encryption.

```js
// Node module; complete helper also included in examples/turn-credentials.mjs.
import { createHmac } from 'node:crypto';

export function turnCredentials(secret, subject, nowSeconds, ttlSeconds = 600) {
  if (!secret || !/^[a-zA-Z0-9_-]{1,64}$/.test(subject)) {
    throw new Error('Invalid credential input');
  }
  const expires = Math.floor(nowSeconds) + ttlSeconds;
  const username = `${expires}:${subject}`;
  const credential = createHmac('sha1', secret)
    .update(username)
    .digest('base64');
  return { username, credential, expires };
}
```

For a fixed time of 1,800,000,000 seconds and a ten-minute lifetime, expiration becomes 1,800,000,600. The browser uses the resulting username and credential for TURN authentication. The server and issuer need reasonably synchronized clocks; an otherwise correct credential can fail when their clocks disagree substantially.

A production credential endpoint authenticates the requester, checks call admission, chooses a bounded lifetime, rate-limits issuance, and avoids caching responses publicly. The identifier can be a pseudonymous accounting identifier instead of a person's name. Returning a derived credential limits its lifetime; it does not mean that credential is harmless to expose in logs while valid.

Credential expiration and existing allocation lifetime are related but not identical. Refresh and reauthentication behavior matters for long calls. Test calls that cross the credential lifetime and design renewal according to the chosen TURN server and client behavior. A ten-minute credential does not by itself prove that a two-hour call will continue correctly.

## Deploying coturn is a network task

Installing a package is only one part of operating a TURN service. The service needs a reachable public address, listeners for the intended transports, a relay port range allowed by host and cloud firewalls, correct address advertisement when behind NAT, authentication, and certificates for TLS endpoints. DNS must point to the intended service.

A narrow relay port range can simplify firewall configuration, but it constrains capacity. A publicly reachable listener with blocked relay ports can issue candidates that never carry useful traffic. Conversely, opening a large range without authentication creates an abuse and cost problem. Choose a capacity model, allocate ports, and validate both allocation and actual traffic.

Do not expose a relay as an unrestricted path to internal or sensitive destinations. Review the server's peer restrictions, address-family behavior, local management interfaces, and network placement. This is a concrete property of a public forwarding service, not a reason to avoid TURN. Use the coturn documentation matching your installed version for exact configuration directives.

The package includes the credential helper rather than an allegedly universal production configuration. Certificate paths, public/private address mappings, allowed peers, firewall rules, and distribution packaging are deployment-specific. A configuration that is correct for a directly addressed VM can be wrong behind a container NAT or cloud load balancer.

## Test the relay independently

Begin with candidate gathering using valid credentials. Confirm that a relay candidate appears. Repeat with intentionally invalid credentials and establish that allocation fails rather than granting anonymous relay access. Then place a call with `iceTransportPolicy: 'relay'` and inspect the selected local candidate through the transport's selected candidate pair.

Run the same checks across independent networks, including the environments your users actually use. Test UDP first, then a constrained scenario where only your intended TCP/TLS path is available. Record which client-to-relay transport was selected and how setup time and media quality changed. A same-LAN call is not a substitute for this experiment.

Monitor allocation failures, active allocations, relay traffic, authentication errors, and resource saturation. Separate credentials rejected from network unreachable; both can present to a caller as “connection failed,” but they require different operational fixes. Avoid exposing credentials in telemetry while adding enough identifiers to correlate application issuance with server-side outcomes.

## Selection, nomination, and continued consent

ICE checks candidate pairs rather than trusting a candidate's apparent attractiveness. A candidate priority helps order work, but a high-priority address that cannot exchange valid checks is not a usable route. The controlling and controlled roles coordinate selection under the protocol. Those roles are different from perfect negotiation's polite and impolite roles, so avoid assigning one application boolean responsibility for both concepts.

The selected route can involve a host candidate, a mapped address, or a relay, and it can change during a session. Do not hard-code a quality label such as direct equals fast or relay equals slow. A nearby relay on a good path can outperform a problematic direct route. The selected candidate type tells you topology, while measured delay, loss, and processing evidence tell you about performance.

Connectivity also includes continued consent. A browser must not send media indefinitely to an endpoint that no longer consents merely because it once answered checks. This is part of why a real-time transport maintains ongoing protocol state. The application does not gain a general-purpose packet-flooding primitive by obtaining a candidate string.

For operators, this means a route is more than a one-time open-port test. Stateful firewalls, NAT mappings, allocation refreshes, and path changes can affect long calls. A ten-second smoke test is useful but should be supplemented by sustained calls and transitions across the expected duration and network conditions.

## Build a reachability decision record

When validating a deployment, save a small record for each test: endpoint versions, network category, configured ICE policy, available candidate types, selected pair type and transport, setup duration, and whether media or data actually arrived. Use synthetic identities and redact addresses unless they are required for diagnosis. This record makes later regressions comparable.

A forced-relay success on one network establishes a specific fact under those conditions. Repeat across the target environments rather than turning it into a global reachability claim. Likewise, a failed direct path is not automatically a server outage if relay succeeds. Classify the result at the layer where evidence exists.

When a change affects coturn, certificates, firewall policy, or address advertisement, rerun the tests that exercise that component. When a UI text change has no transport effect, repeating the whole network matrix adds little value. Focus verification on the changed contract and unresolved risks, preserving a practical balance between rigor and useful engineering progress.

## Recovery is a state machine

A temporary `disconnected` state can occur during network disruption and may recover. `failed` is stronger evidence that ICE could not sustain connectivity. Do not immediately destroy a usable session after every transient state change. Apply a product policy with a grace interval, observed recovery, and bounded retries.

`restartIce()` asks the peer to use new ICE credentials in a subsequent negotiation. It does not itself deliver a new description to the other endpoint. Your negotiationneeded handler and signaling route must carry the restart exchange. Both peers then check routes for the new generation.

```ts
// Integration fragment: negotiationneeded is already handled by your controller.
let restartAttempts = 0;
pc.addEventListener('iceconnectionstatechange', () => {
  if (pc.iceConnectionState === 'connected' || pc.iceConnectionState === 'completed') {
    restartAttempts = 0;
  }
  if (pc.iceConnectionState === 'failed' && restartAttempts < 2) {
    restartAttempts++;
    pc.restartIce();
  }
});
```

This fragment illustrates the trigger, not a complete retry scheduler. A production owner should add backoff, prevent concurrent restarts, bound attempts over time, refresh credentials if needed, and stop retrying after hangup or authorization revocation. Resetting a counter on connection should not permit an infinite rapid flap cycle.

Reconstructing the peer connection is a separate recovery path. It requires reattaching tracks, creating new data channels, assigning a new incarnation, and rejecting old signaling. Prefer a clear escalation policy: try a bounded restart when appropriate, then rebuild or present a reconnect action. Randomly mixing both paths produces stale peers and confusing UI.

## Estimate relay bandwidth with units

Suppose one video stream averages 1.2 megabits per second and lasts 30 minutes. Thirty minutes is 1,800 seconds. Multiplying gives 2,160 megabits, or 270 megabytes using decimal units. That is media payload for one stream in one direction, before protocol overhead and retransmissions.

For a two-person call where both send at that rate, there are two such streams. A relay handling both directions sees ingress and egress. How a provider charges those bytes depends on its billing definition; do not assume “270 MB” is the invoice total. A model must name whether it counts media payload, one-direction egress, both directions, or all interface traffic.

Audio, screen sharing, bitrate adaptation, redundancy, and retransmission change the measured volume. Build estimates from expected usage, then compare them with real counters. TURN success rate is not a universal constant: geography, enterprise policies, and user networks affect how often relay is needed.

## Diagnose the office-only failure

Return to the opening failure. First establish whether offer and answer were received by the intended live peers. If signaling is complete, inspect candidate gathering: are relay candidates available when required? If not, check credentials, DNS, reachability, certificates, and server logs. If relay candidates exist but never become selected, examine relay ports, advertised addresses, and network filtering.

If the selected path is relayed and data flows but quality is poor, connectivity has been established. Move to rate, loss, delay, and processing evidence rather than declaring TURN broken simply because the video is blurry. A distant relay or a TCP path under loss can influence quality even while functioning correctly.

The expert outcome is a distinction between discovery, selection, transport, and user experience. You can now explain why a local success is valuable but incomplete, configure a real relay with the right credential boundary, and choose a recovery action based on state. Next we use the established path more deliberately by controlling media tracks and encodings.

**References:** [RFC 8445 ICE](https://www.rfc-editor.org/rfc/rfc8445.html), [RFC 8656 TURN](https://www.rfc-editor.org/rfc/rfc8656.html), [coturn project](https://github.com/coturn/coturn), [WebRTC TURN guide](https://webrtc.org/getting-started/turn-server), and [restartIce](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/restartIce).
