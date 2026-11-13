# Verification report

Edition: November 13, 2026. Status: content and package checks completed; browser rendering and interaction remain unverified.

## Content and depth

Six prerequisite-ordered chapters contain **30,526 whitespace-separated prose words** in the structural validator's definition. Individual counts: 5,153; 5,023; 5,158; 5,075; 5,083; 5,034. This is a measured word-count proxy, not a model-token count. A model tokenizer was not installed in the permitted runtime. Every chapter exceeds the documented 5,000-word proxy target.

The course includes a 180-hour optional practice plan, three capstone paths, worked scripts, recording/editing guidance, original funnel examples, a landing-page draft, a five-message email sequence, six editable worksheets, a tool-selection guide, 39 source entries with access states, and one exact route diagram. The coverage matrix maps the requested topics to their teaching and evidence.

Teaching review checked prerequisite order, recurring-example consistency, relevant limitations, hypothetical versus documented cases, observation versus inference, and separation of native Shop from external checkout. No private context document, copyrighted course book, or full web extraction is distributed.

## Executed checks

- Final-mode textbook structural validator: passed; six complete chapters; no missing assets, source modules, declared experiments, or book links; all authored minimum word targets met.
- Markdown link/fence check across the package: passed; local targets resolve and code fences are balanced.
- Node.js syntax checks for application modules, build script, and generated inline scripts: passed.
- **Twelve numerical/logic tests passed** in Node.js 24.22.1: script timing, invalid speaking rate, ebook contribution, affiliate reversals, zero traffic, invalid rates/costs, Wilson boundaries, impossible counts, zero/full churn, finite geometric-sum agreement, URL encoding/preservation, and prohibited URL forms.
- Generated reader and workbook HTML parsed; local anchors, embedded SVG, embedded workbook and absence of remote runtime script/style dependencies checked statically.
- Documented local server started successfully and served the generated textbook and workbook. This verifies serving, not visual layout or control behavior.
- ZIP inventory, safe relative paths, required files, CRC integrity and source hashes checked during packaging. Final archive evidence is in verification-results.json and its archive report.

## Numerical reference results

The ebook scenario produces 1,000 visits, 400 leads, 20 initial orders, $580 gross revenue, $551 after the modeled refund, $23.40 modeled payment fees, and **$347.60 contribution** after all entered costs. Fees are hypothetical. The affiliate scenario produces 8 initial orders, $43.20 retained commission, and $13.20 contribution after $30 entered cost. The twelve-month SaaS scenario yields approximately **$88.25** per initial paid customer under its stated constant assumptions; zero churn yields $115.20 and full later-month churn yields $9.60.

## Unverified or limited

Browser testing was attempted with Playwright. Its default browser binary was absent. The installed Chromium failed before page loading because its process-singleton socket was denied by the environment. A standard alternate launch also failed. Consequently no screenshots, desktop/mobile visual inspection, keyboard interaction, actual reset behavior, iframe runtime interaction, or file:// execution is claimed verified. The responsive styles and controls are implemented and syntax checked, but require a real browser review.

The named editing tools, AI services, Shopify admin, payment provider, live affiliate programs, TikTok and YouTube accounts were not operated. No real video was produced, transaction completed, ad run, or revenue generated. Training indexes were inspected without claiming their full videos/PDFs were consumed. Some source text was available through official search renderings while direct pages returned shells. TikTok's direct AI-label page remained unavailable. External links were inspected during research but future availability is not guaranteed.

The HTML editions are standalone artifacts, not hosted publications. The original SVG is exact authored structure and has not been visually inspected in a browser. This package does not include a typeset PDF or claim a complete legal/tax audit.

## Reproduce

From the extracted project folder, run `node companion/tests.mjs` for the tests and `node companion/server.mjs` for the reader. Open the printed local URL in a browser, try all six experiments, reset each, test invalid fields, and inspect a narrow phone-sized layout. The HTML files can also be opened directly; that path is designed but was not executable in this environment's browser.
