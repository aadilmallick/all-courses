# 05 — Record clear screens, clean speech, and occasional camera segments

[Course home](../README.md) · [Previous: Scripting](04-scripting-and-teaching.md) · [Next: Editing](06-editing-and-ai-production.md)

## A dependable recording station is a system

Your channel can begin with screen recordings and a small amount of face-to-camera footage. That fits your stated preference and your available eight to ten hours a week. You do not need to become a cinematic filmmaker before explaining a useful engineering idea. You need a system that repeatedly captures readable evidence and understandable speech without consuming the time you need for research, scripting, and the rest of your life.

Consider two recordings of the same extension. In the first, the screen is technically sharp but the code is tiny, a notification covers the result, and the microphone sounds distant. In the second, the relevant input and output fill the frame, the speech is close and consistent, and the cursor moves deliberately. The second recording makes the lesson easier to understand even if it uses a less expensive camera. Production quality matters through its effect on the viewer's task.

This chapter teaches a Windows-first workflow using OBS Studio for screen capture, an existing phone or webcam for occasional camera segments, and a separate editing stage. The exact controls depend on your installed versions and hardware. The procedures below are a recommended teaching baseline, not a claim that OBS, a camera app, or an editor was installed or operated on your computer while this curriculum was written. Current official documentation was inspected on November 13, 2026; test your actual setup before trusting it with a full recording.

Your first milestone is a thirty-second test that survives the complete path: capture, playback, editor import, export, and phone viewing. That small end-to-end test is more valuable than configuring every advanced recording option. It reveals the failures that matter while the cost of repeating the recording is low.

## Learn the five parts of the recording chain

The chain has a source, a capture process, a stored file, an editing process, and a delivered file. The source is what you intend to show or hear: your application, your voice, and perhaps your face. Capture converts those into digital media. The stored recording holds the result. Editing changes the sequence and presentation. Delivery creates a file suited to the audience's viewing environment.

A failure can enter at any stage. A tiny source font stays tiny in a high-resolution recording. A clipped microphone signal is damaged before an audio filter sees it. A file can play normally in one application yet lack a track in another. A clean local export can look softer after the platform processes it. Naming the stage helps you diagnose the problem without buying equipment or changing random settings.

Start with the viewer's delivered frame. Most of your first long videos can use a horizontal 16:9 frame at 1920 by 1080 pixels and 30 frames per second. These are course planning choices for spoken software demonstrations, not universal YouTube requirements. A frame is one image in the sequence. Resolution describes its pixel dimensions; frame rate describes how many images appear per second. More pixels can preserve detail, but they do not fix an overcrowded screen. More frames can make rapid movement smoother, but they add processing and storage requirements you may not need.

Use one consistent frame rate across the main screen recording, camera segment, and editing timeline when possible. If a phone offers 29.97 rather than exactly 30, understand which option your editor uses instead of assuming a mismatch is impossible. The first test will reveal whether your chosen combination causes a practical problem. For a static code explanation, consistent settings and readable composition matter more than chasing the highest available number.

## Start with what you own and upgrade the real bottleneck

Make a small inventory: computer, existing headphones, a microphone you can use, phone or webcam, a stable surface, and available daylight. Do not turn the first week into a buying project. Record the same paragraph with your available microphones in the same room and listen with headphones. The best available choice is the one whose speech is clearest in your actual space and position.

If spending becomes useful, use budget envelopes rather than assuming a particular product is necessary. A starter envelope might allocate roughly $50–$150 to a microphone and support, $20–$60 to a phone support, and $30–$100 to a small light. These are illustrative planning limits, not verified current product prices or a purchase recommendation. The upgrade order is usually room and placement first, then a microphone if needed, then support and lighting. A dedicated camera can wait until you have published enough to identify a specific limitation.

A USB microphone can simplify a desk setup because it connects directly to the computer. An XLR microphone usually requires an audio interface and adds configuration. Neither connector guarantees a pleasant recording. A lavalier microphone can be convenient for camera segments, but clothing friction can ruin a take. A headset microphone can be visually plain and still make a clear first video. Evaluate the result, not the category's reputation.

Keep one primary workflow for the first six videos. Constantly changing microphones, capture applications, and editors makes it hard to tell whether the improvement came from skill or equipment. Once you have a stable baseline, change one component, repeat the same short test, and compare. The discipline resembles a useful engineering experiment: control what you can, observe the result, and keep a record.

