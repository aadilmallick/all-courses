# D-ID


## The problem: a picture, a script and a usable video

A developer may need a short spoken explanation without filming a presenter. A product team may need the same approved message in several contexts. A support application may need a live avatar that answers questions. These tasks all involve a digital presenter, but they have different lifecycles and success criteria.

D-ID's current quickstart separates asynchronous video generation from real-time agents. It lists several avatar generations and translation workflows. This chapter teaches the distinction first, then develops a small talking-avatar lesson and shows how the design changes for an interactive tutor. [D-ID quickstart](https://docs.d-id.com/docs/quickstart)

The example is Beacon, a fictional developer application with a review queue for proposed agent changes. The prerecorded lesson should explain the queue accurately. The optional live tutor should answer questions from an approved brief and acknowledge what it cannot know or do.

Research was checked November 13, 2026. No D-ID account was used, no paid generation was submitted, and no avatar or voice was created for this guide. The scripts, evaluation cases, and architectural patterns below are original teaching examples. Read [Foundations](../reference/foundations.md) if API credentials, asynchronous jobs, or evaluation are new to you.

## Understand the two lifecycles

An asynchronous render has a beginning and an eventual artifact. You submit inputs, receive a job identifier, wait for completion, retrieve the output, and review it. The viewer later watches a fixed file. A live session stays open while a user interacts, so you must manage device permissions, streaming, interruptions, session termination, and unpredictable questions.

| Question | Prerecorded video | Live avatar agent |
| --- | --- | --- |
| Who chooses the words? | Approved script and delivery inputs | Conversation policy plus user input and knowledge |
| What is the main artifact? | Rendered media file | A session and its outcomes |
| When can you review? | Before publication | Before launch and during monitored operation |
| Typical failure | Bad pronunciation or unusable render | Misunderstanding, latency, unsupported claims, failed tools |
| Essential control | Editorial approval | Scope, access checks, lifecycle and fallback |

Do not turn a successful video-rendering demo into a live assistant by merely adding a microphone. A live agent introduces new decisions that did not exist in the fixed script. It must know how to handle missing information and unavailable actions.

For a first project, complete the prerecorded workflow. It teaches identity, speech, output handling, and review with a bounded artifact. Then use the live path only if a conversation materially helps the audience.

## A mental model: submit, reconcile, retrieve, review

Think of rendering as sending a production order to a workshop. The submission response is a receipt, not the finished product. The receipt's identifier lets you check what happened. A completed status means the technical work finished; it does not mean the lesson is accurate or ready to publish.

Separate provider state from editorial state. Provider states describe whether a job is queued, processing, complete, or failed according to the selected endpoint's actual schema. Editorial states describe whether your team has reviewed the result, requested changes, or approved publication. Do not let a technical completion event skip human review.

For Beacon, the production record should include an internal video identifier, script revision, authorized presenter source, selected route, provider job identifier, output location, and review result. This record makes retries and updates manageable.

The workshop analogy has a limit: a network failure can obscure whether the order was received. If a request times out, submitting again may create a duplicate. A reliable application reconciles known state before repeating a creation operation. This is a general asynchronous-job concern, not a D-ID-specific promise about deduplication.

## Prepare a source package

Start with a permitted presenter image or an available stock avatar. For learning, avoid a real person's custom likeness unless you have explicit authorization and have followed the provider's current process. A file accepted by an API is not evidence that you have the right to publish its likeness.

Create an approved script and terminology sheet. The script is the content contract. The sheet records how Beacon, review queue, diff, CI, and other technical terms should sound. Keep a separate written transcript if you use pronunciation aids that differ from the displayed spelling.

Prepare the actual screen evidence: a sample queue, a proposed change, and supporting checks. Use non-sensitive data and current UI. The avatar should introduce and interpret the evidence, while real recordings show the exact procedure.

Write an asset manifest:

| Asset | Source | Role | Review requirement |
| --- | --- | --- | --- |
| Presenter image or avatar | Permitted stock or authorized source | Visual identity | Confirm intended use |
| Script | Approved release facts | Spoken content | Verify every claim |
| Voice choice | Permitted available option | Delivery | Check clarity and pronunciation |
| Queue capture | Demo environment | Factual procedure | Confirm current controls |
| Closing card | Original editable design | Next action | Check wording and link |

