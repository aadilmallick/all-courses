# Open the course locally

The `dist` folder contains the complete built website. Install Node.js 22.12 or later, open a terminal in the extracted `hyderabadi-urdu` folder, and run:

```text
node companion/server.mjs
```

Open the localhost URL printed by the server. On Windows, you can also double-click **Start Urdu Course.cmd**. Keep the server window running while using the course; press Ctrl+C to close it. No account, API key, or package installation is needed to read and practice with the included build. Opening `dist/index.html` directly is insufficient because browsers restrict module and data loading from files.

## Practice

The home page links to all twelve chapters and these tools:

- **Quizzes & translation:** chapter-filtered grammar and both translation directions, listening with a Roman transcript plus English meaning, and spoken self-checks.
- **Vocabulary:** all 1,000 entries with examples, search, topic filters, and spaced review ratings.
- **Listening & speaking:** synthetic voices where the device supports them, family/reference audio imports, recording and replay, optional local word recognition, and the optional English-language Chrome AI study coach.
- **Milestone assessments:** fresh cumulative grammar/translation tests, with human listening/speaking rubrics.
- **Journal:** real practice time, chapter self-checks, notes, and validated JSON export/import.

Microphone access works on localhost in supported browsers. The browser controls local AI models and language packs. Urdu/Hindi recognition is not universally supported. Imported audio lives only in that browser’s storage; keep original files. The journal export does not include audio.

## Edit and rebuild

```text
npm ci
npm run build
npm test
npm run verify
```

Dependencies are pinned in `package-lock.json`. The build assembles canonical chapters and vocabulary into the website, `book.md`, and downloadable references. See the root README for the source layout and verification limits.
