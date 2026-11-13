# Synthesia


## The problem: turn knowledge into a lesson people can follow

A release note is written for scanning. A training video is experienced over time. Copying the release note into a talking avatar can produce a fluent reading that is difficult to learn from: too many ideas arrive at once, the screen changes before the explanation finishes, and important conditions are buried in a long sentence.

Synthesia is useful when a team needs a repeatable way to create presenter-led training and update it as the underlying information changes. The learning task is broader than selecting an avatar. You need to transform source material into a coherent script, arrange scenes, synchronize speech and visuals, verify factual claims, and preserve enough structure to maintain the result.

This chapter builds a short lesson for Beacon, a fictional developer application whose review queue collects proposed agent changes. By the end, you should be able to choose the right starting route, preserve exact wording when required, design a reusable template, identify where generated assistance helps, and review the final video as a learning artifact.

Research was checked November 13, 2026. No Synthesia account, paid render, or export was used for this curriculum. The scripts, timing plans, rubrics, and examples below are original instructional material. Read [Foundations](../reference/foundations.md) for the shared concepts behind AI accounts, model variability, and evaluation.

## Understand the available starting points

Synthesia's current creation guide describes starting from a prompt, script, file, PowerPoint, template, or blank canvas. It makes a consequential distinction: importing a script preserves supplied wording, while importing a file asks the system to create a new script from the material. The guide also documents plan-specific access differences. [Video creation guide](https://docs.synthesia.io/docs/video-creation)

Choose the route based on the content contract:

| Your situation | Sensible starting approach |
| --- | --- |
| Exact approved wording must survive | Script-preserving workflow |
| Notes need to become a first draft | Assistant with explicit source scope |
| The visual structure already exists | Approved template or presentation |
| You need a tightly controlled custom lesson | Blank or simple reusable scene layout |

Do not choose file import merely because the script happens to be saved in a document. The file container and the intended transformation are different things. If a legal, product, or subject-matter review approved exact words, use a route designed to preserve them and compare the result afterward.

A current assistant can accelerate drafting, but the source remains evidence and the generated script remains a proposal. Keep those roles separate. A polished draft can quietly omit a qualification, merge two steps, or turn a conditional statement into a promise.

## A mental model: script, scene and template

The script is what the lesson says. A scene is a timed visual unit that supports a portion of that script. A template is a reusable arrangement of scenes or elements. These concepts work together but should not be confused.

For Beacon, the script explains why to review a proposed change. One scene introduces the queue, another shows the diff, another explains evidence, and a final scene gives the next action. A template might standardize the title, presenter position, screen-recording area, and closing card across many releases.

The template should reduce repetitive design decisions without dictating the lesson's logic. If every feature is forced into a five-scene promotional pattern, some lessons will become too shallow or too long. Reuse the visual grammar while allowing the instructional sequence to fit the task.

An avatar is a delivery element inside this structure. It can provide continuity and a human-facing presence, but it does not make a confusing script clear by itself. If a sentence contains four actions, split the actions before adjusting the avatar's expression. If the screen recording is unreadable, enlarge or recapture it before changing the presenter.

This mental model makes revision easier: factual changes belong in the script, layout changes belong in scenes or the template, and delivery changes belong in voice and performance settings.

## Prepare a source brief

Write a compact source brief before opening the assistant:

~~~text
Audience: Beacon developers who already know the basic project interface.
Task: Inspect one proposed agent change before approval.
Source facts: The queue groups proposals; each proposal has a diff and evidence.
Required boundary: Passing checks do not prove that the proposal meets the request.
Demo data: A sample repository with a small non-sensitive change.
Outcome: The viewer can locate the queue and explain what to inspect.
Length target: About 90 seconds, adjusted for clarity rather than speed.
~~~

The brief reduces the chance that a drafting assistant writes a broad sales pitch instead of a procedural lesson. It also provides a review reference when stakeholders request changes. If someone asks to add five unrelated features, you can assess whether those features support the stated outcome.

Collect the exact screenshots or recordings you need. Use current UI and a known release version. Remove confidential repository names, customer data, or internal messages from the demo. A small clean example is easier to teach than a realistic but crowded production environment.