This preparation reduces the chance that a polished render hides an unresolved content or rights issue.

## Write a short useful script

Use this original opening:

~~~text
Beacon's review queue collects proposed agent changes in one place.
Open a proposal to inspect the code change and its supporting evidence.
Compare the result with your request before deciding whether to approve it.
Passing checks are useful evidence, but they do not prove that the proposal
solves the right problem.
~~~

The script has one purpose and one important boundary. It is short enough for a first delivery test, but it still teaches something substantive. A generic greeting would test the rendering pipeline without testing the technical language or message the real lesson needs.

Read it aloud. Replace awkward constructions before generating. If “supporting evidence” is too abstract for the audience, explain it in the screen-recorded section: test results, relevant logs, or another actual artifact supported by the product. Do not invent evidence types merely to fill the narration.

Plan where the presenter is visible. A full talking head can work for the introduction. During the diff demonstration, voiceover or a smaller presenter may give the viewer more room to inspect the code. The avatar should support attention rather than compete with the evidence.

Add exact titles and feature labels in a conventional editor. That keeps copy editable and prevents a minor release-name change from requiring a new visual generation.

## First documented path: photo-avatar generation

D-ID's V2 Photo Avatar quickstart documents a simple Talks request using an image URL and text, followed by status retrieval and a result URL. This remains a documented learning route in the current index; it should not be confused with the legacy Talks streaming interface discussed later. [Photo-avatar quickstart](https://docs.d-id.com/docs/v2-photo-avatar-quickstart)

Obtain an API credential through the current documented account process. Keep it out of source control and client-side code. Use a server-side environment variable or another approved secret mechanism.

This HTTP illustration follows the documented structure but contains a credential placeholder and an example asset URL, so it is not runnable as written:

~~~http
POST https://api.d-id.com/talks
Authorization: Basic YOUR_DOCUMENTED_KEY_VALUE
Content-Type: application/json

{
  "source_url": "https://example.com/authorized-presenter.png",
  "script": {
    "type": "text",
    "input": "Beacon collects proposed agent changes in one review queue.",
    "provider": {
      "type": "microsoft",
      "voice_id": "en-US-JennyNeural"
    }
  }
}
~~~

The response's identifier is used for GET /talks/{id}. The quickstart describes waiting for done and then retrieving result_url. It also documents limited output-URL lifetime, so treat a result URL as a delivery mechanism rather than permanent storage.

Before using the example voice or asset approach in production, verify current availability and permissions. No request was submitted for this chapter.

## Build a bounded status workflow

A learning script should not poll forever. A production system should not confuse a slow job with a failed one. Design a deadline, a status record, and a way to resume checking without recreating the job.

The following is provider-neutral pseudocode, not a D-ID endpoint implementation:

~~~text
if production record already has a provider job ID:
    resume status checks for that ID
else:
    submit the approved inputs once
    save the returned job ID immediately

until local deadline:
    read current provider status
    if complete: save output reference; mark awaiting editorial review; stop
    if failed: save error details; mark needs investigation; stop
    wait using documented rate and retry guidance

if deadline reached:
    keep the job ID; mark still unresolved; do not blindly resubmit
~~~

The key idea is persistence. A deadline ends this local waiting attempt, not necessarily the remote job. The job may still complete later. Keep enough state to reconcile it.

Separate transient transport failures from definitive provider failures. A temporary connection error should not erase the job identifier. A provider error should preserve a non-sensitive explanation for debugging. Your logs should help answer what happened without exposing credentials or private input material.

After completion, move the output into editorial review. That state is deliberate. A rendered talking head can still mispronounce a product term, express an inappropriate emotion, or state an inaccurate claim.

## Second path: expressive avatars

D-ID's V4 Expressive Avatar quickstart documents selecting an avatar and a sentiment, with the sentiment carrying a configured voice. It provides discovery of available avatar/sentiment combinations and an asynchronous render flow. [Expressive-avatar quickstart](https://docs.d-id.com/docs/v4-expressive-avatar-quickstart)

This changes how you think about delivery. Emotion is not merely a decorative adjective. It affects whether the performance fits the message. A highly excited delivery may suit a celebration, but it can undermine a careful explanation of reviewing evidence or handling a failure.

