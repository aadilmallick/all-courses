# 11. Design a voice experience people can control

A web voice agent has two interfaces at once: the spoken conversation and the visible page. They should help each other. Speech is useful for quick questions, hands-busy interaction, and natural repair. The screen is useful for exact details, persistent choices, links, receipts, and controls. A good design assigns each kind of information to the channel that makes it easiest to use.

The recurring Harbor task gives us a concrete product flow. The user starts a conversation, explains a preference, reviews available slots, confirms a precise proposal, and receives a durable result. This chapter explains how to make that flow understandable when permission is denied, audio is blocked, the user interrupts, or the network fails. The companion's UX simulator is a deterministic model of those states, not a live microphone application.

## Explain the first action before asking for permission

A microphone prompt appears in browser chrome, outside your normal design. If it arrives without explanation, users may not know why the page wants access or whether audio will be recorded. Put a short explanation next to the Start control: what the assistant helps with, that it is AI, and where the microphone audio goes in the selected mode.

The first action should be specific. “Start voice conversation” is clearer than an unlabeled glowing circle. Avoid starting capture when the user only opens a page or expands a panel. If you offer a text mode, make it available before permission is granted so declining the microphone does not block the entire task.

After Start, show a waiting-for-permission state and an End or Cancel control. Permission can remain pending indefinitely. Cancelling should return the UI to a stable state and stop any tracks that arrive later. The delivered Realtime client handles that resource race; a production design should also explain how to retry after a denied permission.

Do not repeatedly trigger the permission prompt after denial. Show a concise explanation and a route to browser settings or text mode. The user may have intentionally chosen not to speak. A useful fallback preserves their goal rather than treating microphone access as the goal itself.

## Make the state visible and truthful

Users need to know whether the system is waiting, listening, working, speaking, muted, disconnected, or finished. These states should come from actual resources and events. An animated waveform is not evidence that microphone input is reaching the provider. A connected socket is not evidence that the user can hear output.

A compact state model helps avoid contradictions. Capture can be on or off, transport can be connecting or connected, and playback can be idle or active. The UI may combine these into a readable label, but keep the underlying states distinct. “Microphone muted; assistant may still speak” is more accurate than a generic “Paused” when only input is muted.

Use text and icons together. Color alone should not carry a critical meaning. A red indicator can help, but the label should still say that recording or microphone capture is active. Screen-reader users need the same meaningful state transitions. Do not flood a live region with every audio frame or token; announce useful changes at a human pace.

The companion's UX lab lets you trigger permission grant, denial, provider readiness, playback failure, and ending. Its displayed state changes are derived from the selected events. Reset returns all state to the initial condition. It teaches the state model without pretending to test browser permission or real provider connectivity.

## Keep controls available during the entire interaction

Start, mute, stop speaking, and end are different controls. Start creates a session. Mute affects input. Stop speaking affects current output. End releases the conversation's local resources and closes the session according to your implementation. If a single button changes meaning, label that meaning clearly and keep its behavior predictable.

End should remain usable while connecting or waiting for permission. It should not wait for a model response or a slow tool. A disabled End button during a network hang removes the user's most important recovery action. Treat local control as independent of remote progress.

Keyboard behavior matters. Use native buttons, visible focus, and a logical tab order. Avoid press-and-hold interactions that require a pointer without an equivalent keyboard route. For push-to-talk, explain whether a key is held or toggled, avoid global shortcuts that interfere with typing, and handle focus loss so capture cannot remain accidentally active.

Touch targets need enough room for real devices. A tiny microphone icon beside a scrolling transcript can be difficult to hit while the user is speaking. Keep the essential controls in a stable location and test narrow screens. Decorative animation should not displace the controls or create layout shifts during conversation.

## Use speech for the next useful step

Spoken answers should usually be shorter than written answers. The user cannot scan backward through sound as easily as through text. Begin with the result or next question, then offer detail. Harbor might say, “I found Wednesday at three or four. Which works better?” while the screen shows both options with full dates and timezone.

Ask for one meaningful missing detail at a time. “What day works for you?” is easier to answer than a long list requesting date, time, location, purpose, contact details, and notification preference at once. When several details are already known, do not ask again just because a script reaches that step.

