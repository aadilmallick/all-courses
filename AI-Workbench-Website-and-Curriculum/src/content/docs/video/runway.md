---
title: Runway
description: Direct short generated shots, iterate deliberately, and assemble reliable release-video assets in Runway.
sidebar:
  order: 1
---

## What you will learn

Runway is useful when you need footage that would be expensive, slow, or impractical to film: a metaphorical opening shot, an animated reference image, a stylized transition, or a background plate. The difficult part is usually directing a usable shot and deciding whether it communicates the intended idea. Generating something visually impressive is a different objective from producing an accurate software lesson.

This chapter teaches a workflow for a fictional developer tool called Beacon. Beacon's release adds a review queue in which developers can inspect an agent's proposed change before approving it. You will plan a short introduction, generate a few visual assets, and combine those assets with a real screen recording. All sample prompts and shot plans below are original learning examples, not outputs produced during the research for this guide.

Read [Foundations](/foundations/) first if aspect ratios, model versions, API credentials, or evaluation are unfamiliar. You do not need video-editing expertise. You do need an account with whatever generation and download entitlements your selected workflow requires. This guide was researched on November 13, 2026; check the model selector and current help articles before spending credits.

## Understand the product before choosing a model

Runway's current getting-started guide describes several creation surfaces, including individual tools, task-specific apps, an Agent, and node-based Workflows. It distinguishes text-to-video from image-to-video and identifies Gen-4.5 as a current advanced model in that guide. The help center also documents integrations with other models. A model name in a tutorial therefore does not describe the whole Runway product. [Runway getting started](https://help.runwayml.com/hc/en-us/articles/37425232841875-Getting-Started-with-Generative-Video)

Think of the application as a production workspace and the model as one engine inside it. A workspace organizes inputs, attempts, and outputs. The engine interprets a particular kind of input and applies its own duration, resolution, audio, and reference constraints. Moving from one engine to another can change those constraints even if the surrounding interface looks similar.

For learning, start with one explicit model and one mode. Record both. Do not alternate between an agent-created multi-shot result, an older image-to-video model, and a newer text-to-video model while trying to understand which prompt improvement helped. That experiment changes several variables simultaneously. Once you can direct one shot predictably, use the broader surfaces to accelerate tasks whose requirements you already understand.

## A mental model: an image is an initial condition

Text-to-video asks the engine to invent a scene and its evolution. Image-to-video supplies a visual starting point and asks the engine to infer plausible subsequent frames. An input image can establish the arrangement of objects, lighting, palette, and subject appearance, but it is not a rigid three-dimensional scene file. The engine can still reinterpret details as objects move or the camera reveals new areas.

This distinction explains a common failure. You upload an exact screenshot of Beacon and request a cinematic orbit. The engine must invent the sides of a flat screenshot, decide what screen elements mean, and maintain text during perspective changes. It may produce an attractive but inaccurate interface. More prompt detail does not turn that process into a deterministic screen recorder.

For the Beacon release, reserve factual interface demonstrations for recorded or rendered source material. Use Runway to communicate the surrounding concept: work moving from uncertainty toward clarity, a calm workspace, or a symbolic handoff. This division gives generated footage creative freedom while preserving product truth.

The analogy is a cinematographer receiving a still photograph and a direction note. The cinematographer can propose motion, but the photograph does not contain every hidden surface or future event. Judge the result by the shot's job, not by an assumption that every pixel must remain locked.

## Prerequisites that materially affect the result

An aspect ratio is the relationship between width and height. A 16:9 shot fits a landscape training video; a 9:16 shot fits a vertical social excerpt. Cropping a landscape shot after generation may remove the very object you need. Choose the intended output shape before preparing the reference image.

A shot is one continuous visual unit. A scene can contain several shots, and a finished video contains several scenes. A five-second establishing image and a five-second close-up are easier to direct separately than a single prompt asking for a room reveal, a character introduction, a product demonstration, and a logo ending.

A camera instruction describes viewpoint or motion: a locked camera stays in place; a slow push-in moves closer; a pan turns the camera across a scene. Subject motion is different: a card slides, a person gestures, a light changes. If you request both aggressively, the viewer may have difficulty noticing the actual teaching point.

