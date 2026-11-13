# 2. Cloud-native and Kubernetes consulting that solves a real problem

[Previous: consulting foundations](01-consulting-foundations-and-your-position.md) · [Contents](../README.md) · [Next: AI workflows](03-ai-workflow-consulting-and-evaluation.md)

## Start with the application and its owner

Harbor Software has a web application and a background worker. Releases sometimes need intervention, and the team is considering moving more infrastructure into Kubernetes. Before discussing a cluster, draw the actual work: a user makes a request, the application reads or writes data, a job may run later, and an operator must know when something fails. This view keeps the consulting problem connected to users and ownership. A cluster is an operating mechanism, not the customer's goal.

Cloud-native computing generally refers to building and operating systems using practices suited to dynamic, automated environments: packaged workloads, declarative configuration, observable behavior, and repeatable delivery. It is not synonymous with Kubernetes. A managed application platform, container service, or serverless workflow can support similar goals with different tradeoffs. Your first recommendation may be to improve the existing delivery process rather than introduce an orchestration system. The appropriate choice depends on workload needs, team capability, and operational responsibility.

This chapter teaches the concepts you need to reason about a bounded cloud delivery review. It is not a claim that a chapter replaces the experience required to own a production platform. Your resume gives you a useful base in AWS CDK, containers, monitoring, tests, and deployments. We will turn that base into a consulting method, then identify which Kubernetes promises need additional demonstration or an experienced partner. The distinction helps you sell useful work now while developing deeper capability deliberately.

## Build a system map before a tool inventory

A system map identifies users, workloads, dependencies, data stores, trust boundaries, and operators. A tool inventory only lists products. Both can be useful, but the map explains why a failure matters. At Harbor, a public request reaches an application, the application writes an order, and a background worker generates a report. The worker depends on a queue and database. A developer deploys code through an automated workflow. The engineering lead is accountable when the report does not arrive.

Ask where the application runs, how traffic reaches it, where state lives, how configuration is supplied, and what happens during a release. Then ask who can change each part. A managed database may reduce some operational tasks while leaving schema changes, access rules, and restore decisions with the team. A managed cluster may operate the control plane while the customer still owns application behavior and many configuration decisions. “Managed” is not a complete responsibility model.

For a diagnostic, a simple table can record each component, owner, purpose, evidence source, and known uncertainty. Mark a dependency as unknown when the team cannot explain it. Do not fill gaps with assumptions from a familiar stack. The map becomes a guide to investigation: a missing owner may be more urgent than a missing tool, and an undocumented manual step may explain failures better than the architecture diagram's complexity.

## Understand containers in practical terms

An image packages an application and the files it needs in a defined format. A container is a running instance using operating-system isolation features. This is useful because the same image can move through development, testing, and deployment without rebuilding the application's environment manually at every step. It does not make configuration, networking, storage, or permissions disappear. Those remain part of the system and often explain why something works locally but fails after deployment.

For consulting, inspect the path from source to artifact. How is the image built? Which dependencies are resolved during the build? How is the resulting artifact identified? Does staging run the same artifact that is promoted to production? A mutable tag can point to different content over time, so an image name alone may not identify the exact software that was tested. A real delivery process should record the artifact identity and promotion behavior, not merely say “we use Docker.”

Developer environments are adjacent but different. A devcontainer can make local tooling more reproducible, while a production image may have a different purpose and permissions. Your experience improving setup can support a concrete service: reproduce a new developer's path, identify missing prerequisites, and verify a documented setup. Do not claim that containerizing the repository automatically makes its production behavior reliable. Test the actual workflow and explain which boundary the improvement addresses.

## Understand Kubernetes as a reconciliation system