Avoid reading formatting aloud. Markdown headings, bullet characters, raw URLs, and JSON fields belong to the display or developer tools. A voice response can summarize and point to a visible detail. For code-heavy developer products, offer to show an example rather than reciting every symbol unless the user asks.

A concise prompt can guide this style. The following is a design prompt, not an action performed by the package:

```text
You are Harbor, an AI appointment assistant in a web app.
Use one or two short spoken sentences per turn unless asked for detail.
Ask one necessary question at a time. Use the screen for exact slot details.
Treat tool results as facts; do not claim a booking until a receipt confirms it.
When interrupted, yield and incorporate the correction.
If information is missing, say what is missing and offer a useful next step.
```

These instructions support behavior, while backend validation enforces authority. Evaluate the prompt with examples rather than assuming that a well-written instruction guarantees compliance. Keep the version of the prompt with the model and tool configuration so regressions can be traced.

## Design repair as a normal part of conversation

Misunderstandings are inevitable. A good repair identifies the uncertain detail and makes correction easy. If Harbor heard Tuesday but the user meant Thursday, it should update that field and continue. It should not restart the entire onboarding flow or ask the user to repeat information that remains valid.

Use proportional confirmation. For a low-stakes search preference, a lightweight acknowledgement may be enough. Before a consequential write, present the exact proposal and obtain the confirmation required by the product. Over-confirming every harmless word makes the agent tedious; under-confirming dates or amounts can make it unreliable.

Avoid blaming the user. “I didn't catch the time” is more useful than “You were unclear.” If background noise is persistent, offer a different input mode. If the recognizer repeatedly misses a name, allow typing the name while preserving voice for the rest of the task. Multimodal repair reduces repeated frustration.

After an interruption, stop promptly and listen to the correction. A long apology that continues speaking can recreate the very problem being repaired. The strongest acknowledgement is often behavioral: the old audio stops, the visible proposal updates, and the next response uses the corrected value.

## Align transcripts with their actual purpose

A transcript can help users review what was heard and see the agent's answer. Mark interim recognition as provisional if it may change. Do not let a rapidly changing draft appear to be a committed business instruction. A final transcript is still not necessarily a perfect record, so allow correction of important fields through structured controls.

Agent transcripts may get ahead of audible playback. If the user interrupts, decide whether to mark the unplayed portion as interrupted, hide it, or preserve it with a clear status. Do not silently present the entire generated answer as though it was heard. For a receipt or action result, display the authoritative structured state separately from conversational prose.

Avoid excessive screen-reader announcements. Reading every transcript delta can conflict with the agent's audio and overwhelm the user. Provide a readable history, announce meaningful status changes, and let users choose how to consume the conversation. Test with assistive technology rather than assuming that adding an `aria-live` attribute solves the problem.

The delivered Realtime demo shows only the latest agent transcript to keep its purpose small. A production chat history, editable transcript, and text input are extensions described here rather than hidden features of the sample. The offline companion demonstrates state and control concepts without claiming to implement those full communication modes.

## Build a real text fallback

A text fallback should support the user's task, not merely display “Voice unavailable.” Let the user enter the same request, review the same structured proposals, and obtain the same receipt. Shared business logic makes this easier: voice and text become two ways to interact with the same task state.

The fallback should preserve context when switching modes. If the user has already selected Wednesday, do not discard that choice when audio fails. Keep accepted task facts in application state, independent of the provider session. When a new voice session starts later, restore only the approved relevant context rather than replaying all old audio.

Make the current mode visible. If text mode sends no microphone audio, indicate that capture is off. If voice remains active while the user types, explain that and keep mute available. Avoid a design where users assume typing stopped listening when the microphone is still live.

The sample's mention of text fallback is an explicit production extension, not a promise that its minimal page includes a text assistant. The distinction matters because a button labeled “Use text” that leads nowhere would be worse than an honest statement of the demo's scope. When implementing the capstone, make that route complete.

## Handle waiting without filling every silence

Some waiting is useful. A user may be thinking, looking at the screen, or checking their calendar. Do not immediately interpret silence as failure. For a pending lookup, a short acknowledgement can explain the state, while a visible indicator carries continuing progress without repeated speech.

