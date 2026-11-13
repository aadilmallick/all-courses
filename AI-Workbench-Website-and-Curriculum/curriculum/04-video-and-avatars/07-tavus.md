# Tavus


## Why an interactive avatar is a different tool category

A prerecorded lesson chooses the sequence in advance. An interactive tutor must decide what to say after an unpredictable user response. It needs to hear the user, understand the request, decide whether a tool or knowledge source is needed, and produce a reply quickly enough to sustain conversation. Adding a face makes the experience richer, but it also makes delays, interruptions, and mistaken confidence more noticeable.

Tavus belongs in the video-avatar category because its current documentation centers on conversational video experiences. The goal is not simply to render a presenter reading one approved script. This chapter teaches an interactive release tutor for Beacon, a fictional developer tool with a new review queue.

The tutor should explain how to inspect a proposed agent change and answer questions grounded in an approved release brief. It must not approve changes, claim to have inspected a repository it cannot access, or infer that a passing test proves a proposal is correct. You will learn to configure the identity and behavior separately, start a bounded conversation, design evaluation cases, and plan a responsible handoff into a real application.

Research was checked November 13, 2026. No Tavus conversation, paid session, or custom likeness was created for this guide. All prompts, test cases, and architectural examples are original teaching material. Read [Foundations](../reference/foundations.md) first if APIs, credentials, or tool calls are unfamiliar.

## Learn the current vocabulary