## Make the room help the microphone

Your microphone records the room as well as your voice. A bare wall, desk, and floor reflect sound, causing a hollow or distant quality. A closer microphone reduces the amount of room relative to direct speech, and soft furnishings can reduce some reflections. You do not need to build a soundproof studio. You need a manageable place to speak clearly for short blocks.

Choose a quiet time, close an unnecessary door, move away from a loud appliance, and listen for the computer fan under realistic load. A machine may be quiet when idle but loud while an AI demo or screen encoder runs. Do not block cooling vents to reduce noise. Move the microphone, reduce unnecessary background tasks, or record narration separately if the computer's workload makes clean live commentary difficult.

Place a desk microphone close enough that your voice is prominent, often around a hand span away as a starting experiment. The appropriate distance depends on the microphone. Angle it slightly away from the direct stream of air from your mouth to reduce bursts on letters such as p and b. Use a pop filter or windscreen if needed, then test. Speak across the microphone's correct pickup side; some desk microphones collect sound from the front rather than the top.

Record ten seconds of room tone: remain in position without speaking or touching the desk. Then record a normal sentence, a quieter sentence, and an enthusiastic sentence. Listen for hum, echo, mouth noise, clipping, and inconsistent distance. The quiet section helps you hear what the microphone hears when you are not talking; it is also useful material for smoothing edits later.

If the recording sounds hollow, move closer and try a different room position before applying aggressive processing. If it sounds boomy, increase the distance slightly or adjust the angle. If typing and desk impacts dominate, isolate the microphone from the desk or record the demonstration and narration separately. If clothing makes scratching sounds, reposition the lavalier. Each adjustment should address an audible problem you can name.

## Understand levels before adding filters

Digital audio has a maximum level. When a signal exceeds that limit, its peaks can be clipped, creating distortion. Lowering the volume afterward makes the distorted signal quieter; it does not recreate the missing waveform. Set the recording level while speaking the loudest sentence you expect to deliver, not while whispering a microphone test.

In OBS, watch the meter for the actual microphone source. A practical conservative starting point is ordinary speech peaking roughly between −12 and −6 dBFS, with louder emphasis still below 0 dBFS. Here dBFS means decibels relative to the digital maximum, so zero is the ceiling, not silence. This range is a course starting suggestion rather than a platform requirement. Adjust based on the full recording chain and listen to the result. OBS's [audio-mixer guide](https://obsproject.com/kb/audio-mixer-guide) explains the meter and clipping indicators.

Avoid fixing a distant microphone by turning up gain indefinitely. Gain raises room noise as well as speech. First improve placement, then set the input gain. Also check whether Windows or the microphone's own software applies automatic gain or noise processing. Multiple automatic systems can produce pumping, sudden volume changes, or an unnatural voice.

