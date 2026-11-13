# Verification report

Checked November 13, 2026. This report separates evidence layers; it does not certify consulting competence or production readiness.

## Content and depth

Four complete chapters contain **20,308 measured whitespace-separated words**, or **20,212 words outside fenced code** under the textbook validator's method. The word proxy is used because a model tokenizer was unavailable in the checked runtime; exact model-token counts were not verified. No unauthorized network call was used to obtain one.

| Chapter | Whitespace words | Words outside code fences |
|---|---:|---:|
| 1. Consulting foundations and your position | 5,051 | 5,051 |
| 2. Cloud-native, Kubernetes, and platforms | 5,091 | 5,008 |
| 3. AI workflows and evaluation | 5,139 | 5,126 |
| 4. High-value offers, sales, and delivery | 5,027 | 5,027 |

Teaching review checked the dependency order: consulting roles and evidence before technical recommendations; application paths before Kubernetes mechanisms; labels and denominators before AI metrics; scope and economics before high-ticket sales. Worked examples show intermediate arithmetic, assumptions, common failure interpretations, and limits. The service recommendation is tied to the supplied resume without inventing current employment, buyer relationships, consulting results, or certifications.

## Structure and assembly

- The supplied Textbook Workshop validator was run in final mode: four complete chapters, all above the authored 4,500-prose-word target, and no reported errors.
- Additional checks verify the 5,000-word-per-chapter proxy, local chapter links and research anchors, unique HTML IDs, internal HTML links, balanced fences, declared source/assets, and preservation of substantial canonical paragraphs in the single volume.
- An exact-match check found no repeated substantive chapter paragraph. This is not a semantic originality guarantee.
- The actual embedded lab equals the generated standalone HTML source. Its script is generated from the canonical core, fixture, UI, and host source; it is not a prerecorded result or screenshot.
- The original SVG diagram parsed successfully and is embedded into the HTML book.

## Executed numerical and code checks

`python examples/evaluate_workflow.py --self-test` passed **five test methods** covering the default outcome, a higher-threshold counterexample, permission/schema gates and boundary scores, empty acceptance, and invalid inputs.

`node companion/check.mjs` passed **nine test groups** covering:

1. The $34,560 gross, $13,824 realized, and $12,024 net annual customer-value example.
2. No positive payback when annual modeled value is nonpositive.
3. The 43.2-minute error budget, 25.2-minute remainder, and negative exceeded-budget case.
4. Readiness totals that cannot override a failed production discussion gate.
5. Default synthetic evaluation and the 25.5-minute candidate-effort example.
6. Threshold boundaries, invalid categories, denied actions, and undefined precision/coverage.
7. $112 contribution per total hour, twelve delivery weeks at the modeled capacity, and a one-win arithmetic pipeline scenario.
8. Invalid numeric ranges and contradictory inputs.
9. Python/JavaScript agreement across **101 score thresholds** on accepted, correct, wrong, review, precision, and coverage outputs.

The documented threshold commands were run. At 0.80, six of twelve cases are accepted, five correctly, with six routed to review. At 0.95, three are accepted, two correctly, with nine routed to review. These are synthetic stored candidate outputs, not model measurements.

Node syntax checks passed for every companion module and the fully inlined bundle. Python example parsing/execution passed. The YAML was parsed with PyYAML 6.0.3 in the authoring environment; resource kinds, matching selectors, and named-port references were checked. That authoring check is not a learner runtime dependency and is not a Kubernetes schema or admission check.

## Local serving

The documented Python HTTP server was started from the package root and then stopped. Requests for the companion entry, core module, UI module, standalone lab, fixture JSON, and textbook returned HTTP 200 with appropriate content types. This proves file serving, not browser execution.

## Runtime record

Executed with Python 3.12.14 and Node.js 24.22.1. Pandoc assembled the HTML reading edition with embedded CSS and SVG. Learner examples use standard libraries and native browser features; no provider SDK, external model, npm package, API key, or paid service is required. The sample workload references `nginx:1.28.0`; the artifact was not pulled, digest-pinned, or security-reviewed.

## Explicit limitations

No cloud browser was available. Desktop/mobile visual inspection, DOM control interaction, screen-reader testing, iframe execution in the user's browser, and cross-browser verification were **not performed**. The controls and reset implementation are complete source, while their browser behavior remains unverified. Numerical execution and syntax checks do not replace that evidence.

No Kubernetes cluster, Docker, kubectl, cloud account, production application, external model, retrieval service, or customer data was used. No image, rollout, live authorization policy, provider integration, or deployment recovery was executed. The configuration is an educational example, not a production baseline.

No buyers were contacted and no commercial demand or quoted market rate was established. Prices, pipeline shares, readiness scores, and savings models are experiments or reflection aids. No legal agreement, tax advice, security audit, official certification, or financial return is implied.

Archive integrity, required inventory, path safety, and content hashes are checked during final packaging. The generated SHA-256 manifest excludes itself and records the intended package files.
