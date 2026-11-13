# 2. Capture, permissions, and the lifetime of media

## Start with a preview rather than a call

A caller needs confidence about what will be shared before a network connection starts. A preview also separates device problems from connection problems. If a camera cannot be opened locally, changing signaling will not fix it. We therefore build the media acquisition layer before attaching it to a peer.

The browser presents media through two related abstractions. A MediaStreamTrack represents a single audio or video track. A MediaStream groups tracks for convenient handling and synchronization relationships. A stream is not a video file, and it is not necessarily a network connection. A camera stream can be displayed locally, recorded, processed, sent through several connections, or used by none of them.

Think of a track as a handle to a live source. The analogy has limits: several tracks may share the same underlying device, including cloned tracks. Stopping one handle does not imply every other consumer of that device has stopped. Your ownership inventory should record the actual tracks your application acquired or cloned.

The lab begins with a synthetic track from a canvas. This removes hardware and permission from the first transport experiment. The Use camera button replaces that source with a real camera track. The same sender can therefore carry different sources over time without the application treating each source as a different participant.

## The smallest meaningful preview

Create this HTML in a secure page or use localhost:

```html
<button id="start">Start camera</button>
<button id="stop">Stop camera</button>
<video id="preview" autoplay muted playsinline></video>
<script type="module" src="preview.js"></script>
```

The following is the complete TypeScript module for that page. Compile or strip it into `preview.js` with your TypeScript toolchain. It is intentionally separate from the full lab so the resource lifecycle remains visible.

```ts
const preview = document.querySelector<HTMLVideoElement>('#preview');
const start = document.querySelector<HTMLButtonElement>('#start');
const stop = document.querySelector<HTMLButtonElement>('#stop');
if (!preview || !start || !stop) throw new Error('Preview markup is missing');

let active: MediaStream | undefined;
let revision = 0;

start.addEventListener('click', async () => {
  const mine = ++revision;
  try {
    const acquired = await navigator.mediaDevices.getUserMedia({
      video: { width: { ideal: 640 }, height: { ideal: 360 } },
      audio: false
    });
    if (mine !== revision) {
      acquired.getTracks().forEach(track => track.stop());
      return;
    }
    active?.getTracks().forEach(track => track.stop());
    active = acquired;
    preview.srcObject = acquired;
    await preview.play();
  } catch (error) {
    if (mine === revision) console.error(error);
  }
});

stop.addEventListener('click', () => {
  revision++;
  active?.getTracks().forEach(track => track.stop());
  active = undefined;
  preview.srcObject = null;
});
```

The requested width and height are preferences. `ideal` gives the browser room to choose a supported mode. The generation check handles delayed permission and repeated Start clicks. The old track is stopped only after a usable replacement arrives. This preserves a working preview if the new capture fails.

`muted` controls local playback, which prevents hearing your own microphone if audio is added later. It does not modify any transmitted track. `playsinline` asks supporting mobile browsers to keep playback inline rather than automatically using a full-screen presentation. Calling `play()` can reject because browser playback policies are a separate layer from capture permission; handle that failure as presentation failure rather than capture failure.

## Permission is a continuing interaction

A capture request may be approved, rejected, blocked by policy, or left unanswered. Do not show an endless spinner with no way to leave. Give the user an explicit waiting state and a Cancel action that invalidates the request's ownership. A Promise race against a timeout can update the UI, but it cannot cancel `getUserMedia()` itself. If the late capture resolves, release its tracks.

Permission also depends on document context. A cross-origin iframe needs appropriate delegation from its embedder. A device can exist while an operating-system privacy setting prevents access. A browser can remember a denial, so retrying immediately may not display another prompt. Your error message should explain the next useful action without asserting a cause that the error alone cannot prove.

| Error name | Useful interpretation | First diagnostic action |
| --- | --- | --- |
| `NotAllowedError` | Permission or policy prevented access | Inspect browser permission, OS permission, and document context |
| `NotFoundError` | No matching device was found | Check connected devices and requested kinds |
| `NotReadableError` | The device could not be read | Check hardware, drivers, and competing applications |
| `OverconstrainedError` | A required constraint could not be met | Inspect the failed constraint and relax requirements |
| `TypeError` | Invalid request or unavailable API context | Check options, feature presence, and secure context |

These are diagnostic categories, not a guarantee that every browser maps every platform failure identically. Preserve the browser's error name in developer logs. Translate it into a helpful user-facing explanation rather than exposing a raw exception as the entire product experience.

The MDN capture documentation also notes that an ignored permission prompt may never settle. This is why asynchronous ownership is a correctness requirement, not merely defensive programming for rare failures.

## Constraints, capabilities, and settings

Three names describe different questions. Constraints are what the application requests. Capabilities describe the source's supported range where exposed. Settings describe the actual current configuration. Treating constraints as settings produces misleading UI: requesting 1280 by 720 does not establish that those are the chosen dimensions.

