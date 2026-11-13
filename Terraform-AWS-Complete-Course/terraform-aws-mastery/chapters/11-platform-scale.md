# 11. Multi-account architecture, data services, and platform operations

**Central problem:** How do we preserve understandable ownership and safe change when infrastructure spans accounts, regions, data lifecycles, and many teams?

**Prerequisites:** all earlier chapters, especially independent provider/backend identities, module contracts, migration, and delivery evidence. Source examples include [the target-account root](../labs/08-multiaccount/main.tf) and [the optional RDS root](../labs/09-rds/main.tf).

## 11.1 Scale the ownership model before scaling the code

An organization can have thousands of Terraform resources while retaining clear authority, or a few dozen resources with confused ownership. Resource count is not the first scaling question. Start with who owns each root, which account and state it operates on, what other systems depend on its outputs, and how it is recovered.

An account is a useful isolation boundary for permissions, quotas, billing relationships, and incident scope. An organizational unit groups accounts under common governance. Service control policies and related organization controls can limit permitted actions, but they do not grant workload permissions merely by existing. A deployment role still needs applicable authorization.

A platform design often separates organization/bootstrap, security/logging, shared networking, and workload accounts. These are architectural patterns rather than a requirement to create an account for every diagram box. The correct boundaries depend on regulatory needs, team ownership, scale, costs, and operational maturity.

Do not give a learning Terraform root authority over the management account to make cross-account examples convenient. The course's multi-account root assumes a deployment role that already exists under an authorized account setup. Its source is complete for that contract, but the trust relationship and organizational governance are prerequisites supplied by the organization.

## 11.2 Trace a cross-account role session

The target-account root begins with a source profile, a target account ID, a deployment role name, and a region. The provider uses the source profile, assumes the target role, and checks that the resulting account is the intended target.

~~~hcl
provider "aws" {
  alias               = "target"
  region              = var.region
  profile             = var.source_profile
  allowed_account_ids = [var.target_account_id]

  assume_role {
    role_arn     = "arn:aws:iam::${var.target_account_id}:role/${var.deployment_role_name}"
    session_name = "tf-mastery"
  }
}
~~~

This fragment comes from the complete root and assumes the ordinary provider requirements. The source identity must be allowed to request the role session, and the target role's trust must permit the request. The resulting role permissions, session constraints, boundaries, and organization controls then limit actions.

The alias `target` is mapped into the private-bucket module through its providers argument. The child receives an AWS configuration appropriate to the intended account without hard-coding the account itself. This is the module/provider separation from Chapter 7 applied to a real organizational boundary.

The backend is still independent. In this example it remains local unless you configure one. A production tooling-account backend would need its own explicit identity and access design. Provider role assumption does not transport state into the target account or make the backend role equivalent.

## 11.3 Organization guardrails are limits, not ordinary grants

A permission boundary or service control policy can restrict what an identity is allowed to do, even if an attached policy appears broad. An explicit deny can override an allow. Resource policies introduce additional evaluation paths and nuances, especially across accounts and for different principal forms.

AWS's [policy evaluation logic](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_evaluation-logic.html) is the primary reference. Do not reduce the entire system to “all policies are intersected” or “any allow wins.” The result depends on policy type, principal, resource context, and explicit denies.

A deployment role may be permitted to create application roles only when a required permissions boundary is attached. Terraform needs to model that boundary on created roles, and the executor may need appropriate PassRole permissions scoped to the intended services and roles. A broad IAM wildcard added to fix one failure can undermine the governance design.

When a plan fails in one account but succeeds in another, compare organizational controls and role/session context as well as Terraform code. Identical configuration is not identical authority. Record the account's guardrails as part of the environment contract so developers can understand legitimate failures without guessing.

## 11.4 Multi-region means duplicated dependencies and explicit failover

A provider alias can select another region, but a multi-region application also needs data placement, artifact availability, DNS/routing, certificates, service support, capacity, and failover behavior. Duplicating a function resource is only one part of the design.

Some resources have regional identifiers and cannot be reused unchanged elsewhere. AMIs, subnets, and many service endpoints are regional. Certificate placement can have service-specific requirements. An architecture that passes Terraform validation can still reference a resource in the wrong region for the consuming service.

