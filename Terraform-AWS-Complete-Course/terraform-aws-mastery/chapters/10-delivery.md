# 10. Deliver the change that was actually reviewed

**Central problem:** How do we connect source review, dependency selection, a saved plan, authorization, execution, and post-deployment evidence without letting untrusted code inherit deployment authority?

**Prerequisites:** state locking, module contracts, plan JSON, policy checks, and artifact identity. The complete portable implementation is [scripts/pipeline.py](../scripts/pipeline.py). It runs locally or inside a CI runner that already has the declared tools and approved credentials.

## 10.1 CI and delivery are a chain of trust

Continuous integration runs checks when code changes. Delivery turns an approved change into an operational system. Infrastructure delivery is especially sensitive because the code under review can alter identities, network paths, data stores, and the machinery that performs future changes.

A trustworthy chain connects a specific source revision to selected dependencies, explicit inputs, built application artifacts, a plan, policy results, approval, an executor identity, and observed results. If one link changes without another review, the final deployment may no longer correspond to what was approved.

For example, a reviewer can approve a plan for release A while the apply job downloads a mutable `latest` package that now points at release B. The Terraform source diff may look unchanged, but the deployed bytes differ. Likewise, approving a speculative plan and later running an unconstrained `terraform apply` calculates a new plan rather than necessarily executing the reviewed proposal.

The objective is not to make plans live forever. It is to ensure a short-lived reviewed proposal is executed in the intended context, with fresh replanning when relevant facts change. Automation should reduce ambiguity, not hide it behind a green pipeline icon.

## 10.2 Teach the Git prerequisite explicitly

Git records snapshots of files and the relationships among those snapshots. A **commit** identifies a source state. A **branch** names a moving line of development. A pull request or merge request proposes integrating changes and provides a place for review. None of these automatically runs Terraform or grants cloud permissions.

For a course folder you choose to maintain in your own repository, initialize Git, review the ignore rules, add intended source files, and make an initial commit. Keep state, local variable files, saved plans, credentials, and dependency caches out of that commit. Check what is staged before committing.

A source diff is valuable because it shows intent, but it is not the same as a Terraform plan. Changing a module source version can produce a large infrastructure difference with a small text diff. A plan connects the source and inputs to the current state and provider observations.

Repository permissions are part of deployment security. If someone can modify a workflow that receives production credentials, they may be able to change how those credentials are used. Protect the source and workflow paths that define privileged execution, and make review requirements match that authority.

## 10.3 Separate untrusted checks from credentialed operations

A pull request from an untrusted contributor can run harmless syntax and unit checks in a restricted context. It should not automatically receive a privileged cloud role. Terraform configurations can include executable integrations, so merely limiting the intended command to `plan` does not make arbitrary source safe to execute with credentials.

Even read-oriented plan roles can expose sensitive state and infrastructure metadata. A plan job's privilege is not zero. Decide which source revisions and event types may receive that role, and keep untrusted contribution workflows separate from protected deployment workflows.

Avoid a workflow pattern that checks out untrusted code in a privileged event context and then runs it with secrets or OIDC authority. The security boundary depends on the event, checkout target, repository permissions, runner, action code, and cloud trust policy together.

The course does not activate any hosted workflow or create a repository. Its portable pipeline is complete code that you can run locally and adapt to your existing CI system. The included CI adapter notes state the runner and trust prerequisites rather than pretending that a YAML file alone configures repository protection.

## 10.4 Use short-lived cloud identity through a constrained trust

OpenID Connect, or OIDC, allows a CI platform to present a signed identity token that a cloud role trust policy can validate. The role session then uses temporary AWS credentials. This avoids storing a permanent access key as a repository secret, but it does not eliminate authorization design.

For GitHub Actions with AWS, the trust needs an intended audience and a constrained subject representing the authorized repository/ref or environment pattern. An unconstrained trust can allow unintended workflows to request the role. AWS permissions on the role should then limit what the resulting session can do.

GitHub's [OIDC for AWS guide](https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws) and the official [AWS credential action](https://github.com/aws-actions/configure-aws-credentials) explain the integration. This is an architecture example; no identity provider or role is created by reading the chapter or running the local-only checks.