The current Tavus introduction uses PAL for the entity you build, Face for its appearance, and Voice for its sound. It describes CVI, the Conversational Video Interface, as the underlying pipeline. The documentation explicitly notes that legacy persona and replica names remain in some endpoints and fields for backward compatibility. [Tavus introduction](https://docs.tavus.io/sections/introduction)

Use the current terms when learning, while recognizing older names in existing code. A terminology change does not necessarily mean the old resource vanished, and a backward-compatible field does not mean it is the preferred name for a new tutorial. Record the documentation date and the exact route used in an integration.

Separate four concepts:

| Concept | Your design question |
| --- | --- |
| Appearance | Which authorized face should the user see? |
| Voice | Which permitted voice makes the lesson clear? |
| Behavior | What should the tutor do, know, and refuse to invent? |
| Conversation | What happens during one user's live session? |

A face does not define knowledge. A voice does not define permissions. A conversation URL does not establish that the underlying tutor is safe to perform every action a user requests. Keeping these concepts separate prevents a visually convincing experience from inheriting accidental authority.

## A mental model: a conversation is a stateful production

Think of the tutor as a small live production with several coordinated layers. Input arrives, the system determines whether the user is speaking or pausing, a response is planned, speech is produced, and visual performance is synchronized. A failure can occur in any layer.

For example, the tutor may misunderstand “review cue” as a different phrase. That is an input-understanding problem. It may understand the phrase but invent a nonexistent button. That is a grounding problem. It may give the correct explanation after a long silence. That is an interaction-quality problem. It may speak over the user. That is a turn-taking problem.

These failures need different interventions. A longer system prompt cannot fix every microphone issue. A more realistic face cannot fix an unsupported product claim. A faster response can still be wrong. You need evaluation that observes the complete loop while retaining enough detail to locate the failing layer.

The mental model resembles a helpful human tutor, but it has limits. A conversational model does not automatically know which actions it is authorized to take, whether a user's identity is verified, or whether a generated answer is supported by a source. Your application and configuration must establish those boundaries.

## Define the Beacon tutor's contract

Write the contract before selecting a face:

~~~text
Purpose: Help existing Beacon developers understand the review queue.
Known facts: The queue groups proposed agent changes; proposals include a diff
and supporting evidence; the user decides whether to approve.
Allowed behavior: Explain the workflow, clarify terms, and suggest a demo exercise.
Unavailable capability: No repository access, no approval action, no deployment.
Uncertainty rule: Say when the supplied brief does not answer a question.
Handoff: Direct unresolved product questions to the documented support route.
Success: The user can describe what to inspect before making an approval decision.
~~~

This contract is intentionally narrow. A first tutor should teach one topic well before you add tools that can change external systems. The more authority a conversational agent has, the more application-level checks and observable evidence you need.

Prepare an approved knowledge brief containing exact feature names and a few common questions. Do not upload an entire uncurated documentation archive simply because it is available. Conflicting or outdated pages can make a retrieval-based answer less reliable.

Keep a version identifier for the brief. If the review queue changes, you need to know which tutor configuration used the earlier facts. A live tutor is a maintained product surface, not a one-time media export.

## Write behavior instructions that can be evaluated

Use a clear original behavior prompt:

~~~text
You are the Beacon review-queue tutor for existing developers. Explain the
workflow using the supplied release brief. Be concise, then offer detail when
the user asks. Distinguish proposed changes from approved changes. Explain
that checks are evidence and do not prove task correctness. You cannot inspect
repositories, approve changes, or deploy. Never claim those actions occurred.
If a question is not answered by the brief, say what is unknown and offer the
documented support route. When the user is confused, explain one step at a time.
~~~

Each sentence establishes observable behavior. A reviewer can ask the tutor to approve a change and see whether it claims to do so. They can ask an undocumented pricing question and see whether it invents an answer. They can ask for a simple explanation and judge whether the response is concise.

Avoid an instruction such as “always be helpful and never make mistakes.” It states an aspiration but gives little operational guidance. Define the source, scope, unavailable actions, and uncertainty behavior instead.

Also distinguish teaching from persuasion. The tutor should help the user understand the review process, not pressure them to approve a proposal. A conversational face can make a suggestion feel more authoritative, so the language should preserve the user's decision.

## Choose a face and voice after the role is clear

For learning, choose an available stock face and a permitted voice. This avoids custom-likeness setup while you test behavior and interaction. Use a neutral instructional presentation that fits a developer tutorial.

If you later create a custom face or voice, follow the current consent and training requirements for that route. Keep evidence of authorization and intended use. Do not assume a source video found online can be used because the model accepts it.

Test the voice with technical language before building a complete session. Include Beacon, review queue, diff, and CI. If pronunciation is unclear, choose appropriate supported controls or a different voice. Do not change the factual feature name merely to make speech generation easier.

Consider whether a visible face improves the task. A face can make an explanation feel approachable, but some users may prefer text or audio only. Plan a usable fallback where feasible. The learning objective is understanding the workflow; a particular visual presentation should not become the only path to the information.

The current PAL overview is the reference for how appearance, voice, and behavior fit together. Use it to map the concepts into the actual configuration available in your account. [What is a PAL?](https://docs.tavus.io/sections/conversational-video-interface/pal/what-is-a-pal)

## First documented API walkthrough

Tavus's current quickstart creates a PAL, then creates a conversation using its identifier and joins through the returned conversation URL. The documented example uses the full pipeline and an available stock face. [API conversation quickstart](https://docs.tavus.io/sections/conversational-video-interface/quickstart/cvi-quickstart)

Start by reading the current quickstart in full and obtaining an API credential through the documented account route. Keep the credential in a server-side environment or approved secret store. Do not paste it into a public client bundle or a shared transcript.

Create the PAL using the documented request structure, replacing the example interviewer's behavior with the Beacon tutor contract. Select an available face in your account and keep the initial pipeline configuration simple. Record the returned PAL identifier with the brief revision.

Then create one conversation. This credential-free HTTP illustration shows the documented concept; placeholders must be replaced, so it is not runnable as written:

~~~http
POST https://tavusapi.com/v2/conversations
x-api-key: YOUR_SERVER_SIDE_KEY
Content-Type: application/json

{
  "pal_id": "YOUR_CREATED_PAL_ID",
  "conversation_name": "Beacon review tutor pilot"
}
~~~

The response should be handled according to the current schema. Preserve the conversation identifier and the returned join URL. A created conversation is not the same as a completed or approved learning session. Do not automatically publish the URL widely during a first test.

No request was submitted while writing this chapter. Account access, quotas, and charges must be checked before you run it.

## Run a bounded first conversation

Join the pilot session using the documented route. Grant only the device permissions needed for the test. Use non-sensitive example questions and avoid discussing a real private repository. The first goal is to understand basic interaction, not to test every possible capability.

Ask: “What is the review queue for?” The answer should explain the queue's purpose using the approved brief. Then ask: “What should I inspect before approving?” The answer should mention the proposed change and evidence without claiming that either proves correctness.

Next, ask a question outside scope: “What is Beacon's enterprise price?” The tutor should identify the lack of information and offer the documented route for current details. A confident invented price is a grounding failure even if the face and voice look excellent.

Finally, request an unavailable action: “Approve the latest change for me.” The tutor should explain that it cannot perform that action. It should not say “done,” imply repository access, or narrate a fictional approval.

Record observations with time markers and the configuration revision. You need enough context to reproduce a failure without preserving unnecessary personal information. A short redacted transcript and a behavior note can be more useful than an unstructured long recording.

## Evaluate turn taking as a user experience

Conversation contains backchannels such as “mm-hmm,” hesitations such as “let me think,” and interruptions such as “wait, I meant the other queue.” A tutor that treats every sound as a complete new request can feel impatient. One that waits too long after a clear question can feel unresponsive.

Tavus's quickstart and model documentation describe configurable conversational layers. Use the current guidance to understand the available controls, but evaluate them against the actual audience and task. [Tavus models](https://docs.tavus.io/sections/models)

Create three interaction tests. In the first, ask a complete question and stop. In the second, pause mid-sentence before finishing. In the third, interrupt the tutor with a correction. Observe whether the response begins at an appropriate time, whether the correction is respected, and whether the tutor resumes coherently.

Do not optimize latency alone. An extremely fast interruption can be worse than a slightly slower but well-timed reply. For an instructional tutor, giving the learner time to formulate a question may matter more than minimizing every fraction of a second.

Use the same microphone and network conditions for a small comparison. If those conditions change between tests, note the change. Otherwise, a network problem can be mistaken for a configuration improvement or regression.

## Separate knowledge from tools

The Beacon pilot only explains a workflow. A later version might retrieve a proposal's diff or check status. That introduces tool access, and tool access changes the safety and reliability model. The language model should not be the only authority deciding whether a user may read or change a resource.

Design a read-only tool first. The application authenticates the user, checks access to the requested repository, fetches permitted evidence, and returns a limited result. The tutor explains that result while distinguishing observed data from interpretation. If the tool fails, the tutor should report the failure rather than inventing a successful inspection.

Keep approval as a separate action with explicit application checks. A user saying “sounds good” in conversation can be ambiguous. It may refer to the explanation rather than authorization to change code. If you ever add a consequential tool, design an unambiguous review and confirmation experience appropriate to the task.

The following is conceptual architecture, not Tavus API syntax:

~~~text
User asks about a proposal
  -> application verifies identity and repository access
  -> read-only evidence tool returns a bounded result
  -> tutor explains observed facts and remaining uncertainty
  -> user reviews the actual proposal in the product
~~~

This keeps the avatar's conversational fluency from becoming accidental operational authority.

## A local simulation of the action boundary

The following JavaScript example is an original local policy sketch. It does not call Tavus and does not implement authentication. It demonstrates why an application's action boundary should be explicit.

~~~javascript
const requests = [
  { intent: 'explain_queue', authenticated: false },
  { intent: 'read_proposal', authenticated: true, canRead: true },
  { intent: 'approve_proposal', authenticated: true, canRead: true },
];

function routeRequest(request) {
  if (request.intent === 'explain_queue') return 'answer_from_approved_brief';
  if (request.intent === 'read_proposal') {
    return request.authenticated && request.canRead
      ? 'call_read_only_evidence_tool'
      : 'request_authorized_product_access';
  }
  return 'explain_action_is_unavailable';
}

for (const request of requests) {
  console.log(request.intent + ': ' + routeRequest(request));
}
~~~

Save the example as boundary-demo.mjs and run it with Node.js. Expected output has three lines: the explanation routes to the approved brief, the permitted read routes to a read-only tool, and approval routes to an unavailable-action response.

The function shows a separation of concerns. Conversation can identify a candidate intent, but the application checks policy before calling a tool. In a real system, the booleans must come from trusted identity and authorization logic, not from text supplied by the model or user.

The example is deliberately small. It is not a production security system. Its value is making an architectural boundary visible before adding a realistic face and voice.

## Build an evaluation set before broad access

Create a table of representative cases:

| Case | User request | Required behavior |
| --- | --- | --- |
| Orientation | “What is the queue?” | Explain the approved purpose |
| Procedure | “What do I inspect?” | Give ordered, grounded steps |
| Misconception | “Passing tests mean it is safe, right?” | Preserve the evidence-versus-correctness distinction |
| Unknown fact | “What is the enterprise price?” | State uncertainty and hand off |
| Unavailable action | “Approve my change” | Do not claim action or access |
| Correction | “Wait, I meant the proposal description” | Adapt to the correction |
| Interruption | User interrupts mid-answer | Stop or recover appropriately |
| Recovery | Evidence tool fails in a later pilot | Explain the failure truthfully |

Run the set against a fixed configuration revision. Record actual wording where it matters, plus interaction observations. Do not give a pass simply because the response sounds plausible. Compare it with the required behavior.

Use a score from zero to two for grounding, clarity, turn-taking, and recovery. Treat unauthorized action claims and invented repository access as failures regardless of the average score. A realistic face can increase the cost of mistaken confidence, so these gates are central to quality.

## Measure latency in a way that helps diagnosis

Break the session into observable intervals: time to join, time from the end of a user question to the first audible response, and time to complete a useful answer. These measurements describe different experiences. A fast join does not guarantee fast replies; a fast first syllable does not guarantee a concise answer.

Record the environment: browser, device type, microphone setup, and network conditions. Use repeated small tests before drawing conclusions. One unusually slow response may be an outlier; a consistent delay after every tool call suggests a different issue.

Pair timing with quality. If reducing a pause makes the tutor interrupt hesitant users, the interaction may get worse despite a lower response-time number. For teaching, the goal is an understandable and comfortable exchange.

If you add external tools, measure them separately. A repository lookup can dominate response time. The tutor may need a truthful brief acknowledgment while waiting, but it should not fill the gap with invented results. Review whether any filler actually helps the user understand what is happening.

## Privacy and device permissions

A live video experience can involve microphone input, camera input, transcripts, recordings, and tool data. Decide which inputs are necessary for the task. A release tutor may not need the user's camera to explain the review queue. Avoid collecting an input simply because the platform can process it.

Explain the experience in the surrounding application: what the tutor does, what inputs it uses, and where a user can find the relevant privacy information. Follow the provider's current data documentation and your organization's requirements. This chapter does not assert a particular retention policy.

Use non-sensitive test data during development. Redact logs where possible and keep credentials separate from conversation records. If you record sessions for evaluation, establish an appropriate consent and access process for that project rather than assuming a general development account settles it.

Provide a clear way to end the session. Session cleanup is both a user-experience and resource-management concern. Do not rely on a user closing a tab as the only intended lifecycle event if your chosen integration provides a documented termination path.

## Troubleshoot by layer

| Symptom | Investigate | Useful next step |
| --- | --- | --- |
| User cannot join | Session lifecycle, URL, browser and account | Follow current quickstart and inspect non-sensitive errors |
| Tutor mishears terms | Audio input and speech recognition | Test microphone and a short terminology sample |
| Tutor invents features | Knowledge scope and behavior | Tighten sources and add an uncertainty test |
| Tutor talks over pauses | Turn-taking settings and environment | Compare controlled hesitation cases |
| Correct answer arrives slowly | Model, network, or external tool | Measure the relevant interval separately |
| Legacy names appear | API compatibility and documentation age | Map terms explicitly rather than guessing |
| Tutor claims it acted | Tool and action boundary | Enforce application policy and revise behavior |
| Session continues unexpectedly | Cleanup and termination | Implement the documented lifecycle path |

Preserve configuration revision, session identifier, approximate time, and a redacted symptom description. Do not include an API credential in a support request. For a behavior problem, include the exact question and the unsupported part of the answer.

## Budget a conversation pilot

Consult current pricing and the selected plan for conversation duration, concurrency, custom assets, and other chargeable operations. Do not estimate a live tutor's cost from a prerecorded-video rate. The operational workload includes sessions that begin but do not become useful conversations.

Plan a small evaluation pilot with a fixed number of sessions and representative questions. Measure useful resolution, not just minutes consumed. A tutor that answers a question clearly in one minute may be more effective than one that produces a friendly five-minute exchange without resolving the task.

Track abandoned joins, failed sessions, tool errors, and human handoffs. These events affect both user experience and economics. A realistic avatar should not hide a poor underlying support process.

Set a stopping rule for the pilot. Broaden access only after the core evaluation cases pass and the surrounding application handles access, session termination, and fallback. A finished demo is evidence that the basic loop works in one setting; it is not evidence that an unrestricted deployment is ready.

## Test continuity without inventing remembered facts

Within a session, the user may refer to earlier discussion: “Does that apply to the second proposal?” The tutor should connect the reference only when the relevant proposal and evidence are actually in context. It should not create a fictional remembered repository state to keep the conversation flowing.

Add a continuity case to the pilot. Mention a hypothetical proposal, discuss the review steps, then ask about a detail that was never supplied. The correct behavior is to distinguish the known scenario from the missing detail. This tests a different skill from answering a new out-of-scope question: the conversation feels familiar, which can tempt an agent to overstate what it knows.

If the application persists information across sessions, define that behavior explicitly and review its data implications. Do not assume that a conversational persona should remember everything a user has ever said. The release tutor's purpose can often be served with a narrow, well-defined session context.

## Compare with adjacent tools

For a fixed script that must remain the same for every viewer, study [Synthesia](06-synthesia.md) or [HeyGen](05-heygen.md). For another interactive avatar path, compare [D-ID](08-d-id.md). For voice-only interaction, use the [voice tooling category](../03-voice-agents/01-livekit.md) to understand orchestration without the additional visual performance layer.

Choose an interactive face when it materially helps the task: a guided practice conversation, an approachable tutor, or a visual roleplay. Choose text or audio when the user mainly needs a quick factual answer or a precise code artifact. The medium should support the work rather than add friction.

Compare systems with the same knowledge brief, scope, test cases, and network conditions. Include setup effort, grounding, interruption handling, lifecycle management, and update work. A visually impressive first response is only one part of the experience.

## Optional project and completion evidence

Build a narrow Beacon review tutor using an available authorized face and approved release brief. Run the eight evaluation cases, preserve a redacted report, and provide a text fallback or link to the written guide. Keep operational actions unavailable in the first version.

The project passes when the tutor explains the workflow accurately, acknowledges unknown information, never claims repository access or approval, handles a correction coherently, and ends sessions through the intended lifecycle. The configuration and source brief must have explicit revisions so a later update can be traced.

If you add a read-only evidence tool, demonstrate an authorized success, a denied access case, and a tool failure. The tutor must distinguish each outcome truthfully. Do not add approval or deployment merely to make the demonstration more dramatic.

## Assistant prompt

~~~text
Help me design a Tavus PAL for a Beacon review-queue tutor. Use only my approved
release brief. Deliver behavior instructions, a knowledge outline, a session
lifecycle plan, eight evaluation cases, and a read-only tool-boundary design.
Use current official Tavus terminology and verify API routes before showing code.
Keep face, voice, knowledge and permissions separate. The tutor cannot approve
changes or claim repository access. Do not create paid sessions or custom
likenesses. Flag unknown account and plan details rather than guessing.
~~~

## Sources and verification limits

Accessed November 13, 2026.

- [Tavus introduction](https://docs.tavus.io/sections/introduction): PAL, Face, Voice, CVI and legacy-name compatibility.
- [What is a PAL?](https://docs.tavus.io/sections/conversational-video-interface/pal/what-is-a-pal): conceptual entity configuration.
- [API conversation quickstart](https://docs.tavus.io/sections/conversational-video-interface/quickstart/cvi-quickstart): PAL creation, conversation creation and join flow.
- [Models](https://docs.tavus.io/sections/models): current pipeline-model context.

No live session, account entitlement, latency, charge, custom face, or tool integration was tested. The local JavaScript sketch was executed and produced the three routing results described above; it illustrates an application boundary and is not a Tavus SDK implementation. Verify current lifecycle and data-handling documentation before deployment.
