# Research references and provenance

Checked **November 13, 2026**. These are primary sources and user-supplied personal evidence. The explanations, numerical scenarios, templates, code, and diagrams are original teaching material. Provider documentation establishes described mechanisms or features; it does not establish market demand, consulting rates, personal qualification, or business outcomes.

Most large documentation pages were **partially inspected** through relevant retrieved sections and search extracts. This is not a claim to have read every page, linked paper, or full documentation corpus. Version-sensitive production work must use the actual customer's versions and provider terms.

<a id="cncf"></a>

## CNCF · CNCF Platform Engineering Maturity Model

[CNCF Platform Engineering Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/) — CNCF TAG App Delivery. Access: **partially-inspected**. Used for: Platform user needs, interfaces, and deliberate maturity. Chapter(s): 01,02. Official page and relevant search extracts; not every linked white paper inspected.

<a id="k1"></a>

## K1 · Kubernetes Deployments

[Kubernetes Deployments](https://kubernetes.io/docs/concepts/workloads/controllers/deployment/) — Kubernetes project. Access: **partially-inspected**. Used for: Desired state, replicas, selectors, rollout scope. Chapter(s): 02. Live documentation; no claim that the example was run on its current default Kubernetes version.

<a id="k2"></a>

## K2 · Kubernetes Service

[Kubernetes Service](https://kubernetes.io/docs/concepts/services-networking/service/) — Kubernetes project. Access: **partially-inspected**. Used for: Service selectors and traffic abstraction. Chapter(s): 02. Current documentation extracts; no live cluster verification.

<a id="k3"></a>

## K3 · Resource Management for Pods and Containers

[Resource Management for Pods and Containers](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) — Kubernetes project. Access: **partially-inspected**. Used for: Requests, limits, CPU and memory distinctions. Chapter(s): 02. Core concepts used; no newer feature-gated API assumed.

<a id="k4"></a>

## K4 · Liveness, Readiness, and Startup Probes

[Liveness, Readiness, and Startup Probes](https://kubernetes.io/docs/concepts/workloads/pods/probes/) — Kubernetes project. Access: **partially-inspected**. Used for: Different health questions and startup behavior. Chapter(s): 02. Concept page and official task examples inspected through retrieved excerpts.

<a id="k5"></a>

## K5 · Cluster Networking

[Cluster Networking](https://kubernetes.io/docs/concepts/cluster-administration/networking/) — Kubernetes project. Access: **partially-inspected**. Used for: Traffic path and implementation boundaries. Chapter(s): 02. No provider-specific network enforcement tested.

<a id="k6"></a>

## K6 · Persistent Volumes

[Persistent Volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) — Kubernetes project. Access: **partially-inspected**. Used for: Persistence versus application recovery responsibility. Chapter(s): 02. Not a storage migration or backup implementation guide.

<a id="k7"></a>

## K7 · Horizontal Pod Autoscaling

[Horizontal Pod Autoscaling](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/) — Kubernetes project. Access: **partially-inspected**. Used for: Feedback loop, metric dependencies, simplified proportional example. Chapter(s): 02. Task URL redirected to the current concept page; simplified example is not exact controller prediction.

<a id="k8"></a>

## K8 · Disruptions

[Disruptions](https://kubernetes.io/docs/concepts/workloads/pods/disruptions/) — Kubernetes project. Access: **partially-inspected**. Used for: Voluntary disruption budgets and limits. Chapter(s): 02. PDB not presented as protection from every outage or all Deployment updates.

<a id="rbac"></a>

## RBAC · Role Based Access Control Good Practices

[Role Based Access Control Good Practices](https://kubernetes.io/docs/concepts/security/rbac-good-practices/) — Kubernetes project. Access: **partially-inspected**. Used for: Least privilege for an agreed investigation. Chapter(s): 02. No customer authorization configuration was audited.

<a id="obs"></a>

## OBS · OpenTelemetry signals

[OpenTelemetry signals](https://opentelemetry.io/docs/concepts/signals/) — OpenTelemetry project. Access: **partially-inspected**. Used for: Metrics, logs, traces and operational questions. Chapter(s): 02. No SDK integration or exporter executed.

<a id="sre"></a>

## SRE · Implementing SLOs

[Implementing SLOs](https://sre.google/workbook/implementing-slos/) — Google SRE. Access: **partially-inspected**. Used for: SLI, SLO, budget meaning and ownership. Chapter(s): 02. Original numerical time-budget examples; no SLA interpretation.

<a id="sre-policy"></a>

## SRE-POLICY · Example Error Budget Policy

[Example Error Budget Policy](https://sre.google/workbook/error-budget-policy/) — Google SRE. Access: **partially-inspected**. Used for: Policy as an agreed decision process. Chapter(s): 02. Google's example policy is not prescribed universally.

<a id="fin"></a>

## FIN · Unit Economics

[Unit Economics](https://www.finops.org/framework/capabilities/unit-economics/) — FinOps Foundation. Access: **partially-inspected**. Used for: Cost per useful unit and allocation context. Chapter(s): 02. Original hypothetical report-cost example, not actual customer bill analysis.

<a id="aws"></a>

## AWS · AWS Well-Architected Framework

[AWS Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) — Amazon Web Services. Access: **inspected**. Used for: Architecture review as a constructive tradeoff conversation. Chapter(s): 02. Short introduction retrieved; displayed publication date November 6, 2024. Not an official partner or assurance claim.

<a id="cdk"></a>

## CDK · Testing AWS CDK applications

[Testing AWS CDK applications](https://docs.aws.amazon.com/cdk/v2/guide/testing.html) — Amazon Web Services. Access: **partially-inspected**. Used for: Configuration assertions versus live application verification. Chapter(s): 02. CDK v2 documentation; no SDK example or deployment executed.

<a id="gitops"></a>

## GITOPS · Automated Sync Policy

[Automated Sync Policy](https://argo-cd.readthedocs.io/en/stable/user-guide/auto_sync/) — Argo CD project. Access: **partially-inspected**. Used for: Automatic sync, pruning, and self-healing as choices. Chapter(s): 02. Stable documentation route, no installed Argo CD version assumed.

<a id="dora"></a>

## DORA · Software delivery performance metrics

[Software delivery performance metrics](https://dora.dev/guides/dora-metrics/) — DORA / Nathen Harvey. Access: **partially-inspected**. Used for: Current five-metric framing and measurement context. Chapter(s): 02. Do not treat local illustrative release definitions as the official full metric set.

<a id="agents"></a>

## AGENTS · Building effective agents

[Building effective agents](https://www.anthropic.com/research/building-effective-agents) — Anthropic. Access: **partially-inspected**. Used for: Workflows versus greater model discretion; proportional complexity. Chapter(s): 03. Conceptual guidance; no measured productivity claim adopted.

<a id="eval"></a>

## EVAL · LangSmith evaluation

[LangSmith evaluation](https://www.langchain.com/langsmith/evaluation) — LangChain. Access: **partially-inspected**. Used for: Datasets, experiments, and evaluator types. Chapter(s): 03. Provider capabilities, not evidence of independent effectiveness; no plan or SDK access assumed.

<a id="owasp"></a>

## OWASP · Prompt Injection detailed page

[Prompt Injection detailed page](https://genai.owasp.org/llmrisk/llm01-prompt-injection/) — OWASP GenAI Security Project. Access: **partially-inspected**. Used for: Input-based behavior manipulation and authority boundaries. Chapter(s): 03. Retrieved detailed page is labeled 2025; retained as a versioned source, not the latest release by implication.

<a id="owasp-index"></a>

## OWASP-INDEX · LLM Top 10 official repository

[LLM Top 10 official repository](https://github.com/GenAI-Security-Project/GenAI-LLM-Top10/blob/main/README.md) — OWASP GenAI Security Project. Access: **partially-inspected**. Used for: Release and risk taxonomy context. Chapter(s): 03. Official index reported a 2026 release; risk names are used without assuming stable numbering across editions.

<a id="owasp-agency"></a>

## OWASP-AGENCY · Excessive Agency historical guidance

[Excessive Agency historical guidance](https://genai.owasp.org/llmrisk/llm062025-excessive-agency/?lang=us) — OWASP GenAI Security Project. Access: **partially-inspected**. Used for: Capabilities, permissions, and autonomy. Chapter(s): 03. 2025 detailed guidance; cross-checked against the current official index.

<a id="state"></a>

## STATE · LangGraph Persistence

[LangGraph Persistence](https://docs.langchain.com/oss/python/langgraph/persistence) — LangChain. Access: **partially-inspected**. Used for: Checkpointed state, stores, and continuation. Chapter(s): 03. Durable-execution URL redirected; no SDK version-specific code is provided.

<a id="outreach"></a>

## OUTREACH · CAN-SPAM Act business compliance guide

[CAN-SPAM Act business compliance guide](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business) — US Federal Trade Commission. Access: **inspected**. Used for: US commercial email basics, including B2B applicability. Chapter(s): 04. Actual rules depend on message, jurisdiction, and channel; no international clearance.

<a id="eks-limit"></a>

## EKS-LIMIT · Amazon EKS best-practices landing page

[Amazon EKS best-practices landing page](https://docs.aws.amazon.com/eks/latest/best-practices/) — Amazon Web Services. Access: **unavailable**. Used for: Research limit only. Chapter(s): 02. Page returned no readable lines. Not used as evidence for a version-specific EKS claim.

## Personalization and original assumptions

The attached resume and project context were inspected directly. Reported work at Unison, HHMI, Two Six Technologies, and the W&M AI Lab supports relevant experience, not an assertion of current employment, sole ownership, customer endorsement, or consulting revenue. Your stated interests in freelancing and teaching inform the service design. BetterCare Meals supports web implementation experience; it is not used as Kubernetes or AI advisory proof.

All consulting prices, business-case inputs, and pipeline shares are proposed experiments or hypothetical arithmetic. No market-rate survey, buyer interviews, production inspection, or outreach was performed. Harbor Software and the routing fixture are fictional. No official certification, cloud partner status, security assurance, or financial return is claimed.

## Coverage map

| Concept family | Prerequisite | Teaching | Executable evidence |
|---|---|---|---|
| Consulting judgment and evidence | Basic software project experience | Chapter 1, decision diagram, kit | Readiness worksheet logic and gate checks |
| Customer value and scope | Units, assumptions, basic arithmetic | Chapters 1 and 4 | Value and commercial calculators |
| Cloud-native operating decisions | Application path, ownership, containers | Chapter 2 | Reliability model; workload YAML statically parsed only |
| AI workflow decisions | Baselines, labels, action boundary | Chapter 3 | Python evaluator and matching JavaScript policy over synthetic cases |
| Premium service sales and delivery | A credible offer and buyer problem | Chapter 4 and kit | Capacity and pipeline scenarios; no real sales prediction |

## Redistribution and limits

No private attachments, employer code, third-party page extracts, credentials, provider SDKs, or customer records are included. The small Kubernetes example is original configuration referencing a historical image tag; no container image is redistributed or verified. The source ledger records a non-readable EKS landing page and the different OWASP edition labels. Framework descriptions are conceptual; no provider API compatibility is claimed from the dependency-free local examples.

