# 12. Capstone: operate Field Notes as an engineering system

**Central problem:** Can we assemble a coherent deployment, explain each boundary, demonstrate controlled change and recovery, and leave the next operator with usable evidence?

**Prerequisites:** the preceding chapters. This chapter is a complete guided project with a supplied reference implementation, optional extensions, an operating runbook, and an expert-practice path. The reference root is [labs/07-capstone](../labs/07-capstone/main.tf).

## 12.1 Define the outcome before creating resources

Field Notes needs a public nonsecret health endpoint that identifies the deployed release, private storage for build artifacts, and a protected release-metadata table. The infrastructure must have explicit account targeting, reproducible dependencies, reviewable changes, a basic error alarm, and a documented teardown/data-retention decision.

The reference application deliberately implements only the health endpoint. It does not read or write the release table, serve private artifacts, implement user accounts, or provide a complete note-taking product. The table and bucket are real infrastructure components with outputs and operational contracts; application CRUD is an explicitly scoped extension rather than an implied completed feature.

This boundary keeps the capstone focused on Terraform engineering while still integrating identity, storage, compute, API routing, logging, monitoring, state, modules, testing, policy, and delivery. A larger application would add useful software topics but could obscure whether a failure comes from infrastructure or business logic.

Success is demonstrated through evidence: the expected release responds, storage settings match the contract, tests and policy checks pass, the plan targets the intended account, an address migration preserves identity in the local rehearsal, and the runbook explains remaining limitations. Merely creating every resource is not the full outcome.

## 12.2 Read the architecture as responsibilities

The root calls the private-bucket module for artifacts and the health-api module for the endpoint. It declares a DynamoDB release table and a CloudWatch alarm on function errors. Provider default tags identify the project. The health module receives bucket/table names as nonsecret context, while its runtime role remains logging-only because the handler does not access those stores.

~~~text
Terraform executor -> provider -> intended sandbox account
        |
        +-> private artifact bucket (versioned, encrypted, TLS-only)
        +-> release metadata table (encrypted, point-in-time recovery)
        +-> health API -> Lambda -> log group
        +-> Lambda error metric alarm

Client -> public GET /health -> status + release identifier

State -> chosen protected backend (local until deliberately migrated)
~~~

The diagram distinguishes infrastructure context from actual runtime access. There is no arrow from the Lambda to the table because the handler does not call DynamoDB. A resource identifier in an environment variable is neither permission nor implemented application behavior.

The default capstone is regional and serverless. It does not deploy the network lab, NAT gateways, EC2, ECS, EKS, RDS, a custom domain, or a cross-region recovery system. Those were taught as independent capabilities and tradeoffs. Add them only when a requirement justifies their lifecycle and cost.

## 12.3 Inventory the exact implementation

The artifact bucket module configures public-access blocking, ownership enforcement, versioning, explicit encryption, TLS enforcement, and `force_destroy = false`. The table uses on-demand billing and a string partition key named `release_id`, with encryption and point-in-time recovery enabled.

The health module provides the execution role, narrow log-writing policy, retained log group, Python function, HTTP API, route, integration, default stage, and API-scoped invocation permission. The handler returns only status and release. Its package is included and can be rebuilt deterministically from source.

The alarm observes the Lambda Errors metric over a one-minute period with a threshold of one. Missing data is treated as not breaching. No notification action is attached in the reference because the course does not invent a destination or send messages to anyone. An operator must connect an approved notification path and test it before relying on the alarm for production response.

The root's `environment` variable permits dev, stage, and prod labels, but a label does not supply production isolation. Use separate roots/accounts/backends and appropriate controls for actual production. Do not set `environment = "prod"` in a sandbox and assume that creates a production operating model.

## 12.4 Prepare an honest preflight record

Record the selected account ID, region, caller identity, root path, Terraform version, provider version/lock record, release, and backend scope. Confirm the account is an authorized sandbox. Decide whether the current exercise includes real AWS resources or only local/mock verification.

Review expected cost categories: API requests, function execution, logs, storage, table usage and recovery, and monitoring. Look up current region-specific prices before a material run. The companion accepts rates you supply; its illustrative defaults are not a live AWS quote or a promise of free operation.

