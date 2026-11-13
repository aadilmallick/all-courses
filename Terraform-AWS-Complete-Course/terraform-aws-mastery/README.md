# Terraform on AWS: From First Principles to Expert Practice

A complete, practical course built around **Field Notes**, a small system you can understand end to end.

**Start here:** [the continuous textbook](book.md), [the browser edition](book.html), or [Chapter 1](chapters/01-foundations.md).

The package includes twelve substantial lessons, complete Terraform roots and reusable modules, a health-service artifact and readable source, local and mocked tests, plan policy and delivery tools, twelve interactive learning experiments, a capstone, source provenance, and an evidence-based verification report.

## Who this is for

Start with no Terraform or AWS infrastructure experience. You need to create folders and edit text files; the course introduces the command line, API vocabulary, data types, cloud identity, networking, Git, and operational concepts before using them. Experienced engineers can use the chapter outcomes and lab map to locate gaps.

The goal is independent engineering ability: understand a plan, target the right account, model stable identities, design module contracts, test meaningful behavior, deploy through a trusted chain, migrate without unnecessary replacement, and recover with evidence. Reading alone does not confer production expertise; the optional applications and supervised real changes develop judgment.

## Reading order and suggested effort

| Chapter | Central problem | Suggested study/application time |
|---|---|---|
| [1. Foundations](chapters/01-foundations.md) | Reproducible change and the first local lifecycle | 4–6 hours |
| [2. Language](chapters/02-language.md) | Values, types, collections, dependencies, stable keys | 6–10 hours |
| [3. AWS identity and storage](chapters/03-aws-identity-storage.md) | Intended account, temporary identity, private bucket | 5–8 hours |
| [4. Networking](chapters/04-networking.md) | CIDRs, subnets, routes, endpoints, traffic controls | 8–12 hours |
| [5. Compute](chapters/05-compute-services.md) | Artifact, identity, invocation, health, operating models | 6–10 hours |
| [6. State](chapters/06-state-backends.md) | Shared storage, native locks, migration, recovery | 6–10 hours |
| [7. Modules](chapters/07-modules-environments.md) | Reuse with clear contracts and independent authority | 6–10 hours |
| [8. Controlled change](chapters/08-change-recovery.md) | Move, import, relinquish, reconcile, recover | 8–12 hours |
| [9. Tests and security](chapters/09-testing-security.md) | Match each claim to appropriate evidence | 8–12 hours |
| [10. Delivery](chapters/10-delivery.md) | Execute the plan and artifact actually reviewed | 6–10 hours |
| [11. Platform scale](chapters/11-platform-scale.md) | Accounts, data services, upgrades, orchestration | 8–12 hours |
| [12. Capstone](chapters/12-capstone.md) | Operate the integrated system with a runbook | 10–16 hours |

These are planning estimates, not completion requirements. At roughly eight hours per week, allow about three months or more, depending on the depth of your projects. Each chapter motivates a problem, introduces prerequisites, develops a mental model, walks through concrete behavior, explains tradeoffs/failures, and offers optional guided application with a reference direction. There are no mandatory quizzes or hidden mastery gates.

## Tools and declared baseline

| Tool | Course baseline | Role |
|---|---|---|
| Terraform CLI | 1.17.2 exactly | Infrastructure language and lifecycle |
| HashiCorp AWS provider | 6.0.0 exactly | Deliberately fixed reproducible schema baseline; not claimed newest |
| AWS CLI | v2 | Learner authentication and direct service inspection |
| PowerShell | 7 recommended | Primary documented shell |
| Python | 3.12+ locally | Artifact packaging, policy, delivery, book build |
| Lambda runtime | Python 3.13 | Remote health handler |
| Node.js | 22+ | Dependency-free localhost companion |

Source review date: **November 13, 2026**. Review current releases/security advisories before adopting an old baseline in production. Core concepts are separated from version-sensitive APIs. Provider upgrades are taught as reviewed changes. No AWS credentials, provider binaries, downloaded packages, or private source documents are included.

Terraform version constraints do not install the executable. Follow the official installation references in Chapter 1, then check `terraform version`. On Windows, Python may be invoked as `py -3` rather than `python`; use the equivalent command consistently.

## Start without an AWS account

From the extracted course root:

~~~powershell
terraform -chdir=labs/00-local init
terraform -chdir=labs/00-local plan -out=local.tfplan
terraform -chdir=labs/00-local show local.tfplan
terraform -chdir=labs/00-local apply local.tfplan
terraform -chdir=labs/00-local test
~~~

This root uses only the built-in terraform_data resource. It creates local managed records, not AWS resources or real service replicas. Read Chapter 1 before treating the commands as a procedure. Supplying a saved plan to apply is an approval action.

## Run the browser companion

~~~powershell
node companion/server.mjs
~~~