Kubernetes lets you describe desired workload state and uses controllers to reconcile observed state toward it. A Pod is a unit in which one or more containers share certain execution context. A Deployment manages a replicated application through controllers and rollout behavior. A scheduler places Pods on suitable nodes. These mechanisms can replace failed instances and coordinate updates, but they do not know whether your business transaction is correct. Application semantics still require application design and verification. [K1](../references.md#k1)

At Harbor, declaring two application replicas means the platform should try to maintain two eligible instances under the defined conditions. It does not mean the replicas are on independent failure domains, that the database is healthy, or that a request cannot fail during an update. The consultant's job is to connect the declaration to actual placement, traffic, dependencies, and failure handling. A count of replicas is evidence about one part of the system, not a complete availability argument.

A useful diagnostic question is, “What happens when this instance disappears?” Trace whether the request can retry safely, whether another instance can serve it, and whether important data lives outside the replaced container. This question reveals the limits of infrastructure automation. Restarting a process can recover a crashed worker; it can also repeat a side effect unless the application handles duplicates. The platform's recovery action and the business's recovery requirement are related but distinct.

## Read a minimal workload without pretending it is production ready

The included `examples/workload.yaml` defines a namespace, a two-replica Deployment, and an internal Service. It uses the historical `nginx:1.28.0` tag only as a small HTTP example. No image was pulled or vulnerability-verified here. Before real deployment, use a reviewed artifact and record its immutable identity. The sample is a teaching configuration, not a security baseline or an instruction to apply it to a customer cluster.

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: consulting-lab
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sample-web
  namespace: consulting-lab
spec:
  replicas: 2
  selector:
    matchLabels:
      app: sample-web
  template:
    metadata:
      labels:
        app: sample-web
    spec:
      containers:
        - name: web
          image: nginx:1.28.0
          ports:
            - name: http
              containerPort: 80
          resources:
            requests:
              cpu: 100m
              memory: 64Mi
            limits:
              cpu: 500m
              memory: 128Mi
          readinessProbe:
            httpGet:
              path: /
              port: http
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: sample-web
  namespace: consulting-lab
spec:
  selector:
    app: sample-web
  ports:
    - port: 80
      targetPort: http
```

Read it from the outside inward. The namespace groups the example's namespaced resources. The Deployment requests two replicas. Its selector matches the label on its Pod template, which is how the controller identifies the relevant application instances. The container declares an HTTP port name, and both the readiness check and Service refer to that port. The Service selector also uses the application label, connecting traffic routing to the intended Pods. A mismatch between these labels can leave a running workload unreachable through the intended route. [K1](../references.md#k1), [K2](../references.md#k2)

The YAML is complete as a small workload example but intentionally omits many production decisions: external traffic, TLS, authentication, network policy, image hardening, disruption settings, scheduling across failure domains, persistent state, and observability. Omissions are not recommendations to ignore them. They keep the example focused on the relationship between desired replicas, labels, readiness, and a stable internal endpoint. The deliverable includes a static YAML check; no cluster execution or rollout was performed in this environment.

## Explain requests and limits through a capacity example

A resource request informs scheduling and resource allocation behavior. A resource limit constrains use according to the resource and runtime behavior. CPU quantities such as `100m` mean one tenth of a CPU unit. Memory quantities such as `64Mi` use binary units. CPU limits can throttle execution; exceeding a memory limit can result in termination. These are different failure modes, so a generic recommendation to “add limits” is not enough. Inspect workload behavior and service goals. [K3](../references.md#k3)

Suppose a node has four CPU units available for application scheduling after reservations, and each application Pod requests half a unit. In a deliberately simplified CPU-only model, eight such Pods fit. Real placement also depends on memory, existing workloads, affinity, topology, other constraints, and overhead. If the request is far below normal use, the arithmetic may permit dense placement that performs poorly under load. If it is much too high, capacity may sit unavailable for other work. The correct value requires measurement and operating judgment.

A consulting finding should connect the setting to evidence. “The deployment requests half a CPU per replica; observed steady-state use in the supplied interval is substantially lower, but the sample lacks peak traffic” is careful. “Cut the request by eighty percent and save eighty percent of the bill” is not. Pod requests, node capacity, scaling, pricing commitments, and shared overhead interact. First identify the optimization mechanism and verify that the proposed change can actually alter spend or available capacity.

## Health checks are different questions

Readiness asks whether an instance should receive normal service traffic. Liveness asks whether the running container should be restarted under the configured failure conditions. A startup probe gives a slow-starting application time to initialize before the other probes take over. These are operational questions, not interchangeable health labels. A failed readiness check should not automatically be interpreted as a reason to restart every instance. [K4](../references.md#k4)

Consider an application whose database is temporarily unavailable. If every instance uses database availability as its liveness condition, a shared dependency failure may trigger repeated restarts and make recovery harder. Readiness may be the better place for some dependency-related checks, but the right behavior depends on what the application can still serve and how traffic should fail. Design the endpoint to answer the intended question. A generic template cannot make that decision for every workload.

For Harbor, define observable acceptance: a deliberately unready instance stops receiving normal Service traffic under the tested conditions; a slow start is not mistaken for a deadlock; and failure messages help the operator identify the cause. The local sample's readiness check only verifies that its simple HTTP server answers. It does not verify an authenticated user journey or a background report. Your test strategy must extend from infrastructure health to the business path the customer actually needs.

## Trace traffic instead of guessing at networking

A Kubernetes Service provides a stable abstraction for reaching a changing set of application endpoints. External access introduces additional choices, such as a load balancer, ingress or gateway components, DNS, and TLS. When a customer says “the Pod is running but the app is down,” inspect the path in order. Is the process listening? Does readiness succeed? Do selectors identify the intended endpoints? Can traffic cross the relevant network boundary? Is the external route configured correctly? [K2](../references.md#k2), [K5](../references.md#k5)

Do not solve uncertainty by exposing the service more broadly. A temporary public endpoint can change the security boundary and create a different problem. Use approved diagnostic routes and the least access needed. Network policy behavior depends on the actual cluster networking implementation and configuration; a policy file alone is not proof of enforcement. Record what was inspected and tested. A customer needs a verified path, not confidence based on the presence of familiar resource names.

The commercial deliverable can be a traffic-path diagram, a reproduced failure, and one corrected configuration with acceptance evidence. That is more concrete than “Kubernetes networking optimization.” If the issue lies in a provider-managed component or requires expertise you lack, identify the boundary and work with the right owner. Effective consulting includes knowing where the available evidence stops and who can supply the next piece.

## Separate application state from workload replacement

A restarted container should not be treated as a durable database. Kubernetes storage mechanisms can connect workloads to persistent volumes, but persistence alone does not establish backup, restore, data integrity, or disaster recovery. A volume claim and a recovery plan answer different questions. Ask which information must survive a restart, a node failure, a cluster loss, and an operator mistake. Then identify the mechanism and owner for each requirement. [K6](../references.md#k6)

At Harbor, the report worker may write progress to a database and acknowledge queue messages. If it disappears halfway through, the business needs a clear rule for retrying the task without generating duplicate reports or billing twice. This is application state management as much as infrastructure. A reliable platform can rerun a broken process repeatedly; it cannot infer which side effects are safe to repeat. Your review should include the job's identity, completion record, and recovery behavior.

For an initial consulting engagement, avoid taking responsibility for an unfamiliar database migration merely because it sits beside a familiar container setup. You can document the dependency, inspect an approved recovery demonstration, or involve a specialist. Data-loss consequences can dominate a project even when the configuration change looks small. Scope the responsibility to the evidence and experience you can provide, and make the required customer decisions explicit.

## Understand scaling as a control loop with dependencies

Horizontal Pod Autoscaling adjusts replica targets based on configured metrics. It does not automatically provide unlimited capacity or solve every latency problem. The metrics source, resource settings, application startup, node capacity, and downstream services all affect the result. A CPU-based scaling signal can be unhelpful when the bottleneck is a saturated database or an external rate limit. Scaling the wrong tier may increase cost without improving the user experience. [K7](../references.md#k7)

A simplified example helps. If four replicas average a metric twice the target, a proportional model suggests eight replicas. Real autoscaling behavior includes stabilization, missing metrics, readiness, limits, and other rules. Do not quote the simplified arithmetic as a prediction of the exact next controller action. Use it to understand the direction of the feedback loop, then inspect the actual configuration and evidence in the customer's environment.

A valuable consulting question is, “What event should trigger more capacity, and what proves that more capacity helps?” Define a representative load experiment in a safe environment, a user-facing success metric, a cost observation, and stop conditions. If the customer cannot run such an experiment, your recommendation should state that limitation. A dashboard showing high CPU is a clue, not by itself a complete scaling strategy.

## Plan releases and disruptions as distinct events

A Deployment can coordinate application updates, but rollout settings and readiness do not guarantee every business operation completes without interruption. A PodDisruptionBudget constrains certain voluntary disruptions through the eviction mechanism; it does not prevent all failures or substitute for application availability design. Deployment updates are governed by their own rollout behavior. Treat these mechanisms as parts of an argument, not a single “high availability” switch. [K1](../references.md#k1), [K8](../references.md#k8)

For Harbor, trace a release through build, artifact identification, deployment, readiness, user-path verification, and recovery. Ask whether the previous application artifact can still run against the current database schema. Rolling back a container does not automatically undo a destructive data migration. A safe change may require backward-compatible schema steps, a staged rollout, or a different recovery procedure. Those application decisions deserve attention before anyone promises effortless rollback.

The deliverable can be a release checklist tied to evidence: the exact artifact, the approved environment, the verification performed, the decision to continue or stop, and the recovery action. This is a good fit for your testing and documentation strengths. It creates value without requiring you to claim complete ownership of every cluster component. A customer can see whether the process is reproducible and whether another engineer can follow it.

## Use observability to answer operational questions

Metrics summarize behavior numerically, logs record events, and traces connect work across operations or services. OpenTelemetry provides a common instrumentation model for such signals, but instrumentation does not automatically create a useful operating practice. Start with the question: which user operation matters, how will the team detect its failure, and what evidence helps locate the cause? A large volume of telemetry can still leave that question unanswered. [OBS](../references.md#obs)

For a report workflow, useful evidence might include a job identifier, completion status, duration, retry count, and a sanitized failure category. Link related events without collecting unnecessary sensitive payloads. Decide who reviews alerts and what action follows. An alert with no owner or response path can become background noise. A consulting report should distinguish missing visibility from missing response capability; buying a monitoring product addresses only part of the problem.

You can sell a scoped observability improvement when it has a defined use: instrument one critical flow, show a failure, verify that the right person can find it, and document the response. Avoid “full observability transformation” as an initial offer. The smaller engagement is easier to prove and can reveal whether broader work is justified. Your monitoring-system experience is relevant, while the customer's production environment still requires its own investigation.

## Introduce reliability goals and error budgets

A service-level indicator is a measurement of a service behavior, such as the proportion of eligible requests completed successfully. A service-level objective is a target for that indicator over a defined window. An error budget is the amount of bad behavior compatible with the target. These concepts help teams discuss reliability and change together. They are not automatically a contractual service-level agreement with a customer. [SRE](../references.md#sre)

Suppose Harbor defines an eligible request carefully and sets a 99.9 percent success target for a calendar month containing one million eligible requests. A 0.1 percent failure allowance corresponds to one thousand failed eligible requests. That is a request-based budget. In a different, simplified time-based model, thirty days contain 43,200 minutes, and 0.1 percent is 43.2 minutes. These budgets are not interchangeable unless the measurement definition supports the conversion. The companion explicitly models the time-based version.

If a thirty-day time-based target is 99.9 percent and recorded unavailability is eighteen minutes, the remaining modeled budget is 25.2 minutes. If unavailability reaches sixty minutes, the budget is exceeded by 16.8 minutes. A negative remainder is useful evidence; it should not be silently clamped to zero. What the team does next requires an agreed policy. The calculation alone cannot decide whether to freeze releases, improve monitoring, or renegotiate an unrealistic objective.

## Review cloud cost through unit economics

A cloud bill is a total. Unit economics connects cost to a meaningful unit of work, such as an order processed, active customer, report generated, or thousand eligible requests. The FinOps framework treats this as a way to connect technology spending to business value. Choose a denominator that reflects actual useful work, and explain allocation of shared costs. A declining total bill is not necessarily an improvement if useful output has declined faster. [FIN](../references.md#fin)

Suppose Harbor spends $4,000 monthly on an allocated report workflow and produces 100,000 successful reports. The allocated cost is four cents per successful report. Next month it spends $3,600 but produces 60,000 reports, giving six cents each. Total spend fell ten percent, but unit cost rose fifty percent. Neither number alone explains whether the change is good: demand may have changed, fixed costs may dominate, or quality may differ. The consultant needs the operating context.

Do not promise savings from a screenshot. Investigate allocation, reservations or commitments, idle capacity, demand patterns, and reliability constraints. Present estimated savings separately from realized savings, and account for the cost of making the change. A cost optimization that increases incidents or operator burden may be unattractive. Your first offer can be a bounded cost-and-delivery review with a small verified improvement, rather than a sweeping percentage reduction guarantee.

## Connect infrastructure as code to reviewable change

Infrastructure as code expresses configuration in version-controlled definitions. Your AWS CDK experience is directly relevant here. The useful consulting question is not only whether code exists, but whether changes can be reviewed, tested, deployed, and understood. AWS documents fine-grained assertions and snapshot tests for CDK applications. These can detect certain configuration regressions; they do not prove that a deployed workload behaves correctly or that every cloud permission is appropriate. [CDK](../references.md#cdk)

At Harbor, a test might verify that an intended property is present in synthesized infrastructure. A separate deployment verification checks the live behavior in an approved environment. Keep those evidence layers distinct. If the code test passes but the user path fails, the first test was not useless; it answered a narrower question. A good report explains that scope and identifies which evidence supports the recommendation.

GitOps tools such as Argo CD can reconcile declared state from version control, but automated synchronization, pruning, and self-healing are decisions with operational consequences. The current Argo CD documentation describes these as configurable behaviors. Do not enable destructive or automatic behavior in an unfamiliar environment merely because a template includes it. First establish ownership, review, dependencies, recovery, and how desired-state changes are approved. [GITOPS](../references.md#gitops)

## Platform engineering is a product problem too

An internal platform provides capabilities to its users, often developers. Its value depends on whether those users can accomplish important work more effectively. A portal can be one interface, but templates, APIs, command-line tools, and documented workflows can also be part of the platform. The CNCF maturity material emphasizes user interaction and deliberate growth rather than a single required technology stack. [CNCF](../references.md#cncf)

For Harbor, a useful platform improvement might be a supported application template with a tested deployment path and clear ownership. It may not need a large portal. Interview developers, observe an onboarding task, and measure the friction the template is intended to reduce. If users continue bypassing the platform, investigate why before adding features. An internal platform has adoption and support obligations, just like a customer-facing product.

This is a strong bridge for you because your experience includes developer environments, tests, and explanatory material. A “developer onboarding and delivery sprint” can be commercially clearer than “platform engineering services.” It names a buyer problem and a result. As repeated demand emerges, you can expand the scope and reuse appropriate foundations. Do not build a generic internal developer platform before learning which workflow a customer will pay to improve.

## Turn the technical review into a recommendation

Assume Harbor's diagnostic finds that new developers cannot reproduce setup, release configuration differs across environments, and no one verifies the report flow after deployment. Kubernetes adoption would not directly solve those findings. Your recommendation is a reproducible setup, configuration validation, and one post-release workflow check before changing the platform. Explain which observations support each step and which issues remain outside the reviewed path.

A bounded implementation could include one documented development environment, an example configuration without secrets, a test for a selected infrastructure property, and an agreed release-verification check. Acceptance might require an unfamiliar developer to complete setup and a controlled release to produce the expected synthetic report. The outcome is reviewable. A separate reliability or cost study can follow if the evidence supports it.

If the evidence instead shows that the existing platform cannot meet a genuine requirement, propose a comparison and pilot. Include operational staffing, migration effort, rollback constraints, recurring cost, and training. The pilot must represent an important workload and failure mode; a trivial demo does not settle production suitability. A larger engagement may be justified, but it should grow from a decision process rather than from your desire to sell a more expensive technology project.

## Build the capability required for deeper Kubernetes work

Your next Kubernetes learning objective should be a coherent operating demonstration: deploy a small workload, route traffic, change readiness, observe resource behavior, perform a controlled update, and explain recovery. Add an intentional configuration error and diagnose it from evidence. Then document the demonstration so another engineer can reproduce it. This is a better proof asset than a repository containing many unexplained charts.

Before taking sole responsibility for a production modernization, strengthen the areas the engagement actually depends on: identity and access, network enforcement, state and recovery, workload isolation, scaling behavior, provider responsibilities, and change control. A read-only review can still encounter sensitive information, so agree on evidence handling. Kubernetes RBAC guidance supports least-privilege design, but the correct permissions depend on the environment. Do not request cluster-admin as a default diagnostic convenience. [RBAC](../references.md#rbac)

Partnering can be a practical bridge. An experienced platform lead can own the broader architecture while you deliver tests, developer setup, observability work, or a defined workload improvement. Your role remains valuable and can command a sensible fee without claiming authority you have not earned. Record what you delivered and what the partner reviewed. That creates better evidence for future independent work than an inflated project title.

## The cloud-native consulting worksheet

For each opportunity, record the user's task, operational owner, current delivery path, observed failure, evidence confidence, feasible alternatives, and next verification. Add the workload's state and external dependencies. Then ask what responsibility the customer wants you to accept. A recommendation-only review, a nonproduction pilot, a production change, and ongoing operation have different requirements even if they involve the same YAML file.

Use the companion reliability experiment to explore one quantitative part of this worksheet. Change the window, target, and observed unavailable minutes, then explain the result using the actual indicator definition. Use the commercial calculator later to assess delivery capacity. The software does not inspect a cluster or certify a configuration. It performs a transparent model so you can understand the reasoning before applying it to evidence from a real customer.

In the next chapter, the same consulting method moves to AI workflows. The infrastructure still matters, but evaluation, human judgment, and control over side effects become central. Your experience with structured outputs and research gives you a useful starting point. The commercial question remains the same: which decision or workflow can you improve, what evidence will demonstrate it, and who can operate the result after you leave?

## Two review examples that show the difference between advice and a checklist

### A resource change with an incomplete cost claim

A customer asks you to lower memory requests because a dashboard shows low average use. First identify the interval, workload type, and whether the metric includes peaks and startup behavior. Ask what cost mechanism would change if the request were smaller. If node count and commitments remain unchanged, the immediate bill may not fall. The change could still improve schedulability, but that is a different claim. Write the intended effect before touching configuration.

A sensible next step is an approved experiment with representative load, observed memory behavior, a rollback condition, and a comparison of scheduling and cost. If the customer cannot provide the evidence, recommend collecting it rather than guessing. Your deliverable can explain the uncertainty and the measurement plan. That is useful consulting even when the final answer is not yet a configuration value. The fee buys disciplined reduction of uncertainty, not a ritual of changing every setting you inspect.

### A platform proposal with no operating owner

Another customer wants a multi-service Kubernetes platform but has no person assigned to maintain it. Ask who will handle updates, failed deployments, credentials, backups, alerts, and recovery. An external consultant can help establish the system, but a handover document cannot create staffing capacity by itself. Compare a managed application route and a smaller deployment design alongside the platform proposal. The right answer may be to postpone the more demanding option.

If the customer proceeds, make the operating model part of the engagement: named owners, explicit responsibilities, training, recovery demonstrations, and continuing support terms. Do not hide these behind the word cloud-native. A technically successful installation can still be an unsuccessful consulting engagement if the team cannot use or sustain it. Your ability to explain that tradeoff is one of the clearest ways to provide value beyond implementation labor.

## Measure delivery without rewarding the wrong behavior

A team can deploy more frequently while creating more rework. It can also reduce visible incidents by avoiding useful changes. This is why a consulting measurement should describe both flow and instability rather than celebrate one isolated number. DORA's current guide discusses five delivery performance metrics and explicitly notes that its model has evolved. Use the current definitions when applying that research; do not assume a remembered four-metric dashboard is the only valid framework. [DORA](../references.md#dora)

For Harbor, begin with local operational definitions. A release starts when an approved artifact enters the agreed path and ends when its verification succeeds or recovery begins. A failed release requires a defined intervention. A recovery interval has an observable beginning and end. These definitions are examples, not a replacement for the source framework. They make the customer's own evidence interpretable and expose where timestamps or classifications are missing.

Suppose five releases took ten, twelve, eleven, ninety, and thirteen minutes. The mean is 27.2 minutes, but four releases were much faster than that. The outlier may be the most useful diagnostic case. Ask what happened rather than reporting the average alone. If a later change removes that failure mode, compare similar releases and explain the small sample. Do not claim a stable improvement from a handful of observations under different workloads.

Measurement also has collection cost. A small team may need one lightweight record before it needs a new telemetry platform. Identify the decision that the metric will support and the person who will use it. If nobody can explain what would change after the number moves, the metric may be decorative. Your recommendation should make the operating process clearer, not create another reporting obligation whose value is uncertain.

## Write an executive recommendation from the technical evidence

A concise recommendation for Harbor could read: “The inspected release path depends on undocumented configuration and lacks verification of the report workflow. We reproduced both gaps in the approved environment. We recommend addressing those two issues before considering an orchestration migration. The reviewed evidence does not establish that the current hosting model is the main constraint. The next phase should prove that a new developer can run the service and that a controlled release produces the expected synthetic report.”

Below that opening, include links to the actual evidence, the scope boundary, and the owner of each next step. Explain the estimated effort and what could change it. If a buyer wants to proceed, the recommendation becomes the basis of a bounded implementation proposal. If the buyer chooses another provider, the report should remain usable. That independence is a practical test of whether the diagnostic was consulting value rather than an elaborate sales presentation.
