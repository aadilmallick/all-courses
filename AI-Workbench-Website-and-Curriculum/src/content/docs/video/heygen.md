---
title: HeyGen
description: Create scripted avatar lessons, review speech and performance, and understand the current v3 developer workflow.
sidebar:
  order: 5
---

## The problem: update a presenter without filming again

A software tutorial can become outdated because of one sentence. The navigation changes, a feature gets a new name, or a release date moves. Filming a presenter again may require a room, lighting, a camera, and another editing session. An avatar workflow makes the presenter another editable production component, while the approved script remains the source of truth.

HeyGen is relevant to this problem because its product and developer surfaces include avatar video, voice, translation, and broader video-generation workflows. This chapter concentrates on scripted presenter lessons. You will learn to write for speech, select an authorized presenter, create a first clip, diagnose pronunciation and performance, assemble factual screen evidence, and decide when programmatic production is justified.

Our example is a 75-second Beacon release lesson. Beacon is a fictional developer tool whose new review queue collects proposed agent changes. The presenter should explain the benefit, then hand attention to a real demonstration. The presenter must never imply that a synthetic performance is an actual customer's testimonial or a real executive's recording.

The guide was researched on November 13, 2026. No HeyGen account was used to generate media, and all scripts and production scenarios below are original instructional examples. Read [Foundations](/foundations/) for account, model, and evaluation basics.

## Separate application workflows from model APIs

HeyGen's current developer quickstart distinguishes direct model APIs from application APIs that reuse configured avatars, voices, templates, and brand assets. It documents a v3 workflow and says v1/v2 have passed their October 31, 2026 sunset. Do not begin a new integration by copying a popular older v2 tutorial. [Current developer quickstart](https://developers.heygen.com/docs/quick-start)

The application and API are different learning surfaces. In the application, you can inspect options and refine a single lesson visually. In an API workflow, your software must manage inputs, job tracking, failures, outputs, and publication. A subscription or feature visible in one surface does not establish access to every other surface.

Think of three layers: the script is the lesson's content contract; the avatar and voice are the delivery mechanism; the editing timeline combines delivery with evidence. If the lesson is inaccurate, changing the avatar does not fix it. If the pronunciation is wrong, adding more cinematic footage does not fix it. Diagnose the relevant layer.

For a first project, use an available stock presenter or another clearly authorized identity. Learn script and review mechanics before creating a custom likeness. Once you can produce one accurate lesson, decide whether templates or APIs would make repeated production more efficient.

## Understand the avatar mental model

An avatar video is a generated performance of supplied content. It can convey attention, rhythm, facial expression, and gestures, but it does not independently verify the content it performs. A fluent presenter can state an incorrect release claim with convincing confidence.

Separate identity, voice, script, and performance. Identity controls who the presenter appears to be. Voice controls how speech sounds. Script controls the words. Performance controls how those words are expressed through timing and movement. Some workflows combine these choices; others expose them separately. Your production record should still distinguish them.

For Beacon, choose a neutral presenter with a calm delivery. The script is explanatory, not promotional hype. The performance should be restrained enough that viewers can shift attention to the interface. Large gestures during a dense screen demonstration can create competing focal points.

The mental model resembles a presenter reading an approved script, but it has limits. A generated performance is not guaranteed to reproduce identical timing on every render, and a custom identity carries consent responsibilities. Review the rendered result rather than assuming that text correctness guarantees correct speech or appropriate motion.

## Build a fact sheet before writing narration

Create a short approved fact sheet for the release:

~~~text
Feature name: Review queue.
Purpose: Collect proposed agent changes for inspection.
User action: Open a change, inspect the diff and evidence, decide whether to approve.
Boundary: A queue entry is a proposal, not proof that the change is correct.
Demo environment: Beacon sample project with non-sensitive test data.
Next action: Review one sample change after watching.
~~~

This is original fictional source material. In a real project, use the actual release notes and have the feature owner verify them. A video assistant may help rewrite the wording, but it should not invent product behavior to make the narrative smoother.

Now identify words that may be difficult to speak: Beacon, API, CI, diff, repository names, feature flags, and version identifiers. Decide how each should sound. A written acronym can be pronounced as letters or as a word, and either might be wrong for your audience.

