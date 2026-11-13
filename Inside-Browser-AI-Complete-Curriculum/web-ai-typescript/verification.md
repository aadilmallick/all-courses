# Verification report

Edition: 13 November 2026. This report distinguishes deterministic software checks, observed browser behavior and optional external model execution. No generated answer is certified as factually correct by these checks.

## Environment and executed software checks

- Windows authoring workspace; Node 26.7.0, npm 11.19.0; TypeScript 5.9.3 and Vite 8.3.8. The documented Node 22.18 minimum was not separately exercised.
- Pinned dependencies installed successfully; lockfile included. TypeScript checking and Vite production build succeeded. The build reports large optional runtime/WASM chunks; no error. These are meaningful download costs even before optional weights.
- All 17 deterministic Node tests passed, covering numerical invariants, permissions, parser boundaries, routing and bounded agent dispatch.
- Foundations, bigram training, quantization and scripted-planner examples executed with the numerical outputs taught in the chapters.
- `npm run verify` measured every chapter with `gpt-tokenizer 4.1.2`, `cl100k_base`: 5,003–5,055 tokens each, 40,175 total chapter tokens. Prose measurement outside code fences: 30,349 words total. See depth-and-links.json for each file and scope. The encoding measures editorial length, not a chosen inference model's context.
- Local Markdown links, balanced fences, unique book anchors and referenced assets checked. The independent Textbook Workshop validator ran in final mode with no errors; it confirmed all eight substantial chapters and the companion catalog. It is a structural check, not a model or mathematical proof.
- Dependency notice collection preserved 71 installed license/notice texts in THIRD-PARTY-NOTICES.md. External model weights, source papers and full web-document extracts are excluded.

## Observed browser behavior

Tested through the in-app browser against the development application and the built production preview. Browser engine build/version was not separately captured, so these are observations of this environment rather than universal Chrome compatibility claims.

| Area | Observed result |
| --- | --- |
| Numerical lab | Default softmax/attention values matched the chapter; zero temperature produced an explicit RangeError; reset restored the view |
| Routing and transport | Sensitive+cloud selection returned unavailable; streamed fixture completed as `Transport fixture: café. No model ran.` |
| Retrieval | Default question returned public evidence; query for private fixture code returned an empty array |
| WebLLM boundary | Installed catalog populated with 165 entries; memory result was 1.3969838619 GiB weights and 0.4375 GiB KV; no model was loaded |
| Native AI diagnostics | LanguageModel and Summarizer reported unavailable; Translator and LanguageDetector downloadable; Writer/Rewriter/Proofreader absent |
| WebMCP imperative | Registration succeeded; native discovery/execution returned public notes; browser-agent WebMCP bridge invoked the registered tool with a synthetic query and returned S3 |
| WebMCP lifecycle | Reset removed registration; subsequent bridge discovery reported no tools |
| Declarative form | Ordinary human submission returned the expected S3 note; an agent-invoked declarative submission was not tested |
| Evaluation lab | Four deterministic retrieval cases passed, accuracy 1 on this tiny fixture; no statistical model-quality claim |
| Capstone | Evidence prompt displayed; no-consent cloud action was blocked; an unrelated question abstained before native generation |
| Reader/source | All eight chapter views available; research panel showed four documents and source panel twelve listings; architecture SVG loaded |
| Production preview | Built reader and numerical/evaluation controls worked; captured error log was empty at the inspected point |
| Responsive layout | Desktop screenshot inspected; narrow requested viewport 390×844 produced 375 CSS-pixel content width. A discovered whole-page overflow was fixed; page and viewport widths then matched at 375. Numerical controls also remained within the page |

Navigation, reset, invalid input and unavailable states were exercised without private input or model downloads. The local fixture server was tested only as a loopback teaching service. Production preview does not include the dev API proxy.

## Material limits

No real WebLLM model, embedding model, native Chrome model or paid cloud provider inference was run. No model-quality benchmark, adversarial LLM study, cross-browser GPU matrix, full accessibility audit, multimodal inference, cross-origin WebMCP flow or autonomous LLM planning was executed. Those require appropriate models, supported environments, separate evaluation and sometimes account credentials.

No trial was registered, browser flag changed, hosted site published or external account mutated. The WebMCP tests used a synthetic read-only course search. No consequential action tool exists in the delivered app.

The package includes source and build, but not node_modules or external weights. A clean-machine `npm ci`, exact future external model revisions and all supported OS/browser combinations were not independently tested. Model repositories, native browser-managed models and provider availability can change. The minimum Node version is documented rather than cross-version certified.

Markdown was visually inspected through the bundled reader, including code styling and an SVG; no PDF was requested or generated. The assembled volume's section navigation was checked structurally. Its complete source listings retain their original module context. Archive integrity/inventory checks are recorded in the companion archive-verification JSON next to the ZIP.