```ts
// Integration fragment: cameraTrack is a live video MediaStreamTrack.
await cameraTrack.applyConstraints({
  width: { ideal: 1280 },
  height: { ideal: 720 },
  frameRate: { ideal: 24, max: 30 }
});
const actual = cameraTrack.getSettings();
console.log(actual.width, actual.height, actual.frameRate);
```

The fragment applies preferences to the source. The browser may crop, scale, or choose another supported mode within the constraint rules. An `exact` requirement can reject the request if it cannot be met. Use exact selection when the product truly requires a particular device or property; prefer adaptable settings when a fallback is acceptable.

Capture constraints and sender encoding parameters affect different stages. Reducing source resolution lowers work before encoding and may affect all consumers sharing that track. Reducing a sender's maximum bitrate constrains one outgoing encoding. A local preview can remain sharp while an outgoing stream is compressed more aggressively. Chapter 6 uses this distinction to avoid changing the wrong part of a pipeline.

Device selection usually combines `enumerateDevices()` with a deviceId constraint. Labels and identifiers are subject to permission and privacy rules. A blank device label does not prove no device exists. Persisting a device identifier forever is fragile because the device may disappear, browser storage may change, or the browser may rotate identifiers. Offer a default-device fallback and refresh the list on device changes.

## Muted, disabled, and ended mean different things

A track's `enabled` flag is application control. For an audio track, disabling produces silence; for video, it produces black frames as defined by the media track model. This is a useful ordinary mute operation because the logical track can remain attached. It does not imply that every capture source has been released.

The `muted` property describes a source temporarily unable to provide media. It is read-only application evidence, often paired with `mute` and `unmute` events. It is not the property to assign when the user presses Mute. A source interruption and an intentional user mute should have different presentation in a polished application.

An ended track cannot be restarted by setting `enabled = true`. Acquire another track if needed. Calling `stop()` immediately changes that track's ready state to ended, but do not rely on receiving its `ended` event as a result of your own `stop()` call. Run your cleanup directly when you initiate it. The browser may fire `ended` when an external action ends capture, such as the user ending screen sharing.

A video element also has a `muted` property, but it controls that element's audio playback. Disabling the camera track, disabling the microphone track, and muting the element are three separate operations. Naming helpers `setMicrophoneEnabled`, `setCameraEnabled`, and `setPlaybackMuted` makes the intended target visible in code reviews.

## Add audio deliberately

For a voice call, request audio alongside video or acquire it independently. A single combined request is convenient, but a failure to satisfy one requested kind can fail the whole request. Independent acquisition supports products that permit audio-only fallback after camera failure. Choose based on the experience you intend to provide.

```ts
// Integration fragment: invoke from your join/preflight flow.
const microphone = await navigator.mediaDevices.getUserMedia({
  video: false,
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true
  }
});
const microphoneTrack = microphone.getAudioTracks()[0];
```

These processing preferences are not a universal guarantee of identical sound. Browser support, hardware processing, and device routing vary. Speech-oriented processing can help conversation but can harm music, where suppression may treat desired sound as noise. Expose a suitable mode and verify the actual outcome on the target devices instead of assuming one constraint object is ideal for every audio product.

Echo cancellation aims to remove audio played by the device from its microphone capture. Feedback occurs when a signal loops through playback and capture with enough gain. Muting a local preview avoids one obvious loop, but running two audible tabs near the same microphone can still cause feedback. The delivered lab uses silent synthetic video and does not request a microphone, making its default experiment predictable.

## Screen sharing is a separate source

A display capture is selected by the user. The browser's chooser is part of the permission model. Your application should not promise silent capture of a particular window. Call `getDisplayMedia()` directly from a user interaction path, then handle cancellation as an ordinary outcome.

```ts
// Integration fragment: sender is a negotiated video RTCRtpSender.
// Keep the previous track live if you intend to restore it.
const previous = sender.track;
const display = await navigator.mediaDevices.getDisplayMedia({
  video: true,
  audio: false
});
const screen = display.getVideoTracks()[0];
try {
  await sender.replaceTrack(screen);
} catch (error) {
  display.getTracks().forEach(track => track.stop());
  throw error;
}
screen.addEventListener('ended', () => {
  const restore = previous?.readyState === 'live' ? previous : null;
  void sender.replaceTrack(restore).catch(console.error);
}, { once: true });
```

This fragment isolates the replacement mechanic. A full session must additionally check that the call is still current after each await, stop display tracks on hangup, serialize replacements, and update the preview. The companion includes call-generation checks and source restoration. The companion disables conflicting camera/screen acquisition controls while a request is pending and resets that gate on hangup. A production capture service may additionally need a queue for device and shared-source operations.

Screen audio is not the same as microphone audio. Availability depends on the selected surface, browser, and operating system. Requesting display audio does not guarantee receiving an audio track. Always inspect the returned stream. If screen audio and microphone audio must both be sent as one mixed source, a Web Audio graph can combine them, but the graph introduces its own audio context, user activation, cleanup, and echo considerations.

## Device selection as a recoverable workflow