Keep claims narrow. “The queue groups proposed changes” is easier to verify than “Beacon makes every release safe.” The latter is a broad promise unsupported by a single workflow. Clear factual writing makes both video review and future maintenance easier.

## Write for a listener who cannot reread instantly

Spoken language needs a simpler structure than a documentation page. A viewer must hold the previous sentence in memory while looking at the interface. Use one action per sentence when explaining a procedure, and place the reason near the action.

Start with this original draft:

~~~text
Beacon now brings proposed agent changes into one review queue.

Open a change to see what changed and what evidence accompanies it.
Read the diff, inspect the checks, and compare the result with your request.

A passing check is useful evidence. It does not replace your judgment about
whether the change solves the right problem.

Try the queue with a sample change before using it in your regular release flow.
~~~

This script gives the presenter a purpose, a procedure, a boundary, and a next step. It avoids explaining every control while the viewer is still orienting themselves.

Read the script aloud yourself. Mark where you naturally pause and where you run out of breath. If a sentence feels awkward to say, it will probably feel awkward when performed by a synthetic voice. Rewrite before adjusting delivery controls. Better language usually improves both human and generated narration.

Do not force a fixed word count into a fixed time by speeding speech until it becomes difficult to follow. Cut secondary detail or divide the lesson. A short lesson with one clear outcome is more useful than a compressed feature inventory.

## Storyboard the presenter and the evidence

Use the presenter to orient and interpret. Use screen evidence to teach the exact action.

| Segment | Presenter role | Visual evidence |
| --- | --- | --- |
| Opening | Explain the benefit | Title and unobtrusive background |
| Queue orientation | Hand attention to the interface | Real queue recording |
| Inspect a proposal | Explain what to look for | Real diff and check evidence |
| Decision boundary | State the review responsibility | A simple approved text card |
| Closing | Give a practical next step | Sample-project instruction |

Avoid leaving a large avatar over the control being demonstrated. If the presenter remains visible, place them in a region that does not obscure important interface information. For a dense diff, it may be better to use voiceover only during the demonstration.

The title and product labels should remain normal editable text. Do not bake a release date into a generated background if you expect it to change. Keep the avatar clip, screen recording, and typography as separate components for as long as practical.

Create a rough timeline with placeholders before rendering all scenes. You may discover that a presenter paragraph is unnecessary once the real screen action is visible. Removing it early saves generation and editing work.

## First application walkthrough

Open a new video using the current avatar-creation route available in your account. HeyGen's documented Quick Avatar Video path describes choosing a presenter, adding a script, selecting voice and motion-related options, then generating. The article is a useful simple workflow, but its named engines may differ from the latest developer models or your current interface. [Quick Avatar Video guide](https://help.heygen.com/en/articles/12903996-quick-avatar-video)

Choose a stock presenter or an identity you are authorized to use. Select the intended orientation before composing the scene. Paste only the opening paragraph for the first test. Choose a voice that is clear and appropriate for the audience; do not select a voice solely because it sounds dramatic.

Preview any available audio or scene draft. Inspect pronunciation, pacing, and the emotional tone. Confirm the selected generation options and displayed charge. Generate a short test rather than the entire lesson.

The desired first result is a presenter who says the approved opening clearly, with an appropriate expression and enough compositional space for the title. It is not a deterministic expected output. Watch the full clip and listen without reading the script, then compare the actual words against the script.

Save the test with an explicit revision name. Record the presenter, voice, mode or engine, and any delivery settings that materially affected it. A later render may otherwise be difficult to match.

## Review speech in three passes

First, review factual correctness. Did the presenter say the approved words? Did a pronunciation change the meaning of a technical term? Did any generated wording add an unsupported claim? Correctness comes before naturalness.

Second, review intelligibility. Can a viewer distinguish the feature name, follow the sentence structure, and hear the pauses between actions? Listen on ordinary speakers, not only headphones. A technically clean voice can still sound rushed or monotonous.

Third, review fit with visuals. Does “open a change” occur when the cursor opens the change? Does the presenter continue talking about checks after the video has moved to the closing card? Timing is part of instruction. A viewer should not have to choose between listening and watching unrelated actions.