Set up a billing alert appropriate to your account and understand its response limitations. A budget notification does not automatically delete resources or stop every charge. Plan a teardown time and include persistent snapshots or versions in the retention decision.

Confirm that no unrelated object uses the same deterministic function/table name in the target account and region. The bucket uses a generated suffix, but other names intentionally remain readable. If a name collision exists, inspect ownership and choose a deliberate environment/root naming scheme rather than importing an unrelated object just to make the apply succeed.

## 12.5 Run the low-risk evidence first

From the extracted course root, run the Python tests, the local Terraform tests, and the three mocked module test suites. Initialize each module with the pinned dependencies as documented in its README.

~~~powershell
python -m unittest discover -s ./scripts/tests -v
terraform -chdir=labs/00-local init
terraform -chdir=labs/00-local test
terraform -chdir=modules/private-bucket init -backend=false
terraform -chdir=modules/private-bucket test
terraform -chdir=modules/network init -backend=false
terraform -chdir=modules/network test
terraform -chdir=modules/health-api init -backend=false
terraform -chdir=modules/health-api test
~~~

These checks do not deploy AWS resources because of the actual resource and mock configurations. They establish selected language, contract, handler, and policy behavior. Read the verification report for what was executed during authoring; do not infer real AWS validation from those results.

Run the local address-migration rehearsal from Chapter 8 in a scratch copy. Preserve the original and final ID comparison as evidence. It is a small exercise with a large conceptual payoff: you can show continuity rather than merely claiming that a refactor is harmless.

## 12.6 Choose the state boundary before the first team run

For an individual temporary sandbox exercise, protected local state can be sufficient to observe the mechanics. For a team deployment, configure the backend and access process from Chapter 6 before multiple operators begin using the root.

The capstone does not automatically reuse the module-consumer root's backend key. Give it a distinct key such as `sandbox/dev/field-notes.tfstate` in the chosen protected bucket, with the correct account and IAM scope. Copy the partial-backend pattern deliberately and initialize or migrate according to the root's actual existing state.

Do not point two roots at the same key because they use similar modules. The backend key identifies the state they would share, not a general environment folder. Likewise, do not copy a state file into a different account as a promotion shortcut.

Write the selected backend into the runbook using nonsecret identifiers and state who may read, write, approve, and recover it. The credentials themselves remain in the approved identity system, not in the document.

## 12.7 Build and inspect the actual proposal

Copy and edit the capstone variable example, set the verified account ID, and choose a release identifier. Rebuild the health package only if source changed. Then run a plan through the portable pipeline or the explicit Terraform commands.

~~~powershell
Copy-Item ./labs/07-capstone/terraform.tfvars.example ./labs/07-capstone/terraform.tfvars
python ./scripts/package_lambda.py
terraform -chdir=labs/07-capstone init
terraform -chdir=labs/07-capstone validate
terraform -chdir=labs/07-capstone plan -out=capstone.tfplan
terraform -chdir=labs/07-capstone show capstone.tfplan
~~~

The provider requires the account ID you supply to match the authenticated destination. Review resource addresses, public endpoint intent, storage controls, role permissions, table key schema, retention, and alarm behavior. Read every replacement or deletion even if the overall resource count seems plausible.

If using the portable pipeline, keep its saved plan, JSON, and manifest in a protected fresh run directory. The policy checker should pass the reference create plan under its limited rules. Its pass does not evaluate every architecture requirement; use the review rubric below to cover the remaining decisions.

## 12.8 Apply and verify properties through separate observations

After choosing to apply the reviewed proposal, retrieve the outputs and call the endpoint:

~~~powershell
terraform -chdir=labs/07-capstone apply capstone.tfplan
$taskHealthUrl = terraform -chdir=labs/07-capstone output -raw url
Invoke-RestMethod -Uri $taskHealthUrl
terraform -chdir=labs/07-capstone output artifact_bucket
terraform -chdir=labs/07-capstone output release_table
terraform -chdir=labs/07-capstone plan
~~~

The response should show status `ok` and your selected release, defaulting to `v1`. Inspect S3 settings through AWS APIs as in Chapter 3. Inspect the table's encryption/recovery settings and the alarm in the actual account. These are separate property checks; a healthy endpoint does not prove private-storage settings, and a private bucket does not prove the endpoint is serving the right release.

