---
title: Google Flow, Veo and Gemini video
description: Learn Google's filmmaking application, distinguish current video APIs, and build a controlled production workflow.
sidebar:
  order: 2
---

## Why this chapter treats an ecosystem as one learning path

Google Flow is an application for constructing generated clips and scenes. Veo is a video-model family. Gemini video generation is also available through developer interfaces whose supported models and request patterns change independently of the Flow application. Learning these as interchangeable names creates costly confusion: a valid application workflow is not automatically a valid API recipe.

The November 13, 2026 direct documentation check found a particularly important change. Google's current Gemini API video guide says the Veo 3.1 Preview aliases were shut down on October 22, 2026. It points developers toward Gemini Omni Flash or generally available Veo models through Google's enterprise platform. This does not mean the Flow application disappeared, nor does it mean every Veo deployment has the same status. [Current video-generation guide](https://aistudio.google.com/docs/video)

This chapter first teaches the creative workflow in Flow, then gives a small documented developer example using the current Gemini Omni Flash route. You will learn to identify which surface you are using, prepare reference assets, direct a scene, evaluate continuity, and avoid building a new system around retired preview names.

The running example is a release video for Beacon, a fictional application in which developers review an agent's proposed code changes. The finished piece will combine an illustrative introduction with accurate screen recordings. The generation prompts and production plans here are original examples; no paid video was generated for this chapter.

## Prerequisites and the three-layer model

Read [Foundations](/foundations/) if you need an introduction to model versions, credentials, or evaluation. For the application path, you need an eligible account, a supported location, and access to the features you intend to use. Flow's access documentation describes age, region, browser, and subscription conditions. Confirm these in the current account instead of assuming a colleague's entitlement applies to you. [Get started with Flow](https://support.google.com/flow/answer/16353333)

Use this three-layer model:

| Layer | What it controls | What to record |
| --- | --- | --- |
| Product surface | Where you compose, organize, and edit work | Flow, AI Studio, or an enterprise platform |
| Model and mode | Which engine interprets which inputs | Exact model identifier and generation/editing mode |
| Production process | How your team approves and publishes results | Asset brief, accepted take, source files, and reviewer |

The surface is like a workshop, the model is a machine in that workshop, and the production process is the set of instructions and inspections that turns machine output into a usable product. A better machine does not remove the need for a clear brief. A convenient workshop does not imply every machine is available in every account.

For an API experiment, also distinguish an SDK object from a raw HTTP response. Convenience fields supplied by a client library may not exist in raw JSON. This distinction matters in the example later and is one reason to avoid mixing snippets from different documentation generations.

## Start with an instructional objective

Beacon's feature announcement has one objective: an existing user should be able to find a proposed change, inspect its evidence, and decide whether it is ready for approval. Write that objective at the top of the production brief. It is more useful than “make a futuristic AI video,” because it gives you a way to reject footage that attracts attention without helping the audience.

Plan a 50-second version:

| Beat | Message | Visual source |
| --- | --- | --- |
| Opening | Agent work needs a review moment | Generated abstract scene |
| Orientation | The queue groups pending changes | Real interface capture |
| Inspection | Evidence supports the decision | Real diff and test-result capture |
| Boundary | Approval is still a deliberate action | Exact text overlay and narration |
| Next action | Try the queue on a demo change | Still frame with a clear instruction |

The generated opening could show three illuminated paths meeting at a small inspection desk. That metaphor has a risk: it may imply automatic passage through a gate. To avoid that implication, show the movement stopping at the desk. A visual metaphor needs semantic review as well as aesthetic review.

Decide which content must be exact. Product labels, actual navigation, and release claims belong in approved source material. The generated scene can carry atmosphere and the idea of a pause for inspection. This division lets you use a creative model without asking it to serve as a factual UI renderer.

## Prepare references as evidence, not decoration

A reference image constrains appearance, composition, or a subject's identity. A starting frame constrains the beginning of a clip. An ending frame gives the generation a destination. Those roles overlap, but they are not interchangeable. A portrait offered as an appearance reference does not necessarily specify the opening camera angle.

Create a small reference package before generating:

- A simple illustration of the inspection desk, with no real company branding.
- A palette swatch showing Beacon's approved dark blue and muted cyan.
- An optional layout image leaving space for a title.
- A written note explaining the intended role of every file.

Use clean, uncluttered source material. If an appearance reference includes a busy background, the model has to decide whether the background is part of the desired scene. A reference package with competing palettes or inconsistent object shapes makes the job harder to interpret.

Flow documents inputs including text, ingredients, frames, and existing video. Its help page also explains selecting the video mode, model preferences, and output settings. The walkthrough below uses those documented concepts without relying on a fixed location for every button. [Create videos in Flow](https://support.google.com/flow/answer/16353334)

## Walkthrough: create the first clip in Flow

Open Flow in a supported browser and create a dedicated project. Name the project for the release and intended format, for example Beacon review queue landscape. A dedicated project prevents unrelated experiments from becoming accidental references or making the accepted asset difficult to find later.

Choose video generation explicitly. Inspect the selected model and the available controls. Set a landscape aspect ratio for a documentation video, choose a supported short duration, and begin with a small output count. Read the charge shown for the selected settings before submitting.

Use this first prompt:

~~~text
A small inspection desk on a dark blue surface. Three thin cyan paths approach
the desk from the left. A soft light travels along each path and stops at the
desk. The right third of the image stays visually quiet for an editorial title.
Locked wide camera, restrained motion graphics, soft studio lighting.
~~~

This prompt describes a scene and a change in that scene. It avoids asking the system to invent a software interface or to render a long slogan. The desired output is a usable symbolic opening, not a guaranteed exact sequence.

Review the full clip before rating it. Does each light stop? Is the desk stable? Does the quiet area remain quiet? Is anything added that looks like a company logo or a real control? If the result fails, write the observable failure before editing the prompt.

## Add references deliberately

If the first result uses an unsuitable desk or composition, add the approved illustration as a visual reference or starting frame, depending on the mode you are testing. Describe what the reference contributes. For example: “Use the reference's desk shape, lighting, and left-aligned composition; animate the light traveling toward it.”

Do not use a vague instruction such as “make it match.” Match what: the colors, the person, the lens, or every object? A reference may contain several features, and the model does not know which ones matter to the production brief unless you explain their roles.

Suppose the approved starting image shows one path, but the text requests three. That conflict forces a choice. Fix the reference or reduce the prompt's requirement rather than adding more emphatic language. When text and source material disagree, louder instructions often produce inconsistent compromises.

For the Beacon introduction, you can simplify the image to a single path and make the metaphor clearer. One light arrives at an inspection point and stops. The audience does not need to understand a complex traffic system to learn where the review queue lives. Simplification can improve both generation reliability and instructional clarity.

Preserve the exact reference file used for the accepted take. A visually similar replacement may produce a different framing or object shape, which matters when you need to make a follow-up release in the same style.

## Use start and end frames as a transition problem

Imagine the opening must end on a calm background for a title. Prepare a start frame showing the light on the left and an end frame showing the light resting at the inspection desk. The generation now needs to connect two states. That can be easier to communicate than a long description of a sequence of intermediate actions.

Before using both frames, inspect them side by side. The desk should have the same geometry, camera position, and scale. If the end frame changes the entire setting, the engine must invent a major transformation. That may be an interesting creative effect, but it is a poor way to request a subtle handoff.

Use a transition prompt such as:

~~~text
The light travels steadily along the path toward the desk, slows as it reaches
the inspection point, and comes to rest. The camera and the desk remain stable.
The motion feels calm and deliberate.
~~~

The frames describe endpoints; the prompt describes the path. Test whether the transition is understandable without narration. If the light teleports near the end, allow more time, reduce the distance, or simplify the intermediate action. Do not add unrelated detail about material textures while diagnosing a timing failure.

An ending frame is a visual target, not a formal guarantee that every preceding frame will obey your desired geometry. Continue to review temporal stability, especially around the transition into the final state.

## Decide when conversational editing helps

Conversational editing is useful when the basic result is right and a bounded change is needed: a slower camera move, a different background hue, or a less cluttered composition. It is less useful when the original brief was wrong. Repeated small edits can preserve a flawed premise and make the lineage difficult to follow.

Give each edit an explicit invariant and change. For example: “Keep the desk, camera position, and light path. Change the background from a textured surface to a uniform dark blue.” This states what should survive and what should change. Afterward, inspect both sides of the contract. A successful color change that also changes the object count is not fully successful.

Preserve an accepted baseline before experimenting. An edit is a new candidate, and you should be able to return to the earlier take. Name revisions with their purpose, such as background-simplified, instead of a sequence of filenames ending in final-final.

For a production series, keep a small change log: original generation, selected revision, final crop, and any added typography. This helps the next editor understand whether a requested update belongs in the generator or in the timeline. Most copy changes should remain outside generated pixels when you can use editable text layers instead.

## A current developer example with Gemini Omni Flash

The current Google developer guide documents Gemini Omni 1.2 Flash using the Interactions API. The short Python example below follows that documented SDK pattern. It is a paid-service example, not a local simulator. It requires an eligible API project, credentials configured according to Google's current SDK setup, and a compatible installed google-genai release. No API call was run for this curriculum. [Gemini Omni guide](https://aistudio.google.com/docs/omni)

In a clean Python environment, install or update the SDK according to the official quickstart, configure the credential using the provider's supported environment mechanism, and save this as generate_opening.py:

~~~python
import base64
from pathlib import Path

from google import genai

client = genai.Client()
interaction = client.interactions.create(
    model="gemini-omni-1.2-flash",
    input=(
        "A soft cyan light travels across a dark blue tabletop and stops "
        "beside a small inspection desk. Locked wide camera. Calm motion."
    ),
)

video = interaction.output_video
if video is None or not video.data:
    raise RuntimeError("The interaction did not return inline video data.")

output = Path("beacon-opening.mp4")
output.write_bytes(base64.b64decode(video.data))
print(f"Saved {output.name}; review the video before publication.")
~~~

The imports provide base64 decoding, filesystem paths, and the SDK. The client reads configured credentials. The request supplies an exact model identifier and an original prompt. The guard prevents a misleading success message when the expected media field is absent. Decoding converts encoded response data into bytes that can be saved as an MP4 file.

Successful execution should print the saved filename and create a nonempty video file. It does not prove the creative output passed review. Errors can occur because of account access, SDK changes, model availability, quota, moderation, or a different response shape. Recheck the current guide before adapting this code.

## Understand the boundaries of the example

The SDK's output_video convenience field is documented as SDK-specific. A developer who copies the same field assumption into a raw HTTP integration can fail even when the server returned valid media elsewhere in its response. If you use REST directly, follow the current REST schema rather than reverse-engineering it from a Python object's properties.

This example also deliberately avoids batch submission, automatic publication, and an unbounded retry loop. Those additions introduce different engineering problems. A network timeout does not establish whether the provider accepted a request. Immediately retrying can create two charged jobs for one intended asset. Before production automation, determine how the selected interface supports request tracking, status, and deduplication.

Store the model identifier, request purpose, prompt, and local output name in a production record. Do not store the credential beside the video. Keep credentials out of browser code, public repositories, screenshots, and debugging transcripts.

If you need Veo specifically, use the current generally available model documentation for the platform where you have access. Do not mechanically replace a retired preview identifier in an old request and assume every setting transfers. Different platforms can have different authentication, supported parameters, storage behavior, and regional requirements. [Veo 3.1 enterprise documentation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate)

## Preserve request and editorial lineage separately

For an API-driven series, give each intended asset an internal production identifier before submission. Associate it with the source brief, prompt revision, intended crop, and eventual provider response. The internal identifier describes your work; the provider identifier describes one execution. Keeping both prevents a retried request from silently replacing the history of an earlier attempt.

After generation, record the accepted time range and editorial changes. A provider output may be ten seconds long while the edit uses only its middle four seconds. If you later compare models by the raw file length, you can overstate how much usable footage was produced. Preserve the distinction between generated duration and accepted duration.

For the Beacon opening, an adequate record might say that candidate G03 used the approved station illustration, that seconds two through six were accepted, that generated audio was muted, and that the title was added in the editor. Those facts are more useful for an update than a filename called final.mp4.

Do not place credentials or unnecessary response content in the manifest. Store only the non-sensitive fields needed for traceability and debugging. A production record should make the work reproducible without becoming an accidental repository of private inputs.

## Evaluate the clip as part of a sequence

A clip can look coherent alone and still cut poorly into the next shot. Compare its final frame with the first frame of the real Beacon screen recording. If the generated light moves toward the right while the next shot directs attention to a left-side control, the edit may feel visually awkward. You can fix that with a different crop, a short neutral title card, or a new generated composition.

Use three review passes. In the first pass, watch for meaning: does the motion communicate a pause for review? In the second, inspect consistency: do objects stay recognizable and do references remain stable? In the third, check assembly: can you cut in and out cleanly, and does the narration fit?

An original scoring sheet can use five two-point criteria: brief adherence, temporal stability, composition, audio suitability, and editorial fit. Mark product accuracy as a separate gate. Do not average away a false product implication because the lighting is beautiful.

When comparing two models, keep the brief and reference package fixed. Record the exact surface and model. A result from Flow with an agent-assisted planning step is not directly comparable to a bare API request unless the additional planning is part of the workflow you intend to evaluate.

## Handle audio as another generated asset

Generated audio can create a convincing atmosphere, but it also creates another review obligation. Listen for unwanted speech, distracting music, or sounds that imply a physical event the visual does not show. A training introduction usually benefits from a quiet bed that leaves room for narration.

Prepare a simple audio brief independently of the visual brief: no required dialogue, gentle ambient texture if appropriate, and a clear space for a separately approved voiceover. If your selected mode provides native audio, inspect it even if you plan to mute it later. That prevents an editor from accidentally publishing an unreviewed track.

For factual narration, use an approved script and verify the final spoken wording. Do not rely on a visually plausible scene to establish that speech is correct. A voice saying “all changes are approved automatically” would contradict Beacon's actual feature even if the accompanying motion is subtle and attractive.

If you keep generated sound, preserve the raw clip and document any replacement or mixing. If you discard it, remove or mute the track deliberately in the edit. Review the final export with headphones and ordinary speakers because a low background element can become unexpectedly prominent on a different playback system.

## Plan cost around a decision tree

Avoid memorizing a single credit amount. The cost of a production depends on the selected surface, model, length, quality, output count, edits, and how many results survive review. Look up current published pricing and confirm the displayed charge for the exact operation you are about to run.

Use a staged budget. Stage one tests whether the visual idea works at all. Stage two fixes the strongest candidate's biggest problem. Stage three produces the required crop or quality level. At each stage, ask whether the next generation can realistically fix the observed issue. If the answer is no, change the asset strategy.

For example, suppose three short exploratory clips each cost an illustrative unit U and one revision costs 2U. The accepted opening costs 5U before editing time. If you make ten variations with no explicit selection rule, the cost becomes 10U without necessarily improving the result. The unit is hypothetical; the principle is to buy information through controlled experiments.

Keep a fallback: an approved still image with a slow editor move may serve the same instructional purpose. The fallback lets you finish a useful release video even when a particular generated action remains unstable. A learning curriculum should develop judgment about stopping as well as skill in prompting.

## Troubleshooting and migration habits

| Symptom | Check first | Productive response |
| --- | --- | --- |
| Old Veo preview recipe fails | Current deprecation and model documentation | Choose a supported surface and rewrite from its current example |
| Video option is unavailable | Account, age, region, subscription, rollout | Verify access before changing prompts |
| References conflict | Asset roles and visual consistency | Remove or replace the conflicting input |
| End transition becomes abrupt | Distance and timing between frames | Simplify the action or prepare closer endpoints |
| API call succeeds but no file is saved | SDK versus REST schema and media field | Inspect non-sensitive response structure and current SDK docs |
| Final video is misleading | Storyboard and narration | Replace the metaphor or factual wording |

A migration should preserve the audience outcome and evaluation rubric, not every old parameter. Start with one small supported request, confirm response handling, and compare the resulting asset against the baseline. Only then move a larger workflow.

Document the date of the migration check. Model names and product surfaces can outlive particular preview endpoints. The useful maintenance question is “can a new learner still complete this walkthrough on the documented surface?” rather than “does this brand still exist?”

## Choose among adjacent tools

Choose Flow when you want an application-centered environment for references and scene construction. Use a developer interface when generation must be part of a controlled software process with explicit job records and downstream handling. The API path adds engineering responsibility; it is not automatically a better choice for a one-off training video.

Compare [Runway](/video/runway/) for another production workspace, [Kling](/video/kling/) for a multimodal reference workflow, and [Luma](/video/luma/) for image, keyframe, and footage-transformation learning. For a person presenting an exact script, [Synthesia](/video/synthesia/) or [HeyGen](/video/heygen/) may fit the task more directly than a cinematic scene generator.

For each candidate, evaluate the same shot and the same target audience. Include review effort, documentation clarity, export fit, and the maintenance burden of account-specific features. A slightly less dramatic result that is easy to update may be the better foundation for a documentation series.

## Optional project and completion evidence

Produce a 50–70 second Beacon release lesson with one generated opening, one title card, and two accurate recorded actions. Keep a manifest containing the model surface, selected model, reference sources, accepted output, and review notes. If you take the API path, include a redacted request record and a local file check; do not include credentials.

The project passes when the generated opening communicates a pause for inspection, the interface demonstration shows actual behavior, the viewer can identify the next action, captions preserve the factual message, and every included asset has an identified origin. Another editor should be able to find the accepted raw take and change the title without regenerating the whole sequence.

Try one controlled comparison between text-only generation and a reference-assisted version. Explain which version you selected and why. A useful explanation discusses the brief, not only visual preference: perhaps the reference-assisted take preserves title space, or perhaps text-only motion is clearer.

## Prompt for an assistant

~~~text
Prepare a production brief for a Google Flow release tutorial about Beacon's
agent review queue. Use the supplied approved feature description as factual
ground truth. Deliver a five-beat storyboard, asset-role notes, two original
video prompts, and an evaluation rubric. Keep factual UI in real captures.
Distinguish the Flow application from Gemini API and enterprise Veo routes.
Check current official documentation before naming any API model or method;
flag retired preview identifiers. Do not generate media or spend credits.
For every proposed shot, state its teaching purpose and likely failure mode.
~~~

When revisiting the chapter later, check the current model route first, then the SDK example, then account access. That order keeps a retired identifier from becoming an apparently mysterious code failure.

## Sources and verification limits

Accessed November 13, 2026. Sources were directly opened; the current direct page takes precedence over stale search snippets.

- [Current Gemini API video guide](https://aistudio.google.com/docs/video): current route and Veo Preview shutdown notice.
- [Gemini Omni generation and editing](https://aistudio.google.com/docs/omni): current SDK example, model identifier, and SDK-versus-REST distinction.
- [Get started with Flow](https://support.google.com/flow/answer/16353333): access and browser conditions.
- [Create videos in Flow](https://support.google.com/flow/answer/16353334): generation, references, frames, and settings concepts.
- [Flow models and supported features](https://support.google.com/flow/answer/16352836): consult for the current account-specific feature matrix.
- [Generally available Veo 3.1 documentation](https://docs.cloud.google.com/gemini-enterprise-agent-platform/models/veo/3-1-generate): enterprise route for Veo-specific work.

The sample code was checked against the opened documentation but was not executed against Google's service. Account eligibility, charges, and output quality were not tested. Recheck SDK setup and current model availability before running it.
