This is a practical, first-principles textbook for a developer who wants to understand voice agents well enough to build, debug, and evaluate one. It assumes basic programming, then teaches audio, asynchronous streams, browser media, model protocols, tools, and interaction design in dependency order. Python and TypeScript examples share the same underlying contracts.

Read chapters in order for the complete course. Each chapter is also a standalone Markdown lesson. The curriculum in `CURRICULUM.md` maps outcomes, prerequisites, examples, and experiments. Practice projects are optional; there are no quiz gates. All referenced application data is synthetic.

Parts I–II establish the signal and software boundaries, then build both cascaded and native audio paths. Part III examines speech platforms and self-hosted models. Part IV connects timing, trustworthy actions, accessible UX, and production evidence. These parts deliberately reuse Harbor, a fictional appointment assistant, so each new responsibility extends a familiar problem.

The local companion runs eight deterministic experiments without microphone access or provider accounts. Separate network examples require credentials and can incur charges. Provider interfaces were researched against primary documentation on November 12, 2026; live paid calls and model inference were not executed. Read `verification.md` for the evidence and limits.

Units are explicit: milliseconds for application timing, hertz for sample rates, mono signed little-endian PCM16 when stated, and opaque identifiers for sessions and operations. An integration fragment is labeled as such. A simulator is never presented as a model benchmark. A capstone project is guidance for extending the package, not a claim of a provisioned production service.
