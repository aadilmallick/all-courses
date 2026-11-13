---
title: Luma and Dream Machine
description: Learn boards, image animation, keyframes and footage transformation while separating workspace features from model limits.
sidebar:
  order: 4
---

## The production problem

Sometimes you already know the motion you want because you can record it. You can slide a paper card across a desk, turn an object in your hand, or film a slow camera move. What you cannot easily create is the desired visual treatment. A generation or transformation tool can help bridge that gap between a practical source and a finished-looking shot.

Luma's learning material spans Dream Machine and the newer Luma app with creative agents and visual boards. This chapter teaches the durable skills beneath those surfaces: organizing a brief, distinguishing inputs, animating an image, connecting visual states, transforming original footage, and reviewing whether the result still expresses the intended action.

Our project is an introduction for Beacon, a fictional tool that lets developers review proposed agent changes. We will record a simple physical card arriving at a review area, then explore how to turn it into an abstract animated sequence. The actual software procedure will remain a real screen recording. This creates a useful boundary between illustration and evidence.

Research was checked November 13, 2026. Luma's newer app documentation describes agents coordinating multiple media capabilities on boards. Its model-specific guides have separate limits. Do not assume that every capability advertised for the workspace is available in every engine you select. [New Luma app guide](https://lumalabs.ai/learning-hub/the-new-luma-app-creative-multimodal-agent)

## What to understand before generating

Read [Foundations](/foundations/) for general account, model, and evaluation concepts. You need a supported account, permission to upload your source assets, and whatever generation or export entitlements your chosen workflow requires. A browser-based application path does not require writing code.

Learn four input roles:

| Input | What it contributes | What it does not guarantee |
| --- | --- | --- |
| Text prompt | Desired visible content or change | Exact geometry or timing |
| Starting image | The initial visual state | A complete three-dimensional scene |
| Ending image | A visual destination | A perfect path between endpoints |
| Source video | Motion, timing, and existing visual evidence | That every detail survives transformation |

A character reference is a different control from a starting frame. A model may animate an image while lacking a dedicated mechanism for keeping the same character across independent shots. This is not a contradiction; the features solve different problems.

Luma's Ray3.14 guide documents several generation and modification workflows while explicitly listing limits around reference images, character consistency, and Reframe for that model. Read those limits before planning a workflow that depends on them. [Ray3.14 guide](https://lumalabs.ai/learning-hub/ray314-user-guide)

The practical habit is to write the selected engine next to every experiment. “Made in Luma” identifies the workspace; it may not identify the model or the controls that determined the result.

## A mental model: transform a performance, then inspect the invariants

Think of a source video as a performance. It contains a particular timing, camera path, and sequence of events. A transformation request asks the system to reinterpret that performance visually. Some aspects should change, such as material or style. Other aspects should remain, such as when a card stops.

Call the aspects that should remain invariants. In the Beacon opening, the invariants are one subject, a left-to-center movement, a visible stop at the review area, and a stable camera. The desired change is a move from an ordinary paper card to a softly illuminated abstract panel.

This language makes review concrete. If the transformed clip looks elegant but the card never stops, it violated an invariant. If the card stops correctly but the desk texture changes, that may be acceptable. Without a distinction between required and incidental properties, teams can spend many attempts preserving details that do not matter while overlooking the teaching point.

The mental model has a limit. A generative transform is not a nondestructive color filter that guarantees preservation of source structure. It can reinterpret shapes and events. Preserve the original footage, compare the result against it, and keep an ordinary edited version as a fallback.

## Build a board around decisions

Create a dedicated board or project for the Beacon release. Organize it into a small number of meaningful groups: approved brief, source assets, experiments, selected assets, and final assembly notes. Use the grouping features actually available in your account; the goal is clear lineage, not a particular screen arrangement.

Place a short brief where collaborators can find it:

~~~text
Audience: developers who already use Beacon.
Outcome: understand that agent changes enter a queue for deliberate review.
Generated asset: a 4–6 second illustrative opening, not a product simulation.
Required motion: one card arrives, slows, and stops at an inspection area.
Required composition: space for an editor-added title.
Forbidden implication: automatic approval or automatic release.
~~~

