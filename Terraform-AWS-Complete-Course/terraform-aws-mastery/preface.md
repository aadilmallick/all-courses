# Preface

Terraform becomes easier when each declaration has a reason and each command has an observable effect. This book teaches those relationships from the beginning, then carries them into AWS systems, team state, migrations, security, delivery, and organizational operation.

The intended reader can create a folder and edit a file. Command-line use, types, API vocabulary, networking, identity, Git, and operational concepts are introduced before they are required. The examples begin without a cloud account and grow into a small, inspectable reference system called Field Notes.

The course uses optional guided applications with reference directions, rather than mandatory quizzes. Treat the suggested effort as a pacing aid. Read slowly where a prerequisite is unfamiliar, run the smallest experiment that makes the mechanism visible, and distinguish educational models from actual Terraform and AWS evidence.

**Baseline:** Terraform 1.17.2, HashiCorp AWS provider 6.0.0, AWS CLI v2, PowerShell as the main shell, Python 3.12+ for local tools, Python 3.13 as the function runtime, and Node.js 22+ for the dependency-free browser companion. The provider is deliberately pinned for reproducibility and is not claimed to be the newest. Source review date: November 13, 2026. Review current releases and security guidance before production adoption.

Code fragments are identified in context; complete source lives in the included labs, modules, assets, and scripts. All account IDs and example names are synthetic. The companion has no AWS access. Real deployments require an authorized sandbox, temporary credentials, destination checks, cost review, and a cleanup decision. No real AWS infrastructure was created during authoring.

The [README](README.md) provides installation, reading order, lab mapping, and commands. The [verification report](verification.md) separates checks actually executed from service behaviors you must verify in your own environment. The [source ledger](sources.json) records partial and unavailable source access honestly. Use the same evidence standard in your own engineering work.
