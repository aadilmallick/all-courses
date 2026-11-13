# 7. Cartesia, ElevenLabs, and managed agent platforms

A voice provider can sell several different products under one brand. A synthesis API turns text into audio. A recognition API turns audio into text. A managed agent platform may configure and host an entire conversational workflow. Before integrating Cartesia or ElevenLabs, identify which of those products you need. Otherwise it is easy to mistake a successful TTS demo for a complete agent implementation.

This chapter develops the synthesis adapters already included in both languages, then shows how the responsibilities change when you use a hosted agent. The runnable TTS examples save real provider responses when configured with your credentials. Hosted-agent configuration and React integration are explained as version-sensitive integration work, not represented as live services provisioned by this package.

## Begin with an isolated synthesis request

Run a TTS-only request before the full cascade. It removes recognition and reasoning from the diagnosis. With the appropriate provider key and voice ID configured, choose one command:

```bash
python examples/python/providers.py tts cartesia
node examples/typescript/providers.ts tts elevenlabs
```

The fixed input is a short synthetic sentence about reviewing appointment options. Cartesia writes WAV; ElevenLabs writes MP3. Listen to the file and compare it with the source text. If the file cannot play, check HTTP status, output format, and file bytes before investigating the language model, which did not participate in this test.

This small baseline also gives you a reproducible pronunciation fixture. You can replace the sentence with controlled examples containing times, amounts, abbreviations, or product names. Keep each change narrow enough that a quality difference has an interpretable cause. A paragraph containing every difficult feature at once can be impressive to hear but hard to diagnose.

An HTTP success says that the service accepted and returned a response. It does not say that the voice sounds appropriate for your users. Speech quality needs listening and task evaluation. Automated checks can establish format and duration, but they cannot fully judge conversational comfort, accent fit, or whether a particular pronunciation is acceptable in context.

## Understand the Cartesia adapter

The Cartesia adapter sends a model identifier, transcript, voice ID, and output format. This edition pins the `Cartesia-Version` header to `2026-08-14` and uses the inspected `sonic-3.6` model identifier. A dated version header and a model name are separate choices: one identifies the API contract, the other the selected synthesis behavior. Keep both in deployment records.

The output request asks for WAV containing 24 kHz signed 16-bit little-endian PCM. That makes the saved file easy to inspect with standard audio tools. The adapter does not implement incremental text streaming. Cartesia's documented Bytes and streaming interfaces serve different integration needs; replacing the URL without implementing the streaming protocol is not sufficient.

