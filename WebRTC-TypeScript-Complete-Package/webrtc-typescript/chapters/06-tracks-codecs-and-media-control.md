# 6. Control media without breaking the session

## One participant, several changing sources

A participant starts with a camera, switches to a screen, mutes, resumes, and later uses another camera. The person has not changed identity. Their logical publication may remain “main video,” even though its physical source changes. A robust application models those distinctions instead of treating every device change as a new participant.

The browser gives us several layers of control. A MediaStreamTrack controls a source handle. An RTCRtpSender transmits a source through one peer connection. An RTCRtpReceiver represents incoming media. An RTCRtpTransceiver combines a sender and receiver with a negotiated direction and media-section identity. Source selection, publication, and presentation therefore need separate identifiers.

In the companion, a canvas track is attached to a sender. Use camera calls `replaceTrack()` on that sender. The received video continues in the same media relationship. This demonstrates a central design idea: replace the content source when the negotiated arrangement can remain valid; renegotiate when the arrangement itself must change.

## Choose the operation that matches the intent

| Intent | Typical operation | Important consequence |
| --- | --- | --- |
| Ordinary microphone/camera mute | Set track `enabled` | Track can remain attached and live |
| Stop acquiring a source | `track.stop()` | Track ends and cannot be restarted |
| Change source of same media kind | `sender.replaceTrack()` | Often avoids renegotiation; can reject |
| Add a new publication | `pc.addTrack()` or `addTransceiver()` | Usually requires negotiation |
| Change send/receive intent | Set transceiver `direction` | Negotiated state changes after negotiation |
| Permanently stop a transceiver | `transceiver.stop()` | Not an ordinary temporary mute |

A table is useful here because the operations solve different problems. Calling `removeTrack()` to implement every mute can create needless negotiation churn. Stopping the source to mute saves some capture resources but requires reacquisition later. Setting a remote video element's muted property affects playback audio, not remote publishing intent.

`removeTrack(sender)` does not remove the sender object from all knowledge of the connection. Track, sender, transceiver, and SDP section lifetimes do not have to end together. Design against documented state instead of assuming a list becomes empty whenever a visible tile disappears.

## Replace a source as a transaction

A safe replacement acquires the new source, checks ownership, attempts replacement, and only then releases the previous source if it is no longer needed. If acquisition or replacement fails, the old source can remain usable. This is a small transaction with a clear commit point.

```ts
// Integration fragment; the owner must serialize this operation and check call generation.
async function changeVideoSource(
  sender: RTCRtpSender,
  acquired: MediaStream
): Promise<MediaStreamTrack> {
  const next = acquired.getVideoTracks()[0];
  if (!next) throw new Error('No video track in replacement stream');
  const old = sender.track;
  try {
    await sender.replaceTrack(next);
  } catch (error) {
    acquired.getTracks().forEach(track => track.stop());
    throw error;
  }
  old?.stop();
  return next;
}
```

The replacement must have the same media kind. A different resolution may work, but a replacement outside the negotiated envelope can require negotiation and cause rejection. Hardware encoders and particular formats can also impose constraints. Handle rejection as a real outcome, rather than assuming every camera can replace every screen source without negotiation.

If the old source is retained for restoration, as during screen sharing, do not stop it at commit. Retention has a resource and privacy cost. If another sender or recorder shares that old track, this helper must not unilaterally stop it. In a larger application the owner decides when a source is truly unreferenced; the sender should not guess.

For repeated replacements, serialize operations or use a dedicated operation revision. A call-generation check prevents work from an ended call becoming active. It does not prevent an older camera choice from overwriting a newer camera choice within the same call. The companion disables overlapping acquisition controls; a larger application should also serialize all source changes from device events, screen restoration, and other programmatic callers.

## Transceivers express a durable media arrangement

`addTrack()` is convenient when you already have a source. `addTransceiver()` lets you reserve a media relationship before capture is available. For example, a receive-only transceiver can request incoming video without acquiring a camera.