The final plan should be understood rather than mechanically required to print one memorized sentence. Investigate any unexpected differences, pending service modifications, or data-source behavior. Record the observed results with the source/artifact/run identity.

If anything fails, follow the layered diagnostics from the earlier chapters. Preserve successful associations after partial application. Do not erase state or widen permissions until the evidence identifies the actual boundary that failed.

## 12.9 Perform a controlled release change

Change only the release input first, from `v1` to `v2`, and create a new plan. The expected behavior is a function configuration update while the bucket and table identities remain stable. Review the real plan; do not infer this from the source diff alone.

After applying, call the endpoint and verify the release is `v2`. Record the bucket and table identifiers before and after if you want explicit continuity evidence. A no-change plan afterward strengthens the convergence observation under the current conditions.

Next, in a separate change, alter a small handler behavior, rebuild the ZIP, and inspect the source-code hash difference. Apply the newly reviewed plan and verify the new response. This separates configuration release identity from artifact code identity and makes both mechanisms observable.

For rollback practice, select a known previous package/configuration and plan the forward change that redeploys it. Do not restore an old Terraform state to roll back function code. State restoration and application release rollback solve different problems.

## 12.10 Rehearse drift as an operating decision

Use a disposable setting in your sandbox, such as a harmless tag, to observe a deliberate out-of-band change. Run a normal plan and inspect how Terraform proposes to reconcile it. Decide whether to adopt the changed intent in configuration or restore the declared value.

Do not use a public-access flag or production permission as a casual drift experiment. The learning objective is observing reconciliation, not creating avoidable exposure. A synthetic tag provides the same mechanism with lower impact.

If an external controller legitimately owns a value, document that ownership and choose a precise delegation. Do not add ignore_changes to the entire resource to suppress an inconvenient plan. The reference capstone has no external autoscaler or controller claiming its declared settings.

A drift runbook should say how alerts are triaged, who decides whether a change is legitimate, and when a new reviewed apply is appropriate. Automatic reconciliation may be suitable for some environments, but it must account for incidents and authorized emergency changes rather than treating every console action as malicious or every difference as harmless.

## 12.11 Practice recovery without manufacturing a data incident

The supplied local migration lab demonstrates identity-preserving change. Use it for deliberate state/address exercises. For the real capstone, practice locating backend versions, identifying the correct key, and explaining the restore procedure without randomly replacing state snapshots in a live deployment.

For storage recovery, use a tiny synthetic object in the artifact bucket and observe versioning behavior. Restore or retrieve a prior version through the service's supported workflow. Record the object key and version identifiers in a protected note. This demonstrates an actual storage recovery mechanism without involving company data.

For DynamoDB, understand that point-in-time recovery operates under service-specific restore semantics and may create another table. A complete data recovery rehearsal needs write traffic assumptions, validation, application configuration changes, and cutover decisions. The capstone does not claim to execute that rehearsal automatically.

The expert lesson is that a recovery capability must be tested at the layer it promises to recover. Terraform state versions help management recovery. Object versions help object recovery. Database backups help database recovery. None is a universal substitute for the others.

## 12.12 Use a review rubric with observable criteria

| Area | Evidence that supports acceptance | Evidence that is insufficient by itself |
|---|---|---|
| Destination | Verified caller/account and provider allowlist | A profile named sandbox |
| Identity | Resource IDs preserved where promised | A small source diff |
| Storage | Service settings plus retention decision | The word private in a resource name |
| Application | Expected health release over the real endpoint | Terraform apply succeeded |
| Tests | Relevant local/mock/integration results with scope | A generic “all tested” statement |
| Policy | Parsed saved-plan result and reviewed exceptions | Searching plan text for delete |
| Delivery | Same reviewed plan/artifact identity at apply | Recalculating an unreviewed apply |
| Recovery | A documented and appropriately rehearsed procedure | A backup feature enabled |
| Operations | Named owner, alarm route, response process | An alarm without notification or ownership |
| Cleanup | Verified inventory and retained-data decision | Deleting the state file |

The rubric is a project review aid, not a mandatory quiz or a promise that every production requirement is covered. Add organization-specific criteria where appropriate. Keep each criterion tied to evidence that can actually support it.