Finally, distinguish a reference asset from an asset you may legally publish. For this tutorial, create a simple abstract card illustration yourself or use material whose license permits your intended use. Keep the original image and a note describing its origin. A model's willingness to accept a file does not establish publication rights.

## Plan the release video before opening the generator

Write a one-sentence audience outcome: “After watching, an existing Beacon user can find a pending change, inspect its evidence, and decide whether to approve it.” This statement prevents the opening animation from consuming the entire production budget while the actual procedure remains unclear.

Use this initial storyboard:

| Segment | Approximate length | Source | Purpose |
| --- | --- | --- | --- |
| Opening metaphor | 4–6 seconds | Runway-generated abstract footage | Establish review and clarity |
| Feature promise | 6–8 seconds | Typography and narration | Explain the benefit in plain language |
| Find the review queue | 10–12 seconds | Real screen recording | Show the correct navigation |
| Inspect a change | 12–15 seconds | Real screen recording | Show evidence and the decision point |
| Closing cue | 4–6 seconds | Still image or restrained generated shot | Tell the viewer what to try |

These durations are editorial targets, not claims about available generation lengths. Select a supported length in the current application and trim during editing if needed.

Now write an asset brief for the opening: two translucent cards move into a neat stack on a dark desk, with space on the right for the title “Review before release.” Notice that the title belongs in an editor, where spelling and placement are controllable. The generated shot only needs to supply motion and mood.

## First walkthrough: one text-to-video shot

Open a new working session or the equivalent current creation workspace. Select a video-generation mode and explicitly choose a text-to-video-capable model. Confirm orientation, available length, the number of outputs, and the displayed charge before generating. Menu placement can change; the documented concepts are the reliable landmarks.

Use this starting prompt:

~~~text
A quiet dark desktop with two translucent rectangular cards near the left side
of the frame. One card glides slowly onto the other and comes to rest as a
precise stack. Soft blue edge lighting. Locked camera. Clean editorial motion
graphics style, with open dark space on the right.
~~~

This describes a visible arrangement, one action, lighting, viewpoint, and useful composition. It does not ask the model to understand a slogan such as “the future of reliable development.” Abstract slogans leave too many decisions unspecified.

The intended result is a short clip with a readable card-stacking action and title space. It is not an expected deterministic output. Watch the complete clip, then inspect the first frame, the middle, and the last frame. Look for objects merging, new cards appearing, unexpected camera drift, or the right side filling with clutter.

If a satisfactory segment exists inside a less satisfactory clip, mark its start and end. Editorial usefulness can be local: three clean seconds may be enough for the opening even if the final second becomes unstable.

## Learn from the first attempt

Suppose the first result is polished but the cards spin. Do not add a paragraph of emotional direction. Change the motion clause to “The upper card slides horizontally a short distance and settles flat on the lower card.” The change replaces an ambiguous path with an observable trajectory.

Suppose the camera zooms and the title space disappears. Preserve the rest of the prompt and reinforce a static wide composition. If the composition still drifts, switch to an input image that already contains the desired placement. That is a structural change in the workflow, and you should record it as such.

Suppose the card movement is correct but there is no useful contrast against the background. Adjust the input design or lighting description. Contrast is easier to address before adding titles than after the shot is locked. A visually dark shot can still work if the key edges remain distinct at the small size where the finished lesson will be viewed.

Runway's prompting guide recommends describing visual and motion information directly and beginning with the important elements before adding refinements. The lesson here applies that principle as an experiment: change one cause, inspect one effect, and keep a written reason for the next attempt. [Text-to-video prompting guide](https://help.runwayml.com/hc/en-us/articles/47313737321107-Text-to-Video-Prompting-Guide)

## Second walkthrough: animate a prepared image

Create or obtain a landscape illustration showing the two cards exactly where you want them. Leave a generous margin around the objects. Avoid tiny symbols that imply actual product controls, and keep the title area empty. Save this as the approved starting image.

Choose image-to-video with a model that supports it. Upload the image, inspect any crop, and confirm that the important objects remain inside the frame. Use a shorter motion-focused prompt:

~~~text
The upper card slides gently onto the lower card and settles. A soft highlight
travels along the edges. The camera stays in a locked wide view.
~~~

The image already explains the appearance. Repeating a long description of the cards can encourage reinterpretation instead of animation. The text's job is now to explain change over time.

Compare this result with the text-only attempt using the same practical question: which asset leaves room for the title and makes the review metaphor understandable? Do not assume image-to-video is always superior. It may improve composition while limiting motion or introducing distortions around small details.

Keep both the reference image and the motion prompt with the chosen clip. If the title later changes position, you can decide whether cropping, a new input image, or a fresh generation is the appropriate fix. Without that provenance, teams often repeat work because no one knows how an apparently successful shot was produced.

## Create an iteration log that supports decisions

Use a small table rather than a folder full of unexplained downloads:

| Attempt | Input and change | Observation | Decision |
| --- | --- | --- | --- |
| A01 | Text-only baseline | Card motion clear; camera drifts | Keep as reference |
| A02 | Added locked wide framing | Better framing; extra card appears | Reject |
| A03 | Approved image plus motion prompt | Correct count and usable title area | Candidate |
| A04 | Slower subject movement | Calm but action finishes too late | Use A03 |

The example observations are hypothetical. Replace them with your actual review notes. A log should explain why you accepted or rejected the output, not simply preserve a rating.

Separate model quality from editorial fit. A03 might contain less impressive motion than A01 but better satisfy the training video's requirements. The operational objective is an understandable lesson with a maintainable production process, not the highest novelty per second.

Save the selected version with an explicit name such as beacon-review-opening-a03. Preserve raw downloads separately from edited exports. If a stakeholder asks for a different crop, the original file gives you options that a compressed messaging attachment may not.

## Measure quality with a shot-specific rubric

Give each criterion a score from zero to two: zero fails, one is usable with editing, and two meets the brief cleanly. This is an original production rubric, not a vendor benchmark.

| Criterion | A score of two means |
| --- | --- |
| Action clarity | A viewer can describe the stacking action without narration |
| Temporal stability | Card count, shape, and layout remain coherent throughout the usable segment |
| Composition | The title area stays clear in the intended crop |
| Visual hierarchy | Motion attracts attention to the cards instead of unrelated effects |
| Editability | The clip has clean entry and exit points |
| Product honesty | Nothing looks like a real Beacon control or an unsupported product claim |

A clip scoring ten out of twelve can still fail if product honesty is zero. Treat certain requirements as gates rather than averaging them away. A beautiful fabricated interface is the wrong asset for a factual tutorial.

Review at ordinary playback speed first. Slow-motion inspection helps diagnose artifacts, but viewers encounter the piece at normal speed. Also inspect on the smallest realistic display. Subtle edge motion that looks elegant on a large monitor may disappear on a phone or inside a documentation panel.

## Assemble the actual teaching sequence

Record Beacon's review queue in a demo environment using non-sensitive data. Capture the cursor moving to the queue, opening a proposed change, and inspecting the test evidence. Record a few seconds of stillness before and after each action so the edit can breathe.

Place the Runway opening before the factual demonstration. Add the exact title and any labels as ordinary text layers in your editor. Keep the generated asset's role visible in the production notes: “Illustrative opening, not a product simulation.” The public video need not interrupt itself with a long technical explanation, but it should not mislead a viewer about what the product actually does.

Write narration after rough-cutting the screen action. For example: “Beacon now collects pending agent changes in one review queue. Open a change to inspect the diff and its evidence. Approve only when the change matches your request.” This language gives the viewer a procedure and a boundary.

If the opening communicates “automatic approval” because cards flow straight through a gate, change the metaphor. A production asset can be aesthetically successful and semantically wrong. The software feature's meaning should determine whether the shot survives the edit.

## Budget by attempts and accepted seconds

Credit systems and entitlements change. Read the current pricing and the application's displayed charge for the selected model, mode, duration, and output count. Do not infer costs from an older Gen-4 tutorial when using another engine. The older guide itself points readers toward newer model documentation. [Creating with Gen-4](https://help.runwayml.com/hc/en-us/articles/37327109429011-Creating-with-Gen-4-Video)

