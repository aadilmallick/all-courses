# Run the examples

Run commands from the extracted project root. Keys are server environment variables; the package contains none. Use your shell or secret manager to set them. On PowerShell use `$env:NAME = 'value'`; in Bash use `export NAME='value'`. Avoid saving secrets in source or sharing terminal history. Do not put permanent keys in a browser variable.

## Offline foundations

```bash
python examples/python/core.py
node examples/typescript/core.ts
```

Both create a 16 kHz mono PCM16 tone; it is a format fixture, not speech. Python also prints a bounded queue's four mock text chunks. Both endpoint examples commit at 700 ms for 200 ms speech followed by 500 ms silence.

## OpenAI Realtime browser, either backend

Required: `OPENAI_API_KEY`. Optional: `OPENAI_REALTIME_MODEL` (edition baseline `gpt-realtime-2.1`). Run **one**:

```bash
python examples/python/openai_server.py
node examples/typescript/openai-server.ts
```

Open `http://localhost:3000`, select Start, and grant microphone permission. This sends audio to OpenAI and can incur charges. The protocol is Realtime GA `/v1/realtime/calls`; newer Live examples are a separate protocol. End closes local media and stops microphone tracks. The page has no real calendar tools and no implemented text assistant. It is a local learning demo, not a public authenticated server.

## Cartesia or ElevenLabs synthesis

Cartesia variables: `CARTESIA_API_KEY`, `CARTESIA_VOICE_ID`. The code pins API header `2026-08-14` and model `sonic-3.6`.
ElevenLabs variables: `ELEVENLABS_API_KEY`, `ELEVENLABS_VOICE_ID`; optional `ELEVENLABS_TTS_MODEL` (baseline `eleven_multilingual_v2`, a file-generation example rather than a lowest-latency recommendation).

```bash
python examples/python/providers.py tts cartesia
node examples/typescript/providers.ts tts elevenlabs
```

Outputs: `reply.wav` for Cartesia, `reply.mp3` for ElevenLabs. Choose current accessible voice IDs from your account. These commands perform paid provider requests. No automatic retries are configured.

## Whole-file cascade

Additionally set `OPENAI_API_KEY`, `OPENAI_STT_MODEL`, and `OPENAI_TEXT_MODEL` to current accessible model IDs for the transcription and Responses APIs. Provide an actual speech recording in WAV format, not the synthetic tone.

```bash
python examples/python/providers.py cascade utterance.wav cartesia
node examples/typescript/providers.ts cascade utterance.wav elevenlabs
```

This is one sequential recorded turn, not a realtime continuous conversation. It prints recognized and intended text, then saves the synthesized answer. Use permitted non-sensitive fixtures.

## Gemini Live file turn

Set `GEMINI_API_KEY`; optionally `GEMINI_LIVE_MODEL` (inspected baseline `gemini-3.8-live`). Python input must be 16 kHz mono PCM16 WAV. TypeScript input must be raw PCM with those properties, WITHOUT a WAV header.

```bash
python -m pip install -r requirements-optional.txt
python examples/python/gemini_file.py utterance.wav
node examples/typescript/gemini-file.ts utterance.pcm
```

Python saves a 24 kHz PCM16 WAV; TypeScript saves raw 24 kHz PCM16. Chapter 6 gives extraction and wrapping snippets. These are server-key WebSocket examples, not direct-browser authentication recipes. Confirm the current provider schema and account access. Paid network calls were not executed during verification.

## Optional local models

In a separate environment, inspect and install `requirements-models.txt` and the upstream system/hardware requirements. Its entries are direct baseline pins/constraints, not a complete transitive or GPU lock. Model and voice artifacts may download on first run. No weights are redistributed or tested here.

```bash
python examples/python/local_models.py recognize utterance.wav
python examples/python/local_models.py speak "Wednesday at three is available."
```

Recognition uses CPU int8 faster-whisper `small`; synthesis uses Kokoro's documented American-English path and `af_heart`. Kokoro can require phonemizer system dependencies such as espeak-ng. The recipe is unexecuted; obtain upstream instructions and lock a successful environment for your machine. Fish-specific install/inference documentation is linked in chapter 8; its checkpoint licenses must be checked separately from repository code.
