# Atelier français · A thousand hours, a language for life

A beginning-to-C1 French course: ten substantial chapters, 100 ten-hour units, a single-volume textbook, and an Astro/Starlight learning site with client-side practice.

Read [book.md](book.md), the numbered [chapters](chapters/01-sounds-sense-first-conversations.md), or the built website. Start with [the preface](preface.md) and [study guidance](src/content/docs/study.md). The full timetable is in [curriculum.md](curriculum.md). All explanations assume an English-speaking beginner.

## Open the built course

On this Windows computer, extract the ZIP and double-click **Start French Course.cmd**. It starts the course and opens your browser. Keep its window open while studying; close it to stop the server. Node.js must be installed (it is installed on the computer used to create this course).

Install Node.js 22.12 or newer (Node 26.7 was used for verification). From this folder run:

```sh
node companion/server.mjs
```

Open http://127.0.0.1:4321 in a browser. The archive includes dist, so you do not need to install dependencies just to read and use the built course. Use the local server rather than double-clicking HTML: data loading, search, and microphone capabilities need a proper origin. HTTPS or localhost is required for sensitive browser capabilities.

## Edit and rebuild

```sh
npm ci
npm run build
npm test
npm run verify
```

`npm run dev` starts an editable development preview. The exact dependency versions are in package.json and package-lock.json. Canonical chapters live in chapters, exercises in data. The assembly step generates book.md, curriculum.md, public/data/course.json, and the Starlight textbook pages. Do not edit generated pages as the canonical source.

## Practice tools

- Grammar quizzes with explanations; French-to-English and English-to-French sentence translation.
- Vocabulary recall both ways, searchable vocabulary with examples, and listening with French transcription plus English meaning.
- Timed mixed-item sessions within a selected skill/stage, per-item feedback in practice, and due-item review.
- Device French TTS, selected-text context menu, visible read-selection button, and Alt+L.
- Recording/playback, optional local French dictation, and optional Chrome on-device AI feedback on text or audio.
- Browser-local hour logs, 100 completion checkboxes, and progress import/export.

Typed answers use limited references. Valid alternative translations may need manual comparison; practice has a clearly labeled self-mark. Speech tools do not certify pronunciation or language level. Some devices cannot run Chrome’s local models or French recognition. [Sources and browser notes](sources.md) explain these limits. A synthetic French voice is not a human recording.

## Study scope

The 1,000 hours include independent French input, review, writing, real interaction, and portfolio work. This is a full course allocation, not a promise of 1,000 hours of prerecorded instruction. No finite vocabulary list contains everything needed in every future situation; vocabulary growth continues through reading and conversation. CEFR labels describe intended alignment and are not an official assessment result.

See [verification.md](verification.md) for observed checks, [book.json](book.json) for the manifest, and [sources.md](sources.md) for the provenance ledger. All assessment passages are original. No official exam certification or human-native recording corpus is included. Private hosting failed at the provider; the complete local site remains usable. Publication details are in [publishing.md](publishing.md).