Create a terminology list: Beacon, Review queue, proposal, diff, evidence, checks, and approval. Decide which terms need definitions for the audience. A developer may understand diff but still need to know what this application's evidence panel contains.

## Write a complete spoken script

Use this original script as a starting point:

~~~text
Beacon's review queue gives proposed agent changes one place to wait for inspection.

Open the queue and choose a proposal. Start with the description so you know
what the agent intended to change.

Next, inspect the diff. Check whether the code change matches the request and
whether it introduces unrelated work.

Then inspect the supporting evidence. Passing checks can reveal that important
behavior still works, but they do not prove that the proposal solves the right
problem.

When the change and its evidence support the request, make your approval
decision. If something is unclear, send the proposal back with a specific note.

Try this workflow on a sample change before adding it to your normal release routine.
~~~

The script moves from purpose to orientation, then to evidence and a decision. It defines a useful boundary without overwhelming the opening. It also uses verbs a viewer can connect to visible actions: open, inspect, compare, decide.

Read it aloud. If you stumble, rewrite. Add pauses where the viewer needs time to look at the screen. Do not solve a long script by pushing speech speed until the procedure becomes difficult to follow. Remove secondary detail or create a second lesson.

In a real project, have the feature owner approve this wording before a final render. A subject-matter review should check whether every instruction matches the actual product, not only whether the language sounds polished.

## Design scenes around attention

Create a rough scene table:

| Scene | Main idea | Visual treatment | Attention target |
| --- | --- | --- | --- |
| 1 | Proposals wait for review | Presenter plus title | Understand the purpose |
| 2 | Open a proposal | Large real queue recording | Find the correct item |
| 3 | Inspect the diff | Cropped real diff recording | Compare change with request |
| 4 | Inspect evidence | Real check-result recording | Understand what evidence can show |
| 5 | Make a deliberate decision | Simple approved text and presenter | Preserve the boundary |
| 6 | Try the workflow | Clear next-action card | Begin a safe practice run |

Each scene should have one main attention target. If the viewer must read dense on-screen text, watch the cursor, and listen to a new concept simultaneously, reduce the competition. The presenter can become smaller or disappear during detailed screen work.

Keep text concise on the canvas. The full narration belongs in captions or a transcript; the main visual can show a short label such as “Compare the change with the request.” Duplicating an entire spoken paragraph on screen can make the lesson feel like a slide being read aloud.

Use a consistent visual hierarchy: title, focal evidence, optional supporting note. A template can encode that hierarchy so each new release starts from a readable structure.

## First walkthrough: preserve an approved script

Open the current script-import route in your account. Synthesia's assistant documentation distinguishes the current script path from a legacy path and notes that their scene-break conventions differ. Verify the active route rather than mixing instructions from different interface generations. [Assistant documentation](https://docs.synthesia.io/docs/assistant)

Paste a short approved section first. Create scene boundaries using the current route's documented convention, then inspect the resulting scene list. Compare the words before doing detailed design. If the application has paraphrased the content, you may have chosen a source-to-draft workflow instead of a script-preserving workflow.

Choose a simple layout and an available stock avatar or another authorized presenter. Select a voice that makes technical language clear. Add the real queue recording to the appropriate scene, keeping the important controls large enough to read.

Preview the first scene and the transition into the screen demonstration. The desired result is a clear opening and an obvious handoff of attention. It is not a guarantee of identical pacing on every generation.

Save a draft before applying broad assistant edits. If you ask an assistant to shorten the whole lesson, review the script differences. A useful shortening removes repetition while preserving the task sequence and conditions. It should not silently remove the review boundary because that sentence sounds less promotional.

## Second walkthrough: draft from notes with Assistant

Use a notes-to-draft route when the source is not yet a script. Supply the source brief and the approved facts. Ask for an outline first, with each scene's purpose and source claim. The current Assistant guide describes an editable outline and a storyboard-oriented editing experience. [Assistant documentation](https://docs.synthesia.io/docs/assistant)

Use an instruction like this:

~~~text
Create a draft training lesson for existing Beacon developers. Use only the
attached approved feature facts. Teach how to inspect one proposed agent change.
Begin with a short outline. For each scene, state the viewer action and the
source fact it relies on. Keep the distinction between passing checks and a
correct proposal. Use a calm presentation style and real screen captures for UI.
~~~

Review the outline before generating a full visual draft. Does the sequence follow the user's task? Does it introduce terms before using them? Does it invent a benefit or control? Make structural changes now, when they are cheap.

Then inspect the generated script as text. Check verbs, conditions, product names, and claims. A source-based assistant can still produce an inaccurate inference. Your responsibility is to compare the proposal with the approved facts.

Once the script works, refine visuals. Separating content approval from visual polish prevents a beautiful layout from making reviewers reluctant to cut a scene that does not belong.

## Control speech and pronunciation

Synthesia's script documentation describes voice selection, pacing, pronunciation-related controls, and regenerating speech takes. It also notes that speech generation can vary between takes. Use those controls to refine an already sound script rather than to rescue a confusing one. [Script box documentation](https://docs.synthesia.io/docs/script)

Test technical terms in a short passage. Include the product name, an acronym, and the most important action phrase. Listen without looking at the words. If “CI” sounds like a different word, use a documented pronunciation control or an appropriate written form that produces the intended reading.

Keep the displayed product name correct even if the spoken representation requires a different pronunciation aid. Captions and on-screen labels should remain consistent with the actual UI. Do not accidentally teach an alternate spelling because it was convenient for speech generation.

Pacing should follow cognitive load. Slow down slightly when the viewer is inspecting a diff or reading check evidence. A short pause after “Open the proposal” gives the eye time to follow the cursor. A fast promotional cadence may be unsuitable for a procedural lesson.

When regenerating a line, compare it in context. A more natural isolated take can create a jarring rhythm between scenes. Keep the final narration and the final visual timing under review together.

## Build a reusable template carefully

Synthesia's template documentation describes reusable scene designs and variables for programmatic or bulk creation. Templates can be a strong foundation for repeated release lessons, but they need a stable content model. [Templates documentation](https://docs.synthesia.io/docs/synthesia-templates)

For Beacon, define a template with a title scene, a large demonstration scene, an evidence scene, and a closing scene. Keep the presenter placement and typography consistent. Allow the number of demonstration scenes to vary when the task requires it.

Use variables only where variation is expected and constrained. Feature name, release label, approved introduction, and a screenshot asset can be sensible variable candidates. A whole unreviewed release note inserted into one script variable is risky because its length and structure can break both pacing and layout.

Create a variable contract:

| Variable concept | Constraint | Why it matters |
| --- | --- | --- |
| Feature title | Short, approved wording | Prevents title overflow |
| Opening script | One purpose statement | Keeps the introduction focused |
| Demonstration asset | Current non-sensitive capture | Preserves factual UI |
| Boundary statement | Required when relevant | Prevents an overbroad promise |
| Next action | One concrete action | Gives the viewer a useful ending |

The contract is your design, not a provider API schema. Translate it into actual template variables only after checking the current supported variable types and naming rules.

## Personalize without losing control

Personalization is useful when different teams need a familiar example, language, or project name. It is less useful when it produces dozens of nearly identical videos that no one can maintain. Decide what variation improves learning before creating a batch.

Suppose three teams use Beacon: platform, payments, and mobile. The workflow is the same, but their sample proposals differ. A useful batch can share the introduction and decision boundary while swapping approved demonstration assets. A less useful batch changes names cosmetically while retaining a confusing generic example.

Before generating many variants, inspect one record from each variation type. Long feature names, unusual characters, and different script lengths can reveal layout or pacing problems. Do not assume a successful short English title proves that every localized or personalized version will fit.

Track each output with an internal production identifier, template revision, script revision, language, source assets, and reviewer. This makes later updates possible. If a shared boundary statement changes, you need to know which versions inherited the old wording.