A device picker is more than a select element filled once at page load. Before permission, labels may be restricted. After permission, the list can contain more useful names. A device can then be unplugged, become unavailable, or change its operating-system routing while the call continues. Treat selection as an intention that may need to be satisfied again, rather than a permanent binding to one identifier.

A practical flow starts with the default device. After capture succeeds, enumerate devices and show available alternatives. When the user chooses another camera, acquire the requested device using an exact deviceId only for that deliberate choice. Keep the old source until the new source is usable. If acquisition fails, leave the old preview active and explain that the selected device could not be opened. If no old source remains, offer a default-device retry or an audio-only path according to product requirements.

Subscribe to devicechange where supported, refresh the list, and preserve the logical choice when possible. A removed device should not leave a menu showing a selected camera that no longer exists. At the same time, avoid automatically switching to an unexpected camera without making the behavior clear. A room may contain sensitive surroundings, and the difference between the intended camera and a newly attached camera matters to the user.

Output routing is a related but different feature. Choosing a microphone affects capture; choosing a speaker affects playback. Speaker selection APIs have their own support and permission requirements. Do not assume that because enumerateDevices lists an audio output, every browser permits arbitrary programmatic routing to it. Use feature detection and provide a system-default path.

## Track clones and shared consumers

A clone creates another track handle associated with the source. That can be useful when a processing or ownership arrangement needs an independent handle, but it also creates another cleanup obligation. Stopping the original handle does not establish that all clones have ended. An application that saves only the original stream can therefore leave capture active through a forgotten clone.

Consider a preview and a recorder sharing one stream. If the preview component unmounts, it can detach its video element without stopping the source still needed by the recorder. When the entire call ends, the session owner can stop all handles it owns. This division is easier to maintain when acquisition happens in a capture owner and presentation merely attaches the provided stream.

Document whether a function borrows or owns a stream. A helper that borrows a stream should not stop it as an incidental cleanup step. A helper that acquires a new stream must release it on failure. These small interface contracts eliminate a class of bugs that otherwise appears as intermittent camera shutdown or a privacy indicator remaining active after the UI disappears.

## Recording is another consumer

MediaRecorder can record a MediaStream when supported. Recording does not happen automatically because media is transmitted. Conversely, local recording does not imply the remote endpoint is receiving the same content. Decide which tracks the recording represents and make that behavior visible to participants.

Choose a MIME type by checking `MediaRecorder.isTypeSupported()`, rather than hard-coding one container for every browser. Collect `dataavailable` blobs or stream them to a bounded destination. Calling `start(timeslice)` requests periodic delivery; it does not make callback timing precise, so long recordings need storage and interruption handling.

A minimal recording lifecycle is: create the recorder from the chosen live stream, attach handlers, start, stop, wait for the final data and stop events, assemble or persist the result, and release any object URL used for download. Releasing the recorder is separate from stopping source tracks because the call may still need them. A recording service adds consent, retention, upload, and access control decisions beyond this local browser API.

The delivered companion does not implement recording. The separation is intentional: this chapter teaches how to add that consumer without misrepresenting it as part of the tested lab. Before integrating a recorder, first decide whether it records local capture, remote tracks, a composed layout, or all sources separately. Those outputs serve different purposes and have different synchronization requirements.

## A worked lifecycle trace

Follow a realistic sequence. At revision 1, a user requests the camera. The prompt remains open. At revision 2, they leave the preview. At revision 3, they re-enter and request another camera. Suppose the first request now resolves. Its stored revision is 1, which differs from 3, so the acquired tracks are stopped immediately. The application remains in the newer request's waiting state.

Next, the second request succeeds and becomes active. The user shares a screen. Keeping the camera track live allows immediate restoration when screen sharing ends, at the cost of continuing camera capture while it is not transmitted. Some products prefer to release the camera during screen sharing. That is a product and privacy choice, and restoration would then require reacquisition rather than reuse of the ended track.

Finally, the user hangs up. The owner invalidates the call generation, closes peer connections, stops all owned source tracks, clears previews, and removes timers. If a late `replaceTrack()` continuation runs, its generation check prevents it from installing a source into the ended call. Good cleanup is therefore both releasing existing resources and preventing delayed acquisition from reviving them.

## Debugging capture with evidence

If the preview is black, first inspect whether the stream has a live video track and whether that track is enabled. Then inspect settings and whether the element has a source. Check `videoWidth`, playback errors, and whether CSS is hiding the result. A black frame can be the intended result of disabling a track; it is not automatically a decoder failure.

If the camera light remains on after a call, inspect owned tracks and cloned tracks before changing connection code. An old preview, recorder, or shared capture manager may legitimately hold a live track. If one component shares media with another, it should release its ownership without stopping a resource still owned elsewhere. A reference-counted capture service is one possible design; explicit session ownership is often enough for a small application.

The chapter's main outcome is a capture layer whose behavior you can explain when permissions are slow, devices change, or the user leaves. We can now connect that layer to a peer without making device ownership disappear inside networking code.

**References:** [MDN getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia), [MDN getDisplayMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia). Compatibility-sensitive features require testing on the target browser and OS.
