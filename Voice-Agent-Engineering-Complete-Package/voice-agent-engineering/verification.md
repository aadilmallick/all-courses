# Verification report

Edition: November 12, 2026. **27 automated tests passed**. The book and package passed structural/source checks. Browser visual execution was blocked by the host; live paid integrations and model inference were not run.

## Measured teaching depth

Twelve canonical chapters contain **30,661 prose words**, excluding fenced code. Each exceeds 2,500 prose words. Counts do not establish teaching quality on their own; the sequence also received a prerequisite, worked-example, terminology, and scope review. No tokenizer was available, so no measured token-count claim is made.

| Chapter | Prose words |
| --- | ---: |
| chapter-01 | 2,573 |
| chapter-02 | 2,582 |
| chapter-03 | 2,572 |
| chapter-04 | 2,635 |
| chapter-05 | 2,519 |
| chapter-06 | 2,512 |
| chapter-07 | 2,548 |
| chapter-08 | 2,549 |
| chapter-09 | 2,507 |
| chapter-10 | 2,508 |
| chapter-11 | 2,560 |
| chapter-12 | 2,596 |

## Executed evidence

| Layer | Execution and observed result | Limit |
| --- | --- | --- |
| Python tests | 11 unittest cases passed: PCM/WAV, endpoint boundaries, stale audio, ownership/idempotency, percentiles, mocked provider requests, cascade extraction, cross-language traces, static HTTP service and both demo backends | Model and provider calls mocked or absent |
| Node tests | 16 tests passed: audio/state/numerical invariants and actual lab mount handlers in a lightweight DOM double, including event cleanup and repeated mounting | DOM double does not render or establish browser compatibility |
| HTTP services | Companion assets and book served successfully; both demo backends rejected invalid host/origin/type and reported missing keys without provider calls | No successful paid signaling or media session |
| Structural validation | Twelve complete chapters; declared assets, labs, source listings and book targets present; no depth or link errors | Does not prove all APIs work |
| HTML reader | Generated with marked 17.0.5; 155 unique explicit anchors, 157 hash links resolved; SVG diagram embedded in the standalone file | No visual layout inspection |
| Syntax | All included Python sources compiled; Node parsed every MJS/TS file; executable core TypeScript ran under Node 24 | No tsc type-check |
| Arithmetic | PCM frame sizes, Base64 length, endpoint time, percentiles, cost and transaction invariants checked | No vendor performance benchmark |
| Research | 44 primary source entries with section-level access status; six unavailable URL attempts recorded | No claim of reading every page of every site |

## Browser execution limitation

Playwright could not launch the available Chromium. The installed browser attempted to create a Unix-domain socket and received `Operation not permitted`. A separate socket check confirmed AF_UNIX was unavailable while localhost TCP worked. No application screenshot, responsive-layout result, real microphone behavior, or visual accessibility pass is claimed. `tests/browser_checks.py` includes the intended browser checks for a compatible machine. The deterministic DOM tests are reported separately and are not substituted for a browser pass.

## Provider and model boundaries

OpenAI Realtime, Gemini Live, Cartesia and ElevenLabs requests were checked against documented contracts and parsed as source, but no paid live request was executed. Model availability, account permissions, quotas, live voice quality, and billing must be checked with your own account. Request mocks validate local mapping, not remote acceptance.

No Fish, Whisper, Kokoro, Moshi, or Chatterbox weights were downloaded or run. The optional local-model recipes have direct dependency baselines and syntax checks only, without a tested transitive/GPU lock. Fish deployment references distinguish repository code, checkpoints, hosted services, and applicable artifact terms.

The in-memory proposal ledger is a tested teaching model, not a durable concurrent calendar backend. The Realtime demo is a localhost learning server. The production capstone, real text fallback, application login, calendar integration, hosted publication, and GPU serving are guided extensions rather than delivered services.

## Reproduce

```bash
python -m unittest discover -s tests -p 'test_*.py'
node --test tests/core.test.ts tests/dom.test.mjs
python scripts/assemble_textbook.py .
python scripts/validate_textbook.py .
python scripts/check-package.py
```

To regenerate HTML, install the optional authoring dependency `marked@17.0.5` and run `node scripts/build-reader.mjs`. It is not needed to read the shipped HTML or run the companion. Browser testing needs Playwright 1.62.0 and a compatible Chromium installation: `python tests/browser_checks.py`. That script self-starts the local servers and removes the provider key from child-server environments.

## Archive checks

The final archive is produced from an explicit project subtree, with caches, secrets, dependency folders, screenshots and unrelated workspace files excluded. Its integrity, safe relative paths and required inventory are checked during packaging. `checksums.json` records SHA-256 hashes of distributed files.
