# Verification record

**Edition:** 13 November 2026. This report separates content, build, browser, and device evidence. It does not certify linguistic perfection, learner outcomes, or universal browser support.

## Content and structure

- Ten canonical finished chapters, each exceeding 5,000 whitespace-separated words; 54,439 chapter words total. The grammar reference adds approximately 4,000 words. Preface, curriculum, sources, code, generated duplicate pages, and exercise data are excluded from the chapter total. This is a measured word proxy, not a tokenizer count.
- All 100 ten-hour units are present: ten 100-hour stages, exactly 1,000 allocated hours. Independent input, conversation, production, review, and project work are part of the allocation.
- All banks contain 100 vocabulary entries, 20 bilingual sentence pairs, and 15 four-choice grammar questions per stage. Total: 1,000 vocabulary entries, 200 sentence pairs, and 150 grammar questions. Repeated useful headwords across stages mean these are not 1,000 unique words.
- Six exercise modes derive 2,750 practice prompts from those authored records; speaking offers the same 200 model sentences. Derived directions are not described as newly authored sentences.
- All 150 grammar questions received a separate answer-key review; representative French examples and the ten-chapter progression were reviewed. Ambiguous prompts were clarified. Some uncommon reference distinctions received additional teaching in the grammar appendix.
- Original C1 synthesis sources, passages, model answers, and rubrics are included. Official DELF/DALF pages denied automated access; no exact current official exam format is claimed.

## Executed checks

The pinned Astro 7.4.11 / Starlight 0.42.11 production build completed and generated 21 pages plus search assets. `npm test` passed nine meaningful grading/review tests: punctuation/apostrophe normalization, accent-only differences, rejection of changed tense/negation, authored alternatives, review intervals and reset, deck identity, shuffle preservation, and vocabulary sense/form variants. `npm run verify` passed schema, counts, chapter depth, route, bank, and assembly checks.

Additional delegated checks parsed the speaking/storage scripts after TypeScript stripping and exercised storage validation and mocked lifecycle behavior. These confirmed rejection of malformed imports, failed-storage reporting, separate text/audio model probes, text-only coaching when audio is unavailable, prevention of duplicate pending microphone requests, stream cleanup, cancellation handling, and browser-history restoration behavior. Mocks establish chosen logic paths, not actual device-model execution.

The supplied Textbook Workshop validator is run in final mode against book.json and book.md; its machine-readable output is included as textbook-validation.json. Archive packaging separately checks file integrity, safe paths, required book/source/build files, and exclusion of dependency and credential folders.

## Browser observations on the built output

The local built site was served with the included Node server and inspected in the in-app browser. Observed successful behavior includes:

- Homepage rendering and navigation, textbook routes, and desktop and narrow layouts. The narrow homepage reported matching viewport/body/scroll widths, with no horizontal page overflow.
- A Stage 1 grammar question accepted the correct answer, showed the authored explanation, and saved session results.
- A timed French-to-English answer saved without revealing feedback; ending the test showed its reference match and unanswered count.
- Listening mode displayed both transcription and English-meaning fields; revealing an item showed its French sentence, English reference, and explanation.
- French TTS reported the absence of an installed French voice rather than substituting another language. Actual audible playback was not available in this browser.
- Vocabulary search returned relevant French/English/context records.
- Study-time logging and a unit checkbox updated counts; the expanded group and checkbox focus remained intact.
- Local recognition detected that a French language pack was downloadable. The pack was not installed during QA.
- A typed speaking transcript matching the model produced a word-match message that explicitly directs the learner to listen back for sounds and rhythm.
- Textbook search controls loaded, and the selected-text right-click menu displayed its normal and slow pronunciation actions.

The ZIP passed a full integrity scan and required-file/exclusion checks. Private hosting subsequently failed twice at the provider; no hosted URL is claimed. The local delivery includes the complete build and a Windows launcher; see publishing.md for the retained site/version details.

## Limits

Actual microphone recording, audible French TTS, downloaded French dictation, and Chrome model inference were not exercised on physical user hardware. Model availability, microphone permission, audio format support, installed voices, and device resources remain device-specific. No remote AI substitute is used. AI output can be wrong and is not a proficiency or pronunciation grade. Human conversation and expert feedback remain necessary parts of the study plan.

The review is substantial but is not an independent French-language editorial certification. Translation references are finite; a valid answer may need manual comparison and an explicit practice self-mark. The CEFR alignment is instructional, and completing the hour log cannot guarantee a C1 result. The static build emitted a harmless notice about an unused empty i18n collection; the course itself is in English with French learning material.