```ts
// Integration fragment: install the negotiation controller first.
const video = pc.addTransceiver('video', { direction: 'recvonly' });
console.log(video.direction);        // desired direction
console.log(video.currentDirection); // null until a direction is negotiated
```

Later, an application might attach a track and change desired direction to `sendrecv`, then let its negotiation flow communicate that arrangement. Keep `direction` and `currentDirection` separate in the UI and diagnostics. One expresses what your application wants; the other expresses the current agreed result.

A transceiver mid becomes meaningful after negotiation associates it with a media section. It is useful for correlation within that connection. It is not necessarily a stable product identifier across reconnects or another peer connection. A logical camera publication should survive those transport-level changes in your application model.

## Encoding turns pictures into a manageable rate

An uncompressed 1280 by 720 RGB image with three bytes per pixel occupies 2,764,800 bytes. At 30 frames per second, that is 82,944,000 bytes per second, or about 664 megabits per second before overhead. Sending raw images would overwhelm many user connections. A video codec exploits spatial and temporal structure to reduce the rate.

A keyframe can be decoded without depending on earlier pictures in the same way as predicted frames. Predicted frames reuse information from reference pictures, which saves bandwidth but creates dependencies. Losing important reference information can affect more than one displayed frame. A receiver may request a fresh keyframe to recover a usable decoding point.

This makes screen sharing different from camera video. Text and fine lines need readable detail, while a mostly static screen may tolerate a lower frame rate. Camera motion often benefits from smoother temporal updates. A single resolution/frame-rate target is therefore not a universal quality setting.

Codec choice also involves CPU, battery, hardware acceleration, compatibility, licensing constraints, and server support. A newer codec can save bandwidth while costing more processing on a particular device. Measure the real target workload, including simultaneous receive streams, instead of ranking codecs by compression efficiency alone.

## RTP, RTCP, and recovery feedback

RTP transports encoded media in packets with identifiers, sequence numbers, and timestamps. Sequence numbers help detect gaps and ordering. Timestamps support timing; their units are codec-specific clock ticks, not wall-clock milliseconds. SSRC identifies a synchronization source within the RTP context and should not be treated as a permanent participant identity.

RTCP carries control and feedback information around the media session. A NACK requests missing packets in supported recovery arrangements. A PLI requests a picture refresh because the decoder needs a new usable picture. These are related to loss but are not interchangeable. A high PLI count can reflect decoder recovery or stream switching behavior; it is not itself a direct percentage of network loss.

Retransmission has a deadline. A missing packet that can return before playback may help; a packet that arrives after its useful time may not. Forward error correction and redundancy spend extra bandwidth to improve resilience in some conditions. More repair traffic is not free: when the path is already congested, increasing offered load can worsen delay and loss.

The browser manages much of this automatically. Your application chooses sensible source targets, publication layouts, and encoding limits, and it observes whether quality is constrained by bandwidth or processing. Trying to micromanage every packet from TypeScript is the wrong layer for the usual browser calling application.

## Set a bitrate ceiling carefully

Sender parameters allow bounded adjustments to existing encodings. Read a fresh parameter object, modify permitted fields, then submit it. Do not construct a guessed parameter object from scratch or retain an old transaction indefinitely.

```ts
export async function capVideo(sender: RTCRtpSender, kbps: number) {
  if (!Number.isFinite(kbps) || kbps <= 0) throw new RangeError('Positive kbps required');
  const parameters = sender.getParameters();
  if (!parameters.encodings?.length) {
    throw new Error('No negotiated encoding parameters');
  }
  parameters.encodings[0].maxBitrate = Math.round(kbps * 1000);
  await sender.setParameters(parameters);
}
```

