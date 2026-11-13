# Verification record

Edition 13 November 2026. This record distinguishes the completed course from procedures the learner must still perform. Detailed check output is in the checks folder.

## Completed checks

| Evidence layer | What was checked | Result and limits |
| --- | --- | --- |
| Chapter depth | All ten canonical chapters counted, separately excluding fenced code | 55,136 whitespace words; 55,091 prose words. Every chapter exceeds the 5,000-word proxy. No model-token count is claimed. |
| Structural review | Dependency order, assigned topic coverage, worked examples, local Markdown links, balanced fences and 203 book anchors | Passed package checks and the Textbook Workshop final structural validator. The validator does not establish truth or learner mastery. |
| Independent editorial review | Shared idea score, economics categories, production-lab descriptions, time budgets and curriculum constraints | Mismatches identified and corrected before final checks; three independent reviewers contributed source and consistency review. |
| Arithmetic/model execution | Revenue, deductions, capacity, funnel denominators, storage and narration formulas, zero and invalid cases | 17 model assertions passed in Node. Synthetic examples are not empirical conversion forecasts. |
| Browser execution | All nine lab routes, live updates, reset, zero denominators, negative time saving, capacity overload, text-input escaping, book navigation, heading search, SVG loading and horizontal overflow | 40 assertions passed in Google Chrome through Playwright 1.62.1 at 1440×1000 and 390×844. Exact browser version is in checks/browser.json. |
| Visual inspection | Desktop book and full mobile funnel-lab screenshots | Personally inspected for readable hierarchy, controls, results and layout. Four screenshots are included; no claim of exhaustive accessibility or all-chapter visual review. |
| Schedule | Ninety unique actions, time pattern, lesson references, six planned upload days and optional date mapping | 109.5 total hours: six 17-hour cycles plus 7.5 hours consolidation. Baseline 8.5 hours/week; scope must shrink at an eight-hour commitment. |
| Portable archive | Required files, integrity, safe relative paths, extracted model execution and a clean extracted rebuild | Passed. Extracted book.md and book.html matched the authored package byte for byte after rebuilding with the included parser. A final archive inventory records file hashes. |

The initial browser check exposed a heading-search anchor lookup issue, which was corrected before the successful final run. The bundled automation browser executable was unavailable; the installed Google Chrome executable was used instead. No browser or editor was installed. Keyboard-native controls and focus styles are implemented, but a screen-reader audit was not performed.

The included HTML is the built reading edition; companion source is also its runnable output because no compilation is required. Both use local assets. The static book was rendered and inspected; a typeset PDF was not generated. The browser test is optional development evidence and requires Playwright plus an available browser; those test packages are not required to read the book or run the labs.

## Scope and provenance

Ten original substantial lessons, one continuous Markdown/HTML book, reusable templates,90daily actions and nine actual local practice experiments. Project source access and individual online-source access limits are recorded in research. Original project-generated sandbox downloads and project attachments were unavailable. No full creator video playback, private creator analytics or causal growth study was performed. Public page text, descriptions, indexes and first-person posts support bounded creator observations.

## What was not executed

OBS, Resolve, cameras, microphones, paid AI editors, vendor accounts, upload workflows, email delivery, checkouts and user products were not operated. The book teaches them through researched instructions and requires a small learner-side compatibility test. No channels, products or funnels were deployed and no messages were sent. No income outcome was tested or promised. The course is not a PDF edition.

## Depth method

No named model tokenizer was installed or found in the inspected bundled Python/Node runtimes. The curriculum therefore uses its conservative proxy: at least 5,000 whitespace-separated words per chapter. checks/depth.json reports that count and a separate prose count excluding fenced code. These are not token counts. Length is a structural check alongside review of prerequisite order, worked examples and practical applications.
