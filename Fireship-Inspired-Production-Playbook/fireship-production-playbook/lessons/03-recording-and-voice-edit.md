# 03 — Record useful pieces and build the voice track first

**Your result:** the finished narration for one short explainer, plus clean screen clips. You should already have the script, storyboard and an editor that successfully exports a test.

## Make the audio the structural backbone

An audio-first edit lets you solve the argument and delivery before spending time animating it. Record one or two sentences at a time. Leave a small margin before and after each take. If you stumble, pause and repeat the whole phrase with the same energy rather than restarting the entire video. Later you can choose the better take without rebuilding everything around it.

Use a slightly more deliberate delivery than a casual conversation, while keeping your normal voice. Emphasize the important word, not every word. “The JSON is valid. The answer is wrong.” needs a small separation so the contradiction lands. Increasing playback speed changes timbre and comprehension; perform the line at the desired energy instead.

Keep a consistent mouth-to-microphone relationship. Start around 10–15 cm for a suitable close-talk mic, test the manufacturer's guidance, then adjust for plosives and tone. Do not assume all microphones accept the same distance or speak into the same side. Aim slightly away from the breath stream and use a windscreen or pop filter where needed. [Shure recording education](https://www.shure.com/en-US/docs/education/Microphone-Techniques-for-Recording) explains placement as an important part of the recording chain.

Set gain with the loudest sentence you expect to say. An initial peak range around −12 to −6 dBFS gives room for variation; it is a practical starting point, not a loudness standard or a description of Jeff's settings. Avoid hitting 0 dBFS. Record a few seconds of room sound so abrupt changes in background noise become easier to notice during the edit.

## Record with the simplest reliable route

You may record directly into a mono dialogue track in your editor, or record a microphone-only scene in OBS and use that audio. Direct editor recording is convenient after you have tested input routing. OBS is useful when you want a consistent source setup. Disable duplicate input capture so your microphone is not accidentally recorded twice with a short delay.

Follow the [OBS Quick Start](https://obsproject.com/kb/quick-start-guide) for scene, source and audio setup. Use [Hybrid MP4](https://obsproject.com/kb/hybrid-mp4) with compatible H.264/AAC if your short import test succeeds; MKV plus remux is a useful fallback. These are current container choices, not an instruction to change an already reliable workflow. Record and import a thirty-second sample before a large session.

Create a dedicated browser profile with synthetic data and hide notifications. For a 1920×1080 screen recording, enlarge the editor font until the important line is readable in a small preview. Start around 24–32 pixels and judge the actual export; different fonts and zoom levels vary. Show the relevant pane, not a whole desktop full of tiny text.

## Assemble the narration

Place the chosen takes on the dialogue track in story order. Remove mistakes, repeated starts and pauses that do no work. Listen without visuals. Does the argument make sense? Are any edits swallowing consonants? Are you forcing the viewer to process two difficult ideas without a breath? Repair those issues before adding motion.

Use short fades or tiny crossfades where a cut produces an audible click. A click often comes from a waveform discontinuity; covering every edit with a large dissolve is unnecessary. Preserve natural breaths when they support cadence. Remove a distracting breath individually rather than applying aggressive gating that makes every word sound isolated.

Balance phrase levels with clip gain first. Compression can reduce excessive dynamic variation; it cannot undo clipped audio. A de-esser can reduce harsh sibilance; it should not turn speech into a lisp. Equalization should address a heard problem, such as muddiness, rather than copy someone else's numerical preset. Compare processed and raw audio at similar perceived volume so louder does not automatically seem better.

Adobe users can tag clips as Dialogue and use the documented [Essential Sound controls](https://helpx.adobe.com/uk/premiere/desktop/add-audio-effects/adjust-volume-and-levels/audio-editing-with-essential-sound-panel.html). [Auto-Match](https://helpx.adobe.com/in/premiere/desktop/add-audio-effects/adjust-volume-and-levels/auto-match-audio-loudness.html) helps align clips, but its displayed target is not a universal YouTube setting. Resolve users should use the [official Fairlight learning sections](https://www.blackmagicdesign.com/products/davinciresolve/training) for Recording VO and ADR and introductory audio, applying only what the current task needs.

## Capture code as prepared visual states

Finish and test the example before recording the teaching footage. Capture the initial result, the input, the relevant check and the final output as separate clips. Each clip needs a second or two of stillness before and after its important action. That gives you clean editing handles.

One useful reconstruction method is to remove prepared code in reverse teaching order, begin recording, then useUndo to reveal those blocks in forward order. Another is to record deliberate pastes. Keep the original code safe and verify the restored example afterward. This is an edited explanation, not a speed-coding demonstration; do not suggest the implementation was written instantly or generated by a tool if it was not.

When the narration needs longer than the screen action, hold a clean frame rather than repeatedly slowing the mouse movement. A viewer should not watch your cursor drift merely because the sentence is unfinished. Lesson 4 shows how to build holds and highlights. For your optional face segment, record one short orientation or closing sentence at eye level with a window or soft lamp and the same consistent audio.

## This week's practice

Monday 60 min: test placement, levels and input routing. Tuesday 75 min: record the script in short phrases. Wednesday 60 min: select takes and assemble dialogue. Thursday 75 min: repair timing and level differences. Friday 30 min: listen on headphones and ordinary speakers. Saturday 150 min: capture the prepared code/output states and optional camera sentence. Sunday 60 min: export an audio-led rough version and mark every confusing transition.

Done means the narration works by itself, no phrase clips or vanishes at an edit, and every essential screen action exists in a usable clip. That is the foundation for energetic editing. Effects cannot substitute for it.
