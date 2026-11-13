# Authoring brief

Audience: a learner starting without Terraform or AWS infrastructure experience; familiarity with creating files is sufficient. Command-line, JSON, networking, IAM, Git, and deployment prerequisites are taught locally before use.

Target: independently design, review, test, deploy, refactor, recover, and operate AWS infrastructure; explain resource identity, state, permissions, costs, and failure boundaries.

Boundary: Terraform CLI and the AWS provider, with HCP Terraform and newer orchestration capabilities compared in the expert chapters. This is not an AWS service encyclopedia or a claim that reading alone establishes production expertise.

Deliverables: twelve numbered teaching chapters; continuous book; canonical lab and module source; dependency-free browser experiments; projects with reference approaches; provenance; measured chapter depth; verification evidence; portable ZIP.

Conventions: PowerShell is the primary shell; portable alternatives are called out. Synthetic names and accounts only. Region us-east-1 in examples. Terraform 1.17.2 authoring baseline; AWS provider 6.0.0 deliberately pinned for reproducibility, not claimed to be the newest provider. Node 22+ for the companion. Python 3.12+ for packaging/verification; Python 3.13 for the Lambda runtime. Source review dated 2026-11-13.

Teaching sequence: foundations -> expression language -> authenticated AWS storage -> network -> compute -> shared state -> reusable contracts -> change and recovery -> evidence and security -> automated delivery -> organizational scale -> integrated capstone and expert judgment.

Chapter depth: at least 5,000 cl100k_base tokens each; diagnose prose depth separately from code. Optional guided applications, with solutions, rather than mandatory quizzes.

Companion: localhost-only, no AWS calls or credentials. Computed experiments for reconciliation, expression transforms, IAM reasoning, CIDR/routing, scaling, locking, identity, migration, policy, plan artifacts, architecture, and capstone cost sensitivity. Models explicitly name simplifications.
