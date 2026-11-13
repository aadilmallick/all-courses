# From Engineer to Consultant

**Aadil's practical textbook for cloud-native, Kubernetes, and AI workflow consulting**

Read the single-volume **[book.md](book.md)** or open **[From-Engineer-to-Consultant.html](From-Engineer-to-Consultant.html)**. The HTML edition includes the complete book and an embedded offline Consulting Decision Lab. No accounts, API keys, model calls, or paid services are required.

## Learning sequence

| Part | Chapter | Ability developed | Evidence to produce |
|---|---|---|---|
| I · Consulting foundations | [1. Your role and position](chapters/01-consulting-foundations-and-your-position.md) | Diagnose a decision, distinguish evidence from claims, and define your responsibility | A one-page diagnostic offer and evidence record |
| II · Cloud-native practice | [2. Cloud, Kubernetes, and platforms](chapters/02-cloud-native-kubernetes-and-platform-consulting.md) | Explain operating mechanisms and connect findings to a useful change | A workflow map, controlled demonstration, and recommendation |
| III · AI workflow practice | [3. Evaluation before automation](chapters/03-ai-workflow-consulting-and-evaluation.md) | Compare baselines, interpret results, and define permitted actions | An evaluator, error analysis, and go/no-go memo |
| IV · Commercial delivery | [4. High-value offers and sales](chapters/04-high-value-offers-sales-and-delivery.md) | Package, price, sell, and deliver a bounded engagement | A proposal, capacity plan, and buyer test |

Use [consulting-kit.md](consulting-kit.md) for editable assets, [references.md](references.md) for research and access limits, and [verification.md](verification.md) for actual checks and limitations. `book.json` maps prerequisites and experiments; `sources.json` records provenance and coverage. Four substantial chapters exceed 5,000 measured whitespace-separated words each. No model tokenizer was available; exact token counts were not verified.

## The recommendation for you

Start with a **Cloud Delivery Diagnostic**, testing a provisional **$1,500–$3,000** scope only where the buyer's need and your delivery economics support it. Build proof around reproducible setup, release verification, and clear handover. Grow toward implementation sprints, AI workflow evaluation, and broader platform work with relevant evidence and partnerships. Prices are hypotheses, not market rates or promised earnings.

## Run the companion and examples

The easiest offline route is to open the single HTML textbook and expand **Consulting Decision Lab**. Its controls execute local JavaScript and have per-experiment reset buttons and visible source.

For the separate module-based companion, use Python 3.10+ from the extracted package root:

```bash
python -m http.server 8765 --bind 127.0.0.1
```

Open `http://127.0.0.1:8765/companion/` in your browser, then stop the server with Ctrl+C when finished. This is a local static file server, not a hosted publication. A standalone `file://` opening of `companion/index.html` may block module loading; use the HTTP command or the embedded lab instead.

Python evaluation examples:

```bash
python examples/evaluate_workflow.py --threshold 0.80
python examples/evaluate_workflow.py --threshold 0.95
python examples/evaluate_workflow.py --self-test
```

Numerical and cross-language checks with Node.js 20+ and `python3` on PATH:

```bash
node companion/check.mjs
```

The default synthetic evaluation accepts six of twelve cases, five correctly, and routes six to review. At 0.95 it accepts three, two correctly. These are stored teaching outputs, not a model benchmark. The sample YAML is in `examples/workload.yaml`; it was parsed and structurally checked, not applied to a cluster. No Docker or kubectl runtime was available.

## Reproducibility and boundaries

Runtime verification used Python 3.12.14, Node.js 24.22.1, and Pandoc for HTML assembly. The learner's examples and companion use standard libraries only. No third-party runtime packages or lockfiles are needed. The YAML names a historical image tag; no image digest or vulnerability state was verified, and it is not a production baseline. Match actual cluster documentation and reviewed artifacts for a real engagement.

Browser visual and DOM-control testing were unavailable. Numerical algorithms, the Python evaluator, cross-language policy agreement, source syntax, links, assembly, and archive integrity were checked as recorded in the report. Do not interpret those checks as a production, legal, security, or consulting qualification.
