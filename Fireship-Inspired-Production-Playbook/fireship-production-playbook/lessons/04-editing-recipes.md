# 04 — Learn seven editing moves and reuse them

**Your result:** a small library of original reusable edits. You need only one editor. Each recipe below has a purpose, procedure, practice task and failure test. The numerical timings are course starting points, not measured Fireship presets.

At 30 frames per second, six frames last 0.2 seconds. A keyframe records a property's value at a moment in time; the editor calculates the values between keyframes. Easing changes how quickly that change begins or ends. [Adobe's keyframe guide](https://helpx.adobe.com/premiere/desktop/add-video-effects/control-effects-and-transitions-using-keyframes/about-keyframes.html) provides a current explanation. In Resolve, start with the Inspector for clip transforms and titles; use Fusion later for composites that genuinely need it.

## Move 1: cut when the idea changes

**Job:** move attention to the object the narration now discusses.

1. Put a marker on the important spoken noun or verb: “parser,” “sum,” “check.”
2. Place the relevant shot so the object becomes visible at or just before that word.
3. Cut away the preceding shot's dead tail.
4. Replay two seconds before and after the cut. The viewer should know why the picture changed.

Use hard cuts as the default. A dissolve suggests continuity or elapsed time and can blur code unnecessarily. A visual beat can also be an annotation appearing while the same shot remains. Do not manufacture a full cut merely to satisfy a quota. Practise three cuts in a fifteen-second explanation, then remove any that makes the idea harder to follow.

**Failure test:** watch muted. If the shots seem unrelated, improve the visual relationship or the transition sentence. Watch with audio. If the new shot arrives after the important word, adjust timing. Smoothness is subordinate to meaning.

## Move 2: a large keyword card with a controlled pop

**Job:** make one central distinction memorable.

1. Add a solid background and a short title on a layer above it. Use your own color and type choices.
2. For the word FORMAT, start the title slightly smaller, around 90% of its final size.
3. Set another scale keyframe six frames later at 100%.
4. Apply a gentle ease-out if available. Preview; the motion should settle rather than float indefinitely.
5. Hold the settled word while it is relevant, then cut to the evidence.

Resolve: use a Text or Text+ title and its available transform controls. Premiere: use a text graphic and scale/position keyframes in its controls. An optional overshoot adds a brief 104% state before settling to 100%; remove it if the word becomes harder to read. None of these values is a secret creator setting.

Make three cards: FORMAT, MEANING and CHECK. Save them in your project template. A phrase with two important words may need two beats; a full sentence in a tiny rectangle needs rewriting. Practise reading the card in a small preview before animating it further.

## Move 3: a deliberate punch-in

**Job:** guide the eye to a specific result or line.

1. Begin with enough context to orient the viewer.
2. At the narration's emphasis, change scale from 100% to roughly 115% over six to ten frames.
3. Adjust position so the relevant line remains inside the frame.
4. Hold while you explain, then cut or return when context becomes useful again.

This is a teaching zoom, not a reason to enlarge every clip repeatedly. If you zoom on a low-resolution recording, the code may soften. Prefer capturing a tighter window with larger text; higher source resolution can help when the computer handles it reliably, but readable composition comes first.

Resolve: select the clip, use Inspector Transform controls and their keyframe diamonds. Premiere: use the clip's Motion Scale and Position properties. The exact panel layout varies with version. Learn two keyframes on an ordinary clip before attempting a complex animated camera.

**Failure test:** cover your annotation. Can someone identify the line being discussed? If not, the zoom may not be enough; use a highlight as well. If the text moves during the moment it must be read, settle earlier.

## Move 4: freeze the evidence and highlight one line

**Job:** decouple reading time from how quickly an action happened.

1. Choose a frame where the code or output is complete and the cursor is unobtrusive.
2. Create a still/frame hold using the installed editor's freeze command. Importing an exported still is a simple fallback.
3. Extend that still to match the explanation.
4. Put a translucent rectangle behind or beside the relevant line, with enough contrast to preserve the code.
5. Add a small label such as PARSES or WRONG SUM only if it clarifies the claim.

Adobe documents [Frame Hold](https://helpx.adobe.com/ph_en/premiere/desktop/edit-projects/change-clip-speed/freeze-a-video-frame-for-the-duration-of-a-clip.html) and a separate [Time Remapping hold](https://helpx.adobe.com/uk/premiere/desktop/organize-media/file-organization/freeze-a-frame-for-a-portion-of-a-clip-using-time-remapping.html). Use the simpler whole-clip still for this drill. Resolve users can find the current freeze-frame operation through command search or use a still image; the communication result matters more than matching another editor's shortcut.

Practise a four-second hold on the false result. Do not stretch a moving action if the only purpose is to keep text visible. A still lets the viewer read without confusing slow mouse movement. Check whether an animated selection cursor or an autocomplete panel accidentally obscures the evidence.

## Move 5: reveal code in meaningful blocks

**Job:** let the viewer connect one operation with one explanation.

1. Decide the teaching order: input, parse, check, output.
2. Record those states using a prepared Undo/paste sequence or capture separate screenshots.
3. Align each reveal with the corresponding narration.
4. Hold the final state long enough to understand the relationship.

Reveal complete meaningful units, not necessarily individual keystrokes. Typing animation can be attractive while wasting time on punctuation. A three-line expression should appear together if its meaning depends on all three lines. A brief crop or label can direct attention without hiding earlier context.

Your small demo is deterministic. Record it as an explanation of tested code, not a claim about how fast you originally wrote it. In a real application, test the restored state before recording the output. A visual reveal that accidentally omits a necessary import teaches a broken example.

## Move 6: build a diagram one relationship at a time

**Job:** make the system boundary understandable without a wall of text.

1. Draw three original cards:MODEL RESPONSE → PARSE → DOMAIN CHECK.
2. Start with the first card visible.
3. Reveal the second when you discuss structure.
4. Reveal the third when you discuss the task-specific correctness test.
5. Mark the second as pass and the third as fail using words plus symbols, not color alone.

You can make these as separate transparent images or text/shapes in the editor. Animate opacity or position modestly. Keep old objects in place while adding the next relationship so the viewer can build a mental model. Replacing the entire diagram at every sentence forces unnecessary reorientation.

Resolve's [Fusion training](https://www.blackmagicdesign.com/products/davinciresolve/training) is useful once you need connected composites; Introduction to Fusion should precede more elaborate motion graphics. Premiere users can make basic cards directly and use [After Effects learning](https://www.adobe.com/learn/after-effects) when needed. Do not make a 3D scene to explain a relationship three flat cards already communicate.

## Move 7: make one visual joke serve the concept

**Job:** create a brief release that reinforces the lesson.

1. Write the underlying contradiction in plain language.
2. Invent an original image treatment—for example, a polished certificate labeled OFFICIALLY WRONG beside the neatly formatted false sum.
3. Place it at the punchline, briefly enough to keep the argument moving, long enough to recognize.
4. Optionally add one quiet, licensed sound accent.
5. Return to the explanation with no extra transition unless one is needed.

Make the joke about the situation, not a claim that another person or tool did something you have not demonstrated. Do not collect and reuse a creator's branded animations, signature catchphrase, voice, thumbnail or meme sequence. Your creative advantage is a technical observation expressed in your own humour.

Avoid stacking a joke, new code, a flashing title and a loud effect at the same moment. One carries the meaning; the others should support it. Check the video without music. If the joke only works because the sound is startling, improve the visual idea or remove it.

## Practise the moves as a kit

Monday 60 min: create a fifteen-second cut sequence. Tuesday 75 min: make three reusable keyword cards. Wednesday 60 min: practise a punch-in that stays readable. Thursday 75 min: make the freeze/highlight and block reveal. Friday 30 min: remove one unnecessary flourish. Saturday 150 min: build the diagram and original joke; save everything in the template. Sunday 60 min: assemble a thirty-second technique reel and inspect it on a phone.

Open the [editing lab](../editing-lab.html) to scrub an original miniature sequence and compare linear motion with ease-out. It demonstrates timing, holds and hierarchy; it does not render a real editor project or contain Fireship footage. Reproduce the useful behavior in your chosen editor. Done means you can explain why each move exists and apply it without searching for a new tutorial every time.