Decide whether the secondary region is active, warm standby, or a recovery target. Those choices affect cost and recovery time. Define how traffic shifts, how data consistency is maintained, and how the team determines that the secondary is ready. Test failback as well as failover where the business requires it.

Terraform should encode the infrastructure and chosen relationships, while the runbook describes operational decisions and evidence. A single apply across two regions is not a transaction and can partially succeed. Separate state boundaries can improve isolation while increasing orchestration needs; choose based on failure and ownership requirements.

## 11.5 Data has a different lifecycle from compute

A health function can be replaced from a known package. Customer data cannot generally be reconstructed from Terraform source. Persistent storage therefore needs backup, retention, deletion, migration, and recovery decisions that remain meaningful even when the infrastructure definition changes.

For DynamoDB, the capstone uses on-demand billing, server-side encryption, and point-in-time recovery. The table's partition key is `release_id`. These settings configure a storage service; they do not seed records or implement the application logic. On-demand mode removes a particular provisioning decision but does not make usage free or eliminate account/service limits.

A partition key determines how access patterns map onto the service. A poorly chosen hot key can concentrate load. Terraform can enforce the declared key schema but cannot infer the application's query patterns. Design the data model from required reads and writes, then choose indexes and capacity/usage controls accordingly.

Point-in-time recovery supplies recovery options under service semantics. It does not mean a user can undo any operation instantly within the same table. Restoring and switching an application to a recovered target is an operating procedure with permissions, validation, and possibly downtime considerations.

## 11.6 RDS introduces maintenance, secrets, and deletion protection

A relational database stores structured data under an engine such as PostgreSQL. RDS manages parts of provisioning and operations, but the user still chooses networking, engine versions, instance capacity, backups, maintenance behavior, credentials, and application compatibility.

The optional `labs/09-rds` root creates a private subnet group using the network module, a client security group, a database security group allowing PostgreSQL only from that client group, and an RDS PostgreSQL instance. It does not create a client instance or application, so actual connection testing requires an authorized client placed in the intended network and given appropriate credentials.

The root requires an explicit engine version, instance class, and unique final-snapshot identifier. Those values are region- and time-sensitive; use the AWS service's current supported offerings rather than copying an obsolete hard-coded example. The teaching root defaults to a single-AZ database to keep the architecture visible, while making the production availability decision explicit.