For planning, use a hypothetical model in which each attempt costs C credits. If you try four prompts with two outputs per prompt, you have purchased eight attempts, not four. If only one five-second segment is accepted, the relevant production measure is 8C divided by five accepted seconds. This arithmetic says nothing about a real Runway rate; it helps compare workflows consistently.

Set an exploration limit before starting. For a short internal release lesson, you might allow six attempts for the opening and then switch to a still image with a simple editor animation. A fallback is a production technique. It keeps a small visual embellishment from delaying the main instructional content.

Track review time as well as generation cost. Ten clips that each take two minutes to inspect create twenty minutes of review work before editing begins. Automated generation does not remove human selection from a quality-sensitive workflow.

## Troubleshoot by identifying the failing layer

If the output is technically complete but wrong, investigate the brief, prompt, reference image, or selected model. If the job never completes, investigate service status, input compatibility, account entitlements, and the error message. These are different failure classes.

| Symptom | Likely investigation | Useful next step |
| --- | --- | --- |
| Important object is cropped | Input and output aspect ratios | Recompose the reference before regenerating |
| Motion contradicts the brief | Prompt ambiguity or conflicting instructions | Keep one subject action and one camera instruction |
| Text becomes unstable | Generated typography or moving screenshot | Add exact text in the editor |
| Subject changes appearance | Hidden surfaces or weak reference control | Reduce camera movement or supply a stronger visual starting point |
| Desired model is absent | Plan, region, rollout, or product changes | Consult current help and account availability |
| Download is unsuitable | Export format or resolution choice | Verify the selected export before discarding raw assets |

When contacting support, preserve a non-sensitive job identifier, approximate creation time, model name, mode, and error text. Do not send credentials. If the problem is a bad creative result, include the intended observable action and the actual deviation; “it looks wrong” provides little diagnostic information.

## Use Agent and Workflows after defining the contract

An agent can help plan or assemble multiple shots, but a broad prompt such as “make a great release video” hides too many editorial decisions. Give it a contract: audience, factual source, shot count, allowed generated assets, narration length, and acceptance criteria. Ask for a storyboard or draft before authorizing a large batch of generations.

A workflow is useful when several releases share a repeatable structure. For example, you may repeatedly generate a title background from an approved palette, pair it with a product capture, and export several crops. Draw that process first. Identify which steps are creative and which must be exact. Automation belongs around stable decisions; unresolved creative direction should remain easy to inspect.

Do not assume a node-based workflow makes every operation deterministic. A fixed graph can still contain stochastic generation. Preserve the selected outputs and the inputs that produced them, and add a human acceptance step before distributing a final lesson.

If you later connect Runway to a programmatic production system, treat completion notifications, retries, and duplicate submissions as engineering concerns. The guide deliberately teaches the application workflow first so you can recognize a useful output before scaling production.

## Know when another tool is a better fit

For a precise walkthrough of software controls, use screen recording and conventional editing. For a presenter reading a stable script, consider [HeyGen](/video/heygen/) or [Synthesia](/video/synthesia/). For an interactive face-to-face support experience, study [Tavus](/video/tavus/) or [D-ID](/video/d-id/). For another cinematic generation workflow, compare [Kling](/video/kling/), [Google Flow](/video/google-veo-flow/), and [Luma](/video/luma/) on the same brief.

The useful comparison is not “which tool is best?” It is “which workflow reaches my acceptance criteria with tolerable cost, review effort, and maintenance?” A generated opening that requires frequent rerendering after minor copy changes is less maintainable than a clean background with editable text. A single polished demonstration may justify custom editing; a weekly series benefits from reusable production rules.

Use identical deliverables when comparing products: same reference image rights, same target crop, same action, and same review rubric. Record account limitations and model versions. Otherwise, differences in plan access or task setup can masquerade as differences in underlying capability.

## A practical project and evidence of completion

Optionally produce a 45–60 second Beacon release lesson. Include one generated illustrative opening, two factual screen-recorded actions, narration or equivalent readable captions, and a clear final action. Keep the source material and production log together.