The current bulk-personalization documentation describes mapping tabular fields to template variables and generating a batch. Read its current confirmation and persistence behavior before starting a large run. [Bulk personalization](https://docs.synthesia.io/docs/bulk-personalization)

## Estimate timing with useful uncertainty

Word count can help plan a script, but it does not determine final duration. Pauses, pronunciation, language, avatar delivery, and screen holds all affect timing. Use an estimate to find obvious problems, then preview the real speech.

For example, an original planning calculation might use a range of 120–150 words per minute for a calm English explanation. A 180-word script would then occupy roughly 72–90 seconds before extra holds. These are illustrative planning assumptions, not Synthesia limits or promises.

If the rough script exceeds your target, remove secondary ideas before increasing delivery speed. If the script is short but the screen actions need time, add silent or lightly narrated holds. The video should accommodate understanding, not merely fit an arbitrary runtime.

Record actual scene durations after preview. Compare the planned and observed timing. Over several lessons, you will learn how your chosen voice and content type behave. That local evidence is more useful than memorizing a generic words-per-minute number.

Keep the final task sequence intact while trimming. A common editing mistake is to remove the “why” and the condition while preserving every promotional adjective. Cut decoration first. The viewer needs to understand what to do and when the action is appropriate.

## Review learning quality in separate passes

Use four passes rather than trying to inspect everything at once.

First, review factual fidelity. Compare every claim and instruction with the approved source. Pay attention to absolute words such as always, automatic, guaranteed, and complete. They can broaden a modest feature into an unsupported promise.

Second, review procedural clarity. Watch the screen sequence without sound. Can you tell what action occurs and which control matters? Then listen without the screen. Does the narration explain the purpose and order? The final video should combine two useful channels, not two incomplete ones that require guesswork.

Third, review delivery. Check pronunciation, pacing, expression, and transitions. A natural voice is valuable only when the message remains clear. A presenter should not obscure important screen information or compete with dense text.

Fourth, review accessibility and maintenance. Check captions, contrast, readable type, and a usable transcript. Confirm that editable sources exist and that a future editor can identify the current template and script revision.

Use an original score from zero to two for clarity, visual alignment, delivery, and maintainability. Treat factual errors, unauthorized likeness, and misleading claims as gates. A high average score cannot compensate for a wrong instruction.

## Troubleshooting common production failures

| Symptom | Likely layer | Focused correction |
| --- | --- | --- |
| Approved wording was rewritten | Starting route | Use script preservation and compare text |
| One scene is overloaded | Instructional structure | Split by viewer action |
| Voice mispronounces a term | Script delivery | Test the term and use supported controls |
| UI is unreadable | Source capture and layout | Recapture or crop around the focal control |
| Template text overflows | Variable contract | Limit or redesign the variable area |
| Translation changes the condition | Localization review | Compare meaning against the source facts |
| Variants are hard to update | Production records | Track template and script lineage |
| Feature is missing | Account and product version | Check current plan and documentation |

Do not treat every failure as a reason to regenerate everything. If the screenshot is wrong, replace the screenshot. If a sentence is inaccurate, correct the sentence. Modular production reduces both cost and review effort.

For technical support, preserve the non-sensitive project identifier, time, operation, and error text. For editorial review, use time-coded observations and the relevant source fact. Avoid sending credentials or private source material when a smaller redacted example will explain the issue.

## Consent and truthful presentation

Use a stock presenter according to the applicable terms, or an identity whose intended use is explicitly authorized. If you create a custom avatar or voice, follow the provider's current consent process and your organization's policy. Successful rendering does not independently establish permission.

Do not frame a synthetic presenter as a real customer giving a testimonial unless that representation is accurate and authorized. In a training lesson, a neutral instructional presenter is usually sufficient. The audience needs clear guidance more than a claim of personal experience.

Keep provenance for scripts, images, screen recordings, music, and likenesses. Record the allowed audience and any restrictions. If the lesson will be public, review the actual captured data and links; an internal demo environment can contain information that should not appear in a public export.

This chapter provides production habits, not legal advice. Where a license or policy is unclear, resolve that uncertainty before publication. Trust is part of instructional quality: a polished video that misrepresents its source or presenter can undermine the lesson it was meant to support.

## Cost, revision and stopping rules

Check current pricing and account entitlements for the exact operations you plan to use. Application features, API access, generated duration, and other options can have different accounting. This guide does not freeze a credit rate or promise a particular plan includes a feature.

Stage the work: approve facts, approve script, preview delivery, inspect a short scene, then render the complete draft. This sequence catches expensive mistakes early. A final render should consolidate known decisions rather than reveal the first time anyone has heard the script.

Track revision causes. If most rerenders come from changing feature names, the script approval process needs improvement. If they come from unreadable screenshots, improve source capture. If they come from tone preferences, define a delivery standard for the series.

Stop refining when the lesson is accurate, understandable, appropriately delivered, and maintainable. A different avatar or more elaborate background may not improve the viewer's ability to perform the task. Spend remaining effort on a clear transcript, current links, and a reliable update process.

## Run a small update rehearsal

Before committing a whole training series to a template, rehearse a realistic change. Rename the sample feature, replace one screen capture, and revise the sentence explaining evidence. Observe which parts of the project need attention and whether the source record makes those dependencies obvious.

For Beacon, changing only the queue label should not require redesigning every scene. Changing the approval behavior, however, should trigger review of the script, screen actions, boundary card, and captions. The rehearsal teaches the difference between a copy update and a conceptual update.

Record the steps another editor would need. A reusable template is valuable when it preserves understanding and reduces maintenance work. A visually consistent project that only its original creator can safely revise has not yet achieved that goal.

## Compare adjacent approaches

Compare [HeyGen](05-heygen.md) for another scripted-avatar and developer workflow. Use [Runway](01-runway.md), [Kling](03-kling.md), [Luma](04-luma.md), or [Google Flow](02-google-veo-flow.md) when you need invented illustrative footage. Study [Tavus](07-tavus.md) and [D-ID](08-d-id.md) when the viewer must have a real-time conversation rather than watch a fixed lesson.

Use ordinary screen recording when a presenter adds little value. A concise narration over a clear interface can be the most efficient production. Use an avatar when a consistent presenter, multilingual delivery, or repeated updates materially helps the audience or production team.

The right comparison includes update effort. A template-centered lesson that takes minutes to revise may be more useful for fast-changing software than a more elaborate one-off production. Evaluate the whole lifecycle, not only the first export.

## Optional project and acceptance criteria

Create a 75–120 second Beacon review-queue lesson. Use an approved script, at least two accurate screen actions, a deliberate statement about evidence, captions, and a concrete next action. Build a reusable template for the visual structure without forcing every future lesson into the same scene count.

The project passes when the final wording matches the source, the viewer can locate the queue and inspect a proposal, technical terms are understandable, important controls are readable, and the source package identifies the template and script revisions. A second editor should be able to update the opening sentence and one screenshot without reconstructing the project.

If you try a personalized variant, select one meaningful difference such as a team-specific example. Explain how it improves learning. Preserve the shared source facts so personalization does not become uncontrolled factual variation.

## Assistant prompt

~~~text
Create a Synthesia production plan from my approved Beacon fact sheet. Audience:
existing developers. Outcome: inspect one proposed agent change before approval.
Deliver a spoken script, scene table, pronunciation list, template-variable
contract, and review rubric. Keep exact UI in real captures. Preserve the
boundary that passing checks are evidence, not proof of task correctness.
If exact wording is already approved, recommend a script-preserving route;
do not confuse file import with verbatim script import. Check current official
documentation for route and plan details. Do not render, spend credits, or publish.
~~~

## Sources and verification limits

Accessed November 13, 2026.

- [Video creation](https://docs.synthesia.io/docs/video-creation): starting routes and script-versus-file distinction.
- [Assistant](https://docs.synthesia.io/docs/assistant): outline, storyboard, current and legacy script-import distinctions.
- [Script box](https://docs.synthesia.io/docs/script): speech, voice, pacing and pronunciation concepts.
- [Templates](https://docs.synthesia.io/docs/synthesia-templates): reusable scene designs and variable concepts.
- [Bulk personalization](https://docs.synthesia.io/docs/bulk-personalization): batch field mapping and generation workflow.

No live render, account-specific entitlement, localization, pricing, or export was verified. The chapter's production plans and scripts are original examples. Recheck current interface and consent requirements before producing a real lesson.
