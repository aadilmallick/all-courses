---
title: Pipecat
description: Learn streaming voice systems through pipelines, frames, context, and interruption-aware processing.
sidebar:
  order: 2
---

## What Pipecat helps you build

Pipecat is a framework for composing realtime conversational applications. Its documentation teaches transports, frame processing, context, speech services, function calling, and conversation flows. The current quickstart scaffolds a Python application that you can speak to in a browser, with a separate path to Pipecat Cloud deployment. The docs also expose a Pipecat 1.0 migration section; older examples should therefore be checked against the installed package instead of mixed into a new project. [Pipecat quickstart](https://docs.pipecat.ai/pipecat/get-started/quickstart), [Pipeline and frame processing](https://docs.pipecat.ai/pipecat/learn/pipeline)

Learn Pipecat when you want to understand the plumbing of a voice application as a sequence of cooperating processors. This chapter uses **Release Coach**, a synthetic assistant that helps a developer prepare a release checklist. It listens, consults a small checklist, and explains the next incomplete step. It does not deploy software. This keeps the learning problem realistic without making voice recognition an authority to change a production system.

Expect an intermediate programming lesson. You should know basic Python functions, lists, and asynchronous execution. You need a microphone and provider accounts for a live run. You can study the pipeline and execute the offline examples without those accounts. No Pipecat cloud service or paid provider was used in authoring this guide.

## Why a pipeline is useful

Start with a naive implementation: record a whole utterance, send the file for transcription, ask a model for a complete answer, synthesize one audio file, and play it. This is easy to describe, but every stage waits for the previous stage to finish. The person experiences the sum of all delays. When they interrupt, the program may already have queued a long answer that no longer matches their question.

A streaming design overlaps work. Audio arrives in small pieces. Speech recognition can produce useful text before the person finishes. The model can start generating before its full answer is known. Speech synthesis can begin with a sentence rather than waiting for a paragraph. Overlap improves responsiveness, but it means your program must handle partial information, control signals, and cancellation as well as ordinary text.

For Release Coach, imagine the person says: “The tests passed, but the staging smoke check failed.” An incautious system may react to “tests passed” before receiving the rest. A useful pipeline distinguishes provisional observations from a committed conversational turn. The lesson is general: earlier information can reduce latency, but it should not automatically authorize an irreversible action.

The purpose of the framework is not to remove these decisions. It gives you places to express and observe them. Your application still defines what “release ready” means, which evidence counts, and what happens when a tool is unavailable.

## Prerequisites in dependency order

First understand a **frame** as a unit of work moving through the conversation machinery. A frame might represent some media, text, or a control event. It is not necessarily a complete user request. If you assume every item is a full sentence, you will mishandle partial data and lifecycle signals.

Next understand a **processor** as something that receives work, may transform it, and may forward resulting work. A processor can also produce side effects such as logging metrics. A processor that accidentally drops a control signal can break the application even when it handles text correctly. “I only changed logging” is therefore not enough evidence that behavior stayed the same.

A **pipeline** connects processors in an intentional order. Order affects meaning. Logging the text before redaction captures different information from logging after redaction. Applying a business rule before a tool result exists differs from applying it after the result has been validated. Draw the sequence before writing custom processors.

Finally, distinguish **conversation context** from your **application state**. Context helps the model interpret the interaction. Application state says which release checks are complete according to your own system. A model saying “the smoke check passed” does not update your release database unless you explicitly implement that operation.

Read the [foundations](/foundations/) if HTTP requests, credentials, or asynchronous functions are new. You do not need to learn every audio codec to begin. You do need to preserve the input and output formats expected by whichever transport and providers you choose.

## Build a small architecture on paper

For Release Coach, use this conceptual sequence:

```text
microphone -> transport input -> speech recognition -> user context
           -> language model -> speech synthesis -> transport output

application tools: read checklist, record a draft note
application state: release identifier, verified checks, pending question
observability: timestamps and redacted events at selected boundaries
```

This diagram is a teaching model, not a copy-and-paste Pipecat constructor. Some model integrations use a different internal route, and the installed starter is the authority for the actual processor list. The diagram's value is the set of questions it makes visible: where does text become trusted, where can a reply be interrupted, and where do external facts enter?

Keep the checklist outside the persona prompt. Store a release identifier such as `demo-42`, a fixed set of required checks, and evidence references. A prompt describes the assistant's role. A checklist record describes a particular release. When those are mixed, a prompt edit can unintentionally change the definition of completion.

Choose one read-only task for the first live prototype: “What is the next incomplete check?” The answer can be verified independently. Do not start with “manage all my releases” because that request hides dozens of policy and integration decisions behind one impressive phrase.

## Scaffold from the current quickstart

The documented quickstart currently uses Python 3.11 or later and `uv`, with a CLI scaffolding path. The generated example uses separate speech recognition, language-model, and speech-generation services. Follow its current provider setup rather than assuming a key for one vendor pays for the whole chain. [Pipecat quickstart](https://docs.pipecat.ai/pipecat/get-started/quickstart)

```powershell
uv tool install "pipecat-ai[cli]"
pipecat init quickstart
cd pipecat-quickstart
Copy-Item .env.example .env
uv sync
uv run bot.py
```

On Windows, `Copy-Item` is the PowerShell equivalent of the file-copy step in the quickstart. Open `.env` in an editor and provide your own credentials. Never paste them into a prompt or commit them. Check that the file is ignored by version control. A missing credential and an invalid credential are different failures; preserve the exact non-secret error category when investigating.

The quickstart documents a local browser client. Use the URL printed by your process instead of assuming a port if another application already occupies it. Begin with headphones to reduce acoustic feedback. Confirm one spoken exchange before customizing the pipeline. Save the generated dependency lockfile as part of your baseline.

Read `bot.py` from top to bottom. Identify transport creation, model services, context setup, the processor sequence, and the startup handler. You do not need to memorize every import. You should be able to explain where a user turn enters the reasoning path and where an answer reaches the client. If you cannot locate those boundaries, adding a custom processor will be guesswork.

## A runnable offline pipeline experiment

Before changing framework internals, learn a simpler pipeline with ordinary Python. Save this as `pipeline_demo.py` and run `python pipeline_demo.py`. It uses no network, microphone, or Pipecat installation. The classes are original teaching objects, not Pipecat APIs.

```python
from dataclasses import dataclass
from typing import Iterable

@dataclass(frozen=True)
class Event:
    kind: str
    value: str = ""

def normalize(events: Iterable[Event]):
    for event in events:
        if event.kind == "text":
            yield Event("text", " ".join(event.value.split()))
        else:
            yield event

def redact(events: Iterable[Event]):
    for event in events:
        if event.kind == "text":
            yield Event("text", event.value.replace("demo-secret", "[redacted]"))
        else:
            yield event

def route(events: Iterable[Event]):
    for event in events:
        if event.kind == "text":
            yield Event("reply", f"Checklist note received: {event.value}")
        else:
            yield event

events = [Event("start"), Event("text", "  smoke   check demo-secret  "),
          Event("interrupt"), Event("end")]
for item in route(redact(normalize(events))):
    print(item.kind, repr(item.value))
```

Expected output includes `start`, one reply with normalized spaces and `[redacted]`, then `interrupt` and `end`. `frozen=True` makes the teaching event immutable, so processors create a new event instead of silently altering a shared object. The non-text branch preserves lifecycle signals. Removing that branch from `redact` would make the program appear to work for text while losing the interrupt and end events.

Now move `redact` after `route`. The resulting reply event is no longer of kind `text`, so this deliberately simple redactor does not change it. The experiment demonstrates why processor placement and event types matter. It does not demonstrate actual Pipecat interruption handling. Carry the reasoning into the framework, then use its documented frame types and forwarding rules.

The program also shows a limitation: string replacement is not a production secret detector. It is a controlled fixture that makes ordering visible. A real redaction system needs explicit data classification and tests for the types of information your app actually handles.

## Add application truth through a tool

For the first real customization, create a pure function that returns the next incomplete check:

```python
CHECKLIST = [
    {"name": "unit_tests", "complete": True, "evidence": "ci/demo-42/tests"},
    {"name": "staging_smoke", "complete": False, "evidence": None},
    {"name": "release_notes", "complete": False, "evidence": None},
]

def next_check(release_id: str) -> dict:
    if release_id != "demo-42":
        return {"status": "not_found", "release_id": release_id}
    pending = next((item for item in CHECKLIST if not item["complete"]), None)
    return {"status": "ok", "release_id": release_id, "next": pending}

print(next_check("demo-42"))
```

This can run as a second offline file. Its result names `staging_smoke`. Returning `next: None` would mean every known check is complete; `not_found` means the release is unknown. Preserve that difference when you register the function through the current Pipecat tool mechanism.

A useful spoken response is “The next incomplete check is the staging smoke test. I do not have a passing result for it yet.” A harmful response is “You can release now” merely because one earlier check passed. The application should return evidence and status in structured fields, while the agent translates that result into concise spoken language.

When the person says a check passed, decide whether you are collecting an unverified note or recording verified evidence. For this beginner project, collect a draft note. Do not let an unverified conversational statement mark a release ready. This is an engineering design choice for the example, not a special requirement of Pipecat.

## Shape context deliberately

Context is useful because “that one” and “what comes next?” depend on earlier turns. It is dangerous when old assumptions survive after the person changes the release identifier. Keep the selected release explicit. If the conversation switches from `demo-42` to `demo-43`, invalidate facts retrieved for the old release rather than letting them blend into one plausible answer.

Separate a compact task summary from a verbatim transcript. A transcript is evidence of what was said. A summary is a derived aid for future reasoning. If you summarize “staging is probably fine” as “staging passed,” you have changed uncertainty into a fact. Keep provenance and confidence where they matter to the task.

Do not send every internal event to the model. Transport diagnostics, secret-bearing headers, and raw stack traces usually belong in developer logs. The model needs a user-appropriate result such as “checklist service unavailable.” Your support trace can retain a redacted error identifier that lets a developer find the underlying failure.

For a long session, establish a context budget before it becomes a problem. Keep stable instructions short, retain the selected release and unresolved question, and retrieve current facts again when needed. A smaller, accurate context often helps more than a larger history containing contradictory release information.

## Handle partial speech and interruption

Interim recognition is a hypothesis. A person may begin “the smoke test passed” and continue “on my laptop, but not in staging.” If a pipeline reacts to the first phrase as a committed fact, later correction becomes a repair operation. Prefer collecting candidate intent until the relevant turn boundary, especially for state changes.

Interruption creates two obligations. Stop or supersede the current conversational output, and decide what to do with work still running. A read-only lookup may safely finish, but its result may no longer be relevant. A draft-note write may need an idempotency key so a retry cannot duplicate it. Audio cancellation and business cancellation are related but separate concerns.

Test a specific race: delay the checklist lookup, then change the release identifier before it returns. The correct response should use the current release or ask for clarification. If it reads the old result, add an application-level request revision and compare it when handling the response. This pattern works even when the transport and model are behaving perfectly.

Also test acknowledgments. A quiet “mm-hm” should not necessarily erase the assistant's explanation. A clear “stop” should have a predictable effect. Your preferred behavior depends on the setting: a tutorial may tolerate backchannels, while dictation may need every utterance captured. Evaluate the intended user experience rather than optimizing a single interruption count.

## Instrument the pipeline without drowning in logs

Choose observation points that answer questions. At minimum, keep a non-secret session identifier, the selected release, user-turn completion time, tool start and finish, response-start time, and the final business outcome. If a stage emits many small frames, aggregate counts and timing rather than logging every byte.

Use a trace table for one slow response:

| Boundary | Example observation | Interpretation |
| --- | --- | --- |
| Person finishes speaking | 0 ms | Start of the user's perceived wait |
| Turn accepted | 350 ms | Endpointing consumed part of the wait |
| Checklist result returns | 510 ms | Tool added 160 ms after acceptance |
| First response text | 820 ms | Reasoning/generation interval |
| First audible reply | 1080 ms | Remaining synthesis/delivery interval |

These are invented numbers for teaching, not Pipecat benchmarks. Their value is the method. If endpointing dominates, changing the database is unlikely to help. If the tool dominates, changing the voice may make the assistant sound nicer while leaving the pause unchanged.

Avoid logging full credentials or entire private documents to diagnose latency. You usually need sizes, durations, statuses, and correlation identifiers. When you need a transcript, use synthetic cases first and define who can access it. Keep the operational log and the human listening notes linked by a session identifier.

## Use flows when structure earns its cost

A release assistant has natural stages: identify release, inspect checklist, explain missing evidence, draft a note, and finish. You can initially express those stages in ordinary code and instructions. Add a more explicit flow only when it solves a real problem, such as repeated failure to ask a required question or difficulty testing transitions.

The risk of an overly rigid flow is forcing the person through questions they already answered. The risk of an entirely open prompt is losing required information. A useful compromise keeps the required data explicit while allowing the conversation to collect it in different orders. The application can know that release identifier is required without insisting it must be the first sentence of every conversation.

Draw transition conditions in plain language. “When the release identifier has been validated, inspect the checklist” is testable. “When the user seems ready, continue” is vague. If you cannot write a deterministic test for a transition, define the uncertainty and a clarification path instead of pretending the state is certain.

When comparing framework flow features, consult the installed Pipecat version's current docs. The documentation includes dedicated flow and migration sections. Do not assume an older `FlowManager` example or a remembered import is compatible merely because the overall concept remains familiar.

## Prepare for a remote process

Local success establishes only a small part of deployment behavior. A remote process needs reachable endpoints, configured secrets, compatible packages, and enough capacity to accept sessions. The quickstart includes a Pipecat Cloud route; hosting your own process is a separate operational choice. Read the relevant deployment guide for the approach you actually choose. [Pipecat quickstart](https://docs.pipecat.ai/pipecat/get-started/quickstart)

Make startup and readiness observable. A process can be running while a required provider is unavailable. Distinguish “the program started” from “the agent can accept and complete a conversation.” Keep a minimal health check that does not consume an entire paid audio session every time a load balancer probes it.

Pin dependencies and record the working provider configuration. When upgrading, replay a small suite before changing more than one layer. If you update the transport, model service, and application prompt together, a regression becomes difficult to localize. Small changes preserve useful evidence.

Think through disconnection. If the browser closes while a draft note is pending, should the note still be created? For this project, a safe policy is to finish only a request the person explicitly confirmed and then make its status available through another interface. The exact policy is yours; leaving it accidental is the problem.

## Troubleshooting by boundary

| Failure | Likely boundary | First controlled test |
| --- | --- | --- |
| Browser connects but no transcript appears | Input transport or recognition | Run unchanged starter with same device |
| Transcript appears but no response | Context/model processing | Feed a fixed text turn into the reasoning path |
| Text response exists but no speech | Synthesis or output transport | Use a fixed short response |
| Interruptions stop working after customization | Control-frame handling | Remove custom processor and compare |
| Release facts blend across sessions | Application state isolation | Run two synthetic sessions with different IDs |
| Latency worsens with long conversations | Context growth or accumulating work | Compare first and twentieth turns |
| Package import fails after copying a tutorial | Version mismatch | Compare lockfile with current docs |

Do not “fix” a dropped control frame by adding another instruction to the model. Do not “fix” wrong checklist data by increasing speech quality. State which boundary you are testing and change one variable. When a fix works, preserve the failing case as a regression scenario.

## Compare learning routes

Pipecat rewards a developer who wants to reason about the sequence of media and reasoning processors. [LiveKit Agents](/voice/livekit/) offers another code-centered route with its own conversation and room abstractions. [Deepgram Voice Agent](/voice/deepgram/) is useful to study when you want a managed speech pipeline over one connection. [Vapi](/voice/vapi/) and [Retell](/voice/retell/) provide managed assistant workflows that may get a business conversation in front of users sooner.

The right choice depends on which decisions you need to own. More control means more responsibility for lifecycle, deployment, and debugging. Less infrastructure work may come with a different configuration model and service boundary. Compare the full application, including observability and operations, rather than only the number of lines in a hello-world example.

For cost, list each metered component: hosting, transport, recognition, model input/output, speech generation, and any telephony route. Use your own measured session lengths and failure/retry rates. A cheap successful minute and an expensive failed minute are not directly comparable; calculate cost per useful completed task as well as cost per connected minute.

## Optional project and acceptance

Build Release Coach around the synthetic checklist. Keep the first version read-only except for draft notes. Include direct queries, changed release identifiers, unknown releases, interrupted replies, delayed lookups, and provider failures in your test set. Capture one quiet-room recording and one controlled noisy recording made with synthetic speech content.

A reviewable result explains the pipeline order, preserves lifecycle events through custom processors, isolates state between sessions, distinguishes unknown release from complete checklist, and never claims a release was deployed. It should report the exact tested versions and whether the test covered real audio, text-only behavior, or pure business functions.

Use this coding-assistant prompt:

```text
Read this Pipecat starter, lockfile, and current official docs before
changing APIs. Build Release Coach with a synthetic release checklist.
First explain the existing processor order and identify control-event
forwarding requirements. Add a read-only next-check tool and draft-note
collection. Keep verified evidence separate from spoken assertions.
Add regression cases for changed release IDs, delayed old results,
interruptions, and unknown releases. Preserve the starter's working
transport. Provide a small diff and report which checks used actual
audio. Do not deploy or connect production release systems.
```

## A processor-change review you can actually perform

Before accepting a custom processor, describe its input types, output types, side effects, and behavior for events it does not recognize. A text-redaction processor may look trivial, but it sits in a live stream. Ask whether it forwards lifecycle signals, whether it blocks while doing expensive work, and whether it changes ordering. Write one small case for each property that matters to the application instead of merely asserting that a sample sentence was redacted.

Consider a metrics processor that writes synchronously to a remote database for every tiny audio frame. The text answer may remain correct while latency and memory usage worsen. A better design may batch metrics or put a bounded queue between the media path and the reporting service. The queue still needs a policy when full. Dropping nonessential metrics may be acceptable; silently accumulating unbounded work is usually a poor default.

Now consider failure inside a processor. If logging fails, should the conversation end? If required redaction fails before data leaves a trusted boundary, continuing may be inappropriate for your application. These are different failure policies. Name them rather than wrapping the entire pipeline in one broad exception handler that hides every error and continues.

Keep a tiny replay fixture containing start, text, interruption, and termination events. It is not a substitute for live media testing, but it catches accidental event loss quickly. Add a second fixture for two sessions so shared mutable state becomes visible. When an upgrade changes event types or processor lifecycle, update the adapter and fixtures together using the current framework reference.

The goal is confidence in one bounded change. A processor that passes a meaningful forwarding and lifecycle check is easier to integrate than a large rewrite that happens to sound fine once. Preserve the smallest useful implementation and let observed failures justify additional complexity.

When handing the project to someone else, include the processor diagram and the smallest replay fixture next to the setup instructions. These explain the intended behavior more durably than a screenshot of one successful conversation. The next developer can then distinguish a deliberate policy from an accidental consequence of processor order.

## Sources and verification boundary

Checked **November 13, 2026**: [Pipecat quickstart](https://docs.pipecat.ai/pipecat/get-started/quickstart) for prerequisites, scaffolding, local run, and cloud entry point; [Pipeline and frame processing](https://docs.pipecat.ai/pipecat/learn/pipeline) for the framework's central composition model. The documentation navigation also identified the current migration and flow learning paths. The Release Coach design, offline Python pipeline, timing example, and acceptance scenarios are original instructional material.

No paid provider, microphone conversation, or cloud deployment was exercised while authoring. The offline examples deliberately use ordinary Python so their behavior can be examined without an account. Check the current starter and reference pages before adding version-sensitive Pipecat imports or provider options.