The input is kilobits per second; multiplying by 1000 produces bits per second. The property is a ceiling, not a command to generate exactly that rate. A static canvas may use far less bandwidth. Congestion control may choose a lower rate. Protocol overhead and the precise measurement point also mean that one counter will not necessarily equal this ceiling numerically.

Do not change the number or order of encodings through a parameter update. Establish an intended simulcast structure when adding the transceiver. Some parameter capabilities differ across browsers, and DOM typings may lag or lead an installed implementation. Catch rejections and verify observed output rather than treating a successful property assignment as proof of support.

In the lab, apply a low cap and inspect outbound rate over several intervals. The synthetic source is low motion and low frame rate, so the rate may already be below the requested ceiling. That is a valid result. To study compression quality seriously, use a representative source and compare stable intervals after adaptation.

## Codec preferences are capabilities, not inventions

Where available, transceiver codec preferences let the application order supported codecs. Build preferences from browser capability objects, preserve the required supporting codecs and relationships, and let negotiation establish the common subset. A made-up codec object does not install an encoder.

A simplistic filter that retains only one media codec can accidentally discard retransmission or redundancy support. An application that genuinely needs restricted codec behavior should understand how its selected codec capabilities relate to auxiliary formats and test both endpoints. Codec preference changes also need a negotiation path; do not assume every browser automatically emits the event you expect solely because preferences changed.

Prefer capability detection and an interoperability test over a user-agent-name shortcut. A browser brand alone does not identify the OS codec stack, hardware acceleration, or negotiated profile. Inspect the chosen codec through stats and the negotiated description when investigating a mismatch.

## Simulcast: several representations of one source

In an SFU call, different subscribers may need different resolutions. A participant shown as a small tile does not need the same stream as a full-screen speaker. Simulcast lets a publisher send multiple encodings so the SFU can forward an appropriate one without transcoding each subscriber's video.

```ts
// Configuration sketch for a new connection; verify support in your target stack.
pc.addTransceiver(cameraTrack, {
  direction: 'sendonly',
  streams: [cameraStream],
  sendEncodings: [
    { rid: 'low', scaleResolutionDownBy: 4, maxBitrate: 120000 },
    { rid: 'mid', scaleResolutionDownBy: 2, maxBitrate: 400000 },
    { rid: 'high', scaleResolutionDownBy: 1, maxBitrate: 1200000 }
  ]
});
```

For a 1280 by 720 source, scale factors 4, 2, and 1 suggest dimensions around 320 by 180, 640 by 360, and 1280 by 720, subject to implementation details. Those ceilings total 1.72 megabits per second. Simulcast can therefore increase publisher upload compared with a single encoding, while reducing wasted subscriber bandwidth through selective forwarding.

The identifiers and layer policy must agree with the SFU stack. Adding this snippet to a peer-to-peer demo does not create a complete adaptive subscription system. The companion's topology calculator uses a single-encoding model, so its SFU upload figure deliberately excludes this simulcast overhead.

Scalable Video Coding, or SVC, instead structures dependencies into layers within an encoding. Spatial layers concern resolution; temporal layers concern update rate. Available scalability modes depend on codec, browser, and server support. SVC and simulcast solve related adaptation problems through different encoding arrangements; neither is a universal checkbox that guarantees scalability.

## Content hints and processing pipelines

A track's contentHint can inform the browser about intended content, such as motion-oriented or detail-oriented video, where supported. It is a hint rather than a guarantee. Apply it to a live track and compare observed results under representative conditions. A readable screen at a lower frame rate may be preferable to smooth movement that makes text unreadable.

Browser processing can create new tracks from canvas, Web Audio, or more specialized APIs. The synthetic lab is an example: a canvas draws frames and `captureStream()` supplies a track. That loop also consumes timer and rendering resources. Background tab throttling can affect it, which is one reason not to treat its frame cadence as a calibrated camera or network benchmark.

