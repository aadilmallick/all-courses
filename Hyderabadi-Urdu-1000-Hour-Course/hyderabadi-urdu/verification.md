# Verification record — 13 November 2026

## Content and measured depth

Twelve chapters contain 42,970 whitespace-separated words and exact hour tables totaling 1,000 hours. Tiktoken 0.14.0, `o200k_base`, measured 64,362 chapter tokens; each exceeds 5,000 tokens. `token-report.json` includes individual counts and source SHA-256 fingerprints. Length is a depth diagnostic, not a quality guarantee.

The vocabulary has 1,000 distinct normalized Roman headwords/lexical entries with meanings, examples, translations, topics, chapter tags, word classes and gender labels. It is a curated useful core, not a verified corpus frequency ranking. There are 360 authored items: 72 each for both translation directions, grammar, listening and speaking. Vocabulary supplies 2,000 directional prompt variants. Speaking requires human assessment.

## Executed verification

- Production Astro/Starlight build succeeded: 25 HTML pages and search index. The optional empty `i18n` collection and authored 404 route priority emit nonfatal framework warnings; the 404 output exists.
- Eleven automated tests passed: meaningful spelling distinctions; separate listening transcript/meaning checks; all 288 auto-graded models; spaced due dates; validated journal import; metadata excluded as vocabulary meanings; missing speech APIs; stopped/stale speech; mapped synthesis labeling; propagated synthesis errors; and deliberate local-particle exclusions.
- Static verification passed exact counts, unique IDs/headwords, required fields, grammar choices, each chapter’s hour arithmetic, Roman-only learner content, token minima, book anchors/fences and production outputs. All local production links/assets resolve.
- Textbook Workshop’s validator passed in final mode with zero errors. Structural checks do not certify language accuracy.
- The portable server successfully served the production build on localhost. Existing exact-version local dependencies were reused after a cached clean install encountered operating-system cache permissions. A fresh internet dependency install was not verified.

## Observed browser behavior

Checked the actual build in the Codex in-app Chromium browser. Desktop homepage/navigation rendered. A chapter-9 translation displayed its Roman source, accepted its model meaning, showed specific feedback and prevented repeat scoring. Listening hid its target and offered separate Roman and English fields. Vocabulary search found the biryani card. A saved 30-minute journal session reloaded as 0.5 hours. Selecting `chai` and right-clicking opened the custom audio dialog.

At a requested 390 by 844 mobile viewport, the homepage and grammar feedback were usable without horizontal overflow: client and scroll widths both 375 pixels after the scrollbar. Visible text remained Roman-only. The viewport override was reset. `course-preview.jpg` captures the desktop homepage.

The test browser had no Urdu/Hindi system voice; local Urdu recognition and Chrome’s foundation model reported unavailable. All displayed useful guidance and left text practice usable. Their successful hardware-backed paths were not exercised. An optional reference-audio upload browser check stalled and is not claimed as a passed test.

## Audio and device limits

Machine-only speech spelling covers 999/1,000 vocabulary headwords and 134/144 listening/speaking models. `Hau` and ten phrases containing `hau`/`ich` deliberately request family audio rather than substituting shared words. All learner-facing text stays Roman. Spelling coverage does not verify a system voice’s pronunciation.

Native-speaker recordings are not bundled. The application supports exact-transcript family audio imports, recording/replay, system TTS, local-only recognition and an English reflection coach. Physical microphone capture, imported audio persistence/playback, a successful local language-pack installation, and successful on-device AI generation remain unverified. The current Prompt API does not list Urdu among supported text languages; the coach does not hear or grade Urdu speech. System voices cannot promise a Hyderabadi accent.

## Linguistic review and portability

Chapters were reviewed for prerequisite order, agreement, tense/aspect, modals, reflexives, relative constructions, respect, answer meanings and household variation. Targeted corrections were integrated. The source ledger distinguishes inspected, partial, index-only and unavailable material. Native Hyderabadi editorial, acceptability, prosody and pronunciation review remains outstanding.

The target is selected CEFR B2 conversational abilities, not accreditation or a guarantee after fixed hours or vocabulary size. Fresh interaction and unfamiliar human listening on different occasions provide the course’s final evidence.

The archive includes book, chapter sources, data, full companion source, pinned dependencies, built website, references, evidence and a localhost launcher. It excludes dependencies, Git internals, caches, credentials and temporary audio. The packaging script checks required files, traversal safety, CRC integrity, source-book identity and SHA-256; its result is recorded in `archive-verification.json`.