The length is an editorial target. Choose a duration supported by the actual model and trim if needed.

Attach source notes to the assets. A card illustration created by you, a desk clip recorded by you, and a palette approved by your team form a clean learning package. Avoid adding a large inspiration collection before you know which source controls what. A crowded board can make an agent's context less clear and a human's review more difficult.

## Record a source clip that is easy to transform

Use a stable camera and a simple background. Place one plain card at the left side of a desk, then slide it slowly into a marked review area near the center. Let it settle and hold still for several seconds. Record more lead-in and hold time than you expect to use; trimming is easier than inventing a missing pause.

Keep lighting even enough that the card edges remain distinct. Avoid a glossy surface that creates confusing reflections unless reflections are part of your intended shot. Remove unrelated objects and personal information from the frame. The source should make the action obvious before any AI treatment.

Watch the raw recording. If the card's movement is jerky, rerecord it. A transformation system can reinterpret a performance, but a cleaner performance is a stronger starting point. If your hand remains in the frame and the final scene should not include a hand, consider whether a simple physical setup or an ordinary animation would create a better source.

Choose a landscape framing for a landscape lesson. Leave room for the title in the original composition. Planning title space now is easier than repeatedly asking the model to make room after the shot is generated.

The intended source output is an unremarkable but readable clip. At this stage, clarity is success. The creative treatment comes later.

## First experiment: transform the source footage

Select a video-modification workflow supported by the current model. Upload the original clip and check that its length, format, and other properties meet the documented requirements. Inspect the selected engine and displayed charge. Start with a small experiment rather than a long source video.

Use a bounded request:

~~~text
Transform the paper card into a translucent cyan panel and the desk into a
minimal dark blue surface. Preserve the card's path, speed changes, final
stopping position, and the locked camera. Keep one moving panel. The result
should feel like restrained editorial motion graphics.
~~~

This states both change and preservation. It avoids asking for a new camera, new choreography, extra objects, and a different setting in one step. Those additions would make it harder to determine whether the transformation preserved the source performance.

Review the result beside the original. Find the moment when the card begins moving and the moment when it stops. Does the transformed subject follow the same broad timing? Does the subject remain one object? Does the final hold remain long enough for the title?

If the result is unusable, identify which invariant failed. Do not immediately request “higher quality.” A more detailed version of the wrong motion is still wrong. Change the relevant instruction or improve the source clip.

## Separate transformation strength from task success

Suppose a subtle transform preserves the motion but looks too close to the raw paper card. A stronger style instruction may help. Suppose a strong transform looks striking but turns the card into several flowing ribbons. That is a different failure: the style overwhelmed the subject identity.

Treat transformation strength as an experimental dimension, even if the interface expresses it through different controls or wording. Make one candidate that prioritizes preservation, one that prioritizes the visual treatment, and one in the middle. Compare them against the brief, not against a general desire for novelty.

An original review table might look like this:

| Candidate | Preservation | Style | Editorial decision |
| --- | --- | --- | --- |
| L01 | Excellent stop and timing | Too ordinary | Keep as reliable fallback |
| L02 | Subject splits at midpoint | Attractive glow | Reject for unclear action |
| L03 | Stable subject and visible pause | Sufficient abstraction | Select for rough cut |

These are hypothetical observations. Your actual notes should explain what happened in your own outputs.

If no candidate preserves the action, revisit the source. A simpler background, a clearer silhouette, or less camera movement can help more than a longer prompt. Luma's modification guide itself discusses the difficulty of unstable or excessively dynamic source footage. [Modify Video guide](https://lumalabs.ai/learning-hub/modify-video-dream-machine)

## Second experiment: animate a prepared still

Prepare a still illustration showing the cyan panel near the left edge and the inspection area in the center. This route is useful when you want stronger control over composition than the physical footage provides. The image is the starting state; the text supplies the change.

Choose an image-to-video workflow supported by the selected model. Check the crop before generation. Then use a motion-focused prompt:

~~~text
The panel slides slowly toward the center inspection area, decelerates, and
comes to rest. A soft highlight traces its top edge. Locked camera and calm,
precise movement.
~~~

Do not spend most of the prompt restating the colors and arrangement already visible in the image. Instead, tell the engine what should happen over time. If the model keeps the image almost still, simplify the motion and make the main action more explicit. If it invents a large camera move, reinforce a stable viewpoint or try a more clearly composed source image.

Compare the animated-still result with the transformed-footage result. The former may offer a cleaner look; the latter may preserve more useful timing. The best choice depends on the shot's job. For the Beacon opening, a visible pause is more important than elaborate environmental detail.

Record which route you selected and why. A curriculum becomes practical when it teaches selection among workflows, not only how to invoke them.

## Third experiment: connect two keyframes

Create a second still showing the panel resting at the inspection area. Keep the background, camera, scale, and lighting aligned with the first still. Keyframes work best as related states, not as two unrelated pictures that happen to share a color palette.

Luma's keyframe guide explains the roles of a starting image and an ending image, with text available to guide the transition. Use those concepts while checking the current model's actual controls and limits. Older articles may show different default durations or interface details. [Keyframe guide](https://lumalabs.ai/learning-hub/how-to-use-keyframes)

Try this transition direction:

~~~text
The cyan panel moves along the surface to the inspection area, slows gently,
and settles into the final position. The camera and background remain stable.
The motion is continuous and easy to follow.
~~~

The expected observation is whether the transition connects the two states in a readable way. Watch for abrupt morphing, scale changes, or the object appearing at the destination too late. If the endpoints are too different, make them more consistent. If the action is too long for the chosen duration, shorten the path.

A keyframe pair can produce an attractive transition that is wrong for the narrative. For example, the panel might dissolve and reappear instead of physically arriving. Decide whether that visual language still communicates review. The fact that endpoints match does not automatically mean the middle teaches the intended idea.

## Use extension with a purpose

Extension is useful when an accepted action needs a longer hold or a short continuation. It is less useful when you are trying to repair a broken opening. If the subject already changed shape, extending the clip usually continues from a compromised state.

Write the reason before extending: “Need two more calm seconds after the panel stops for the title to be read.” This is a concrete editorial need. Compare that with “make it longer,” which gives no indication of what should happen during the additional time.

If your chosen workflow accepts an ending keyframe, use it when the continuation needs a clear destination. If the desired continuation is simply a hold, consider freezing a clean frame or using an editor technique instead. Those options may be cheaper, more predictable, and easier to revise.

Luma's extension documentation describes continuation with optional textual direction and, in appropriate workflows, a visual destination. Treat it as a conceptual reference and verify the current model's supported combination before relying on it. [Extend guide](https://lumalabs.ai/learning-hub/how-to-use-extend)

Every extension introduces another section to review. Inspect the join for a sudden lighting change, subject deformation, or a shift in camera motion. A seamless-looking first frame is not enough; watch several seconds around the join at normal speed.

## Direct an agent with a production contract

The newer Luma app documentation describes creative agents working with shared project context. An agent can help organize and produce assets, but the brief still needs constraints. Ask first for a shot plan or a bounded set of candidates rather than an open-ended finished campaign.

For Beacon, specify the audience, the factual source, the generated asset's role, the allowed references, the maximum exploration batch, and the review criteria. Ask the agent to identify the selected model for each generation if the interface makes that information available. A workspace that routes among models can hide important differences from a learner unless you preserve them deliberately.

Use an instruction such as “Prepare two candidate treatments for the approved source clip, preserve the visible stop, and place outputs in the experiment group for human review.” This creates a reviewable result. “Make it amazing and finish everything” transfers too many unresolved decisions at once.

Do not treat a model list embedded in a broad workspace article as a guarantee that every named provider endpoint is still active. Provider deprecation notices and live account availability may supersede a marketing or overview page. In this guide, for example, the [Google video chapter](/video/google-veo-flow/) documents an API transition, and OpenAI's Sora API is recorded separately as retired. Verify the actual route used for a production dependency.

## Evaluate continuity and editability

Use a review rubric tailored to this source-driven workflow:

| Criterion | What to inspect |
| --- | --- |
| Motion preservation | Approach, deceleration, and stop remain understandable |
| Subject integrity | One panel keeps a recognizable shape |
| Environmental stability | Desk, camera, and lighting do not drift distractingly |
| Style suitability | Treatment matches the release's tone |
| Editorial fit | Clean beginning, usable hold, and easy transition to screen recording |
| Message accuracy | Nothing implies automatic approval or invented product behavior |

Score the first five from zero to two and treat message accuracy as a gate. The score helps compare candidates, but the gate protects the learning objective. A visually dramatic result that changes the feature's meaning fails.

Review side by side with the source when preservation matters. Review without the source when judging whether the clip is understandable to an ordinary viewer. Both perspectives are needed. A transform can preserve a subtle gesture that no viewer notices, or it can communicate the action well while changing incidental details.

Check the final crop and the title overlay. The generated clip should support the text rather than compete with it. If the title has to cover the main action, revise composition before polishing color or sound.

## Build the final lesson from trustworthy components

Use the generated opening for a few seconds, then move quickly into the real Beacon demonstration. Record the review queue, opening a proposed change, and inspecting evidence. Keep the exact product UI visible long enough to be learned.

Narration can explain the purpose: “Beacon brings proposed agent changes into one review queue. Open a change to inspect the diff and supporting checks. Approve when the proposal matches your intent.” Use approved release documentation to verify every claim. Do not let the visual metaphor supply details that the product does not support.

Add exact titles, release numbers, and instructions in your editor. These elements change more frequently than a generic background. Keeping them editable reduces future generation work and makes localization more manageable.

Export a draft, then watch the exported file from beginning to end. Timeline previews can differ from the final experience because of missing fonts, audio levels, crop changes, or export settings. Verify captions and narration together. A polished opening does not compensate for an unreadable procedure.

Preserve both raw and final assets. A future release may need the same style with a different title. Your source package should make that update straightforward without requiring someone to reconstruct which board item was the accepted take.

## Troubleshoot the right problem

| Symptom | First investigation | Focused response |
| --- | --- | --- |
| Motion becomes chaotic | Source camera and subject movement | Rerecord a simpler source |
| Character reference option absent | Selected model's specific limits | Choose a supported model or redesign the shot |
| Start/end transition morphs | Endpoint consistency | Align geometry, scale, and camera |
| Extended clip drifts | Join state and continuation request | Shorten the continuation or use an editor hold |
| Agent chooses unexpected treatment | Brief and reference roles | State invariants and required deliverable |
| Generation is inaccessible | Account, format, size, or entitlement | Check current docs and account feedback |
| A workspace overview conflicts with provider docs | Source freshness and route | Follow the active endpoint's current documentation |

When a generation fails technically, preserve the error and non-sensitive job information. When it fails creatively, write a time-specific observation: “At the midpoint the panel splits into two” is actionable. “The output is bad” does not isolate a cause.

Avoid a blind retry loop. A repeated failure can indicate unsupported input or a systematic ambiguity. Retrying the same request may spend more resources without teaching you anything. Change a hypothesis, then compare the result.

## Budget by workflow, not just clip duration

The selected model, operation, quality, duration, and number of candidates can all affect charges. Account plans and credit systems change, so consult current pricing and the displayed operation cost. Do not infer a Ray-specific rate from a different model routed through the same workspace.

Measure accepted seconds as well as generated seconds. Suppose you create six clips of a hypothetical five seconds each, but only four seconds from one clip survive the edit. You generated thirty seconds and accepted four. That ratio helps you understand the practical efficiency of the workflow.

Include preparation and review. Recording a cleaner source might take ten minutes but save several generations and a long selection session. Preparing consistent keyframes can be more efficient than trying to force a vague text prompt to preserve composition.

Set a fallback threshold. If the physical source already communicates the idea, a conventional color treatment or simple motion graphic may be enough. Use generation where it improves the final communication or saves meaningful work. The objective is a clear release lesson, not maximizing the number of AI operations in the production chain.

## Rights and maintainable source records

For original footage, note who recorded it, when, and whether people or licensed objects appear. For uploaded images and music, record the source and permission basis. For synthetic or cloned voices, confirm that the voice and intended use are authorized. This is a practical production record rather than legal advice.

Check the applicable account terms before publishing commercially. A paid account, a successful generation, and a downloadable file are different facts; none alone explains every right or restriction. Use the current terms for the actual service and model route involved.

Do not use a real person's likeness in a way that falsely implies they recorded or endorsed the release. For the learning project, an abstract panel avoids that issue and keeps attention on workflow skills. If you later need a presenter, compare tools with an explicit avatar and consent process.

Keep a manifest with source file, selected engine, prompt, accepted output, edit notes, and final audience. Another editor should be able to trace the final opening back to its raw footage. This lineage is especially useful in an agent workspace where several models and revisions may be involved.

## Preserve a non-generated baseline

Keep a simple edited version of the original card footage beside the generated candidates. It establishes what the transformation improved and what it damaged. If the generated treatment weakens the visible pause, you can make a concrete tradeoff instead of assuming a synthetic version must be preferable. The baseline also gives the team a usable fallback when a release deadline arrives before the creative experiment converges.

## Alternatives and a sensible next step

Compare [Runway](/video/runway/), [Kling](/video/kling/), and [Google Flow](/video/google-veo-flow/) on the same original source and brief. Compare the total workflow, including preparation, review, and editing. For scripted presenter content, study [HeyGen](/video/heygen/) and [Synthesia](/video/synthesia/). For interactive video agents, study [Tavus](/video/tavus/) and [D-ID](/video/d-id/).

If your desired animation is simple and exact, consider creating it directly in a conventional editor or motion tool. A rectangle following a path may not require generative interpretation. If you want a visual reinterpretation that would be tedious to create manually, a source-driven transformation can be a productive experiment.

After one completed project, identify which part deserves a reusable template: the board layout, source-recording setup, reference-role sheet, review rubric, or final edit structure. Reuse the stable process while allowing the creative treatment to change.

## Optional project and completion evidence

Create a 45–75 second Beacon lesson using one original physical source clip. Produce a transformed-footage candidate, an animated-still candidate, and a keyframe candidate. Select the strongest route for the brief and include only the accepted opening in the final lesson.

The work passes when the review pause is visible, the subject remains understandable, the factual software steps are accurate, titles remain editable, captions match the message, and the source package identifies the accepted model and assets. Include a short note explaining why the chosen route beat the alternatives.

Have another person open the package and locate the original footage, accepted generation, and final export. Ask them to update the title without recreating the motion. This verifies maintainability in a concrete way. If they cannot, improve naming and records before automating more production.

## Assistant prompt

~~~text
Help me prepare a Luma production board for a Beacon release lesson. I have an
original clip of a paper card moving to a review area and stopping. Deliver a
brief, an invariant/change table, three candidate workflow plans (video modify,
image animation, keyframes), and a shot-specific review rubric. Preserve the
visible pause. Keep actual software UI in real screen recordings. Check the
selected model's current limitations; do not assume every workspace capability
exists in Ray3.14. Do not generate assets or spend credits. Flag any stale
provider-model references and explain which official source should govern.
~~~

## Sources and verification limits

Accessed November 13, 2026.

- [New Luma app guide](https://lumalabs.ai/learning-hub/the-new-luma-app-creative-multimodal-agent): boards, creative agents, and workspace-level organization.
- [Ray3.14 user guide](https://lumalabs.ai/learning-hub/ray314-user-guide): model-specific workflow and limitation distinctions.
- [Modify Video guide](https://lumalabs.ai/learning-hub/modify-video-dream-machine): source-footage transformation and stability considerations.
- [Keyframe guide](https://lumalabs.ai/learning-hub/how-to-use-keyframes): start/end image concepts.
- [Extend guide](https://lumalabs.ai/learning-hub/how-to-use-extend): continuation concepts.

The examples and review process are original teaching material. No Luma generation, account entitlement, export, or paid workflow was tested. Older help articles can retain model-specific defaults that differ from the current application; verify the selected engine and live controls before production.