Raw media processing and encoded transforms operate at different stages. Raw processing can alter pixels or audio samples. Encoded transforms handle compressed frames around the sender or receiver pipeline. Chapter 10 discusses the latter as an extension point for application-level encryption. Keep the distinction clear because the objects, timing, and performance constraints differ.

## Derive a useful resolution and frame-rate tradeoff

Suppose a camera is captured at 1280 by 720 and 30 fps, while the interface displays it in a 320 by 180 tile. The capture has sixteen times as many pixels per frame because each dimension is four times larger. Keeping that full source may be useful for a focused view or recording, but sending every small tile at full resolution wastes work when no consumer needs it.

Reducing frame rate from thirty to fifteen halves the nominal number of source updates. That can reduce work, but encoded bitrate does not necessarily halve: temporal prediction, motion, keyframe frequency, and rate control affect the result. Similarly, reducing dimensions does not produce a universal fixed bitrate ratio. Use pixel and frame counts to understand processing demand, then measure actual encoding rate and quality.

Screen text often benefits from preserving spatial detail while reducing frame rate. A fast-moving camera may benefit more from temporal smoothness. An application can therefore define different source policies for camera and screen publications. The source label is a useful product concept because it connects user intent to media policy without inferring intent from device-specific track IDs.

Keep receiver demand in view. A phone receiving twelve streams may need fewer active subscriptions even when each individual stream is well encoded. Server layer selection, subscription suspension, source constraints, and sender ceilings operate at different levels. The best intervention is the one that addresses the constrained stage while preserving the information users need.

Finally, test changes over a stable interval. Encoders and congestion controllers take time to respond, and content changes independently. Compare representative motion or screen activity, record the selected codec and resolution, and avoid interpreting a single one-second sample as the final effect of a parameter change.

## Make quality policy visible

A useful quality policy defines priorities. In a conversation, intelligible audio may take precedence over sharp video. In remote code review, screen text may take precedence over camera motion. In a gallery, limiting the number of active high-resolution subscriptions may improve the whole device's performance more than lowering every publisher's camera settings.

Choose how to degrade: resolution, frame rate, number of subscriptions, or temporary video suspension. Avoid rapid oscillation by using stable intervals and hysteresis, meaning different thresholds for degrading and recovering. For example, reduce a subscription after several constrained samples and restore it only after a longer period of headroom.

The browser already runs congestion control. Your product policy should complement it at a slower semantic level, not repeatedly override parameters every few milliseconds. A tight application loop reacting to every noisy counter can fight the browser's adaptation and produce unstable quality.

## A complete debugging path for source switching

Suppose camera-to-screen switching succeeds locally but the remote image freezes. First check whether replaceTrack resolved. If it rejected, inspect the negotiated envelope and the replacement track's kind/settings. If it resolved, inspect whether the source remains live and whether framesEncoded increases. Then inspect remote bytes, framesDecoded, and presentation.

If outgoing bytes continue but decoded frames stall, decoder recovery or format issues deserve attention. If outgoing frames stop when the tab is backgrounded, source generation or capture behavior may be responsible. If remote decoding continues but the visible element is frozen, examine the rendering and attachment layer. Each diagnosis points to a different fix.

A second failure occurs after screen sharing ends: the application restores a camera track that was previously stopped. The restoration request can install a handle that no longer produces usable content. Check `readyState` and either restore a still-live source or explicitly reacquire one. Do not assume a saved reference implies a live resource.

The core outcome is purposeful control. You can choose between changing a source and changing negotiation, reason about encoding limits with units, and understand why codec and layer choices must match the whole system. The next chapter applies similar discipline to arbitrary application data, where the browser provides transport but you must design the message protocol.

**References:** [replaceTrack](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender/replaceTrack), [setParameters](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpSender/setParameters), [setCodecPreferences](https://developer.mozilla.org/en-US/docs/Web/API/RTCRtpTransceiver/setCodecPreferences), and the [W3C WebRTC specification](https://www.w3.org/TR/webrtc/).