Open **http://127.0.0.1:4173** and stop the server with Ctrl+C when finished. Set `PORT` in your shell if that port is already occupied. The server binds only to localhost and serves a distributed-file allowlist; it does not expose state, local input files, credentials, or provider caches.

The browser app has twelve chapter-linked experiments with real calculations/decision logic, labeled controls, visible results, reset, source inspection, keyboard access, and narrow-screen layouts. It never calls AWS, executes Terraform, or asks for credentials. Each experiment names its simplifications. The cost example uses illustrative editable rates, not live pricing.

The prebuilt [browser textbook](book.html) also opens directly as a local file. It has chapter navigation, search/filtered contents, and readable code/tables. All reading and experiment assets are local; the reference links intentionally lead to official external documentation.

## Real AWS lab contract

Use an authorized sandbox account and temporary credentials. Confirm the caller with AWS STS. Copy the relevant `terraform.tfvars.example` to `terraform.tfvars`, replace the synthetic account ID, and inspect the input. Provider `allowed_account_ids` supplies an additional destination check.

Real applies may incur charges. The default network lab omits NAT, instances, load balancers, and allocated public IPv4 addresses. The serverless capstone still has request, compute, logging, storage, table/recovery, and monitoring cost categories. The optional RDS lab has recurring cost and deletion protection. Current rates, region availability, quotas, and organization policies require your own account verification.

No real AWS resources were created during authoring. Read [verification.md](verification.md) for the exact executed checks and limitations.

## Lab map and expected evidence

| Source | Purpose | Evidence to look for |
|---|---|---|
| [00-local](labs/00-local/main.tf) | Service catalog and language | Filtered manifest, stable keys, 3 test runs |
| [01-bucket](labs/01-bucket/main.tf) | First private S3 deployment | Intended account, public-access block, versioning, encryption |
| [02-network](labs/02-network/main.tf) | Two-zone IPv4 network | Nonoverlapping /24s, explicit associations, S3 endpoint |
| [03-serverless](labs/03-serverless/main.tf) | Public nonsecret health endpoint | Correct release over HTTP; no app data access |
| [04-bootstrap](labs/04-bootstrap/main.tf) | State storage | Private versioned bucket; protected bootstrap state |
| [05-modules](labs/05-modules/main.tf) | Consumer and optional backend migration | Preserved bucket identity after state migration |
| [06-refactor](labs/06-refactor/before/main.tf) | No-cloud address migration | Same managed ID before and after move |
| [07-capstone](labs/07-capstone/main.tf) | Integrated reference | Health release, storage/table controls, alarm, runbook |
| [08-multiaccount](labs/08-multiaccount/main.tf) | Explicit role/provider mapping | Authorized existing target role and independent backend choice |
| [09-rds](labs/09-rds/main.tf) | Optional private PostgreSQL infrastructure | Explicit supported engine/class; recovery/deletion design |

The health API implements only GET /health. It does not implement user authentication, note CRUD, DynamoDB reads/writes, private artifact delivery, custom DNS, or multi-region failover. Optional extensions are clearly distinguished from delivered features.

## Local checks and delivery rehearsal

~~~powershell
node companion/check.mjs
python -m unittest discover -s scripts/tests -v
python scripts/pipeline.py plan --root labs/00-local --out .runs/review-01
~~~

The pipeline produces a concrete saved plan and manifest for review. Its apply command requires that manifest and the reviewed plan digest. It checks consistency and age; it is not an identity/approval server. Production CI must supply trusted runners, protected artifacts, scoped short-lived credentials, actual approval controls, and per-state serialization. See [the adapter notes](references/ci-adapter.md).

For Terraform mock tests, initialize each module with `-backend=false` and run `terraform test` there. Tests can create real resources in other repositories; the supplied mocks and built-in resource types establish this package's local behavior.

## Projects and reference approaches

See [projects.md](projects.md) for six cumulative projects and acceptance evidence, and [references/runbook-template.md](references/runbook-template.md) for a reusable operating note. Reference code is included for the catalog, storage, network, health API, backend pattern, migration, policy, portable delivery, target-account provider, optional RDS infrastructure, and integrated capstone.

## Rebuild and maintain this edition

Canonical text lives in `chapters/`; canonical implementation lives in `labs/`, `modules/`, `assets/`, `scripts/`, and `companion/`. Run `python scripts/build_book.py` to assemble `book.md`, `book.html`, experiment metadata, and the server allowlist. Run the documented verification after changes and recreate the archive from intended files only.

The browser/reading runtime has no third-party dependencies. Optional authoring requirements are pinned in `scripts/requirements-authoring.txt`; they are not required to read, use the companion, run standard-library tests, or deploy the supplied Terraform roots. Provider lock files preserve the official package checksum record; future platforms should initialize through the normal registry path and review any dependency update.

[Sources](references/sources.md) · [Measured chapter depth](references/depth-report.json) · [Verification](verification.md) · [Notices](NOTICE.md)