## 12.13 Write the operator's runbook as a usable document

A useful runbook begins with the service purpose, root location, owner, account/region, backend key, normal deployment entry point, and expected health response. It then describes common symptoms, the next observation, recovery authority, and cleanup/data-retention behavior.

For the reference API, an invocation failure leads to checking the route, integration, Lambda permission, function logs, and deployed artifact. A missing release change leads to checking environment input and the package/configuration actually applied. An initialization failure leads to backend identity and configuration rather than function code.

Include command examples with the intended working directory and placeholders clearly labeled. Avoid commands that discover broad account inventories and then delete everything matching a name fragment. A runbook should identify exact managed resources and use the normal Terraform ownership path whenever possible.

Do not embed credentials or customer records in the runbook. Nonsecret identifiers and links to approved credential procedures are enough. The document's purpose is to help an authorized operator make a correct next decision, not to bypass the identity system.

## 12.14 Teardown is the last designed change

Before destruction, decide whether the bucket contains artifacts or object versions to retain, whether the table contains release history to preserve, and whether logs are needed for evidence. The default bucket resists automatic deletion of contents. The table and log group have their own deletion behavior.

Review a normal destroy plan for the capstone. The narrow policy checker will flag delete actions by design, so a cleanup requires the explicit approved destruction path rather than pretending it is an ordinary harmless update.

~~~powershell
terraform -chdir=labs/07-capstone plan -destroy -out=cleanup.tfplan
terraform -chdir=labs/07-capstone show cleanup.tfplan
terraform -chdir=labs/07-capstone apply cleanup.tfplan
~~~

For a nonempty versioned bucket, inspect and deliberately remove only disposable synthetic lab data and all relevant versions/delete markers before retrying. Retained snapshots from optional data-service labs can continue to incur charges after the main resources are gone.

Destroy application roots before backend storage. Preserve needed state/evidence according to the operating policy, then handle bootstrap resources separately. Confirm the actual remaining inventory and billing categories rather than assuming one successful command eliminated every retained resource.

## 12.15 Extend the reference through explicit projects

The first extension is an authenticated read/write API. Define routes, caller authorization, input validation, table permissions, conditional writes, error handling, and data tests before adding a database client. The reference direction keeps the public health route separate and gives the function only the table actions and ARN it needs. Merely passing the table name into the existing handler is not an implementation.

The second extension is a private relational workload using the optional RDS root. Choose supported engine/class values, attach a real client to the intended security group, retrieve managed credentials through an authorized runtime path, and verify connectivity. Add maintenance, backup restore, and deletion-protection procedures. The reference root supplies infrastructure, not a full database application.

The third extension is a production delivery design. Map the portable pipeline onto the organization's runner, configure short-lived trust, protected approval, artifact retention, per-state concurrency, and probes. Verify the actual platform settings instead of assuming a workflow file creates them.

The fourth extension is a multi-account rollout. Start with one authorized target role and separate backend scope, then document module version promotion and recovery. Avoid turning an educational exercise into an unreviewed organization-wide account bootstrap.

Each extension has a complete starting implementation or a clearly bounded design contract in this package. Optional application work is labeled honestly; it is not counted as a finished feature of the reference system.

## 12.16 Learn from incidents without normalizing improvisation

Expertise includes recognizing uncertainty early, choosing the next discriminating observation, and preserving recovery options. During an incident, a small deliberate change can be better than a broad refactor. Afterward, capture the mechanism, evidence, and corrective action while the details are still available.

A useful incident analysis separates the triggering change, contributing conditions, detection, impact, recovery, and prevention. “Human error” is rarely a sufficient technical explanation. A wrong-account apply may reveal missing destination checks, weak role separation, unclear root naming, or an approval that did not bind the actual plan.

Turn repeatable lessons into the appropriate control: a type validation, module contract test, plan rule, narrower role, clearer output, documented migration, or better probe. Do not add every conceivable control to every workflow. Choose the one that addresses the observed failure mechanism with acceptable operating cost.

Keep the educational examples small enough to understand, then practice the same reasoning on supervised real changes. Reading can supply concepts and patterns; expert judgment grows through feedback from actual systems and accountable operation.

## 12.17 A practical path beyond the book

