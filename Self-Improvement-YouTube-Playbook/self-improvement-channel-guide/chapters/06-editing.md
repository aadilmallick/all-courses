# 6. Edit for understanding, then add polish

Editing decides what the viewer experiences and in what order. A useful cut removes confusion, makes an example visible, or preserves the rhythm of a thought. An effect that does none of those things is optional.

Use one editor for the first six videos. This guide uses **DaVinci Resolve’s free version** as the default. Some current AI features require Studio or specific hardware; none are required here. Blackmagic’s current site identifies Resolve 21, while some official training files still refer to version 20. Core operations carry across, but button names and panels can vary. Use the lessons labeled Introduction to Editing and Introduction to Audio first. [Official training and practice files](https://www.blackmagicdesign.com/products/davinciresolve/training).

If your computer struggles even with small 1080p files, use a simpler editor you already have. Learning the sequence below is more important than adopting a particular brand.

## Set up the project once

Create folders named Footage, Audio, Graphics, Exports, and Project. Copy your source files into them before importing. Give the project a clear name such as `V01-Course-To-Project`. In project settings, set the timeline to the actual recording frame rate and 1920×1080 for the initial workflow. Resolve may offer to match the source frame rate on import; decide before substantial editing.

Import the footage through the Media or Edit page. The media pool is your library of source files. The timeline is the arranged sequence that will become the video. A video track holds picture; an audio track holds sound. Keep spoken audio on one or two clearly named tracks so you can adjust it consistently.

If playback stutters, generate proxy media or use the editor’s lower-resolution playback options. Proxies are smaller working copies linked to the originals; they are not an excuse to delete the originals. Do not spend a full session color grading a clip that cannot play smoothly yet.

## Pass one: assemble the argument

Place the best full take of each section in order. Use the viewer to find the beginning and ending of the useful part, then trim or split around it. Remove a failed take only after checking that the replacement contains the whole sentence.

A **ripple delete** closes the gap left by a removed section. It is useful for removing a failed start, but check the downstream timing. Clips placed on other tracks may shift unexpectedly depending on selection and track settings. Review every join rather than assuming the operation did what you intended.

Listen to the assembly without music or B-roll. Does the claim lead to an example, then a method, then a limit and action? If not, fix the order. A finished spoken assembly is often called an A-cut or radio edit: the core explanation works through sound before decoration.

## Pass two: make the speaking rhythm comfortable

Trim distracting pauses, repetitions, and verbal detours. Retain enough silence to let an important sentence land. Cutting every breath can make a calm lesson feel anxious. If one point is repeated three times, keep the clearest version rather than hiding the repetition under different camera crops.

A jump cut is an obvious change within the same camera angle. It is acceptable when it removes dead time without damaging meaning. If it interrupts a gesture awkwardly, cut at a more natural pause or cover the join with a relevant demonstration.

### Recipe 1: a gentle change of framing

For a new section, select the clip and adjust Zoom and Position in the Inspector for a slightly tighter composition. A small crop can distinguish a new beat. If the source is only 1080p, large crops will soften it; do not rely on the ability to magnify indefinitely. A genuine wider shot or full-screen notebook is often a better alternative.

Use a crop when the thought changes, not on a timer. There is no evidence-based requirement to zoom every few seconds.

## Pass three: add visuals that answer a question

Put supporting footage on a video track above the talking head while leaving narration below. Trim the support clip to the part of the sentence it explains. If it contains irrelevant camera noise, mute or remove that clip’s audio without deleting the main narration.

### Recipe 2: cover a cut with an actual demonstration

Suppose you say, “Write a finish line you can recognize,” then cut to the next sentence. Place a shot of writing that finish line above both sides of the cut. The speech remains continuous, and the viewer sees the action being described. The shot earns its place even if the underlying cut were invisible.

### Recipe 3: a J-cut or L-cut

A J-cut starts the next scene’s sound before its picture. An L-cut lets the previous scene’s sound continue after the picture changes. For example, continue your sentence while showing the notebook; that is an L-cut in this context. To create one, separate picture and audio trimming carefully or place B-roll above continuous narration. Keep lip-sync intact when returning to the speaker.

These are continuity tools, not effects you must use in every scene. If separating clips makes the timeline confusing, use the simpler B-roll-above-narration method first.

### Recipe 4: a clean three-step graphic

Create a plain background using a solid-color generator or an image you made. Add a basic Text title for “Finish line,” then another for “Next action,” then “Review.” Align them consistently and reveal each when you mention it. Static appearance or a short fade is enough.

If using motion, keyframe Position or Zoom between a starting and ending value. A keyframe stores a value at a specific time, allowing the editor to interpolate between them. Keep the movement modest and stop it before the viewer needs to read. Do not learn an elaborate Fusion animation before you can make a readable static card.

### Recipe 5: a truthful results chart

If your actual record contains eight planned evenings and five starts, show those counts directly. Label the observation period and definition of a start. A simple row of eight boxes may be clearer than a dramatic rising line. If numbers are illustrative, label them “illustrative”; do not let a polished chart imply measurement you did not perform.

## Pass four: make speech easy to hear

Open the audio mixer or Fairlight page. Balance clip levels so the viewer does not need to change volume between sections. Avoid red clipping indicators. If one word is unusually loud, adjust that section rather than crushing the entire track.

Use equalization only to solve a problem you can hear. A gentle high-pass filter can reduce low rumble; setting it too high can thin the voice. Compression reduces the difference between loud and quiet portions; excessive compression can emphasize room noise or make speech tiring. Start with a light voice preset if available, compare before and after at similar volume, and trust the recording over the preset’s name.

### Recipe 6: keep music behind the voice

For R videos, begin without music. For P videos, add it only if it improves the sequence. Lower music beneath speech and fade it at transitions. You can automate volume with points on the audio clip or track. There is no universal fader number that guarantees intelligibility because source tracks have different loudness. Check on a phone speaker at low volume.

YouTube’s [Audio Library](https://support.google.com/youtube/answer/3376882?hl=en) is a useful starting source. Check each track’s license and include required attribution. Keep the attribution text and track details with the project. “Royalty-free” does not mean every item found elsewhere is unrestricted.

## Pass five: match the image and add accessibility

Correct obvious brightness and white-balance differences before applying a stylized look. Skin should look plausible and important text should stay readable. Do not add a strong color preset to fix poor exposure; it often makes the problem more noticeable.

For captions, use a tool available to you or YouTube’s automatic caption draft, then correct names, punctuation, and misleading word errors. Captions are valuable for accessibility. Full-screen animated word-by-word subtitles are an aesthetic choice, not a substitute for an available corrected caption track. If you use burned-in captions, keep them away from important on-screen objects and interface controls.

## Export and inspect the actual file

For the initial 1080p SDR workflow, export an MP4 using H.264 video and AAC audio, at the source frame rate. YouTube lists 8 Mbps as a reference bitrate for standard-frame-rate 1080p SDR; an appropriate editor preset can also be a practical starting point. Use 48 kHz audio. These are delivery settings, not a requirement to change already-recorded speech to achieve a particular number. [YouTube upload settings](https://support.google.com/youtube/answer/1722171?hl=en).

Play the exported file, not just the timeline. Check the start, a middle section, all new graphics, and the end. Watch the whole file before publishing when practical. An export can reveal missing media, black frames, truncated audio, or unreadable text that the editing preview did not make obvious. Upload privately or unlisted for processing checks before making it public. Verify the processed playback and captions.

## Use AI on specific bottlenecks

An assistant can critique a script for vague claims, suggest alternative openings, or turn your outline into a shot checklist. Give it your actual evidence and instruct it not to invent experience or research. Treat every factual addition as unverified until checked.

Audio enhancement may help a difficult recording, but it can produce metallic sound or alter speech. [Adobe Enhance Speech](https://podcast.adobe.com/en/enhance) is one optional service to investigate; its page was reachable but plan details were not available in readable research output. No free quota or account access is assumed here. Use a short comparison before relying on any enhancer. Keep the untouched recording and avoid uploading sensitive material unnecessarily.

Automatic clipping, generative B-roll, and avatar tools are not priorities for your first six videos. They can increase output without improving the idea. Do not generate fake evidence of a personal experiment. Spend saved time on real examples and better explanations.

## Stop rules for both formats

For R: one clean spoken assembly, useful demonstration, balanced voice, corrected captions, and an inspected export. For P: the same foundation plus the small planned set of visuals and matching results. When the timebox is exhausted, remove optional effects. Never remove the evidence check or speech check to make room for animation.
