# Verification record

Checked November 13, 2026.

- 32 core chapters across four categories; every body passes 5,000 cl100k_base tokens using gpt-tokenizer 4.1.2.
- 164 distinct primary-source links recorded in the tool ledgers.
- Canonical source navigation and exported Markdown relative links pass.
- Production Astro Starlight build and Pagefind index pass.
- 24 JavaScript blocks pass syntax checking; five root offline cases execute with expected results. Category authors also executed their explicitly reported offline examples.
- Browser checks: light/dark appearance, category plus text filtering, empty-state reset, experience-level filter, 390×844 mobile reading layout, and production full-text search. Search for “barge” returned the matching Foundations section.
- Source review sampled six guides; E2B CSV and Vapi asynchronous-error findings were corrected before delivery.
- Curriculum ZIP inspected: exactly 32 numbered core guides, plus supporting materials and research records; no duplicate guide exports.

Exact body counts and links: verification.json. Root example output: offline-checks.json. Built asset/navigation check: built-link-checks.json. Editorial findings and resolutions: editorial-review.md.

Limits: Python examples were not executed. Paid services, live voice/audio, telephone calls, generated videos, remote agent accounts, and production integrations were not exercised. Browser QA verifies the guide website, not vendor account entitlements or service runtime behavior.