Keep a pronunciation sheet. For each difficult term, record the intended reading and the spelling or pronunciation control that produced it. Do not solve one pronunciation by silently changing the product's displayed name in captions. Spoken and written forms can be different while still representing the same term accurately.

If a sentence remains awkward after several voice adjustments, rewrite it. For example, replace “Inspect the CI artifact associated with the repository diff” with “Open the check results beside the code change” when that wording remains technically accurate for the audience.

## Review motion as communication

Gestures and facial expression should support the lesson. A celebratory gesture during a caution about reviewing evidence can feel incongruent. A large hand movement can distract from a small control on screen. A fixed smile may be unsuitable for a serious explanation of an error or limitation.

Use a performance note such as “calm, informative delivery, small gestures, clear pauses between steps.” This is a direction brief, not a guarantee that a particular engine exposes those exact controls. Use the supported controls in your selected workflow and review the actual result.

If the avatar's movement is distracting, simplify the scene or reduce the amount of time the presenter remains visible. A voiceover over a clear screen recording can be more effective than a full-time talking head. The presenter is a tool for attention, not a requirement for every second of the video.

Inspect mouth synchronization around difficult words, especially after changing audio or translating. Also inspect the beginning and end of the clip for abrupt motion or an awkward frozen expression. Clean entry and exit frames make the edit easier.

Do not equate more realistic motion with a better lesson. A restrained performance that preserves clarity can outperform a more expressive one in a procedural tutorial.

## Use translation as a new editorial version

A translated lesson is not merely the same video with different sounds. Sentence length, product terminology, formal address, and cultural expectations can change. The translated narration may need different screen timing or a different line break in an on-screen label.

Prepare a glossary before translating. Include Beacon, Review queue, proposed change, diff, check evidence, and approval. Decide which terms should remain in English and which should use the audience's established local terminology. Ask a competent reviewer to verify meaning, not only grammar.

Preserve procedural order. If the original says to inspect evidence before approving, the translation must retain that sequence. A fluent paraphrase that weakens the condition changes the lesson. Compare translated captions and audio against the approved fact sheet.

If your chosen workflow changes lip synchronization or voice identity during translation, review the rendered version separately. Do not approve a language version solely because the source language passed. Verify any required consent and rights for the selected voice and likeness in the intended use.

Keep a language-specific manifest and revision number. When the product changes, you need to know which localized lessons require updates. A single shared filename called final-video is insufficient for a maintained documentation library.

## Learn the current developer workflow without copying a retired recipe

