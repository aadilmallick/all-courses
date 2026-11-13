---
title: LiveKit Agents
description: Build voice applications around rooms, agent sessions, and observable tool execution.
sidebar:
  order: 1
---

## What you will learn

LiveKit Agents is a strong starting point when you want to write a voice application as software: keep the agent in a repository, choose how it reasons and speaks, and connect it to a real conversation. The official quickstart supports Python and Node.js starters. LiveKit also offers a browser Agent Builder for simpler prototypes and a cloud deployment path. These are related entry points, so begin by deciding whether your immediate goal is to understand the code or validate a conversation idea. [Voice AI quickstart](https://docs.livekit.io/agents/start/voice-ai/), [Agent Builder](https://docs.livekit.io/agents/start/builder/)

This chapter develops an original example: **Workshop Guide**, an assistant that helps someone choose a technical workshop and prepares a registration request. It can explain a small catalog and collect preferences. It cannot silently enroll anyone. By the end, you should understand where media transport ends, where conversational logic begins, and how to investigate a failure without guessing at the prompt.

Allow three to five hours for a first implementation, then additional time to listen to test conversations. You need a microphone, basic Python or JavaScript knowledge, and permission to use the services you connect. The local reasoning exercises require no paid account. The live starter does require appropriate credentials and may create usage charges. The commands below are documented instructions for the learner; no LiveKit service was provisioned while writing this chapter.

## Start with the problem, not the voice

A normal HTTP application receives a request, computes an answer, sends a response, and usually finishes. A conversation is different. The person may pause halfway through a sentence, correct a workshop name, interrupt the answer, or disconnect while a tool is running. Audio keeps arriving while other work is happening. Treating every burst of sound as an independent request loses the relationships that make conversation coherent.

For Workshop Guide, consider this exchange:

> Person: I want the Python workshop on Friday.  
> Guide: The Friday Python workshop starts at two—  
> Person: Sorry, I meant Saturday.  
> Guide: Saturday has the introductory Python workshop at ten. Would you like the details?

The important behavior is not merely recognizing the word “Saturday.” The system must stop obsolete speech, revise the intended day, avoid using a stale Friday result, and keep track of what the person actually heard. This is why a voice framework is useful: the application needs a durable conversational process around the model.

Write the outcome before choosing providers. For this example, success means the person receives a workshop option that exists, hears the relevant date and time, and receives a draft registration request only after confirming the choice. A pleasant voice is desirable, but it does not establish correctness. A confident response about a nonexistent workshop is a failure even when the latency is excellent.

## The prerequisites that matter

You do not need to become an audio engineer. You do need five working ideas.

**Streaming** means work arrives in pieces. A microphone does not send one complete recording at the end of the conversation. Similarly, generated speech can begin before the whole answer exists. This reduces waiting but creates cancellation problems: some pieces may already be playing when new information arrives.

**Asynchronous work** lets the program wait for a model or database without blocking unrelated activity. A tool call can be pending while the media connection remains active. Awaiting a result does not mean the rest of the world stops. Design the result handler to ask whether the result is still relevant when it returns.

**A session** is the ongoing interaction, including history and current state. A model request is one operation inside that interaction. If you restart the process, you need an explicit policy for which information survives. A user identifier, a room identifier, and a business request identifier serve different purposes and should not be interchangeable.

**A tool** is application code that the conversational system may request. The model proposes arguments; your code decides whether those arguments are valid and whether the caller is permitted to perform the operation. Returning a JSON object is not the same as completing a business transaction.

**A transport** moves media and control messages between participants. It does not decide whether Saturday has seats. If the audio connection works but a workshop answer is wrong, investigate the catalog and application logic before replacing the transport.

If these ideas are unfamiliar, read the [foundations guide](/foundations/) and return here. The rest of the chapter uses them directly, without requiring a detour into network protocol internals.

## A useful mental model

Imagine three adjacent workbenches. The first handles the conversation connection: who joined, which microphone is sending audio, and whether the client remains connected. The second handles the agent session: listening, deciding that a turn has ended, asking for reasoning, and producing a reply. The third handles business truth: the workshop catalog, booking policy, and request records.

The separation is a design recommendation, not a claim that each bench must be a separate server. A small prototype can implement all three in one project. The benefit is diagnostic. You can say “the catalog lookup returned a Saturday workshop, but Friday audio continued playing” instead of “the AI is confused.”

For Workshop Guide, keep a compact state record:

```json
{
  "conversation_id": "local-demo-17",
  "topic": "python",
  "preferred_day": "saturday",
  "selected_workshop_id": null,
  "registration_confirmed": false,
  "draft_request_id": null
}
```

This is an original application object, not a LiveKit configuration. The distinction matters: do not paste these fields into an SDK constructor and assume they are supported options. The object gives your own code a stable vocabulary while the framework handles conversation mechanics.

Keep facts out of the prompt when they change frequently. A prompt can say “look up workshop times.” The catalog should say what those times are. Otherwise, changing a workshop requires remembering every prompt, test fixture, and fallback message that copied its old date.

## Create the smallest live starter

The documentation’s current quickstart lists Python 3.10 or later with `uv`, or Node.js 20 or later with a sufficiently recent `pnpm`. Check the live requirements before installation because starter requirements can change. On Windows, the documented LiveKit CLI installation is:

```powershell
winget install LiveKit.LiveKitCLI
```

Open a new terminal after installation so it sees the updated executable path. Then follow the documented Python starter flow:

```powershell
lk cloud auth
lk agent init workshop-guide --template agent-starter-python
cd workshop-guide
```

The initialization is interactive. Read the selected project and dependency choices instead of accepting them mechanically. A starter is useful because it gives you a coherent set of files and dependency versions, rather than a handwritten mixture of examples from different SDK generations. [Voice AI quickstart](https://docs.livekit.io/agents/start/voice-ai/)

Before editing, record the generated dependency lockfile, the CLI version, the selected cloud project, and which model providers the starter uses. Keep secrets in the environment mechanism the starter documents, and ensure those files are ignored by version control. A key authenticates the service, not the person using your eventual app. You still need application authentication when real users can access private information.

Run the starter using its generated README. Do not skip that README in favor of a remembered command from a tutorial. Your first live check has a narrow goal: hear one reply, interrupt it once, and end the session cleanly. Do not connect a registration database yet. If something fails now, the search space remains small.

## Define a conversation contract

Replace an open-ended persona with an explicit job. This is an original prompt for the workshop example:

```text
You are Workshop Guide, the event's AI workshop assistant.
Help a person choose a workshop from the current catalog.
Ask one short question when a required preference is unclear.
Use catalog results for dates, times, availability, and workshop names.
When a person changes a preference, use the revised preference.
Explain one suitable option at a time in spoken language.
You may prepare a registration request after the person confirms
the exact workshop. A request is not a completed enrollment.
If the catalog is unavailable, say that you cannot verify the schedule.
Offer a human support route when the task cannot be completed.
```

Every line changes an observable behavior. “One short question” prevents a five-field interview from being read as one breathless paragraph. “Current catalog” establishes an external source of truth. “A request is not enrollment” prevents the wording from overstating what your backend did. A prompt remains an instruction, not a security boundary: enforce registration rules in code.

Use a small catalog so you can inspect every answer. Here is a complete offline example that teaches the business layer independently of the framework. Save it as `catalog_demo.py` and run `python catalog_demo.py` with Python 3.10 or later.

```python
import json

WORKSHOPS = [
    {"id": "py-sat", "topic": "python", "day": "saturday",
     "time": "10:00", "title": "Python foundations", "seats": 6},
    {"id": "py-fri", "topic": "python", "day": "friday",
     "time": "14:00", "title": "Python for automation", "seats": 0},
]

def find_workshops(topic: str, day: str) -> dict:
    normalized_topic = topic.strip().casefold()
    normalized_day = day.strip().casefold()
    matches = [
        item for item in WORKSHOPS
        if item["topic"] == normalized_topic
        and item["day"] == normalized_day
        and item["seats"] > 0
    ]
    return {"status": "ok", "matches": matches}

def prepare_request(workshop_id: str, confirmed: bool) -> dict:
    if not confirmed:
        return {"status": "confirmation_required"}
    selected = next((w for w in WORKSHOPS if w["id"] == workshop_id), None)
    if selected is None or selected["seats"] < 1:
        return {"status": "unavailable"}
    return {"status": "draft", "request_id": "demo-request-001",
            "workshop_id": workshop_id, "enrolled": False}

if __name__ == "__main__":
    result = find_workshops(" Python ", "SATURDAY")
    print(json.dumps(result, indent=2))
    print(json.dumps(prepare_request("py-sat", confirmed=False)))
    print(json.dumps(prepare_request("py-sat", confirmed=True)))
```

The expected result contains the `py-sat` workshop, then `confirmation_required`, then a draft with `enrolled: false`. `casefold` makes matching insensitive to letter case. The comprehension filters by topic, day, and seats. `next` finds one identifier without trusting a title generated by the model. Nothing contacts a network or creates an enrollment.

The fixed request identifier is deliberately limited to this offline demonstration. A real service should generate a durable identifier and use an idempotency key so retrying a tool does not create duplicate records. Do not replace the clear demo boundary with an apparently production-ready implementation that quietly writes into memory and loses its state on restart.

## Connect tools one at a time

First expose only the read-only catalog lookup using the tool-definition pattern in your installed starter and current SDK documentation. The portable part is the function contract: validated strings enter, structured results leave. The framework-specific decorator, context type, and registration method must match the installed version. This chapter avoids inventing a decorator whose import may have changed by the time you use it.

Test a successful lookup, an empty result, and a failed lookup as distinct cases. An empty result means the service worked and found no matching workshop. A failed lookup means the answer is unknown. If both produce an empty list, the conversational system may confidently report “there are no workshops” during an outage. Return explicit status fields and explain their meaning in the tool description.

Then expose preparation of a registration request. Keep confirmation attached to the exact selected workshop. If the person confirms Saturday and then changes to Friday, the old confirmation does not authorize a Friday request. Store the selection and confirmation as related values, or make the confirmation reference a stable selection identifier. This avoids a class of bugs that a better voice model cannot fix.

Give the tool a short deadline. If the catalog takes too long, say that verification is delayed and offer an alternative. Repeating “one moment” indefinitely is not a fallback. For a useful experiment, make the offline function sleep for several seconds and observe whether your conversation policy remains understandable while waiting. Remove the artificial delay after the test.

## Follow one full conversation through the system

Use a written trace before listening to audio:

| Step | Observed input | Application decision | Evidence to keep |
| --- | --- | --- | --- |
| 1 | “Python on Friday” | Query Friday catalog | Arguments and result status |
| 2 | No available Friday seats | Explain lack of match | Exact spoken wording |
| 3 | “What about Saturday?” | Replace day preference | New state snapshot |
| 4 | Saturday match | Explain one option | Workshop identifier |
| 5 | “Yes, prepare that” | Prepare draft request | Confirmation and request identifier |
| 6 | Draft created | State that enrollment is pending | Backend status and reply |

This is a test design, not a transcript of a live run. It specifies what evidence would establish success. A recording alone makes it hard to know whether the agent used the catalog or guessed correctly. A tool log alone misses whether the person heard an incomplete sentence. You need enough of both to reconstruct the task.

Listen once as the developer and again as the person. The developer notices a valid JSON result. The person notices a long pause, an ambiguous “done,” or a date spoken too quickly. Separate those findings so you do not tune a model parameter to solve an application wording problem.

## Understand interruptions and stale work

Interruption is a coordinated state change. Suppose a Friday catalog request starts, the person says “Saturday,” and the Friday request finishes afterward. The service result is valid for Friday but obsolete for the current intent. Attach a local turn or intent revision to the request and compare it before using the result. This is an application technique that remains useful across voice frameworks.

An illustrative rule is: each meaningful preference change increments `intent_revision`; a result may influence the answer only when its captured revision equals the current revision. Do not confuse this with canceling the underlying HTTP request. Cancellation may save resources, but the result handler still needs a relevance check because cancellation can race with completion.

For speech, distinguish text generated, audio generated, audio sent, and audio heard. Those events occur at different times. If you append an entire planned answer to business history after the person interrupts its first sentence, later turns may assume the person heard information they never received. Investigate how your current session implementation reports interruption and playback before designing history updates.

Begin with ordinary interruptions: a correction, “stop,” and a short acknowledgment such as “right.” These should not all have the same effect. A correction may change state. “Stop” should stop the relevant activity. “Right” might simply acknowledge the answer. Record the behavior you want in the scenario, then evaluate the actual result.

## Develop with current tools, not stale snippets

LiveKit’s documentation now includes coding-agent resources and an agent debugger. The documented debugger can drive turns against a local agent and report replies and tool activity; its default text mode does not exercise the full audio path, while audio mode is intended for audio-related behavior. This makes it useful for separating business-logic failures from acoustic failures. [Coding agent support and tools](https://docs.livekit.io/intro/coding-agents/)

Use a layered development loop. First run the pure catalog example. Next run a text interaction with the agent and inspect tool calls. Then run audio in a quiet room. Finally add realistic background noise and a less predictable speaking pace. Passing the first layer does not imply passing the next; each layer adds a different source of uncertainty.

After changing code, ensure the running process actually reloaded it. A surprising number of “prompt changes do nothing” reports are tests against an old process or a different project. Put a non-secret build label in your development logs and record it with each test. Do not announce build identifiers to end users unless they need them for support.

When using Claude Code or Codex, ask the assistant to inspect the generated starter, lockfile, and official API documentation before editing. A plausible import is not evidence. If an assistant proposes replacing the starter wholesale, ask for a smaller change tied to the failing scenario so you preserve a working baseline.

## Deploy deliberately

The documented LiveKit Cloud flow uses `lk agent create` for initial registration and provides status and log commands. The deployment quickstart describes creation of a `livekit.toml` and a build from your project. Verify the selected project and generated configuration before running it. [Agent deployment quickstart](https://docs.livekit.io/deploy/agents/quickstart/)

Treat deployment as a change in operating conditions, not merely a different URL. The cloud process needs the same intended secrets, compatible dependencies, and a reliable route to the catalog service. Localhost inside a remote process refers to that remote process, not your laptop. If the agent can speak but cannot find workshops after deployment, inspect the catalog address and network access before changing its instructions.

Separate development and production projects or environments where your account supports that organization. Use synthetic workshop data until the full path is understood. Decide what happens when no worker is ready, when the catalog is unhealthy, or when the person disconnects. A pending draft should have an explicit lifecycle instead of lingering indefinitely.

Set an operating budget using the billing units of every connected service. Your total may include agent compute, media or session usage, speech recognition, language-model usage, speech generation, and telephony. The exact combination depends on your chosen configuration. Do not multiply call minutes by one advertised rate and assume the result covers the whole system.

## Diagnose failures by symptom

| Symptom | First investigation | Useful experiment |
| --- | --- | --- |
| No sound in either direction | Device permissions and connection | Test starter unchanged with headphones |
| Person is transcribed incorrectly | Audio capture and recognition | Speak the same sentence in quiet conditions |
| Right transcript, wrong workshop | Tool arguments and catalog truth | Replay the text turn with fixed tool results |
| Long silence before an answer | Timing across lookup and generation | Replace lookup with immediate fixture |
| Friday answer after Saturday correction | Stale result handling | Delay the Friday lookup intentionally |
| Duplicate draft requests | Retry and idempotency behavior | Replay the same operation identifier |
| Works locally, fails remotely | Environment and network differences | Check endpoint from deployed environment |

Write down the observation before the theory. “The first audio arrived 2.4 seconds after the final user word” is useful. “The model is slow” is a hypothesis. Split the delay into endpointing, recognition if applicable, tool work, model generation, synthesis, and delivery where your instrumentation permits. Only then choose an optimization.

Avoid optimizing one attractive average. A median can look good while a small but important group waits much longer. Keep a handful of slow traces and inspect their causes. Long workshop names, a cold catalog connection, and a repeated clarification may produce different remedies even when their total delays are similar.

## Evaluate usefulness and choose alternatives

Use a small scenario set with varied intent: direct selection, changed day, full workshop, unavailable catalog, uncertain pronunciation, interruption during a date, and a request outside the catalog. For each scenario, record factual correctness, completion status, unnecessary turns, interruption recovery, and whether the final wording matches the backend state. Your acceptance thresholds are project choices, not vendor guarantees.

LiveKit is attractive when you want code-level control of a conversational application and are comfortable owning application behavior. Compare [Pipecat](/voice/pipecat/) when you want to learn a frame-and-pipeline style of composition. Compare [Vapi](/voice/vapi/) or [Retell](/voice/retell/) when a managed assistant workflow is the more useful starting point. Compare [OpenAI Realtime](/voice/openai-realtime/) when the direct speech-to-speech model/session interface is what you want to study. These are learning routes, not a universal ranking.

Do not add a second framework just because a demo uses it. Each extra abstraction introduces configuration, observability, and failure boundaries. Start with the smallest architecture that exposes the controls your application actually needs, and add layers only for a concrete requirement.

## Optional application project

Build Workshop Guide with the two-workshop catalog, one read-only lookup, and one draft-only registration tool. Keep a versioned test sheet with at least eight scenarios. A reviewable result includes the repository, dependency lockfile, a short architecture note, redacted traces, and two recordings made with the intended client device.

Acceptance means the guide states only catalog-backed times, never calls an unavailable workshop available, asks for confirmation of the selected workshop, avoids duplicate drafts during a retry, recovers from a changed day, and provides an understandable response during a catalog failure. Also verify that ending the session stops microphone capture. A successful demonstration does not establish production readiness, but it does establish a coherent first application.

Use this prompt with a coding assistant after generating the starter:

```text
Inspect this LiveKit starter and its installed versions before editing.
Build Workshop Guide using the existing architecture. Add a read-only
catalog lookup and a draft-only registration request function. Use
synthetic workshops, validate tool arguments, require confirmation
of the exact workshop, and prevent duplicate draft creation on retries.
Consult current official LiveKit docs for every SDK-specific interface.
Keep credentials outside source control. Deliver a small diff, a diagram
of the conversation/data boundaries, and tests for changed preferences,
empty results, lookup failure, and retries. Report which checks exercised
only text and which exercised actual audio. Do not deploy automatically.
```

## A final design review before widening access

Walk through the project with a colleague who has not seen the implementation. Give them a workshop question and ask them to follow the evidence from microphone input to the final draft status. They should be able to identify which component supplied the workshop time, which operation created the draft, and why the assistant used the word “request.” If the explanation depends on “the model probably understood,” make the relevant state or tool result explicit.

Then restart the application between two steps of the task. For a learning prototype, losing the conversation may be acceptable if the UI explains it. Losing an already created registration request while telling the person to start again is a different problem. Decide which records require persistence, and test that decision independently of the conversational framework.

Finally, compare a short typed interaction with the same spoken interaction. If both choose the wrong workshop, focus on task logic. If only speech fails, inspect recognition and turn handling. If both are correct but only audio feels confusing, revise spoken phrasing and playback behavior. This three-way comparison turns a vague impression into a practical diagnosis and gives you a clear next change.

## Sources and verification boundary

Research checked on **November 13, 2026**. Product setup facts come from [Voice AI quickstart](https://docs.livekit.io/agents/start/voice-ai/); the browser prototype option from [Agent Builder](https://docs.livekit.io/agents/start/builder/); development tooling from [Coding agent support and tools](https://docs.livekit.io/intro/coding-agents/); deployment commands from [Agent deployment quickstart](https://docs.livekit.io/deploy/agents/quickstart/). The workshop scenario, business functions, troubleshooting experiments, and acceptance criteria are original instructional examples.

The authoring process reviewed documentation but did not authenticate to LiveKit, run a microphone session, or deploy an agent. Recheck current dependency requirements, provider availability, account limits, and billing before a live implementation. The offline example is intentionally independent of the SDK; successful offline execution would verify its business logic only.
