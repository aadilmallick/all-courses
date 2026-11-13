This book is for a developer who wants to understand and build modern AI features on the web without confusing a model, a runtime, a browser API, a protocol, and an application. We begin with text prediction and visible numerical examples, then build the surrounding TypeScript system one boundary at a time.

The first part develops model intuition, asynchronous application mechanics, and evidence retrieval. The second part studies application-managed local inference with WebLLM, browser-managed tasks with Chrome AI, and page operations exposed through WebMCP. The final part asks what evidence makes a system dependable and assembles a document-assistant capstone.

Basic variables, arrays, and functions are the only programming background assumed. Probability, vector similarity, workers, streams, and browser capability checks are introduced where needed. The aim is practical understanding, with enough mathematics to explain behavior and enough complete code to reproduce it. Frontier-model pretraining infrastructure and a production authentication service are outside this edition's implementation scope.

Every teaching example uses TypeScript. HTML, CSS, JSON configuration, and shell setup are identified as such. Intentional integration fragments say what surrounding environment they require. Complete source is included in the package and in the source appendix; optional model weights remain external. No private user or organization documents are used.

The companion is a local browser reader and experiment gallery. Its deterministic experiments work without a model download. Optional native, WebGPU, embedding and cloud paths report their real capability conditions. A transport fixture and scripted planner are explicitly labeled fixtures, so their success is never mistaken for model inference.

The research date is 13 November 2026. Browser APIs and model runtimes change quickly, and the source ledger records exactly which resources and sections were consulted. Read the API baseline for unstable details and the verification report for executed checks. A source being inspected, code compiling, and a model running are three different kinds of evidence.

Use the chapters in dependency order, or return to a specific chapter after the first pass. The curriculum offers a suggested pace and optional applications, not a gatekeeping progress system. You can read, run, modify, and compare at your own pace. The recurring question throughout is concrete: what does this component do, why does it work, and how would we know when it fails?