Begin with a clean raw signal and light processing. A noise suppressor can reduce steady noise; an expander can make quiet background sound less prominent; a compressor can reduce the difference between loud and quiet speech; a limiter can catch excessive output peaks. These tools solve different problems. OBS lists them in its [filter guide](https://obsproject.com/kb/filters-guide). Do not copy a complicated filter chain without comparing the unprocessed result.

For an initial teaching recording, leave most processing for editing so you can revise it. If you use a live limiter, remember that it does not repair distortion that happened earlier at the microphone or interface. A noise gate set too aggressively may remove the beginnings or endings of words. The warning sign is speech that sounds unnaturally chopped when you speak softly. Back off the setting and solve more of the noise problem physically.

## Prepare a teaching desktop

Before opening OBS, prepare the environment viewers will see. Use a separate browser profile or a clean set of tabs. Disable notifications, close personal messages, hide bookmarks and account details that are irrelevant, and use synthetic data. A demonstration should not expose employer code, customer information, credentials, private calendar items, or a terminal history containing secrets. This is a practical recording preparation step, not a reason to postpone making videos.

Use a project state you can reproduce. For the bookmark-to-study extension, keep the synthetic source note, the missing-field fixture, the false-answer fixture, and the clean result in named files. Record a brief note about which application state produces each shot. That preparation prevents the screen recording from turning into a live debugging session and ensures that the staged test cases remain truthful.

Set the editor font and terminal text to a size readable in the delivered frame. Hide panels that do not contribute to the current explanation. If a code file needs more width than the frame allows, simplify the view or show a focused excerpt. Do not rely on viewers using a large monitor. Your phone-viewing test is the practical standard for whether a critical identifier can be read.

Choose a consistent cursor size and move it deliberately. Avoid circling the pointer while searching for a button. Put the pointer near the relevant object, pause, perform the action, then pause again. Those small handles give the editor clean places to cut. If the cursor is irrelevant to a static diagram, move it away from the text rather than leaving it over the concept you want viewers to read.

Arrange desktop windows around a planned shot. One shot might show the supplied note and card preview. Another might show the validator and test output. The entire desktop does not need to remain visible across every shot. You are making a lesson from evidence, and you can record focused evidence in several takes.

## Configure OBS from a small known baseline

Download OBS only from the [official project site](https://obsproject.com/). Run its Auto-Configuration Wizard for recording rather than streaming if that is your task. The wizard is a starting point, not a substitute for testing. OBS's [quick-start guide](https://obsproject.com/kb/quick-start-guide/) explains scenes, sources, audio selection, and the need for a short recording test.

Create a scene collection named for your channel and a simple scene called “Screen.” A scene is a composition; a source is an input placed inside it. For example, your application window is one source and a webcam can be another. Start with the screen alone. Add the camera later after you have verified the screen and audio path.

Use Window Capture when you want a particular application rather than everything on a display. OBS's [Window Capture documentation](https://obsproject.com/kb/window-capture-sources) explains that source's scope. Window capture reduces accidental exposure from other windows, but it is not an absolute privacy guarantee: the selected application itself can still reveal private content, and source matching can behave differently when windows change. Inspect the actual preview before each take.

In the video settings, choose the intended canvas and output resolution, starting with 1920 by 1080 and 30 fps if your machine handles it. The canvas is your composition space; output resolution is the stored video's dimensions. If you capture a higher-resolution display and shrink it, inspect whether the text remains readable. You may be better served by resizing the application and increasing its font than by recording the whole monitor.

Choose a local recording folder with adequate free space. Keep active recording files on a reliable local drive rather than relying on continuous synchronization during capture. A synced folder can be useful for backup later, but simultaneous recording and synchronization add another variable to troubleshooting. Record a minute, measure the resulting file size, and estimate the space you need with a comfortable margin.

For compatibility, H.264 video with AAC audio is a sensible initial test combination. Your hardware may provide a suitable encoder; use the wizard or documented options rather than forcing a setting from someone else's computer. A hardware encoder can reduce some CPU load, but availability and quality depend on the device. If recording performance fails, reduce complexity before assuming the software is broken.

## Choose a resilient recording container

A **codec** describes how media is encoded; a **container** holds video, audio tracks, and related metadata. “H.264 in MP4” names both. Confusing the two makes troubleshooting difficult because changing the container does not necessarily change the video encoding or quality.

Older advice often says to record MKV and remux afterward. That remains a useful fallback. OBS also offers Hybrid MP4 in versions supporting it; the official [Hybrid MP4 guide](https://obsproject.com/kb/hybrid-mp4) explains its recoverability and compatibility design. For this course, try Hybrid MP4 with H.264/AAC if available, import the test into your editor, and keep it if the path works. If it does not, record MKV and use OBS's remux function to produce an editing-friendly file.

Remuxing changes how existing streams are packaged; it is different from re-encoding the picture. Keep the original recording until the edited result and backup are secure. The [standard recording guide](https://obsproject.com/kb/standard-recording-output-guide) documents MKV and the remux workflow. Do not choose ordinary non-resilient MP4 solely because the extension looks familiar without understanding the risk of an interrupted recording.

The important decision is the tested path, not loyalty to a container. Your editor, codec, operating system, and installed version determine practical compatibility. A two-minute test can show whether audio tracks appear correctly and whether seeking is smooth. If a format works in a player but not the editor, that is a compatibility observation you can act on; it is not evidence that the recording contains no useful media.

## Keep narration separate from application sound

If you record your voice and application audio into one mixed track, a notification or loud effect may be difficult to remove without damaging speech. Separate tracks preserve options. A simple setup is track 1 containing a safety mix, track 2 containing only the microphone, and track 3 containing only application or desktop audio when needed. Disable desktop audio entirely if the demonstration does not require it.

OBS's [multiple-audio-track guide](https://obsproject.com/kb/multiple-audio-track-recording-guide) explains track assignment and notes that ordinary players often play only one track at a time. Enable the tracks in the recording settings and assign the sources in Advanced Audio Properties. Then import a test and listen to each track separately. A moving meter alone does not prove the intended track was written to the file.

Record a three-part test: speak while the application is silent, trigger application sound while silent yourself, and then do both. In the editor, microphone-only material should appear where expected, application-only material should appear on its own track, and the mix should contain both. If you hear an echo, check whether the microphone is captured twice, whether monitoring is feeding back, or whether speakers are being recorded acoustically.

Headphones simplify monitoring because application sound is less likely to reenter the microphone. Avoid monitoring your own voice with noticeable delay if it disrupts your delivery. You can use a short playback test instead. Do not wear headphones merely because creators often do; use them when they solve a recording or checking problem.

For your first tutorial, a very simple strategy is to record silent screen actions and add narration afterward. This avoids typing noise and lets you explain at a controlled pace. The tradeoff is synchronization: you must align the words and actions in editing. Live narration can feel more natural but makes mistakes harder to separate. Try one thirty-second segment both ways and choose the method that produces clarity with less total effort.

## Record in short blocks with useful edit handles

You do not need one perfect uninterrupted take. Record one beat or section at a time, usually thirty to ninety seconds for a prepared explanation. Leave a brief quiet pause before and after the spoken line. If you make a mistake, pause and restart from the beginning of the sentence or thought rather than trying to splice individual syllables later.

Say the take identifier out loud before the usable material: “Section two, missing answer, take two.” This makes the recording searchable by ear and transcription. You can also write a quick marker in your shot list. A clap creates a visible waveform spike, but do not repeatedly clap close to a sensitive microphone at high gain. The goal is an identifiable point, not a loud sound.

Capture the result before recording a long explanation. If the extension's final state is working, record that proof shot immediately. Then collect the failure cases and process shots. You are less likely to finish a session with all the setup footage and none of the payoff. This order also reveals whether your planned script still matches the current project.

Record clean plates when useful: a few seconds of the empty interface, the final result, or the diagram with no cursor movement. The editor can hold these while narration explains a point. A clean plate is just a stable shot that provides room to adjust timing. It is especially useful when you narrate separately and need an extra second without repeating an action.

For a code demonstration, pause after pressing Run so the viewer can see the output before you begin the next thought. If a response takes time, record enough to establish the wait and the completed result. You can trim the middle with an honest transition. Do not speed up a tool comparison in a way that implies a faster real response time than you observed.

After each important take, check that a file exists and play a few seconds. At the end of the session, review the beginning, middle, and end of the longest recording. This is not a complete quality review, but it catches obvious missing audio or frozen capture while the environment is still set up and a retake is cheap.

## Add your face where it serves the lesson

Occasional camera segments can build familiarity and communicate judgment. You might appear for a fifteen-second introduction, a transition explaining a design decision, and the final invitation. The rest of the video can focus on the screen. You do not need a face overlay covering code for eight minutes to establish a human presence.

Use the phone or webcam you already have. Put it on a stable support close to eye level, clean the lens, and frame a medium shot with a small amount of space above your head. Look at the lens for the sentence addressed to the viewer. If you look at your own preview, your gaze will be slightly off. This is normal; you can reduce it by minimizing the preview once framing is set.

Choose a plain, relevant background and some distance from the wall when the room permits. A clean desk or shelf is enough. Do not spend hours arranging a symbolic creator set before you know whether viewers can hear you. Watch the background for mirrors, windows, name badges, papers, and screens that reveal things you did not intend to include.

Use soft daylight from roughly in front and to one side, or a diffused light in a similar position. Avoid placing a bright window directly behind you unless you know how to balance exposure. Turn off competing lights if they make your face alternate between orange and blue tones. Exposure determines overall brightness; white balance affects color neutrality. A stable, natural-looking face is a sufficient starting target.

If your phone supports focus and exposure lock, test locking them after you are seated so they do not change while you gesture. If it records HDR by default, consider a standard SDR recording mode for the first workflow to avoid unexpected color-management differences in editing. The exact controls vary by phone, so consult your device's current documentation rather than assuming the same menu exists everywhere.

## Synchronize a separate camera and microphone

If the phone records camera footage while the computer records clean narration, both devices have their own timing. Begin with a visible hand clap at a comfortable level while both are recording. The clap produces a visible contact moment and an audible spike. In editing, align the two, then mute the less useful audio track after checking the sync.

Check synchronization near the end of a longer segment as well as at the beginning. Devices can drift over time, especially with variable-frame-rate footage or inconsistent recording conditions. Short camera sections reduce the practical cost. If the lips look increasingly out of sync, split at a natural pause and realign, or use the editor's supported synchronization tools. Do not assume moving the entire clip once fixes gradual drift.

For occasional face-to-camera sentences, recording the clean microphone with the camera software may simplify the chain if your equipment supports it. The important question is whether the resulting file has good audio, usable video, and consistent sync. Test the simplest approach first, then add complexity only to solve a specific problem.

When recording separate narration, match the delivery to the intended visual. Speak the words while looking at the script's beat plan or the rough screen sequence. If the narration describes a button before it appears, note that alignment for the edit. Do not rush speech to match an accidental capture speed; the editor can often trim or hold a shot more naturally than you can speak unnaturally fast.

## Run a complete thirty-second acceptance test

Record a short segment containing your actual working conditions: a line of code at the chosen font size, an application interaction, normal speech, one emphasized sentence, and a brief camera shot if used. Include application audio only if it is part of the real video. Do not test with a silent desktop and then assume a GPU-heavy demonstration will behave the same way.

Play the recording locally with headphones. Confirm that the intended microphone is present, that both stereo channels behave sensibly, and that nothing distorts. Import it into the editor you intend to use. Verify that the frame dimensions, frame rate, and separate tracks are what you expected. Make a simple cut and export using your planned delivery settings. Then view the exported file on a phone.

Your acceptance questions are practical: Can I understand every word without turning the volume to an extreme? Can I read the specific code and result the lesson depends on? Does the screen move smoothly enough for the demonstration? Is the camera in sync? Does the export contain private or irrelevant information? Does the file open in the intended editor? If one answer fails, fix that stage before a full session.

Save the successful test settings in a small recording note. Include the date, OBS version, encoder, container, resolution, frame rate, microphone, input level, and any filters. This is a personal reproducibility record, not material you need to put on screen. When a future update changes behavior, you can compare against a known successful configuration.

Use the [companion](../companion/index.html) **production** experiment to explore how recording time, retakes, editing effort, and reusable setup affect your available hours. The calculator is a planning model, not a prediction of how quickly you should work. Your first actual session supplies the useful measurements.

## Diagnose common recording failures by stage

**Black or frozen screen capture:** Check that the intended window is open, that the source is visible and not hidden behind another full-frame source, and that the preview changes when the application changes. Try the source's documented capture-method options if necessary. Certain protected content cannot be captured, and you should not build a workflow around bypassing protection. A simple window or display test helps distinguish source configuration from an application-specific limitation.

**No microphone in the recording:** Confirm the correct device in Windows and OBS, check that it is not muted, and verify track assignment. A meter moving on another source does not establish that the microphone was recorded. Open the file in the editor and inspect the intended isolated track. If the microphone is present only in the safety mix, correct the assignment before the real take.

**Echo or doubled voice:** Look for duplicate microphone sources, desktop monitoring feeding back into the mix, or a camera microphone being captured alongside the main microphone. Mute one source at a time during a short test. A hollow, phasey sound often means two similar signals are arriving at slightly different times; more noise reduction is unlikely to solve that routing problem.

**Stutter or dropped frames:** Test while the real application is running. Close unnecessary workloads, reduce capture complexity, lower frame rate or output resolution if appropriate, and try a supported encoder. Keep the source readable after any reduction. If narration and application load conflict, record them separately. Do not keep repeating a long take with unchanged settings and hope the next file will be smooth.

**Audio crackles or robotic voice:** Compare raw and processed recordings. Excessive suppression or multiple enhancement systems can create artifacts. Check the device connection and sample-rate consistency, and try a simpler signal path. A mildly audible room can be less distracting than speech damaged by aggressive cleanup. Preserve raw recordings so you can revisit processing later.

**Camera brightness changes mid-sentence:** Check automatic exposure and changing light from windows or the monitor. Stabilize the lighting, test exposure lock where available, and avoid placing rapidly changing screen content as the main light on your face. If the image remains inconsistent, record the brief face segment separately under simpler conditions.

**Good local playback, bad editor import:** Check codec/container compatibility and whether the recording uses an unusual audio format. Try the tested remux path, preserve the original, and consult the editor's current documentation. Converting a copy can solve a compatibility problem, but re-encoding may affect quality and timing; inspect the result rather than deleting the original immediately.

## Use a two-week production rhythm

With an eight-and-a-half-hour weekly baseline, treat one six-to-ten-minute long video every two weeks as the initial production unit. A recording session should fit into that larger seventeen-hour envelope alongside research, scripting, editing, publishing, and review. Your first setup session may take two hours; the reusable routine should become shorter over time. The goal is reliability, not proving you can record on a punishing schedule.

A practical capture session might use fifteen minutes to prepare the desktop and microphone, ten for the acceptance test, thirty to forty-five for focused screen blocks, fifteen for occasional camera segments, and ten for review and backup. These are planning allowances, not performance standards. If the project requires more footage than this, simplify the explanation or split the topic rather than silently expanding the week's workload.

Batch compatible tasks. Record all clean screen results while the demo environment is stable. Record face segments together under the same lighting. Record replacement narration in a quiet block after the rough cut shows exactly what is missing. Batching saves setup time, but avoid recording several complete unvalidated videos in one marathon. You want feedback on the first finished workflow before multiplying its mistakes.

Keep an optional derived Short truly optional. If the long video contains a self-contained thirty-to-sixty-second insight, record a clean extra line that supplies context for a vertical edit. Do not let a separate Short concept double the filming session. A small number of consistently useful long videos can teach you more than a daily output target you cannot sustain.

## Organize and back up the useful material

Use a predictable folder per video: brief, script, screen, camera, audio, project, exports, and rights. Give takes meaningful names or keep a take log if the recorder generates timestamps. A file named with the date and section is easier to recover than “final-final-new.” Keep the original recordings, the editing project, the final export, the thumbnail source, and the claim ledger together.

Make a second copy after the session and verify a sample opens from that copy. A second file in the same folder is not much protection against a drive problem. You can use your existing backup arrangement; you do not need a new subscription solely for the first video. Keep active editing storage and backup responsibilities clear so that cleanup does not accidentally remove the only source media.

Record what rights or permissions support any non-original media. Your own screen recordings of a synthetic project reduce this burden. If you use music, stock footage, or a supplied logo, save the license or permission details relevant to your actual usage and plan. “Downloaded from the internet” is not a useful rights record. The editing chapter covers a simple asset ledger.

After a video is complete, note the reusable setup: scene collection, microphone position, lighting position, export preset, and any problem that required a fix. Update the routine when evidence supports an improvement. This turns production knowledge into an asset that compounds across uploads instead of a collection of settings you relearn every time.

## Application project and learning route

Create a private ninety-second teaching sample showing the extension's missing-field test or another small project you understand. Include twenty seconds of clear narration, readable input and output, one deliberate screen action, and an optional ten-second camera introduction. You do not need to publish it. Its purpose is to prove the capture-to-export path and reveal your first practical bottleneck.

The sample is complete when the final exported file has clear speech, readable evidence on a phone, no unintended private information, correct synchronization, and an organized source folder with a second copy. Write one paragraph stating what you changed after the first test and why. This builds a repeatable production habit without making perfection the entry fee for the course.

Use OBS's [quick-start guide](https://obsproject.com/kb/quick-start-guide/) for the initial setup, the [sources guide](https://obsproject.com/kb/sources-guide) when choosing inputs, and the linked track and container documentation for the specific path you use. Read the relevant section, perform a short test, and return to your actual video. Spending several weeks watching equipment tutorials without recording a sample will not establish the skill you need.

Your next task is to turn the recorded blocks into a coherent finished lesson. The editing chapter begins with organization and a rough cut, then adds the limited polish and AI assistance that help you publish consistently within your real schedule.