Separate planning and applying roles where that improves the trust model. The plan role needs backend read/locking behavior and relevant read APIs; exact requirements depend on the provider operations. The apply role needs approved mutation authority. Both roles may need additional constraints such as permission boundaries and account allowlists.

Do not claim a universal minimal policy for every Terraform plan. Data sources, refresh behavior, and resources vary. Derive policies from the supported workflow and validate them, including explicit denies and organization controls.

## 10.5 Define a stable run identity

A deployment run should identify its root, backend/state scope, account/region, source revision or source fingerprint, CLI version, provider lock selection, input identity, artifact digests, and plan digest. These are related but independent dimensions.

The supplied pipeline computes a source fingerprint over the course's relevant Terraform and artifact source files and records the saved plan's SHA-256 digest. It also records the selected CLI version and root path relative to the course. The manifest is a consistency record, not a cryptographic signature or an independent authorization service.

If an attacker can replace both the plan and manifest in an unprotected directory, hashes alone do not prove provenance. Production CI should protect artifacts, job identity, access, and approval records. A signed attestation can add stronger provenance under a suitable key and trust system; it still needs a verified relationship to the executor.

The source fingerprint intentionally includes shared module files, not only the root's `main.tf`. Otherwise a changed child module could slip between planning and applying without changing the root file. Application artifact bytes are included because the function package is part of the deployment input.

## 10.6 Handle Terraform's detailed exit codes correctly

`terraform plan -detailed-exitcode` uses zero for a successful no-change plan, two for a successful plan containing changes, and one for an error. A generic shell failure rule that treats two as an error can break a correct plan job. A permissive rule that ignores every nonzero result can proceed after a real failure.

The pipeline handles these outcomes explicitly. It accepts zero and two, rejects one or unexpected failures, and only then renders plan JSON and runs policy. This is an example of adapting automation to a tool's actual contract rather than guessing from common conventions.

A no-change plan can still contain output updates or other representation details that deserve appropriate handling. Read the actual plan and manifest. The code does not use a hard-coded expected resource count as a substitute for review.