Use a no-input policy appropriate to the task. A gentle follow-up after a reasonable pause may help, but repeated prompts can become intrusive. After continued inactivity, offer to end or return to text. Set a session cap and resource timeout on the backend as well; a visible idle screen should not imply that resources and costs are necessarily zero.

Do not use fake progress claims. “I'm checking availability” is appropriate when a lookup is pending. “Almost done” requires evidence about progress that many APIs do not provide. A neutral status with a working cancel control is better than an invented estimate.

If a tool takes longer than expected, keep its result authoritative when it arrives, but check freshness. The user may have changed the task while waiting. A late response should not overwrite the current screen or speak an outdated proposal. The generation and operation identity rules from earlier chapters are therefore also UX requirements.

## Design for language and speech variation

Ask or respect the user's language preference when the product supports multiple languages. Do not infer a permanent language from one accented word or a product name. Code-switching can be normal. Test recognition, reasoning, and synthesis together, because each component may support a different set of languages and pronunciations.

Dates and numbers are cultural as well as technical. Numeric date formats can be ambiguous, and a spoken time needs a timezone when context spans regions. Show an unambiguous date and speak it naturally. Resolve “tomorrow” using the user's intended local date, not the server's UTC day by default.

Allow more deliberate timing for users who need it. Slow speech, pauses, assistive input, or second-language formulation can make aggressive endpointing unpleasant. Offer alternatives without labeling the user as a problem. A pause control or push-to-talk mode can be a normal option available to everyone.

Avoid treating emotion recognition as certainty. A voice can sound hurried, soft, or frustrated for many reasons. Respond to explicit content and observable interaction problems. Keep the assistant's tone respectful and useful without claiming hidden knowledge about the user's internal state.

## Accessibility extends beyond captions

Captions and transcripts help, but accessibility also includes control, timing, focus, motion, contrast, and error recovery. A user must be able to start and end without seeing an animation. A hearing-impaired user needs access to the task's results and choices. A speech-impaired user needs an input route that does not depend on a recognizer accepting their voice.

Respect reduced-motion preferences. A continuously pulsing orb should not be required to understand whether the system is active. Use stable text status and optional animation. Avoid rapid flashes and high-frequency layout updates. The companion uses native controls and text results so its lessons remain usable without decorative motion.

Test zoom and narrow viewports. Long transcripts and code snippets should scroll within their own regions rather than forcing the entire page wider than the screen. Keep controls reachable after errors and ensure focus does not disappear when a connected state replaces a Start button.

Automatic checks are useful for obvious missing labels or contrast issues, but they cannot establish that a conversation is understandable with a screen reader or switch device. Include manual task walkthroughs on representative assistive setups before shipping. The verification report limits its claims to the automated and visual checks actually performed.

## Review the same result through two channels

Suppose Harbor finds two slots. The voice says, “Wednesday at three or four is available.” The screen shows the full date, timezone, and selection controls. If the user misses the spoken time, the choices remain visible. If they cannot use the screen, the voice can repeat the options and accept a supported spoken choice.

After selection, both channels should refer to the same proposal ID. Do not render a new visual option from a late lookup while the voice is asking confirmation of an older one. The shared task model keeps the spoken and visible interfaces aligned. This is a state-consistency requirement with a direct usability consequence.

After booking, the receipt stays visible even if the user stops speech. A short spoken confirmation can summarize it, while the screen preserves exact details and any next action. This division reduces the pressure to make the voice read every field and gives the user a reliable place to verify completion later.

## Evaluate the whole journey

Use task-based observation. Ask whether a user can start, understand what is happening, correct an error, stop speech, switch input mode, review a proposal, and recognize completion. Count repair turns and abandonment, but also inspect where confusion occurs. A high completion rate can hide an exhausting experience if every task requires repeated corrections.

Evaluate the first minute separately from repeat use. New users need a brief explanation; returning users may prefer a faster start. Keep the explanation available without reading it aloud every time. Preserve useful preferences only under the product's intended memory policy.

The capstone in the next chapter combines these choices with production metrics and economics. A successful voice agent is judged by the task it helps the user complete, the control it gives them along the way, and the truthfulness of its result—not by how elaborate its waveform looks.
