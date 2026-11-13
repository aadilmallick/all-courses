# From Attention to Customers

A complete 1,000-hour practice course and textbook in sales, digital marketing, LinkedIn, X/Twitter, and YouTube. Tailored examples cover developer services, coding notes, courses, tutoring, and workshops.

## Start here

1. Open **From-Attention-to-Customers.html** in a browser. It contains the full book, searchable chapter navigation, the syllabus, source ledger, and six embedded interactive labs. It needs no network or account.
2. Read the ten numbered chapters in order, then follow their studio assignments.
3. Use **syllabus.md** and **100-session-plan.csv** to schedule the exact 1,000 active hours. Reading alone does not complete the workload.
4. Copy the reusable documents in **templates/** for your own practice. Keep fictional and real evidence clearly separate.
5. Finish the integrated capstone and review the included rubric.

## Contents

| Module | Hours |
|---|---:|
| Foundations and commercial economics | 70 |
| Customer research, positioning, and offers | 90 |
| Content strategy, copywriting, and creative | 90 |
| Prospecting, discovery, proposals, and sales | 120 |
| LinkedIn authority and demand generation | 100 |
| X/Twitter conversations and audience growth | 80 |
| YouTube long-form, Shorts, and production | 140 |
| Websites, email, digital products, and launches | 90 |
| Measurement, experimentation, and paid acquisition | 100 |
| Retention, operations, partnerships, and capstone | 120 |
| **Total** | **1,000** |

The allocation is 140 study, 160 guided-practice, 380 production, 222 field-application, and 98 review hours. At 10 hours/week: 100 weeks; at 20: 50 weeks; at 40: 25 weeks.

## Files

- **book.md**: continuous textbook, complete syllabus, calculation source, and references.
- **chapters/**: ten canonical substantial Markdown lessons, at least 5,000 prose words each.
- **companion/index.html**: standalone offline labs; double-click to run.
- **companion/models.mjs**, **experiments.mjs**, and **app.mjs**: readable implementation.
- **templates/**: reusable research, offer, creative, sales, launch, measurement, and capstone documents.
- **synthetic-campaigns.csv**: fictional source-mix example for Chapter 9; not real campaign evidence.
- **sources.md**, **sources.json**: 26 primary-source references with inspected scope and limitations.
- **verification.md**, **verification-results.json**: measured checks and remaining limits.

## Optional local server and tests

The HTML files run offline without installation. For serving and calculation checks, Node.js 20+ is the intended baseline; Node.js 24.22.1 was tested. There are no third-party runtime dependencies or package installs.

```bash
node companion/server.mjs
node companion/test-models.mjs
node companion/test-interactions.mjs
```

Open http://127.0.0.1:4173/companion/index.html after starting the server. The server binds only to localhost. Set PORT if the default is occupied.

The authoring helper **tools/build_course.py** uses Python 3.11+ and standard-library modules. It regenerates metadata, the hour ledger and HTML from the current **book.md**. The included **tools/rebuild_book.py** rebuilds the continuous book and presentations from the canonical chapters. Run from the extracted course folder:

```bash
python3 tools/rebuild_book.py
python3 tools/check_course.py
```

Browser automation was attempted but Chromium startup was blocked by an environment socket restriction. No visual browser inspection is claimed. The actual companion modules were executed with a deterministic DOM harness, which checks interaction logic without certifying browser layout or accessibility. The optional tools/browser_check.py provides the browser checks for an environment that supports Chromium; its optional Playwright pin is in tools/verification-requirements.txt. No ads, emails, public posts, selling-platform integrations, or live account UIs were executed. Exact model-token counts are unverified; the measured chapter-depth proxy is at least 5,000 whitespace-separated words.