The relevant contract is [the Cartesia Bytes reference](https://docs.cartesia.ai/api-reference/tts/bytes). Older tutorials can use a structured voice object or different model and version values. This edition's adapter follows the inspected current voice-ID shape. When upgrading, compare the full request schema rather than assuming historical field shapes remain interchangeable.

A streaming synthesis connection can support multiple text fragments or contexts. Your application must associate generated audio with the correct response and cancel or invalidate a context on interruption. Reusing a socket does not mean reusing conversational audio state indiscriminately. Keep response identity explicit so one turn's late output cannot spill into the next.

## Understand the ElevenLabs adapter

The ElevenLabs adapter posts text and a model identifier to a voice-specific HTTP path. It authenticates with `xi-api-key`, selects an MP3 output format, and saves the returned bytes. The example defaults to the inspected `eleven_multilingual_v2` identifier for this file-based baseline, with an environment override. That is not a claim that it is the lowest-latency conversational choice.

The [speech creation reference](https://elevenlabs.io/docs/api-reference/text-to-speech/convert) exposes model and format choices. Evaluate an appropriate low-latency model separately if realtime responsiveness is central to your product. A model selected for long-form expressiveness and a model selected for short conversational turns may have different strengths. Do not infer a universal winner from a single sample.

Voice IDs are URL path values, so the TypeScript adapter uses `encodeURIComponent` and Python uses URL quoting. This prevents an unexpected identifier from changing the request path. It is ordinary input hygiene, and it remains necessary even when the value usually comes from your own configuration.

The adapter intentionally does not use a deprecated latency-optimization parameter as a generic speed fix. Start with a supported model and sensible chunking, then measure actual time to usable audio. Output format, region, request size, warmup, and network path can all contribute. A parameter that appears in an old blog post is not a substitute for checking the current contract.

## Streaming input and streaming output are distinct

A service may begin returning audio before the full audio response is generated. That is streaming output. It may also accept text fragments over time while the language model is still generating. That is streaming input. A provider can support one, both, or neither on a particular endpoint. Your adapter should state which capability it actually implements.

With output streaming only, the entire text must be known before synthesis starts, but playback can begin before all audio is generated. With input streaming, you can start with a coherent phrase before the entire answer exists. This can reduce perceived delay, but the TTS system has less future text available to choose prosody and sentence rhythm.

Suppose the language model emits “The available times are” and then pauses while a tool finishes. Speaking that phrase too early can leave an awkward gap. Waiting for “three or four tomorrow afternoon” gives the voice more context but adds startup delay. A useful policy buffers until the phrase has enough meaning to be spoken naturally, while bounding how long it waits.

Do not send one TTS request per token. Tokens are model units, not natural speech boundaries. Some tokens are partial words or punctuation. Excessively fine requests can create unnatural emphasis, more overhead, and complicated cancellation. Use the provider's supported streaming mechanism or a phrase-level request strategy, and evaluate the resulting voice under realistic token timing.

## Keep spoken text separate from display text

A web answer may contain a clickable date, an email address, code, or a table. Reading that representation literally is often unpleasant. A voice agent benefits from separate spoken and displayed forms derived from the same underlying facts. The screen can show a full address while the voice asks whether to use the saved location.

For example, display `2026-11-13 15:00 America/New_York` in a developer trace, but speak “Tomorrow at three in the afternoon, Eastern time” only after resolving the user's actual date and timezone. Do not let an informal spoken rendering become the canonical scheduling value. Store the precise timestamp and timezone in structured state.

Numbers need particular care. “One twenty” can mean a time, a price, or a quantity depending on context. A good response supplies the unit: “one hundred twenty dollars” or “one twenty in the afternoon.” Use task-aware normalization rather than blindly expanding every digit. A version number such as 3.6 should not be pronounced as a currency amount.

Pronunciation dictionaries or provider controls can help with product names when supported. Keep the canonical spelling in your business data, and apply the pronunciation mapping at the speech boundary. Test the mapping in complete sentences. A phonetic spelling that fixes one isolated word may sound unnatural in a different language or inflected context.

## Voice design is part of interaction design

Choose a voice for its role. Harbor should sound clear, steady, and easy to interrupt. It does not need to dramatize an availability lookup. An entertainment character may appropriately use a different style. Treat expressive controls as a product decision with evaluation, not as decoration added after the interaction is finished.

Consistency helps users understand that the same agent is continuing the task. Abrupt changes in speaking speed, volume, or pronunciation between turns can feel like errors. When switching providers as a fallback, voice identity may change. Decide whether to disclose the change, offer text, or preserve the task while restarting the audio experience deliberately.

Avoid inferring a user's emotional state as fact from vocal tone. An agent can respond gently to explicit frustration without claiming to know a hidden diagnosis or emotion. Similarly, a friendly voice should not imply human identity. State clearly that the user is interacting with an AI assistant, then focus on useful behavior rather than repeated artificial introductions.

Voice cloning requires an appropriate source and permission for the intended use. This book uses no cloned voice and redistributes no voice recordings or model weights. If your product uses a custom voice, document provenance, consent, access controls, and revocation handling as part of the asset lifecycle. Those are concrete product requirements, not something a TTS API automatically supplies.

## What changes with a managed agent

A managed agent platform may store the system instructions, speech configuration, tool definitions, knowledge sources, conversation records, and monitoring. Your web application then starts a conversation with a configured agent rather than orchestrating every recognition and synthesis call. This can reduce integration work when the platform's workflow fits your task.

The platform still needs a clear application boundary. Your backend determines which authenticated user may start which agent, what account or tenant context is attached, and which tools are allowed. Do not let the browser select arbitrary private agent identifiers or privileged dynamic variables without validation. Configuration flexibility is also an attack surface.

A hosted knowledge base is not automatically current or authoritative for every question. Decide how documents are refreshed, how access restrictions are applied, and how the agent handles missing evidence. For real availability, use a live lookup tool rather than embedding yesterday's calendar in a static document. Retrieval is useful for policies and explanations; transactions need their system of record.

Conversation dashboards can be useful operational tools, but they introduce retention and access questions. Know whether audio, transcripts, tool payloads, and user identifiers are stored. Minimize sensitive dynamic variables and prevent credentials from entering prompts or tool descriptions. A managed product can simplify operation without eliminating your responsibility for data flow.

## Start hosted sessions with scoped authorization

A private hosted agent typically requires a server-issued conversation authorization mechanism. ElevenLabs documents a signed URL for an authorized conversation and a separate token path for supported transports. These are transport-specific capabilities. Do not pass a signed WebSocket URL to an unrelated WebRTC initializer and assume the SDK will infer the intended mode.

A backend authorization route should authenticate the application user, select an allowed agent, request the appropriate short-lived capability, and return only what the client needs. Apply issuance limits and avoid caching the response. The [signed URL reference](https://elevenlabs.io/docs/api-reference/conversations/get-signed-url) defines that particular API; consult the current transport-specific SDK example before integrating it.

Cartesia's current materials also include managed-agent paths alongside its speech APIs. The source ledger distinguishes the accessible official example from the unavailable Line overview. We do not infer a stable Line SDK API from a failed page fetch. If you choose that route, start from the current official agent template and inspect its exact dependencies and configuration.

For either vendor, create separate development and production configurations. A test agent with permissive tools should not become a production agent by changing only its display name. Review tool endpoints, authentication, allowed overrides, retention, and quotas. Version the configuration so an observed behavior can be traced to the prompt and tool schema that produced it.

## Integrate a hosted client into React carefully

The inspected ElevenLabs React documentation currently shows a `ConversationProvider` with granular hooks for controls and status. Historical examples may use a different hook arrangement. Treat the current documented package and migration guidance as the baseline. This package does not install or pin that optional React SDK, so the following discussion is an integration plan rather than a verified React application.

At the component boundary, map start, end, mute, connection status, speaking status, transcript events, and errors into your UI. Keep the provider's lifetime aligned with the intended conversation lifetime. If navigating to another route should end capture, ensure the relevant provider or session is disposed. If conversation should persist, make that persistence explicit and keep its controls visible.

React development modes can mount and clean up effects more than once to expose lifecycle problems. Do not start a paid conversation automatically in an unguarded effect. Start from a user action, use the SDK's supported lifecycle, and make cleanup idempotent. The same principles apply to any frontend framework, even if its lifecycle terminology differs.

Client tools are useful for UI actions such as opening a panel or highlighting a result. They are not a safe home for privileged business authority. A client tool can request a backend operation, but the backend must independently authenticate and authorize it. Treat the model's tool arguments as untrusted input just as you would any other client request.

## A listening comparison that produces useful decisions

Prepare three response families: a short acknowledgement, a sentence containing critical details, and a longer explanation. For each family, keep the text constant across candidates. Normalize listening volume so loudness does not dominate preference. Label whether a sample is a complete-file request or a streaming request, since the timing conditions differ.

For Harbor's critical-detail sentence, include a date, time, and timezone. Ask whether each detail is intelligible on the target device, not merely whether the voice is attractive on studio headphones. Keep a separate note for pronunciation errors and for interaction timing. A voice can score well on one and poorly on the other.

Then repeat under the actual application chunking policy. A voice that sounds fluid with a full paragraph may sound fragmented when text arrives phrase by phrase. Measure first usable audio and listen at the boundaries between fragments. This reveals whether your adapter and chunker preserve the qualities that made the isolated sample appealing.

Document the decision as a configuration-specific result. Record the model, voice, output format, text policy, and device. That gives future upgrades a comparison baseline and avoids turning a narrow listening preference into an unsupported claim that one provider is best for every voice agent.

## Evaluate provider swaps without hiding behavior changes

An interchangeable synthesis adapter is valuable, but it does not make every voice equivalent. Compare sample rate, codec, streaming behavior, pronunciation controls, response IDs, cancellation semantics, and quota behavior. A fallback adapter that only returns complete files cannot preserve the timing of a streaming implementation without changing the user experience.

Define an internal capability record. It can state whether incremental text is supported, what audio formats are available, whether timestamps are returned, and how cancellation is requested. Use that record to select a compatible player and chunking policy. Prefer an explicit unsupported capability error over a silent fallback that claims to preserve realtime behavior.

Test provider failures as part of the comparison. Simulate rejected credentials, quota exhaustion, delayed first audio, and interrupted streams. Measure what the user sees and hears, not just whether an exception is caught. A graceful fallback to text can be a better product outcome than automatically starting a second voice session with uncertain history.

The next chapter examines what happens when you operate a speech model yourself. The same adapter boundaries remain useful, but you become responsible for model loading, hardware capacity, isolation, and checkpoint provenance as well as the conversation experience.