For Beacon, choose a professional or similarly restrained available delivery. Use the current discovery response rather than inventing a sentiment identifier from a label. An identifier shown in a documentation example may be illustrative or account-dependent; inspect the actual available resources.

Create two short candidates with the same approved script and different permitted delivery choices. Evaluate clarity, tone, and alignment with the lesson. Do not change the script at the same time, or you will not know whether a preference came from wording or performance.

If a sentiment also determines voice, record both in the production manifest. A later editor may otherwise think only the facial expression changed. This is a general lesson in configuration: one high-level choice can bundle several underlying properties.

The desired result is not maximum emotional intensity. It is a performance that makes the lesson understandable and appropriate for the audience.

## Compare delivery with a controlled review

Use a fixed script and one target layout. Watch each candidate once without the script visible, then compare it against the words. Evaluate the same criteria for every candidate.

| Criterion | Question |
| --- | --- |
| Factual speech | Did the rendered message preserve the approved meaning? |
| Pronunciation | Are product names and technical terms understandable? |
| Pacing | Can the viewer follow the procedure without rushing? |
| Expression | Does the face match the seriousness and tone of the lesson? |
| Synchronization | Does visible speech feel aligned enough for the intended use? |
| Editability | Are there clean starts, endings, and pauses? |

Score each zero, one, or two. Treat unauthorized identity and false claims as gates rather than averageable preferences. A compelling performance should not make a reviewer overlook the content contract.

If a candidate feels wrong, describe the observable problem. “The closing sentence sounds like a guarantee” may indicate script emphasis or wording. “The presenter smiles broadly during the caution” indicates tone mismatch. “The product name is unclear” points to pronunciation. Those are distinct changes to test.

Keep the strongest candidate as a baseline before refining. A later version may solve one problem and introduce another. Clear lineage prevents a team from losing the last usable take.

## Assemble the actual training lesson

Combine the avatar opening with a real screen recording of the review queue. Show the user opening a proposal, inspecting the diff, and locating evidence. Keep the demonstration slow enough to follow and crop around the important controls.

Use narration to connect action and purpose. “Read the description first so you know what the proposal intended to change” explains why the viewer should look there. “Click here, then here” may work briefly but becomes fragile when the UI changes or the cursor is difficult to see.

Add a short boundary card: “Checks are evidence. Compare the proposal with the request.” Keep the text exact and editable. If the product's language changes, the card can be updated without recreating an abstract visual or presenter identity.

Export a rough version and watch it from beginning to end. Check the transition from avatar to screen, the audio level, captions, and any accidental private data. A clean raw render does not guarantee a clean final export.

Preserve the approved script, source captures, selected avatar output, and final timeline. The next release should be an update, not an archaeological search through unlabelled downloads.

## Move to real-time agents only for a real need

A live tutor is useful when users need clarification or practice. It is unnecessary when the same short explanation serves everyone. Real-time interaction adds latency, uncertainty, and operational complexity, so choose it because the task benefits from conversation.

D-ID's current agent quickstart describes configuring an avatar, voice, and LLM instructions, then creating sessions through its current agent tooling. Use the currently supported model and account options rather than assuming every model named in an older example is still available. [Agent quickstart](https://docs.d-id.com/docs/agent-quickstart)

For Beacon, define a narrow behavior contract: explain the queue from the approved brief, clarify terms, acknowledge unknown details, and avoid claiming repository access or approval capability. Keep the first agent informational. A realistic face should not imply operational authority.

Prepare a small knowledge source containing only current release facts and common questions. Version it. If the product changes, you need to know which agent used the previous source. Knowledge retrieval can improve grounding, but it does not eliminate the need to inspect answers.

Plan session termination and a fallback path before sharing the experience. Users should be able to leave clearly, and a technical failure should not trap them in an unresponsive avatar interface.

## Avoid the legacy streaming trap

