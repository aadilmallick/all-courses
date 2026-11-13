# Working glossary

| Term | Practical meaning |
| --- | --- |
| Signaling | Application-chosen delivery of negotiation and session-control information |
| SDP | Text session description interpreted under offer/answer rules |
| Offer/answer | Exchange establishing a compatible media/data arrangement |
| Glare | Competing offers created at approximately the same time |
| Polite/impolite | Complementary collision-handling roles in perfect negotiation |
| MediaStreamTrack | One audio or video track handle |
| MediaStream | Track grouping object, not inherently a connection or recording |
| Sender/receiver | Browser objects for outgoing/incoming RTP media |
| Transceiver | Sender/receiver pair with a negotiated media-section relationship |
| ICE | Candidate gathering/checking/selection process for connectivity |
| STUN | Protocol used for mapped-address discovery and connectivity-check mechanisms |
| TURN | Relay service/protocol supplying relayed transport addresses |
| Candidate pair | A local/remote candidate combination checked for reachability |
| NAT | Address/port translation with state and mapping behavior |
| DTLS/SRTP | Security components of WebRTC transport/media protection |
| SCTP | Message-oriented transport used by WebRTC data channels over DTLS |
| RTP/RTCP | Encoded media packet transport and associated control/feedback |
| SSRC | RTP synchronization-source identifier, not permanent participant identity |
| mid | Identifier of a media section within the negotiated session |
| RID | Identifier associated with an RTP encoding in relevant negotiated arrangements |
| NACK/PLI | Missing-packet feedback / picture-refresh request |
| Codec | Encoding/decoding scheme for media representation |
| Simulcast | Multiple encodings of a source for selective forwarding |
| SVC | Layered scalable encoding with dependency relationships |
| Jitter | Variation in packet timing under the metric's definition |
| Jitter buffer | Receiver buffer trading some delay for smoother playout |
| RTT | Round-trip time at a named measurement point |
| Backpressure | Producer pacing in response to bounded downstream capacity |
| SFU | Server forwarding selected encoded media to subscribers |
| MCU | Server mixing/compositing and re-encoding media outputs |
| Publication | Logical source made available by a participant |
| Subscription | Receiver's intent to receive a publication |
| Incarnation/generation | Application marker distinguishing a particular resource/session lifetime |
| End-to-end encryption | Content protection between intended endpoints under an explicit key/trust model |

Units: kbps/Mbps are decimal bit rates; KiB/MiB are binary byte quantities. A JavaScript string length is not its network byte length. A statistic's missing field is not measured zero.