The project is complete when a new viewer can identify where to find the review queue and what evidence to inspect; the generated section contains no false UI; important text remains legible in the target crop; captions match the spoken information; all published assets have documented permission; and another person can locate the selected source clip without asking you which download it was.

Run a small audience check: show the rough cut to someone who has not seen the storyboard, then ask them to carry out the procedure in the demo environment. This is usability observation, not a compulsory quiz. If they cannot find the right control, revise the factual demonstration before spending more effort on visual polish.

Preserve a short retrospective: which generation mode helped, which prompt change mattered, what consumed the most review time, and what you would template next time. This converts one successful video into a repeatable capability.

## Maintain the asset across future releases

Imagine Beacon later renames the review queue to the proposal inbox. If the name exists only as an editor text layer and in a short narration segment, the update is straightforward. If it was generated into the cards, spoken inside an inseparable scene, and repeated in several background signs, the same copy change can require a new production. Plan for the likely update before choosing how much factual content to put into generated footage.

Keep the opening's metaphor generic enough to survive a minor UI change, but specific enough to serve the lesson. “A proposal pauses for inspection” is durable. “A proposal automatically passes a green gate into release” embeds a workflow claim that may be wrong now or later. Durability is about preserving meaning, not making every visual so abstract that it communicates nothing.

Create a compact change-impact note with the final asset. List which changes require a new recording, which require narration, and which require regeneration. A UI navigation change usually affects the screen capture. A product-name change may affect only text and speech. A change from manual review to a different approval process affects the storyboard itself. This note helps a future editor choose the smallest correct update.

When a stakeholder requests a new visual treatment, use the existing accepted clip as a baseline rather than discarding the production evidence. Compare the new version against the same criteria and ask whether the additional work improves comprehension, consistency, or brand fit. A new model release can justify a new experiment, but its existence alone does not make the previous lesson obsolete.

Finally, preserve a fallback export with a still opening. If the generated source becomes unavailable or a later account no longer exposes the same model, the lesson's factual demonstration can still be maintained. This is ordinary production resilience: the core teaching should remain usable even when a decorative asset needs replacement.

## Prompt for a coding or production assistant

~~~text
Help me prepare a Runway shot plan for a 60-second Beacon release tutorial.
Audience: existing developers. Feature: a review queue for proposed agent changes.
I will supply approved screenshots and a written feature description.
Deliver: a storyboard, three original motion prompts, an iteration-log table,
and a checklist for a human reviewer. Keep exact interface behavior in real
screen recordings. Use generated video only for illustrative footage.
Do not invent current model limits, prices, or UI labels. Flag details that
must be checked in the current Runway account. Do not submit generations.
Verify every shot against the stated audience outcome and explain any
visual metaphor that could imply automatic approval.
~~~

This is a planning prompt. It does not install a Runway integration, grant account access, or authorize spending. If you later automate generation, make the model, output count, spending limit, and review destination explicit.

Before reusing the planning prompt, replace the fictional feature brief with approved facts. A prompt that is excellent for one release can still produce the wrong lesson when its assumptions are carried into another product.

## Sources and verification limits

Research accessed November 13, 2026. Product facts above are intentionally concise; the examples, rubrics, budgeting arithmetic, and production choices are original instructional material.

- [Getting started with generative video](https://help.runwayml.com/hc/en-us/articles/37425232841875-Getting-Started-with-Generative-Video): creation surfaces, modes, model-selection concepts, and iteration.
- [Text-to-video prompting guide](https://help.runwayml.com/hc/en-us/articles/47313737321107-Text-to-Video-Prompting-Guide): current Gen-4.5-oriented visual and motion prompting principles.
- [Creating with Gen-4](https://help.runwayml.com/hc/en-us/articles/37327109429011-Creating-with-Gen-4-Video): older-model documentation and its explicit links to newer workflows.

No paid generation, account-specific entitlement check, or video export was performed while writing this chapter. The walkthrough is documentation-based. Reconfirm available models, commercial terms, and displayed charges in your account before production.
