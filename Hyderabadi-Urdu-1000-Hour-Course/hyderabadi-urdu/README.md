# Ghar ki Baat — Hyderabadi Urdu in Roman script

A complete authored 1,000-hour conversation curriculum, a continuous textbook, and an Astro Starlight companion. For an English-speaking adult starting from zero, with a spoken B2 target and no Urdu/Devanagari literacy requirement.

## Begin

- Read `book.md` for the continuous textbook, including the course plan, grammar reference, Hyderabadi field guide, complete vocabulary, and sources.
- Open `chapters/01-sounds-and-first-conversations.md` for the first standalone chapter.
- Run `node companion/server.mjs` and open the printed localhost link for the included built website. On Windows, double-click `Start Urdu Course.cmd` after installing Node.js 22.12 or later.
- Follow `curriculum.md` for all twelve chapter allocations, totaling exactly 1,000 hours.

The built course works without installing its development dependencies. System voices, microphone capabilities and optional Chrome AI/recognition depend on your browser and device. Native Hyderabadi audio is not bundled; import a willing family speaker’s recording for the most relevant reference.

## What is inside

Twelve substantial chapters teach sound and Roman spelling, respect and repair, pronouns and agreement, noun gender and number, possession, postpositions and oblique forms, present and past aspect, perfective agreement and `ne`, future and subjunctive, modals, dative experiencers, relative-correlatives, reporting, conditions, compounds, passive, causatives, focus, and sustained interaction. Each chapter contains original bilingual dialogues, worked sentence construction, exercises with explained keys, listening/speaking activities, a detailed practice allocation, and performance criteria.

The 1,000-entry vocabulary is a curated useful core, not a verified corpus frequency ranking. It includes example sentences, English meanings, noun gender and conversation topics. B2 conversation requires vocabulary expansion beyond this core. Local Dakhni forms are integrated with shared alternatives, social context and household-variation notes.

The browser includes 360 authored practice items, plus word review derived from all 1,000 entries. Translation works in both directions; listening asks for a Roman transcript and English meaning. Exact matching is conservative, with selected accepted variants and explanatory feedback. Speaking uses recordings and human rubrics; neither a transcript match nor AI feedback is a pronunciation certificate.

## Source layout

`chapters/` contains canonical Markdown. `data/chapters.json`, `data/practice-*.json` and `data/vocab-*.tsv` contain the course structure, practice bank and vocabulary. `scripts/assemble.mjs` generates `book.md`, Starlight pages and public course data. Edit canonical files, then rebuild rather than editing generated book/pages directly.

`public/studio.mjs` implements the practice tools. `public/core.mjs` handles answer checks, review scheduling and journal validation. `public/audio.mjs` handles local audio and synthetic voice selection. Speech dictionaries contain machine-only native-script voice input; they are never shown in the learner interface. This permits script-aware TTS without requiring script literacy. Unmapped words produce a useful error unless approximate Roman TTS is explicitly enabled.

## Rebuild

Use Node.js 22.12 or later (this edition was built with Node.js 26.7.0). Dependencies are pinned: Astro 7.4.11, Starlight 0.42.11, the Astro Markdown renderer 7.3.0, and Sharp 0.34.5.

```text
npm ci
npm run build
npm test
npm run verify
node companion/server.mjs
```

For editing with live reload: `npm run dev`. Build output is in `dist/`. No API keys or paid services are required. Browser-local data is tied to an origin, so a hosted site and localhost have separate journals. Export and import your journal to move it; keep original audio files separately.

## Evidence and limits

Read `verification.md`, `content-report.json`, `token-report.json`, `textbook-validation.json`, and `sources.json`. Structural checks, browser observations, hardware capability limits, and linguistic review are reported separately. The course targets selected CEFR B2 spoken abilities; it is not accredited, officially CEFR-validated, or a guaranteed result after a fixed number of hours. Native family/editor review is still needed for household pronunciation and register.