The official Talks Streams overview explicitly labels Talks/Clips Streams as legacy and directs new integrations toward Agents SDK or Agents Streams. It provides migration mappings for existing systems. This is a different issue from using the documented asynchronous Talks photo-video endpoint. [Legacy streaming notice](https://docs.d-id.com/reference/talks-streams-overview)

The practical lesson is to read the operation, not only the noun. “Talks” in a video-rendering tutorial and “Talks Streams” in a live WebRTC tutorial describe different lifecycles. A deprecation or legacy notice for one does not automatically apply to every similarly named route.

For new live work, start from the current agent-session guide and SDK documentation. Do not build a new project around a legacy demo simply because it ranks highly in search results. If you maintain an existing integration, map one lifecycle operation at a time and test connection, speech, interruption, and cleanup.

Preserve the user's experience during a migration. A lower-level API change should not silently alter what data is collected, which knowledge source is used, or which actions the agent can claim to perform. Treat those as explicit product decisions.

## Design a live tutor's action boundary

The Beacon agent should answer questions, not approve code. If a user says “approve my latest change,” the tutor should explain that it cannot perform the action and direct the user to the real review interface. It must not narrate a fictional success.

If you later add tools, begin with read-only evidence retrieval. Your application should authenticate the user and verify access before returning repository data. The model's request is not proof of authorization. The response should clearly distinguish observed data from an interpretation of that data.

For example, a tool may report that three checks passed. The tutor can say “The tool reports three passing checks” and explain what that evidence covers. It should not infer that the change is correct in every respect or that approval has occurred.

Add a separate application workflow for consequential actions. Ambiguous conversational phrases such as “okay” or “looks fine” may not be sufficient evidence of the user's intended operation. Design a clear review moment appropriate to the action rather than relying on the avatar's confidence.

This architectural discipline applies regardless of which visual SDK you use. A face and voice improve presentation; they do not replace identity, authorization, validation, or audit records.

## Evaluate the live path with concrete cases

Use the same approved knowledge brief for every candidate configuration. Test these original cases:

| Case | Prompt | Expected behavior |
| --- | --- | --- |
| Basic explanation | “What is the queue for?” | Grounded concise explanation |
| Procedure | “What should I inspect?” | Ordered steps from the brief |
| Misconception | “Passing checks prove it is correct?” | Explain the limitation |
| Unknown detail | “What is the current enterprise price?” | State lack of source information |
| Unavailable action | “Approve it for me” | Do not claim action |
| Correction | “I meant the proposal description” | Adapt to the clarified request |
| Interruption | User stops a long answer | Recover without ignoring the user |
| Technical failure | Connection or tool interruption | Explain and offer a useful fallback |

Record exact unsupported claims and relevant timing. A vague overall impression is insufficient for a production decision. Score grounding, clarity, turn-taking, and recovery, while treating invented actions as failures.

Test with realistic audio conditions. Background noise, a different microphone, and a hesitant speaker can expose problems absent from a quiet developer demo. Do not promise a particular latency based on one favorable session.

## A local production-state exercise

The following JavaScript is an original offline example. It does not call D-ID. It demonstrates how a provider-complete state remains separate from publication approval.

~~~javascript
const production = {
  id: 'beacon-review-001',
  providerStatus: 'done',
  scriptRevision: 'r2',
  reviewedRevision: 'r1',
  reviewerApproved: true,
};

function canPublish(record) {
  return record.providerStatus === 'done'
    && record.reviewerApproved === true
    && record.scriptRevision === record.reviewedRevision;
}

console.log('Publish allowed:', canPublish(production));
production.reviewedRevision = 'r2';
console.log('Publish after current review:', canPublish(production));
~~~

Save as production-state.mjs and run with Node.js. Expected output is false on the first line and true on the second. The first result matters: approval of an earlier script revision should not authorize publication of a later one.

This is a small teaching model, not a complete approval system. A real application needs authenticated review records and durable state. The example makes a subtle workflow error visible before it becomes an automated publication bug.

## Troubleshoot by lifecycle stage

| Symptom | Stage | Focused investigation |
| --- | --- | --- |
| Unauthorized response | Credential setup | Verify current auth format and active key |
| Input image cannot be fetched | Source delivery | Use a direct permitted URL or documented upload |
| Job remains unresolved | Render tracking | Preserve job ID and resume checks |
| Duplicate renders | Submission | Reconcile before retrying creation |
| Output link no longer works | Retrieval | Follow current output-lifetime guidance |
| Wrong emotion or voice | Delivery configuration | Inspect selected avatar/sentiment combination |
| Live tutorial uses old stream demo | Integration choice | Start from current Agents guidance |
| Agent invents repository access | Behavior and tools | Enforce scope and application checks |
| Final video is inaccurate | Editorial review | Correct the source script and affected render |

Preserve a non-sensitive request identifier, time, route, and error description for support. Do not place the credential in logs. For visual or speech issues, include a time range and an observable description instead of only a general rating.

## Cost and resource planning

Check current pricing for the exact avatar generation and live-session route. Do not infer costs from a different version, a different product surface, or a third-party wrapper. Duration, quality, output count, and session behavior may affect the practical budget.

For prerecorded lessons, track generated minutes, accepted minutes, and rerender causes. If the same technical term repeatedly causes a full rerender, add a short pronunciation test stage. If stakeholders keep changing wording, improve script approval before spending more on final renders.

For live pilots, track successful joins, useful resolutions, abandoned sessions, and errors. A session that consumes resources without helping the user is not a successful learning interaction. Include support and review effort in the comparison.

Set a small exploration budget and a fallback. A conventional narrated screen recording may serve the lesson well if the avatar adds little value. Use synthetic presentation where it helps clarity, consistency, localization, or update speed.

## Consent, provenance and truthful framing

Keep evidence of permission for presenter images, custom likenesses, voices, music, and screen recordings. Follow the provider's current consent requirements and applicable organizational policy. This chapter offers production practices rather than legal advice.

Do not present a generated person as a real customer endorsement or a recorded event unless the representation is accurate and authorized. For a developer training lesson, a neutral instructional avatar is usually enough. The lesson's credibility should come from correct evidence and clear explanation.

If the live experience processes microphone, camera, or transcript data, decide which inputs are necessary and explain the experience in the surrounding product. Consult current provider data documentation rather than assuming a retention rule from an unrelated service.

Preserve source lineage and revision history. A maintained guide needs to know which script, knowledge brief, and avatar configuration produced each artifact or session pilot. Good records reduce both operational confusion and accidental publication of outdated information.

## Alternatives and project completion

Compare [HeyGen](05-heygen.md) and [Synthesia](06-synthesia.md) for other scripted-presenter workflows. Compare [Tavus](07-tavus.md) for another interactive video path. Use [Runway](01-runway.md), [Kling](03-kling.md), [Luma](04-luma.md), or [Google Flow](02-google-veo-flow.md) for invented cinematic footage instead of a speaking presenter.

Optionally create a 60–90 second Beacon lesson with one avatar introduction, two factual screen actions, captions, and a next step. Include the source manifest, job record, pronunciation notes, accepted output, and final review. The lesson passes when it is accurate, understandable, authorized, and easy to update.

For the optional live extension, run the evaluation cases and prove that the agent does not claim unavailable actions. Demonstrate a clear session end and a useful fallback. Keep the first version informational; add external tools only after the application boundary is explicit and tested.

## Assistant prompt

~~~text
Plan a D-ID Beacon release lesson and an optional narrow live tutor. Deliver an
approved-script draft, source manifest, asynchronous job-state design, delivery
rubric, and live evaluation cases. Separate fixed video from real-time sessions.
Use current official documentation and distinguish asynchronous Talks from legacy
Talks Streams. Do not invent avatar or sentiment IDs, model access, or prices.
Use an authorized stock presenter for learning. Do not submit paid jobs, create
custom likenesses, expose credentials, or publish. Keep approval actions unavailable.
~~~

## Sources and verification limits

Accessed November 13, 2026.

- [D-ID quickstart](https://docs.d-id.com/docs/quickstart): current asynchronous and real-time product paths.
- [V2 Photo Avatar quickstart](https://docs.d-id.com/docs/v2-photo-avatar-quickstart): Talks creation, status, result and output-lifetime concepts.
- [V4 Expressive Avatar quickstart](https://docs.d-id.com/docs/v4-expressive-avatar-quickstart): avatar/sentiment selection and render flow.
- [Agent quickstart](https://docs.d-id.com/docs/agent-quickstart): current agent configuration path.
- [Agent sessions](https://docs.d-id.com/docs/agent-session-quickstart): live-session learning route.
- [Legacy Talks Streams overview](https://docs.d-id.com/reference/talks-streams-overview): explicit new-integration recommendation and migration context.

No account entitlement, paid rendering, live session, output retrieval, or latency was tested. HTTP examples are marked incomplete. The offline JavaScript example was executed and returned false followed by true as described; it verifies only the illustrated local workflow logic. Verify current route-specific authentication, limits, consent and charges before production.
