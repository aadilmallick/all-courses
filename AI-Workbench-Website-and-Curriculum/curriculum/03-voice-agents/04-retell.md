# Retell AI


## Learn Retell through a bounded task

Retell AI is a platform for building and operating voice and chat agents. Its current documentation includes a phone-agent quickstart, single-prompt and conversation-flow approaches, custom functions, web calling, a website widget, testing, and call history. The documentation now also describes Conductor, an assistant for working with agents and conversations inside Retell. Treat these as distinct capabilities rather than assuming that every account exposes the same controls. [Retell documentation index](https://docs.retellai.com/llms.txt), [First phone agent](https://docs.retellai.com/get-started/quick-start)

The original project in this chapter is **Demo Concierge**, a voice assistant that helps a person request a product demonstration. It explains a small catalog of demo topics, collects a preferred time window, and prepares a request. It does not claim a calendar booking exists until the booking system confirms one. That distinction will guide every design choice.

You can complete the design and offline simulation without an account. A live implementation requires a Retell account and whatever calling or website access your chosen route needs. Begin with a dashboard or browser test before adding a telephone number. Allow three to five hours for a first version, with additional listening time. No phone calls, agent changes, or account setup were performed while writing this guide.

## The underlying problem: flexible speech and required facts

A form can require a date before submission. A conversation cannot assume the person supplies information in order. Someone may begin, “Thursday afternoon would work, but I need to see the integration features first.” That single sentence contains a time preference and a topic. A rigid interview may ask for both again. An unconstrained agent may chat pleasantly and never produce a usable request.

Your task is to preserve the flexibility of conversation while making required information explicit. For Demo Concierge, the required facts are a demo topic, a time window with a timezone, and consent to prepare a request. Contact details may be collected through the surrounding authenticated application rather than dictated aloud. Decide that architecture before teaching the agent to ask for an email address.

The most consequential ambiguity is the word “booked.” A person may think a preferred time has been reserved when the system has only written a note. Model the backend states first: preference collected, request prepared, slot held, booking confirmed, failed, or unknown. Only use states your actual application supports. The voice should translate those states faithfully.

This is why a tool lesson must teach more than dashboard buttons. The platform can route a conversation and invoke a function, but it cannot decide your organization's booking policy from a vague persona prompt. A compact, explicit business contract is the foundation of a reliable agent.

## Prerequisites without unnecessary detours

You need to understand an **agent configuration**, a **conversation**, a **function**, and a **state transition**. The configuration describes how an agent should behave. A conversation is one interaction. A function is an external operation the agent can request. A state transition changes what the application knows or is permitted to do.

For example, “I prefer Thursday” changes a preference. “Yes, send that request” can authorize preparation of a specific request when the previous question was clear. Neither statement proves that a calendar slot is available. Availability must come from the scheduling system. Keep conversational assertions and verified backend results separate.

Learn **idempotency** before adding a write function. If a request times out and is retried, the same logical action should not create multiple bookings or support records. An idempotency key identifies that logical action. A new HTTP request does not necessarily mean a new business operation.

Also learn the difference between a public integration identifier and a private management credential. An agent ID selects an agent; it should not be treated as proof of user identity. A private API key belongs in a trusted server environment. If the website route uses a documented public-key mechanism, configure the available restrictions and abuse controls for that route instead of exposing a management secret.

Read the [foundations](../reference/foundations.md) if these concepts are unfamiliar. The offline program later in this chapter makes state and confirmation concrete before any live service is connected.

## Choose a single prompt or a conversation flow

Retell's current guidance distinguishes single-prompt agents from conversation-flow agents and recommends beginning with a single prompt for many new use cases. The key learning tradeoff is flexibility versus explicit structure. A flow can make required stages visible, while a prompt can be simpler to iterate for an exploratory conversation. [Single prompt versus conversation flow](https://docs.retellai.com/build/choose-agent-type)

For Demo Concierge, begin with a single prompt and explicit application fields. Do not add a flow just to make the diagram look sophisticated. Add structure when you can name the failure it solves: skipping timezone, failing to confirm the selected topic, or moving to completion before the request service replies.

A useful design table is:

| Situation | Conversation behavior | Application rule |
| --- | --- | --- |
| Topic is missing | Ask which area they want to see | No request yet |
| Timezone is missing | Ask one timezone question | Do not interpret local time silently |
| Person revises the day | Acknowledge revised preference | Invalidate confirmation of old request |
| All fields are present | Read a short summary | Wait for review |
| Request service succeeds | Explain returned status | Store returned identifier |
| Request service fails | Explain lack of confirmation | Preserve draft for review if supported |

This table is an original design artifact, not a Retell flow export. It is intentionally portable. You can use it to review either a prompt or a flow and ask whether each transition has a clear condition.

## Create the first agent carefully

Follow the current Retell quickstart to create an account, select or create an agent, configure it, and test it in the dashboard before connecting a number. Exact labels and templates may change. Keep the first configuration small: one language, one voice, one topic catalog, and no write tools. [First phone agent](https://docs.retellai.com/get-started/quick-start)

Use this original first message:

```text
Hi, I'm Demo Concierge, an AI assistant. I can help you choose a demo
topic and prepare a request for the team. What would you like to see?
```

Use this original behavior prompt:

```text
Help a person request a demonstration of the fictional DevHarbor product.
Available topics are code review, release automation, and integrations.
Explain one relevant topic briefly, then collect a preferred time window
and timezone. Ask one missing question at a time. If the person changes
their preference, use the revised preference and review the new summary.
Before preparing a request, summarize the topic and time window and
ask whether that request is correct. A prepared request is not a booking.
Use tool results for request status. If no booking is confirmed, say so.
Provide a human contact route when the request cannot be completed.
```

Notice the catalog is deliberately tiny and fictional. You can hear whether the assistant stays within it. Replace the topic list with a lookup only when you need changing or larger data. Do not add all your product documentation at once and then struggle to determine which source caused an incorrect answer.

Save a baseline version or configuration snapshot before experimenting. Record the date, selected model, voice, prompt revision, and tool set. When you compare runs, these details matter more than a vague description such as “the new assistant.”

## Work through the happy path

Write a target conversation using plain language:

> Person: I want to understand release automation.  
> Concierge: I can help arrange a demo of release automation. What time window works for you?  
> Person: Thursday afternoon.  
> Concierge: Which timezone should I use?  
> Person: Eastern time.  
> Concierge: I have release automation, Thursday afternoon in Eastern time. Should I prepare that request?  
> Person: Yes.  
> Concierge: The request is prepared for the team to review. A meeting is not confirmed yet.

This is a designed example, not a transcript from Retell. Its value is the state sequence. The assistant does not interpret “Thursday” as a precise timestamp without context, and it does not present a preference as an available slot. In a real application, resolve relative dates against the user's intended date and timezone and repeat the resulting calendar date when it matters.

Test the same facts in a different order: “I'm in Eastern time and free Thursday afternoon; can someone show me release automation?” A useful agent should not ask all three questions again. Required fields do not imply required question order. This is one of the clearest ways to evaluate whether a flow is serving the person or forcing them through a script.

Then test a correction immediately before confirmation. If the person says “Actually, integrations,” the confirmation must apply to integrations. A generic boolean `confirmed = true` detached from the selected data is too weak. Tie confirmation to a version of the request or the exact reviewed fields.

## Learn state transitions with an offline simulator

Save this complete Python program as `concierge_demo.py` and run it with Python 3.10 or later. It uses no Retell package and no network. The event names are original teaching constructs, not Retell events.

```python
from dataclasses import dataclass, field
import json

@dataclass
class Concierge:
    fields: dict = field(default_factory=dict)
    revision: int = 0
    reviewed_revision: int | None = None
    drafts: dict = field(default_factory=dict)

    def set_preference(self, name: str, value: str) -> None:
        if name not in {"topic", "window", "timezone"}:
            raise ValueError("Unknown preference")
        if not isinstance(value, str) or not value.strip():
            raise ValueError("Preference must be nonempty text")
        self.fields[name] = value.strip()
        self.revision += 1
        self.reviewed_revision = None

    def review(self) -> dict:
        missing = [key for key in ("topic", "window", "timezone")
                   if key not in self.fields]
        if missing:
            return {"status": "missing", "fields": missing}
        self.reviewed_revision = self.revision
        return {"status": "review", "revision": self.revision,
                "request": dict(self.fields)}

    def prepare(self, approved_revision: int, operation_id: str) -> dict:
        if operation_id in self.drafts:
            return self.drafts[operation_id]
        if (self.reviewed_revision is None or
                approved_revision != self.reviewed_revision or
                approved_revision != self.revision):
            return {"status": "review_required"}
        result = {"status": "draft", "request_id": f"draft-{len(self.drafts)+1}",
                  "request": dict(self.fields), "booking_confirmed": False}
        self.drafts[operation_id] = result
        return result

agent = Concierge()
agent.set_preference("topic", "release automation")
agent.set_preference("window", "Thursday afternoon")
agent.set_preference("timezone", "America/New_York")
review = agent.review()
print(json.dumps(review))
agent.set_preference("topic", "integrations")
print(json.dumps(agent.prepare(review["revision"], "operation-1")))
new_review = agent.review()
first = agent.prepare(new_review["revision"], "operation-2")
second = agent.prepare(new_review["revision"], "operation-2")
assert first == second
assert len(agent.drafts) == 1
print(json.dumps(first))
print("Repeated operation returned the same draft.")
```

The first review captures a revision. Changing the topic increments the revision and invalidates review. Attempting to prepare with the old revision returns `review_required`. A new review permits one draft. Repeating the same operation identifier returns the same result. These are the properties to preserve when attaching a model and a voice service.

The in-memory dictionary is an educational convenience. A real service must persist its idempotency records and enforce uniqueness across processes. Do not call this a production booking service. It demonstrates the state rules that your actual backend should implement and test.

## Attach a custom function

Retell documents custom functions for calling your own API during a conversation, with configurable URL, method, headers, parameters, and response handling. Use the current guide for the exact request shape and authentication options. [Custom functions](https://docs.retellai.com/build/single-multi-prompt/custom-function)

Expose `prepare_demo_request` only after the offline state rules are clear. Keep the function's description narrow: it prepares a reviewed request and returns the actual request status. Do not describe it as “book a demo” if it does not reserve a slot. Tool names influence the model's choice and the human maintainer's understanding.

Validate the topic against the supported catalog, reject oversized strings, and require the server's own identity context rather than trusting a caller-supplied customer identifier. If the surrounding app is authenticated, derive the customer from that session. A person speaking someone else's email address is not evidence that they control the account.

Return a small result containing status, request identifier, and any follow-up action that really exists. An internal stack trace does not belong in the spoken response. Give the developer a correlation identifier for investigation. Keep “service unavailable,” “invalid request,” and “duplicate resolved” distinguishable in logs and tests.

## Decide whether to use the website widget

Retell's current website widget supports chat and voice configurations as well as a callback mode. The documented integration uses public-key fields and agent identifiers; a callback initiates a phone interaction rather than simply opening a browser conversation. Use the route that matches the experience you intend, and verify the relevant account settings. [Website widget](https://docs.retellai.com/deploy/chat-widget)

For learning, prefer a browser conversation with an obvious start and end state. A callback adds telephone routing, number ownership, and a second device to your test matrix. Those may be necessary later, but they make it harder to isolate an early prompt or tool problem.

If you embed a widget, pin the intended agent version where the integration supports it. Otherwise, a dashboard edit may change the behavior of an already published page. Check the surrounding page for microphone explanation, keyboard access, mobile placement, and a visible route to human help. A floating button that covers the submit button on a small screen can make an otherwise capable assistant unusable.

Do not copy an example script with a private key substituted into a public-key field. Public integration credentials and private management credentials have different roles. Configure abuse controls appropriate to the public route. Test with synthetic data before making the widget accessible to a broad audience.

## Use testing layers to find the right problem

Begin with the state simulator, then test text behavior, then audio, then the intended delivery channel. Each layer adds uncertainty. A text simulation can reveal that the agent skips timezone. It cannot establish microphone quality, interruption behavior, or the experience of hearing a date spoken aloud.

Design a small scenario matrix:

| Scenario | Required behavior | Evidence |
| --- | --- | --- |
| All details in one sentence | Reuse supplied facts | No repeated collection questions |
| Missing timezone | Ask one clarification | Explicit timezone before review |
| Topic changes after review | Review revised request | New request revision |
| Tool returns draft | Describe draft accurately | No confirmed-booking claim |
| Tool times out | Explain uncertainty | No silent second write |
| Person asks for human | Offer the real handoff route | Correct route and status |
| Person interrupts a summary | Pause and use correction | Current fields match correction |

Retell's documentation includes testing and conversation-history paths, and Conductor-related pages describe help with investigation and refinement. These can support iteration, but they do not remove the need for your own task-specific acceptance criteria. [Retell documentation index](https://docs.retellai.com/llms.txt)

Review a failed call by separating recognition, reasoning, tool selection, tool execution, and final wording. If the transcript says the correct timezone but the request contains another, the microphone is probably not the first thing to tune. If the tool result says draft but the voice says booked, investigate instructions and result interpretation.

## Make spoken scheduling understandable

Relative dates are convenient and risky. “Next Friday” can mean different things depending on the day and the speaker. Ask for clarification or repeat the resolved calendar date when a meeting request depends on it. Store a timezone identifier where your scheduling system supports one, not merely a human abbreviation that may be ambiguous.

Read times in a natural form and include timezone when it affects the request. Do not recite raw ISO timestamps. Keep the structured timestamp for the application and the spoken rendering for the person. Test daylight-saving transitions separately if the product schedules across them; a one-hour offset error can survive a very fluent conversation.

Avoid collecting a long email address by voice if an authenticated page already knows it. If voice collection is necessary, provide a review route that lets the person verify it. Spelling corrections are a distinct interaction pattern and deserve a test. Do not mark an address valid merely because it contains an at-sign.

Make uncertainty short and concrete. “I can prepare that preference, but I cannot confirm availability yet” is clearer than a long legal-sounding disclaimer. The goal is accurate task status, not frightening the person away from the interface.

## Operate the agent as a versioned application

A useful release record includes the agent configuration version, prompt revision, function schema, backend build, and scenario results. When one changes, replay the cases it might affect. You do not need to rerun every possible conversation after a punctuation correction, but changing a tool contract or conversation flow justifies targeted regression checks.

Keep a known-good configuration and a rollback route. A new prompt that handles one awkward example can accidentally make ordinary cases worse. Compare several representative cases, especially changed preferences and tool failures. Avoid optimizing solely for a polished demonstration recorded under ideal conditions.

Track outcomes that match the job: valid requests, incorrect booking claims, duplicate requests, abandonment before review, and successful handoffs. Call duration is informative but ambiguous. Shorter calls may mean efficient completion or immediate frustration. Listen to a sample and inspect backend outcomes before interpreting a chart.

Estimate total cost from the services actually used: voice-agent usage, selected model or voice options, calling routes, phone numbers where applicable, and your own backend. Current rates and included limits are account-sensitive and change over time. Use current billing pages and measured conversations; this curriculum intentionally avoids promising a stable price.

## Troubleshoot without overfitting the prompt

| Symptom | First investigation | Better next step |
| --- | --- | --- |
| Required timezone is skipped | Collection/transition rule | Make missing-field condition explicit |
| “Booked” after draft result | Tool name and result wording | Align action vocabulary with backend state |
| Repeats details already given | Context and flow assumptions | Test out-of-order information |
| Old topic survives a correction | Application state and review revision | Invalidate old confirmation |
| Function works manually but fails in call | Envelope, auth, timeout | Compare redacted request/response |
| Browser works, phone sounds poor | Delivery channel and audio path | Test same script over both channels |
| Two requests from one approval | Retry behavior | Persist idempotency keys |

One failure does not justify twenty new prohibitions in the prompt. Identify the missing rule or incorrect boundary. “Always ask timezone when absent” is useful. “Do not be wrong, do not forget, do not confuse dates” adds length without defining an operation the system can reliably perform.

When asking a coding assistant for help, provide the failing scenario, expected state transition, actual tool arguments, and redacted result. Do not provide production customer recordings unless your working environment and permissions allow that use. A synthetic reproduction is usually easier to reason about and safer to share.

## Alternatives and a sensible learning sequence

Compare [Vapi](03-vapi.md) for another managed orchestration model. Compare [ElevenAgents](05-elevenlabs.md) for its agent and voice ecosystem. Move to [LiveKit](01-livekit.md) or [Pipecat](02-pipecat.md) when you need to understand and own more of the runtime. Study [Twilio ConversationRelay](08-twilio-conversationrelay.md) when your existing phone application should retain the business logic and model interaction.

Choose based on the boundaries you want to manage: conversation design, code deployment, media transport, telephony, tools, and observability. No single platform removes all of them. A side-by-side trial should use the same synthetic task and acceptance criteria so differences reflect the architecture rather than one demo receiving better preparation.

## Optional project and coding-assistant prompt

Deliver Demo Concierge with three topics, one request-preparation function, and a short scenario report. Demonstrate out-of-order facts, a changed topic after review, a failed tool, and a repeated operation. A passing result never claims an unconfirmed booking, asks for missing timezone, and creates one draft for a repeated logical request.

Use this prompt after creating the initial agent:

```text
Review this Retell configuration and current official documentation.
Build Demo Concierge for synthetic product-demo requests. Keep topic,
time window, and timezone explicit. Invalidate approval when reviewed
fields change. Add a custom function that prepares a draft request only;
use validated inputs and durable idempotency in the backend design.
Keep private keys on the server. Compare a single-prompt design with a
flow only if a specific transition needs more structure. Produce the
smallest working change, a state table, and tests for revised details,
missing timezone, timeout uncertainty, and duplicate retries. Report
which tests were text-only. Do not buy numbers or place outbound calls.
```

## A concrete prompt-to-flow migration experiment

If the single-prompt version repeatedly skips request review, do not migrate every sentence into a giant flow. Isolate the failing transition. Keep free conversation for topic explanation, but make the move into request preparation depend on three validated fields and an explicit review state. This preserves flexibility where it helps and structure where the task needs it.

Compare both versions using the same out-of-order sentence, the same changed-topic case, and the same timeout. The flow version should reduce the skipped-review failure without making the assistant ask for information already supplied. If it merely adds more turns, the structure has not yet earned its complexity. Adjust transition conditions and shared state before adding another node.

Write down what happens when the person changes their mind inside a stage. A well-defined flow needs a return path from review to collection and from a failed request to a recoverable draft. “Go back” should mean a specific state transition, not clearing every field indiscriminately. Preserve still-valid information and invalidate only the approval or data that the correction affects.

This experiment also creates a maintainability test. Ask another developer to find the rule that prevents a draft from being called a booking. If it is copied into many prompts and nodes, centralize the business status interpretation in your application or a shared instruction source. A correction should have one clear home, with regression cases proving that every relevant route uses it.

Keep the reviewed request fields visible in your final demonstration so another person can verify the result without trusting the assistant's spoken summary alone.

## Sources and verification boundary

Research checked **November 13, 2026**: [Retell documentation index](https://docs.retellai.com/llms.txt), [First phone agent](https://docs.retellai.com/get-started/quick-start), [Single prompt versus conversation flow](https://docs.retellai.com/build/choose-agent-type), [Custom functions](https://docs.retellai.com/build/single-multi-prompt/custom-function), and [Website widget](https://docs.retellai.com/deploy/chat-widget). The index establishes current navigation and naming; consult the linked feature guide before implementation rather than treating index descriptions as an API reference.

The scheduling scenario, state simulator, test matrix, and engineering recommendations are original examples. No live Retell agent, widget, phone call, or scheduling service was exercised during authoring. Current account eligibility, limits, phone-number requirements, and billing remain implementation-time checks.
