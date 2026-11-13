# Authoring brief and conventions

Audience: developer with basic variables, arrays and functions; no assumed calculus, browser AI knowledge or async TypeScript. Target: practical LLM/web-AI engineering and a reviewable document assistant. Requested sources: WebMCP, WebLLM, Chrome AI documentation and the Chrome AI hub. Deliverables: eight numbered full lessons, course guide, continuous Markdown textbook, TypeScript companion/examples, diagrams, research/provenance, build, tests, report and ZIP.

Teaching order follows the dependency graph in CURRICULUM.md. One central problem per chapter; concepts precede the APIs that require them. Worked examples are explained and connected to actual source. Practice is optional. No mandatory quizzes, progress tracker or account system is introduced.

Vectors are ordinary number arrays; dimensions are checked. Probabilities are unitless. Memory uses GiB and explicitly lower-bound formulas. Durations use milliseconds. Text string indices are distinguished from model tokens and UTF-8 bytes. Dataset and examples are synthetic. Complete source is canonical in src/examples; the book appendix is generated from it.

The local browser environment is Vite plus a separate loopback Node example server for fixture/cloud routes. The course does not publish a Site. Browser-native APIs and external models are optional and capability-dependent. Fixtures are labeled as fixtures. Research and execution claims are kept separate.