At the beginner stage, become comfortable reading configuration, explaining the plan, and preserving state. At the independent practitioner stage, build focused modules, test contracts, deploy in a sandbox, and diagnose common IAM/network/artifact failures. At the advanced stage, own migrations, provider upgrades, CI boundaries, and recovery drills under appropriate review.

At the expert stage, design boundaries that let other teams work safely, explain tradeoffs without slogans, maintain compatibility, and improve the operating system after incidents. Expertise includes deciding when Terraform should not own an application runtime field or perform a data migration.

You can use the suggested pacing in the README, but there is no required quiz gate. Move more slowly where an explanation is unfamiliar and use the optional applications when a concept needs concrete reinforcement. Skip no prerequisite that a later operation depends on merely to reach the advanced chapter sooner.

The course's companion remains useful as a quick model of the relationships: reconciliation, stable keys, policy boundaries, CIDRs, capacity, locks, migrations, plan rules, artifact identity, architecture choices, and cost sensitivity. Its outputs are computed and inspectable, while its limitations are explicit. Use the actual Terraform/AWS workflow whenever the claim requires real service evidence.

## Worked acceptance record with synthetic observations

The following is an illustrative completed record, not a claim that the course deployed these resources in your account. The account is the verified sandbox; the region is `us-east-1`; the release is `v2`; the backend key is the capstone's distinct dev key. The reviewed plan changes the function environment and leaves the bucket/table identities unchanged.

The operator records the source fingerprint and package/plan digests, then applies that saved plan through the approved path. The endpoint returns `status = ok` and `release = v2`. Direct service inspection confirms public-access blocking and versioning on the artifact bucket. The alarm exists but has no notification action, so the record explicitly states that on-call notification is not yet operational.

A normal plan shows no unexpected infrastructure changes under the observed conditions. The local migration rehearsal reports the same managed ID before and after its address move. The operator notes that neither the health probe nor the local migration proves DynamoDB restore behavior, multi-region availability, or authenticated application CRUD.

This is a strong record because its claims stay inside its evidence. It also makes unfinished operational decisions visible: notification routing, real production account separation, retained-data policy, and any required integration/load tests. A weaker record would say “production ready” after one successful apply and hide those remaining choices.

### Decide whether an extension changes the capstone's purpose

Adding a custom domain can be a focused extension to the HTTP entry point. Adding a full Kubernetes platform introduces a substantially different operating model. Both can be educational, but they should have distinct requirements, cost expectations, and acceptance evidence.

For a custom domain, verify certificate placement and validation, DNS, API mapping, expected hostname, TLS behavior, and the same release response. For a Kubernetes extension, define cluster ownership, workload delivery, identity, networking, upgrades, observability, and recovery before translating the function into a container. Do not treat either as a cosmetic resource substitution.

The reference remains intentionally small enough that one learner can trace every important dependency. Preserve that quality as you extend it. If you can no longer explain which identity reads which data or which state owns a resource, pause expansion and clarify the architecture before adding more services.


## Keep a maintenance backlog tied to evidence

After the capstone review, record remaining work as concrete outcomes: connect and test an approved alarm route, verify a real integration path, review a provider upgrade, rehearse a data restore, or document a production account boundary. Give each item an owner and a reason grounded in the system's requirements.

Avoid a backlog made only of service names to add. More resources do not automatically make the project more advanced. A tested recovery procedure, a narrower permission, or a clearer module migration can demonstrate deeper engineering than another decorative architecture box.

When revisiting the project, start from its actual source, state, versions, and operating record. Recreate a fresh plan and inspect changes introduced by time, dependencies, or external actions. This habit turns a one-time lab into a maintainable system and connects the course's final project to real infrastructure practice.

## 12.18 Your final engineering artifact

A strong capstone submission consists of the source and dependency record, a concise architecture decision, a reviewed plan/run identity, relevant test results, the observed endpoint release, selected storage/monitoring checks, a migration continuity result, and a runbook with teardown and recovery decisions. Keep sensitive state and credentials out of the shared submission.

The supplied reference gives you all the infrastructure and local tooling needed to follow that path. The verification report states which parts were actually executed during authoring and which require your own sandbox. Use that distinction as a model for your own work: make claims as specific as the evidence, and leave the next operator with enough context to continue safely.