The database enables encryption, managed master-password handling, backup retention, and deletion protection. It is not publicly accessible. `apply_immediately` is false, so some changes may wait for maintenance behavior rather than taking effect at the moment the Terraform operation returns. The [pinned RDS resource schema](https://raw.githubusercontent.com/hashicorp/terraform-provider-aws/v6.0.0/website/docs/r/db_instance.html.markdown) describes supported settings and update implications.

This lab is optional and can incur material recurring cost. It is not part of the default serverless capstone. Deletion protection must be deliberately changed and reviewed before a planned teardown, and the final snapshot has its own retention and cost consequences.

## 11.7 Work a database capacity change through its real lifecycle

Suppose a database is approaching storage pressure. The configuration currently requests an allocated size and permits autoscaling up to a maximum. First inspect actual usage, growth rate, engine limits, and the service's current modification state. Do not infer urgency from a Terraform diff alone.

If the desired change increases storage, inspect whether the service supports the transition, whether it can be reversed, and when it becomes effective. Some storage changes cannot be undone by reducing a number in code. A Git revert does not guarantee an in-place shrink.

Plan with the correct provider and state. Read maintenance-related arguments, immediate-apply behavior, and any pending modifications. A subsequent plan may continue to show a difference while AWS is waiting for a maintenance window. Repeatedly applying or forcing replacement can turn an expected pending transition into an incident.

Define application checks and a recovery strategy before the change. A backup should be recent enough and restorable under the required recovery objective. Verify how the application finds the database endpoint and obtains credentials. If recovery creates a new database instance, connectivity and secrets may need a controlled cutover.

After the service reports the intended state, inspect metrics and application behavior. Record the observed capacity and any follow-up actions. The useful evidence is the whole transition from measured need to service state and application health, not merely a successful Terraform exit code.

## 11.8 Provider upgrades are schema and behavior changes

A provider implements resource schemas, diff logic, API calls, retries, import behavior, and state migrations. Upgrading it can change plans even with identical configuration. A release note that sounds small can affect a critical resource's computed attributes or replacement behavior.

The course intentionally fixes AWS provider 6.0.0 for reproducibility. To adopt a newer version, choose a reviewed target, read official upgrade and release notes, update constraints in the relevant roots/modules, initialize with the intended upgrade behavior, and inspect lock-file changes. Do not let a routine validation job silently select the target for you.

Test representative fresh deployments and existing-state upgrades. Fresh-state tests reveal schema compatibility; existing-state tests reveal migration and diff behavior. Include critical resource categories such as IAM, network, storage, and data services in the representative set.

Plan in a lower-risk environment first, then roll out across roots in stages. Keep the old configuration and evidence, but do not assume provider downgrade is a safe rollback after a newer provider has written state. State schema compatibility can constrain reversal.

A module supporting a range of provider versions should maintain a meaningful test matrix. A lower-bound constraint without tests is only a claim. Narrow support may be appropriate for an internal module if the organization prefers coordinated upgrades and can support that operational model.

## 11.9 Diagnose provider behavior using the right interfaces

`terraform providers` shows provider requirements and relationships. `terraform providers schema -json` exposes the selected provider's schema in structured form. These can help distinguish an unsupported argument from a documentation mismatch.

A resource diagnostic may originate in Terraform's language evaluator, provider validation, or the remote AWS API. Read the message and context carefully. An “unsupported argument” before any API request usually calls for schema/version inspection, while an AWS request ID suggests the service received a request.

Detailed Terraform logs can help investigate difficult issues, but they may expose sensitive values. Enable them narrowly, store them securely, and remove them according to the incident process. Do not ask a colleague to post an entire debug log publicly without reviewing its contents.

When reporting a provider defect, build a minimal nonsecret reproduction with the exact CLI/provider versions, resource configuration, expected behavior, actual behavior, and relevant diagnostics. Reduce unrelated modules so maintainers can see the underlying interaction. A careful reproduction is often more useful than a long description of the original repository.

## 11.10 Optimize plans by reducing unnecessary work

Large roots can suffer from slow refresh, broad dependency edges, expensive data lookups, provider API rate limits, and excessive computed churn. Begin by measuring where time is spent. Splitting files does not split state or reduce the graph's operational scope.

Use direct references and stable published interfaces rather than repeated account-wide discovery queries. Avoid broad module dependencies that make unrelated data sources defer until apply. Keep resource ownership coherent so two declarations do not continually overwrite the same property.

The `-parallelism` setting can limit concurrent operations. Increasing it may improve throughput until API limits or service dependencies dominate; decreasing it can reduce pressure in particular incidents. It is not a substitute for correct dependencies, and a faster failing run is not an improvement.

Split roots when ownership, lifecycle, risk, or independent deployment justify it. Every split adds cross-root orchestration and interface obligations. A monolith can be too broad; an extreme collection of tiny states can be too brittle. Measure coordination cost alongside plan duration.

## 11.11 Hosted execution changes the operating surface

HCP Terraform and Terraform Enterprise can supply managed state, execution, permissions, policy integration, and other platform capabilities. Exact feature availability depends on the product and plan and should be checked in current official documentation before adoption.

Remote execution moves the credential and network boundary. A run may execute in a hosted environment or an agent connected to private infrastructure. A successful local plan does not prove the remote runner has the same files, variables, provider access, network paths, or identity.

A remote-execution design should identify who can queue plans, approve applies, change variables, read state, manage agents, and alter policy. These are distinct authorities even when a platform makes them easy to configure. Preserve the evidence chain from Chapter 10 in the chosen execution model.

The course does not provision or claim to test a hosted account. The local pipeline teaches the invariants that remain useful when the execution platform changes. Evaluate a platform based on the real control and operational needs it solves, not the assumption that “remote” inherently means correct.

## 11.12 Stacks coordinate a different configuration layer

Terraform Stacks are an HCP Terraform configuration layer for composing components and deployments. They differ from ordinary root modules and workspaces and require their own current documentation and execution context. They can be relevant when coordinating repeated module-based infrastructure across environments at scale.

The [Stacks overview](https://developer.hashicorp.com/terraform/language/stacks) was inspected for this edition's architectural survey. The course does not provide a fake locally executable Stack or claim that ordinary CLI roots automatically gain Stack orchestration by renaming files.

Before adoption, map existing ownership, state, outputs, provider configurations, rollout requirements, and failure recovery to the platform's actual model. A new orchestration layer can simplify repeated deployment while introducing migration and operating responsibilities of its own.

The expert skill is to recognize when ordinary roots and a clear pipeline remain sufficient and when a coordinated platform offers concrete value. New syntax is not a learning objective by itself; a better-supported operational model is.

## 11.13 Actions and discovery need provider support

Current Terraform documentation includes provider-defined actions for operations outside ordinary managed-resource state transitions. Availability depends on the provider implementing the action and on the selected CLI/platform context. The course's older pinned AWS provider baseline is not claimed to support every new action described in current documentation.

The [action invocation guide](https://developer.hashicorp.com/terraform/language/invoke-actions) distinguishes these operations from managed resource state. Before using an action, identify its side effects, retry behavior, authorization, audit trail, and relationship to resource lifecycle. A convenient trigger can still perform a consequential external operation.

Discovery and query workflows can assist adoption of existing infrastructure, but documentation and provider support are evolving. Some specific list/query reference pages were unavailable through the research interface for this edition; the source ledger records that limit. The book therefore does not invent runnable list-block APIs or imply they were tested.

The stable adoption principles remain: identify the actual object, establish one owner, produce reviewable configuration, plan the association and changes, and verify the resulting state. A discovery tool can accelerate inventory without deciding those responsibilities for you.

## 11.14 Kubernetes and application controllers create ownership edges

If Terraform creates an EKS cluster and immediately configures a Kubernetes provider using values from that new cluster, initialization and readiness dependencies can become difficult. A separate cluster-foundation root and workload deployment process often make the boundary clearer.

Kubernetes controllers continuously reconcile workloads. Terraform also reconciles declared infrastructure when invoked. If both own the same field, they can fight. Choose an owner for replica counts, generated annotations, certificates, and other dynamically managed attributes, then encode that delegation deliberately.

The same principle applies outside Kubernetes: an autoscaler, secret rotation service, configuration agent, or incident script can be a legitimate external writer. Document ownership at the attribute level where necessary. Do not globally ignore changes just because a controller exists somewhere in the architecture.

A platform team should publish supported interfaces rather than requiring application teams to read cluster state containing unrelated authority or secrets. Versioned outputs, runtime identity, and independent workload delivery can preserve useful separation while still allowing coordinated upgrades.

## 11.15 Work an organizational rollout as a staged change

Suppose the platform team wants all artifact buckets to require TLS and preserve version history. First inventory module consumers and identify unmanaged exceptions. Define the new contract and migration behavior. Test a representative existing bucket so the team knows whether the change is in place, whether policy conflicts exist, and whether any application uses an unsupported access path.

Release the module with clear notes and an adoption window. Upgrade a development root, inspect its plan, apply, and verify relevant access behavior. Then promote through representative staging and production roots with their own state and approvals. Track actual adoption rather than assuming publication means enforcement.

If a consumer has a legitimate exception, document it explicitly with an owner and rationale. Do not silently add a generic bypass flag that every future consumer can select without review. A controlled exception preserves the meaning of the standard contract.

Observe the rollout's failures. AccessDenied can indicate an unexpected client behavior, a policy conflict, or a flawed implementation. Use evidence to refine the change. Organizational scale is often a coordination and communication problem as much as a Terraform syntax problem.

## 11.16 Architecture decisions should record tradeoffs

A short architecture decision record names the problem, constraints, considered alternatives, selected choice, consequences, and revisit trigger. For example, “Use separate workload accounts because production authority and recovery must be isolated; accept additional role/bootstrap coordination; revisit shared tooling when the number of accounts exceeds the team's manual operating capacity.”

Useful revisit triggers are concrete: a measured request rate, a recovery-time objective, a compliance requirement, a number of independent teams, or a cost threshold. “Revisit when scale grows” is too vague to guide action.

The companion's **Architecture tradeoffs** experiment computes an explanatory recommendation from chosen workload and operating constraints. It is a transparent educational decision model, not an automated architect. Inspect its assumptions and use it as a starting point for a written decision, then validate service-specific feasibility through current primary sources.

## Worked state-boundary decision: one platform, three teams

Suppose a networking team owns VPCs, a data team owns RDS, and an application team owns the health/API tier. All three currently share one state and one deployment role. An application wording change can require access to database settings and networking plans, while a network change risks locking every other team out of deployment.

A proposed split gives each team a root with its own state, role, and approval path. The network publishes a stable subnet/security interface. The database root consumes that interface and publishes a nonsecret endpoint/secret reference through an approved channel. The application root consumes only what it needs. This improves authority separation but introduces compatibility and ordering obligations.

A routine compatible application release should not require a network apply. An incompatible subnet migration does require coordinated consumer changes. The platform needs a documented interface version and migration path rather than assuming that separate states can never affect each other.

Compare failure modes explicitly. In the shared root, one lock or plan error can block all teams, but a single plan sees more of the graph. In split roots, teams can move independently, but no single plan proves cross-root compatibility. The decision should follow team authority and lifecycle, then be supported with orchestration and contracts.

### Audit an assumed role's real authority

For a role that deploys Lambda, identify why it needs each category: function lifecycle, role creation/policy management where permitted, PassRole to the intended function role, API configuration, logging configuration, state access, and selected read operations. Scope resources and conditions where AWS supports them. A role that can create arbitrary roles and pass them to arbitrary compute may have much broader effective authority than a simple action list suggests.

If the organization requires a permissions boundary on created roles, encode it in the module contract and test its presence. Verify that the executor cannot simply remove the boundary. IAM design includes both the role being created and the authority of the actor creating it.

The course source omits organization-specific boundary ARNs because inventing one would make the example falsely concrete. A production adaptation should add an explicit validated input or platform-owned provider/module context and document the required governance behavior.

### Upgrade a fleet of roots in cohorts

Group roots by representative risk rather than upgrading every state at once. A first cohort might include a disposable environment and a service with good probes. A later cohort includes persistent data and critical networking. Define stop criteria such as unexpected replacement, repeated drift, provider crashes, or probe failures.

Preserve the exact provider version and lock record for each cohort. If an issue appears, pause rollout while unaffected roots remain on their prior baseline. Do not assume that downgrading already-upgraded state is safe; investigate schema compatibility and a forward correction.

A rollout record should identify actual applied roots, not merely repositories with merged version bumps. A merged dependency change can remain unapplied for weeks. Platform inventory and execution evidence close that gap and support later incident diagnosis.


## Decommission an interface as carefully as you introduce it

A platform output, role, or shared service can outlive its original owner. Before removal, identify actual consumers, announce a supported replacement, measure adoption where possible, and define the final retirement condition. A search of one repository may miss consumers in another account or operational tool.

For a deprecated module output, retain compatibility through the promised upgrade window. For a role, verify which workflows still assume it before deleting trust. For a backend bucket, identify every state and recovery dependency before retirement. These are versions of the same ownership problem at different scales.

A practical inventory should connect resource, owner, state, consumers, data sensitivity, and recovery obligations. It does not need to begin as a complicated product; an accurate maintained register is better than an ambitious abandoned dashboard.

Expert operation includes reducing unnecessary infrastructure and interfaces. Removing a component with evidence can improve security, cost, and understandability. Treat decommissioning as an engineered migration with explicit retention and verification, rather than a cleanup spree driven by names that look old.


When account boundaries change, verify physical zone alignment through zone IDs where cross-account placement requires it. Matching zone-name letters are not sufficient evidence. Keep this placement decision separate from provider aliases and state paths, which describe different relationships.

## 11.17 Optional application and transition

Read the multi-account root and trace the source profile, role trust prerequisite, target provider, module mapping, and backend separately. Write the exact evidence you would need before applying it. A reference answer includes the verified target account, permitted role session, intended bucket/state ownership, and a reviewed plan under that identity.

For the RDS extension, choose current supported values in a sandbox only if you intend to incur and manage the cost. Review deletion protection and final-snapshot behavior before creation, not during an impatient teardown. No actual database deployment was performed during course authoring.

The final chapter assembles the reference system, provides a complete capstone runbook and review rubric, and explains how to continue from course competence to expert practice through supervised changes, incident work, and deliberate maintenance.