The current quickstart documents direct Avatar 6 generation from a photo and an audio recording using v3. It uses an API key header, returns a job identifier, and retrieves the result through a status endpoint. A separate application route can reuse already configured assets. [HeyGen developer quickstart](https://developers.heygen.com/docs/quick-start)

The request below is an intentionally incomplete credential-free request illustration. The two example.com URLs are placeholders; replace them with permitted, accessible assets or use the documented upload route. It is not runnable as written and was not submitted.

~~~http
POST https://api.heygen.com/v3/models/avatars
X-Api-Key: YOUR_SERVER_SIDE_KEY
Content-Type: application/json

{
  "model": "heygen-avatar-6",
  "reference_images": [
    {"type": "url", "url": "https://example.com/authorized-presenter.jpg"}
  ],
  "audio": {
    "type": "url", "url": "https://example.com/approved-release-narration.wav"
  }
}
~~~

The method creates work, so it can incur a charge. The image supplies the permitted appearance; the audio supplies the approved speech performance. Your backend should record the returned job identifier before attempting another creation request.

Current documentation retrieves these model outputs through GET /v3/models/videos/{video_id}, waiting for a terminal status and then using the returned video URL. Do not reuse a status route from an older API generation without checking. [Avatar 6 documentation](https://developers.heygen.com/docs/models/avatar-6)

## Engineer a batch only after one lesson works

An API workflow is justified when you have a stable template and many controlled variations. For example, several product teams may need the same release-introduction structure with different feature names and approved scripts. The difficult part is managing the production state, not writing a loop that submits requests.

Represent each requested video as a record with an internal production identifier, script revision, approved input assets, model route, provider job identifier, status, output location, and reviewer. Keep the internal identifier separate from the provider's identifier. This lets you reconcile work even when a request is retried or a provider changes its response format.

Avoid blind retries after a timeout. The provider may have accepted the request even if your connection failed before the response arrived. Investigate whether the operation can be found or reconciled before creating a duplicate. Respect documented rate limits and retry guidance for the exact route you use.

Store API credentials on the server or in an approved secret mechanism. Do not place them in a public webpage, commit them to source control, or ask a colleague to paste them into a chat transcript. Client-facing code should receive only the limited information it needs.

Add a human review state before publication. A completed render is a technical event. An approved lesson is an editorial decision. Treating those as separate states prevents an automation from distributing an inaccurate but successfully rendered video.

## A local planning check you can run without a paid account

Before submitting a batch, validate that every record has the required editorial fields. The following Python script uses only the standard library and checks an original sample manifest. It does not call HeyGen.

~~~python
videos = [
    {
        "production_id": "beacon-review-en-001",
        "script_revision": "r3",
        "language": "en",
        "presenter_authorized": True,
        "script_approved": True,
        "reviewer": "release-editor",
    }
]

required = {"production_id", "script_revision", "language", "reviewer"}
seen = set()

for video in videos:
    missing = required - video.keys()
    if missing:
        raise ValueError(f"Missing fields: {sorted(missing)}")
    identifier = video["production_id"]
    if identifier in seen:
        raise ValueError(f"Duplicate production ID: {identifier}")
    if not video.get("presenter_authorized") or not video.get("script_approved"):
        raise ValueError(f"Editorial input is not approved: {identifier}")
    seen.add(identifier)

print(f"Ready for a submission review: {len(videos)} record(s).")
~~~

The required set defines the minimum metadata. The seen set detects duplicate internal identifiers. The two boolean checks represent an editorial policy for this example; they do not independently prove consent or approval. A real system should link to the underlying evidence and authenticated approval record.

Expected output is “Ready for a submission review: 1 record(s).” Change script_approved to False to observe the explicit failure path. This local check can catch missing preparation before any paid request, but it does not validate provider-specific parameters or the final media.

## Test the audio source independently of the face

When a workflow accepts a supplied recording, listen to that recording before asking an avatar to perform it. Check clipped peaks, background noise, long silences, and whether the speaker actually follows the approved script. A visually convincing render cannot restore a missing word or resolve an ambiguous sentence in the source audio.

For Beacon, compare the spoken phrase “before deciding whether to approve” with the source script. If a recording accidentally omits “before,” the instructional sequence changes. Fix the source and preserve a new audio revision, then rerender only the affected segment where the workflow permits it. This keeps the troubleshooting chain clear: source content, generated performance, and final edit are separate artifacts.

Also check the audio-only version for accessibility and reuse. A clear approved narration can support a transcript, an audio lesson, or a screen-recorded variant even if you later choose a different presenter.

## Measure the lesson, not only the avatar

Use an original rubric with six dimensions: factual fidelity, speech clarity, pronunciation, performance suitability, visual alignment, and maintainability. Score each from zero to two, while treating unauthorized likeness and false claims as automatic failures.

For factual fidelity, compare the final spoken wording with the fact sheet. For clarity, listen without captions. For visual alignment, watch without sound and identify the action at each point. For maintainability, ask whether you can update one sentence without reconstructing the entire project.

Then run a short task observation with a person who has not seen the production plan. Show the lesson and let them find a sample change in the demo queue. If they cannot locate the control, the problem may be the screen recording or narration timing, not the avatar's realism.

Record which changes improve comprehension. A slower sentence, a shorter screen action, or a momentary highlight can help more than a different presenter. This keeps iteration focused on the user's learning outcome.

## Troubleshooting by layer

| Symptom | Layer to inspect | Practical response |
| --- | --- | --- |
| Technical term sounds wrong | Script and pronunciation | Use a glossary and test the term in a short clip |
| Presenter feels overly excited | Voice and performance | Use a calmer delivery or reduce visible presenter time |
| Correct audio but wrong timing | Edit | Align narration with the actual screen action |
| Old sample endpoint fails | API version | Rebuild from current v3 documentation |
| Input cannot be fetched | Asset delivery | Verify a direct accessible file or documented upload |
| Duplicate videos appear | Submission tracking | Reconcile accepted jobs before retrying |
| API access differs from app | Entitlements | Verify the exact surface and account plan |
| Finished clip misstates the feature | Content review | Correct the script and rerender the affected segment |

Keep errors and non-sensitive job identifiers for technical support. Keep time-coded observations for editorial review. Those records serve different purposes and should not be mixed with credentials or confidential source data.

If a feature is absent from the current interface, check official documentation and account availability. Do not infer that it has been renamed merely because an older help article uses different wording. Product surfaces can change at different speeds.

## Cost and stopping rules

Consult current pricing for the exact application or API route. Charges can depend on model, generated duration, quality, output count, and other options. A studio subscription is not a reliable proxy for an API budget. This chapter avoids freezing a price that could become inaccurate.

Plan a short pronunciation test, a scene draft, and a final render as separate production stages. If a three-word technical term is wrong, test that term in a brief sample before regenerating several minutes of content. If a performance problem persists, consider a voiceover-only section or a different presenter.

Track accepted minutes and review time. A two-minute lesson requiring five full rerenders costs more than the final duration suggests. Stable scripts, approved glossaries, and modular scenes reduce unnecessary rerendering.

Set a stop rule for aesthetic refinement. Once the presenter is clear, accurate, appropriately expressive, and visually compatible with the lesson, further realism may not improve comprehension. Spend the remaining effort on the actual demonstration, captions, and update process.

## Choose an adjacent tool when the task changes

Compare [Synthesia](/video/synthesia/) for another template-centered training workflow. Use [Runway](/video/runway/), [Kling](/video/kling/), [Luma](/video/luma/), or [Google Flow](/video/google-veo-flow/) when the main need is invented footage rather than an exact scripted presenter. Study [Tavus](/video/tavus/) and [D-ID](/video/d-id/) for real-time interactive video experiences.

A scripted lesson and a conversational avatar have different success criteria. A scripted lesson needs stable wording and repeatable editing. A conversational avatar must manage interruptions, uncertain questions, latency, and tool boundaries. Do not assume that a good prerecorded presenter automatically makes a safe or effective live assistant.

## Optional project and completion evidence

Create a 60–90 second Beacon release lesson with an opening presenter, two real screen-recorded actions, and a closing instruction. Keep the factual script, pronunciation sheet, presenter authorization record, source assets, selected render, and final export together.

The project passes when every factual claim matches the approved source; the audience can follow the procedure; technical terms are understandable; captions agree with speech; the presenter does not imply a false endorsement; and one sentence can be updated without rebuilding the whole lesson. If you use the developer path, include job tracking and an explicit review state.

## Assistant prompt

~~~text
Turn my approved Beacon release fact sheet into a 75-second HeyGen production
plan. Deliver a spoken script, scene-by-scene visual plan, pronunciation sheet,
and review checklist. Keep exact UI in real recordings and use a stock or
explicitly authorized presenter. Do not add claims beyond the fact sheet.
For API planning, use current official v3 documentation and distinguish direct
model generation from application assets. Do not ask me to paste an API key
into chat, submit paid jobs, or publish. Flag any outdated v1/v2 recipe.
~~~

## Sources and verification limits

Accessed November 13, 2026.

- [Current HeyGen developer quickstart](https://developers.heygen.com/docs/quick-start): model/application distinction, v3 generation and status flow, and v1/v2 sunset notice.
- [Avatar 6 documentation](https://developers.heygen.com/docs/models/avatar-6): current direct avatar model route and input concepts.
- [API key guide](https://developers.heygen.com/docs/api-key): credential setup reference.
- [Quick Avatar Video](https://help.heygen.com/en/articles/12903996-quick-avatar-video): a simple documented application workflow; named engines in older app guidance may differ from the latest API.

No live generation, entitlement, price, translation, or export was tested. The local manifest example is independent of HeyGen; the HTTP illustration is explicitly incomplete and was not submitted. Verify current consent requirements, route-specific limits, and charges before production.
