# Voice-agent landscape: research and decision guide

Research snapshot: November 12, 2026. Primary documentation, model cards, official repositories, and package release records were used. `sources.json` records individual URLs, inspected sections, partial access, and unavailable pages. No provider benchmark, paid conversation, or model inference was run. The choices below are engineering inferences from documented capabilities and system responsibilities, not measured vendor rankings.

## Compare the layer you are buying

| Option | Role in an application | Useful reason to evaluate it | Responsibilities that remain yours |
| --- | --- | --- | --- |
| OpenAI Realtime | Native conversational audio | Direct browser media and tool-oriented conversation | App authentication, trusted tools, UX, lifecycle, evaluation |
| Gemini Live | Native bidirectional audio session | Explicit audio/video/text session integration | PCM bridge or supported client stack, playback, interruption, backend authority |
| Cartesia speech APIs | Recognition/synthesis components | Independent speech stages and voice evaluation | Reasoning, orchestration, media transport, cancellation |
| Cartesia managed agents / Line paths | Agent configuration and hosting options | A hosted workflow or framework may reduce integration work | Verify the exact current product, SDK, permissions, and lifecycle |
| ElevenLabs TTS | Synthesis component | Voice, pronunciation, and expressive speech evaluation | Recognition, reasoning, transport, task state |
| ElevenLabs Agents | Managed conversational platform | Hosted agent workflow and frontend integration | Scoped authorization, trusted backend actions, web controls, data policy |
| Fish hosted API | Hosted speech components | Evaluate documented hosted models without running inference workers | App orchestration, model selection, account terms, voice UX |
| Fish Speech checkpoints | Self-operated speech generation | Artifact-specific control and deployment evaluation | Exact checkpoint terms, hardware, serving, transport, cancellation, monitoring |
| Whisper / faster-whisper / whisper.cpp | Recognition | Local or self-operated recognition experiments | Streaming policy, turn detection, inference capacity, reasoning and synthesis |
| Kokoro | Open-weight TTS candidate | Compact synthesis pilot with a documented permissive model-card label | System dependencies, voice assets, quality testing, serving |
| LiveKit Agents / Pipecat | Orchestration and transport | Reduce repeated media/session engineering | Task design, correct configuration, provider/asset terms, release evidence |

Sources for the provider roles: [OpenAI Realtime](https://developers.openai.com/api/docs/guides/realtime), [Gemini Live](https://ai.google.dev/api/live), [Cartesia speech](https://docs.cartesia.ai/api-reference/tts/bytes), [ElevenLabs Agents](https://elevenlabs.io/docs/eleven-agents/libraries/react), [Fish capabilities](https://docs.fish.audio/overview/capabilities), [LiveKit](https://docs.livekit.io/agents/start/voice-ai/), and [Pipecat transport guidance](https://docs.pipecat.ai/client/concepts/choosing-a-transport).

## Implementation baselines and migration risks

The executable OpenAI browser demo uses the Realtime GA call reference and configurable `gpt-realtime-2.1` baseline. Some current guide pages also present the newer Live interface. Endpoint names, session shapes, readiness events, and shutdown semantics differ. This package keeps the Realtime example internally consistent rather than combining both protocols.

The Gemini examples use the documented v1beta BidiGenerateContent WebSocket wire schema with configurable `gemini-3.8-live`. Python and TypeScript both show a single file turn. They do not claim to implement live browser capture. Direct browser access needs the provider's supported ephemeral-credential flow and matching endpoint.

The Cartesia example pins `Cartesia-Version: 2026-08-14`, `sonic-3.6`, and the inspected voice-ID field shape. The ElevenLabs file example uses `eleven_multilingual_v2` as a documented compatibility baseline, not a claim that it is the newest or fastest model. Its pricing site lists newer model families; choose and verify the exact API model for your own realtime evaluation.

The current ElevenLabs React page includes a provider and granular hook pattern. Earlier tutorials may have a different shape. No React SDK was installed for this package, so its discussion is migration-aware guidance rather than a verified React build.

## Fish and the meaning of “open”

The inspected [S2-Pro model card](https://huggingface.co/fishaudio/s2-pro/blob/main/README.md) labels the weights with a research license. The [repository license](https://github.com/fishaudio/fish-speech/blob/main/LICENSE) currently contains a community agreement. The hosted platform lists additional model identifiers. These are separate artifacts and should not be collapsed into “Fish is free for any commercial agent.”

Before a deployment decision, record the exact code revision, checkpoint revision/hash, voice assets, applicable terms, and hosting use case. This report identifies the sources to examine; it does not grant permission or provide a legal determination. The package redistributes no weights, recordings, or upstream source-document extracts.

## A practical selection process

For a first application, compare one native-audio path and one cascade against the same task fixtures. This exposes whether your product benefits more from native vocal interaction or explicit text control and component interchange. Add a managed platform candidate if its workflow fits, and a local candidate if deployment control or measured economics justifies operating inference.

Use hard constraints first: permitted deployment region, language, accessibility route, latency tolerance, authority boundaries, and team operating capacity. Then score intelligibility, critical-entity accuracy, first-audio latency, interruption latency, repair turns, and cost per completed task. The book provides the definitions and local calculation tools; it does not pretend to supply measured scores for vendors.

Avoid comparing marketing latency numbers with different start and end points. “First audio” may exclude endpointing, network setup, or device buffering. Measure the user's experience with the actual transport and output policy. Include a noisy case, a correction, a mid-sentence pause, a tool delay, and repeated interruptions.

For self-hosting, measure cold load, warm first audio, queue wait, sustained generation, concurrent demand, and cancellation. Include idle capacity in cost. A faster-than-realtime offline model can still be a poor interactive service when the admission queue or startup dominates.

## Pricing research

Consult the current official account-specific terms and price pages: [OpenAI](https://developers.openai.com/api/docs/pricing), [Gemini](https://ai.google.dev/gemini-api/docs/pricing), [Cartesia](https://www.cartesia.ai/pricing), and [ElevenLabs API](https://elevenlabs.io/pricing/api). Hosted-agent and speech-component billing can differ. The attempted Fish pricing URL was unavailable, so no Fish price is asserted.

Normalize billing units only with explicit assumptions. Audio input, generated audio, text tokens, synthesis characters, connected minutes, platform fees, and self-hosted instance hours are different quantities. The companion uses editable illustrative rates and makes no live pricing request. Chapter 12 derives example cost equations and explains cost per task.

## Access and evidence limits

Cartesia's WebSocket page timed out; its Bytes reference and official SDK description were available. A Line overview, an ElevenLabs JavaScript page, and a Pipecat quickstart were unavailable at the attempted URLs. Accessible official alternatives support the bounded discussion, but no API was inferred from an unavailable page. The attempted OpenAI server-controls guide was unavailable, so no unverified sideband implementation is shipped.

Several large API pages were inspected only in relevant sections. `sources.json` marks that explicitly. Search retrieval and source inspection establish documented contracts; syntax checks, mocked tests, and browser tests establish different evidence. Read `verification.md` for the actual execution boundary.