The CLI wrapper option in hosted setup actions can also affect how output and exit codes are exposed. If using [HashiCorp's setup action](https://github.com/hashicorp/setup-terraform), understand its documented behavior and select wrapper settings deliberately. The portable Python pipeline invokes the native Terraform executable directly.

## 10.7 Run a complete local planning pipeline

With Terraform and Python available on PATH, use the local lab first:

~~~powershell
python ./scripts/pipeline.py plan --root labs/00-local --out .runs/local-review
~~~

The command checks the root is inside the course labs, initializes it with the declared dependency behavior, validates it, creates a saved plan, writes its JSON representation, evaluates the narrow policy, and writes a review manifest. It does not apply the plan.

Read the printed paths. Inspect the human-readable plan through Terraform and inspect the manifest. The output directory can contain sensitive plan data when used for AWS roots, so use a protected directory and a short retention policy. The local exercise contains only synthetic data.

The `.runs` directory is ignored by the course's source-control rules. Ignoring a directory prevents accidental normal Git addition; it is not an access-control mechanism. On a shared runner, configure filesystem permissions, artifact permissions, and cleanup through the runner platform.

For an AWS root, establish the backend and approved identity first, provide the root's actual nonsecret inputs, and use the same command with the intended lab root. The provider account allowlist remains an additional check. The pipeline deliberately does not create a missing cloud identity or silently choose a different profile.

## 10.8 Authorize one concrete saved plan

After reviewing the plan, the pipeline's apply command requires its manifest and the plan digest as an explicit approval argument:

~~~powershell
python ./scripts/pipeline.py apply --manifest .runs/local-review/manifest.json --approve PLAN_SHA256_FROM_REVIEW
~~~

Replace the displayed placeholder with the actual digest from the manifest after review. The script verifies the plan bytes, relevant source fingerprint, CLI version, root, and age before invoking Terraform with the saved plan. A stale state can still make Terraform reject application; the script does not bypass that native protection.

The digest is not a password. Requiring it makes the selected proposal explicit in this educational workflow. In production, a protected approval gate should bind an authorized reviewer and approved artifact/run identity. A caller who can run the apply command already has meaningful local authority.

Do not rebuild the Lambda ZIP after planning and before this apply. If the source or artifact changes, generate and review a new plan. Do not edit the manifest to make a mismatch disappear. The mismatch is evidence that the proposed execution context no longer matches the reviewed one.

## 10.9 Plan age is a policy choice

The pipeline uses a four-hour default maximum age. This is a teaching policy, not a universal Terraform requirement or a guarantee that any younger plan is safe. A rapidly changing production system may need a much shorter review interval. A carefully frozen maintenance window may support another bound.

Relevant state changes can invalidate a plan regardless of wall-clock age. External service behavior and permissions can also change without updating the state serial. A recent plan reduces some uncertainty but does not eliminate the need for post-deployment verification.

When a plan expires, regenerate it and obtain the appropriate review. Do not treat approval as permission to keep recalculating different plans until one happens to apply. If the new plan is materially different, explain the difference and review it as a new proposal.

A deployment system should make this workflow convenient enough that people do not work around it. Clear artifacts, concise summaries, and fast local checks support safety by reducing unnecessary friction.

## 10.10 Protect and serialize the apply boundary

Use one concurrency key per state identity for applies. If the key is only the repository name, unrelated roots may block each other unnecessarily. If the key is only the branch name, two branches may modify the same state concurrently. The correct unit follows the actual backend/state ownership.

Backend locking remains enabled. Pipeline serialization coordinates jobs known to the CI system; backend locking coordinates clients using the same backend. Neither prevents another state from managing the same object, so ownership discipline remains essential.

A protected environment can impose approvals or branch restrictions depending on the CI platform and account plan. GitHub documents environment behavior and availability in [deployment environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments). Merely writing an environment name in YAML does not prove that required reviewer rules exist or are available for the repository's plan.

Verify protection through the actual repository settings and a controlled test. Record who can change those settings. An approval gate that a deployment author can silently disable may not provide the separation of duties the organization assumes.

## 10.11 Apply is followed by observation, not celebration

After Terraform succeeds, run probes tied to the change's purpose. For the health API, retrieve the endpoint, call it, and verify the expected release. For a network change, verify the relevant source-to-destination path. For a backend migration, verify associations and a normal plan. For a data-store change, verify the required data behavior and recovery properties.

Record the apply outcome and probe results with the same run identity. A failed probe should initiate diagnosis rather than automatically declaring infrastructure rollback safe. The appropriate response depends on what changed and which recovery path was designed.

Logs can contain sensitive data, so capture narrow evidence. A health response with status and release is enough for this demonstration; there is no reason to archive every environment variable or full state snapshot in a public build summary.

A periodic drift plan can detect later differences, but recurring scheduling is an operational choice for your team. This course describes how to interpret those results and does not create any standing cloud job or automation in your account.

## 10.12 Cache dependencies without caching authority

Provider caches can reduce download time. They should preserve integrity checks and be scoped to avoid untrusted jobs poisoning privileged execution. A cache is an optimization, not the authority for which package is allowed; lock records and trusted distribution still matter.

Do not cache credentials, initialized backend metadata containing sensitive configuration, state files, or plan artifacts as if they were harmless package data. A broad “cache the entire working directory” rule can retain exactly the operational information you intended to keep short-lived.

Application build caches have similar considerations. A reproducible artifact should be identified by its bytes and produced in a trusted context. If a privileged deployment accepts arbitrary cached output from an untrusted pull request, the source review may no longer describe the deployed code.

The course archive excludes `.terraform`, plugin caches, run outputs, and authoring dependencies. It includes dependency lock records and readable source. That packaging choice models the distinction between reproducible inputs and machine-local execution data.

## 10.13 Failure paths need explicit behavior

If formatting fails, stop before cloud access. If initialization cannot verify dependencies, stop rather than falling back to an unknown provider. If validation fails, report the relevant diagnostic. If policy fails, preserve the protected plan for review and do not invoke apply.

If apply fails partway, preserve the state and diagnostics, stop other writers, and calculate a fresh plan after addressing the cause. Do not rerun an old saved plan after manually changing infrastructure and assume it still represents the system. If the runner disappears, inspect lock ownership before any force-unlock action.

If the application probe fails, compare the expected release, artifact hash, handler behavior, role, invocation permission, and logs. The evidence chain narrows the problem: you know which package and infrastructure proposal were intended, so you can investigate the actual mismatch.

If a secret leaks into logs or artifacts, treat it as a credential/data incident under the appropriate process. Removing the visible line from the current file does not erase historical artifacts. Rotation, access review, and retention cleanup may be required depending on the secret and exposure.

## 10.14 AI assistance fits inside the review boundary

An AI assistant can explain a plan, propose a module refactor, or draft tests. It should not be treated as an authority that makes a risky plan safe merely by describing it confidently. Give it the smallest nonsecret context required and verify the proposed code against primary documentation and executable checks.

A useful review prompt is: “Review this sanitized Terraform diff and plan summary for address changes, replacements, widened permissions, state-boundary mistakes, and missing recovery steps. State uncertainty, cite the relevant official schema, and do not propose application until the concrete plan is reviewed.” This is a prompt you may choose to use; it is not an action performed by the course.

For code generation, ask for a complete change with explicit inputs, provider baseline, supported paths, tests of meaningful behavior, and a statement of what was not executed. Avoid pasting raw state or secret-containing plan JSON into an external assistant without an approved data-handling basis.

The best use of assistance is to make reasoning and evidence clearer. Retain human accountability for authorization, organizational context, and the operational consequences of the change.

## 10.15 Optional application and reference direction

Run the planning pipeline for the local lab. Copy the manifest's plan digest into the apply command after review and verify that the local resources appear. Then change a relevant source file in a scratch copy and try to apply the old manifest. The expected reference behavior is rejection before Terraform application because the source fingerprint changed.

Restore the source or create a new plan; do not edit the recorded fingerprint. Separately, change a byte in a copied saved plan and confirm its digest check fails. These experiments demonstrate consistency checks, not protection against an attacker who controls both the trusted runner and all artifacts.

For a CI design exercise, map the portable stages onto your organization's runner. Identify the untrusted event boundary, cloud role trust conditions, protected artifact store, state concurrency key, approval mechanism, and post-apply probe. A reference design names the actual authority at each point rather than writing a single job with permanent administrator keys.

## Worked runner contract: map the portable pipeline onto CI

A CI adapter needs less hidden machinery when the underlying workflow is already an executable script. Define a runner image containing the selected Terraform CLI, Python, and any required build tools. Record the image identity and update process. Then map events and stages onto the portable commands rather than reproducing their logic inconsistently in several shell snippets.

An untrusted validation stage can run formatting, Python tests, local Terraform tests, and mocked module tests without cloud credentials. It still needs network/dependency controls and bounded runner resources. It should not read production state, receive the deployment role, or upload arbitrary local files as public artifacts.

A protected plan stage checks out an approved source revision, obtains the planning identity, initializes the intended backend, supplies explicit environment inputs, builds or retrieves the approved application package, and runs `pipeline.py plan`. It retains the saved plan, JSON, and manifest in a protected short-lived store. The human-readable summary should identify meaningful actions without dumping secret values.

An approval stage binds an authorized reviewer to that run and plan digest. Its mechanism comes from the actual CI platform and repository settings. A string variable called `APPROVED=true` in source is not an independent reviewer. Verify that the person proposing the change cannot silently redefine the approval control when separation is required.

A protected apply stage retrieves the same source and artifacts, obtains the applying identity, verifies context, serializes against the state, and invokes the saved-plan command. It does not run a fresh unconstrained apply as a substitute. Afterward, a probe checks the expected release and relevant service properties.

### What the portable script verifies

The script constrains roots to this course's labs, checks formatting and configuration, saves a detailed plan, evaluates the included narrow policy, and records a SHA-256 digest. At apply it compares the plan bytes, relevant source/artifact fingerprint, CLI version, root location, and age. Terraform itself then enforces its saved-plan/state consistency behavior.

The fingerprint includes ordinary Terraform source, test configuration, lock records, local variable files, Python tooling, and the packaged ZIP in the selected source areas. It deliberately excludes generated state and provider caches. The aim is consistency of reviewed deployment inputs, not a general repository integrity monitor.

The script does not authenticate the human reviewer, inspect repository branch protection, verify a cloud OIDC trust, or prove that a manifest came from a trusted job. It also does not record secret environment values in the manifest. Saved plans retain planned ordinary input values, while credentials and supported ephemeral values have different runtime handling. Production integration must verify the execution identity and protected artifact provenance separately.

This explicit limit is important. Hashes answer whether bytes match an expected digest. A signature or trusted platform record can help answer who vouched for that digest. Authorization decides whether that actor may approve deployment. These are related but distinct claims.

### A complete stage handoff record

A useful handoff record can contain a run ID, source commit/fingerprint, root/state identity, target account/region, CLI version, provider lock digest, package digest, plan digest, policy result, creation time, reviewer identity, and expiry. Avoid copying secret values into the record to make it appear more complete.

At apply, compare the actual context to the record. If the cloud role is wrong, stop even if the file hashes match. If the root/state key is wrong, stop even if the source commit is right. If the plan bytes differ, stop even if the filename is unchanged. Each check protects a different link.

After application, append the executor/run result and probe evidence through the CI platform's normal record system. The manifest shipped by the educational script remains a consistency artifact, so do not retroactively edit it to describe a different plan or package.

### Work through a rejected apply

Assume a plan was reviewed at 10:00 for package A. At 10:15 a developer rebuilds the ZIP from changed source into the same filename. At 10:20 the apply stage compares source/artifact fingerprints and refuses. The correct response is a new build identity and a new reviewed plan, not manually copying the old digest into the new manifest.

Now assume the package is unchanged but another valid deployment updates the state at 10:18. Terraform may reject the old saved plan as stale. Again, replan against the new state and review the result. The previously approved intent may still be desirable, but the executable proposal must be recalculated in the current context.

Finally, assume the plan and state are unchanged but the apply role loses permission. Execution can fail despite a valid plan. Preserve partial results and diagnose the authorization boundary. A plan is not a reservation of future permissions or service capacity.

### Keep summaries useful and nonsecret

A CI summary should lead with destination, root, source/run identity, and meaningful changes. List replacements and deletions explicitly. Summarize the purpose of IAM changes rather than printing every sensitive value. Link authorized reviewers to the protected full plan when deeper inspection is necessary.

If a generated plan is too large to review coherently, investigate broad dependencies, accidental churn, provider upgrades mixed with feature changes, or an overly broad root. Truncating the plan until it looks small does not reduce the operational change. Improve the change's structure and explanation.

A failed job should identify the failed stage and next useful action. “Pipeline failed” alone forces the next operator to reconstruct the entire workflow. A precise message such as “plan digest differs from reviewed artifact; generate a fresh review” points directly to the consistency boundary.


## Preserve a usable emergency path

A protected delivery process still needs an incident procedure for unavailable runners, expired identity integrations, or urgent restoration. Define who may authorize an exceptional run, which identity is used, how state locking remains intact, and how the action is recorded afterward. An emergency path should preserve accountability rather than becoming a permanent shortcut around normal review.

If a manual apply is authorized, use the intended source, dependency lock, inputs, backend, and account checks. Capture the concrete plan and outcome under appropriate access controls. After service recovery, reconcile the normal pipeline with the actual state so the next automated run does not undo the emergency change unexpectedly.

Do not store a permanent administrator key in a shared document as the emergency design. Use the organization's approved identity recovery mechanism and test that authorized operators can obtain it when the normal CI system is unavailable.

The educational pipeline intentionally remains smaller than a full enterprise control plane. Its value is that you can inspect every consistency check and map it onto a real authority model. Keep that distinction visible when adapting it: add the platform controls your organization actually needs, verify their settings, and avoid claiming that an extra script argument creates independent approval.

## 10.16 Transition to organizational scale

A reliable single-root pipeline is a building block. At organizational scale, accounts, regions, root ownership, provider upgrades, platform services, and data recovery introduce additional coordination. The next chapter shows how to preserve the same explicit relationships while the number of teams and systems grows.
