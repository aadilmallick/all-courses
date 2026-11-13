# 9. Testing, policy, and security as different kinds of evidence

**Central problem:** How can we catch meaningful mistakes before deployment without confusing a formatting pass, a mocked result, a policy decision, and a real service test?

**Prerequisites:** resource contracts, plans, identity, state sensitivity, and migration behavior. The course includes Terraform tests under each module, [a plan policy checker](../scripts/check_plan.py), and local verification scripts.

## 9.1 Begin with a claim, then choose the evidence

“Tested” is too vague to guide an infrastructure decision. A formatting check establishes consistent presentation. A validation check establishes selected structural and schema relationships. A mocked test can establish a module's response to controlled provider values. An integration test can establish service acceptance and selected real behavior. A production probe can establish a narrow observation at a particular time.

Start by writing the claim. For example: “The network assigns slot zero in the private half to `10.42.128.0/24`.” A mocked Terraform plan can check that expression and configuration relationship. The claim “a private workload can retrieve a specific S3 object through the endpoint” requires a real workload, network path, IAM identity, and object. The first test cannot establish the second claim.

Likewise, “no resource deletion is present in this plan” is a policy-checkable property of the action list. “This change cannot cause an outage” is far broader and cannot be inferred from the absence of delete actions. An in-place security group update can interrupt traffic, and a code update can break application behavior without deleting infrastructure.

The purpose of a layered evidence strategy is to catch errors close to where they become observable and communicate what uncertainty remains. It is not to produce the largest possible number of green badges.

## 9.2 Put checks in an economical order

Run cheap local checks before expensive external work. A practical sequence is formatting, initialization with the intended dependency selection, validation, local/mock contract tests, plan, policy review, human approval where required, apply, and post-deployment probes.

Initialization is part of the dependency workflow and can access networks. Keep the provider lock file committed and use read-only lock behavior in controlled pipelines where appropriate. A test job that silently upgrades dependencies is testing a moving target.

~~~powershell
terraform fmt -check -recursive
terraform -chdir=modules/private-bucket init -backend=false
terraform -chdir=modules/private-bucket validate
terraform -chdir=modules/private-bucket test
~~~

Run formatting from the course root so the recursive scope is clear. `-backend=false` skips backend initialization for module testing; it is not a guarantee that every subsequent operation avoids AWS. The mocked provider in the test file is what prevents its AWS resources from being created.

Tests should be proportionate to the change. A reversible wording correction does not need a cloud integration environment. A module migration that changes addresses needs existing-state evidence. Repeating a broad test suite after no relevant change can consume time without reducing the uncertainty that matters.

## 9.3 Understand Terraform's test execution model

Terraform discovers files with the `.tftest.hcl` or supported JSON test extension. A file contains run blocks and optional variables/provider configurations. A run normally applies unless `command = plan` is selected. Tests can create real resources and incur charges.

The course makes command mode explicit in its tests. The local service-manifest tests use apply against the built-in `terraform_data` resource, which has no AWS effects. The AWS module tests use a mocked AWS provider and plan-based assertions. These are different reasons for avoiding real cloud deployment.

~~~hcl
mock_provider "aws" {
  mock_data "aws_iam_policy_document" {
    defaults = {
      json = "{\"Version\":\"2012-10-17\",\"Statement\":[]}"
    }
  }
}

variables {
  name_prefix = "tf-mastery-test"
}

run "bucket_contract" {
  command = plan

  assert {
    condition = (
      aws_s3_bucket.this.force_destroy == false &&
      aws_s3_bucket_public_access_block.this.block_public_policy
    )
    error_message = "Preserve deletion resistance and public-policy blocking."
  }
}
~~~

This excerpt demonstrates the test's structure; the canonical test file includes the full assertions. The mock policy-document default is syntactically valid JSON for consumers that validate JSON. It is not a useful real trust policy, and the test does not claim that AWS would accept it for every role.

HashiCorp's [test language reference](https://developer.hashicorp.com/terraform/language/tests) and [mocking reference](https://developer.hashicorp.com/terraform/language/tests/mocking) define the version-sensitive execution behavior. The distinction between apply and plan must be understood before running unfamiliar test repositories.

## 9.4 Mocks should model the boundary you need

A mocked provider supplies computed values without calling the real service. Automatically generated placeholder strings are convenient, but downstream configuration may impose structure. An ARN-shaped value, a JSON policy, or a region name may need an explicit default so the test evaluates the intended relationship rather than failing on unrelated placeholder syntax.

During authoring, the health module's first mock run failed because the generated trust-policy value was not a JSON object. The correction supplied a valid JSON-shaped mock at the data-source boundary. That failure was useful: it showed why a mock is a controlled input, not an oracle that automatically understands every downstream semantic requirement.

Do not overfit mocks so every test passes regardless of implementation. If an output depends on a resource association, choose mock values that make the association distinguishable. If two resources receive identical fake IDs, a wiring error can become invisible.

Document the mock's omissions. Our health contract test checks configured timeout, memory, route path, and public-health intent. It does not verify IAM propagation, actual invocation, API response serialization, or runtime availability. Those belong to other checks.

## 9.5 Test invalid inputs as deliberate behavior

A module contract includes failure behavior. The storage module rejects an invalid prefix. The network module rejects duplicate slots. The local module rejects an unknown environment label. Tests can declare the expected validation failure rather than treating it as a broken test run.

~~~hcl
run "reject_bad_name" {
  command = plan

  variables {
    name_prefix = "INVALID NAME"
  }

  expect_failures = [var.name_prefix]
}
~~~

This run is successful when the declared validation failure occurs as expected. It does not mean every diagnostic is acceptable. The expectation should identify the intended condition, and unrelated errors must still be investigated.

Boundary cases are valuable when they exercise the domain: duplicate address slots, a negative replica count, an empty required collection, or an unsupported environment. A large random collection of arbitrary strings is less useful if it does not correspond to a meaningful failure mode.

Avoid imposing mandatory quizzes on yourself as a substitute for implementation evidence. The optional applications in this course let you extend the system and compare a reference direction. Automated checks focus on concrete promises the code makes.

## 9.6 Integration tests need their own lifecycle

A real integration test needs an isolated account or sufficiently isolated resource scope, a bounded identity, unique names, cost expectations, cleanup logic, and evidence of what remains after failure. If cleanup fails, the test runner should surface the remaining resources rather than claiming the test environment vanished.

Do not run a repository's default tests with production credentials merely because the files are called tests. Inspect resource types, provider configurations, run commands, and setup scripts first. The same Terraform engine used for deployment can create meaningful infrastructure during a test.

For the health API, an integration test can deploy a uniquely named sandbox service, call the endpoint, assert status and release, inspect relevant logs, and destroy the environment through a reviewed workflow. That would establish a real end-to-end path for the tested account and region. It would not establish every browser, region, concurrency condition, or failure mode.

The course was authored without deploying to your AWS account. Its verification report distinguishes executed local/mock tests from the provided instructions for real integration. That honesty is part of the engineering standard being taught.

## 9.7 Parse plans as structured data

Terraform can render a saved plan as JSON:

~~~powershell
terraform -chdir=labs/00-local plan -out=review.tfplan
terraform -chdir=labs/00-local show -json review.tfplan |
  Set-Content -LiteralPath ./review-plan.json -Encoding utf8
python ./scripts/check_plan.py ./review-plan.json
~~~

The output path for `Set-Content` is relative to the shell's current directory, while the plan path in the Terraform command is relative to the selected module. This is why the example writes the JSON file explicitly in the course root. Inspect paths carefully when moving commands into scripts.

Plan JSON can contain sensitive values, including values hidden in normal CLI presentation. Protect it like a plan artifact and do not upload it indiscriminately to an external “analysis” website. The [show command reference](https://developer.hashicorp.com/terraform/cli/commands/show) documents its output modes and sensitivity implications.

A policy should parse the schema rather than search the raw JSON text for words such as `delete`. A harmless description might contain that word, while a replacement's action array might be missed by a simplistic exact match. Structured data lets the checker reason about the actual field.

## 9.8 Walk through the included policy checker

The included Python checker reads one plan JSON file and returns a process exit code. It rejects invalid or unsupported input, flags delete actions unless an explicit address allowance is supplied, flags automatic S3 object deletion, and flags public-access-block resources whose required settings are not known true.

The algorithm begins with the plan's `resource_changes` array. For each entry, it reads the address, resource type, action list, planned after-values, and unknown-value markers. If the actions contain `delete`, the change needs the explicit deletion allowance. That catches both deletion-only actions and replacement combinations.

For a planned public-access-block resource, the checker requires the four expected blocking flags to be true. A missing or unknown flag is not silently treated as safe. This is a narrow fail-closed rule for a property whose safe value the policy knows. It does not mean every unknown value in every resource should be rejected globally.

The checker intentionally does not implement the entire AWS authorization model, prove application availability, or scan every possible public-exposure path. It is a teaching-quality executable policy with a documented scope. Extend it only when you can specify the rule's meaning, legitimate exceptions, and test fixtures.

A policy exception should identify the exact resource address and reason through the surrounding review process. A broad “skip security” switch would erase the distinction the policy is intended to protect. The script prints addresses and reasons rather than dumping resource values, reducing unnecessary sensitive output.

## 9.9 Test the policy's dangerous cases

The supplied unit tests use synthetic plan fragments. They cover a harmless create, deletion, replacement in both action orders, an explicit address exception, unsafe bucket destruction, unknown/missing public-access settings, malformed input, and a declared incomplete plan. These cases target the places a naive checker would plausibly fail.

Run the tests with Python's standard unittest runner:

~~~powershell
python -m unittest discover -s ./scripts/tests -v
~~~

A fixture is not a captured private account plan. Synthetic minimal cases make the policy logic reviewable and portable. The verification workflow also runs the checker against a real locally generated Terraform plan so the parser is exercised on actual CLI output.

A passing policy result means only that the encoded rules passed on the supplied plan representation. It is one input to approval. Human review still needs to consider account, environment, application semantics, costs, data retention, and the recovery path.

## 9.10 Secrets have a dataflow, not just a label

A secret can enter through a variable, environment, data source, or generated value. It can then flow into resource arguments, state, plans, logs, outputs, artifacts, and application configuration. Security review should follow the value through that path.

`sensitive = true` marks a value for restricted normal display. It does not generally prevent persistence in state or saved plans. Terraform's newer ephemeral values and provider write-only arguments offer different persistence semantics in supported contexts, but support depends on CLI and provider/resource schema.

For example, the following is an illustrative variable declaration, not a complete database deployment:

~~~hcl
variable "database_password" {
  type      = string
  sensitive = true
  ephemeral = true
}
~~~

An ephemeral value cannot be inserted into arbitrary persisted attributes. It must flow through contexts that support ephemeral use, such as a compatible write-only argument. Marking an input ephemeral does not magically make a normal password argument nonpersistent. Check the exact provider resource schema.

HashiCorp's [sensitive-data guidance](https://developer.hashicorp.com/terraform/language/manage-sensitive-data) distinguishes presentation, ephemeral values, and write-only support. The pinned RDS schema includes write-only password capabilities, but the course does not deploy a database merely to demonstrate the syntax.

## 9.11 Prefer not handling a secret when the service can manage it

Some AWS services can generate and manage credentials through an integrated secret-management path. For RDS, a managed master-password design can avoid supplying a plaintext password through ordinary Terraform inputs. It still creates an access and key-management system that needs review.

A secret stored in Secrets Manager can still enter Terraform state if a normal data source reads its secret value and passes it into a persisted argument. Moving the storage location is not the same as changing the infrastructure tool's dataflow. If the application can retrieve the secret at runtime through its role, Terraform may need only to configure the secret reference and permissions.

Environment variables are convenient configuration but not a universal secret boundary. Users with relevant management permissions can often inspect them, and application logging can expose them. Choose a delivery mechanism based on who may read the value, when it must be available, and which systems retain it.

Rotate secrets through a deliberate service/application process. Terraform resource replacement is not automatically a correct rotation protocol. A database credential change can require coordinated client updates, overlap, and verification to avoid an outage.

## 9.12 Supply-chain trust applies to infrastructure tooling

Terraform providers are executable plugins. Modules are code that can influence infrastructure and, through provisioners or external integrations, may execute additional commands. A registry hostname or popularity score is not proof that a dependency is appropriate for your environment.

Review provider source identity, version, checksums, release provenance, and compatibility. Commit the dependency lock file. For modules, pin reviewed versions or immutable references and inspect meaningful changes. Keep dependency upgrades in a workflow with representative plans and tests.

The course uses the official HashiCorp AWS provider at a fixed version and includes its lock records. The validation environment initially obtained the provider through the registry's signed package path, then reused that known package locally. The final package does not distribute provider binaries, credentials, or plugin caches.

Be cautious with provisioners and external data sources. They can cross from declarative infrastructure into arbitrary process execution. When they are necessary, document input trust, idempotence, failure behavior, secrets handling, and the verification path. Prefer purpose-built resources and external build pipelines when those provide a clearer ownership model.

## 9.13 Static scanners complement, rather than replace, design

Tools such as infrastructure linters, security scanners, and policy engines can identify known configuration patterns. Their usefulness depends on maintained rules, selected versions, appropriate exceptions, and clear integration into review. A scanner cannot infer every business requirement from a resource block.

This course provides an executable small policy checker rather than assuming a particular commercial scanner is installed. For a production tool choice, consult current primary project documentation and evaluate language/provider support, rule transparency, integration, and maintenance. Do not install arbitrary plugins solely because a course mentions the category.

Policy as code platforms such as OPA or Sentinel can express organization-wide rules and integrate with execution systems. The same design questions apply: what claim does a rule make, what input schema does it consume, how are unknown values handled, and who can approve a scoped exception?

A rule that rejects all changes may be safe in a narrow sense but unusable. A rule that allows everything is easy to operate but meaningless. Effective policy encodes a real boundary with a supportable exception process and tests for its likely failure modes.

## 9.14 Security review across the actual architecture

For the health service, review the public endpoint's intentionally limited behavior, the Lambda invocation scope, the execution role's logging-only permissions, artifact identity, runtime, log retention, and absence of secret output. For the bucket, review public access, ownership, encryption, TLS, data retention, and authorized readers.

For the network, review routes and workload security relationships separately from IAM. A private subnet is not proof of data confidentiality. For the backend, review who can read state, who can write it, who can remove locks, how versions are recovered, and how identities are audited.

For CI, review who can modify the workflow and source that receives credentials. A narrowly scoped cloud role does not help if an untrusted pull request can alter a job that assumes that role and then execute arbitrary commands. The trust boundary includes the repository and runner, not only AWS.

Threat modeling can remain practical: identify the valuable data or authority, the legitimate actors, plausible entry paths, and the controls that restrict those paths. Then choose tests that demonstrate the relevant control rather than relying on a generic label such as “private” or “encrypted.”

## 9.15 Optional application and reference direction

Add a synthetic policy fixture where a resource replacement is represented as `["create", "delete"]`. Confirm that deletion review is still required. Then add a public-access-block fixture with one flag unknown. The reference result is a failure that names the resource and unknown required property without printing the rest of the plan.

For a module extension, add a test for an empty zone map and confirm the intended input validation rejects it. A good assertion identifies the contract, not just the current implementation. Keep real AWS integration optional until the test account, costs, and cleanup procedure are explicit.

The companion's **Plan policy** experiment computes decisions from action arrays and selected flags. Compare its result with the Python checker on equivalent synthetic cases. Both are deliberately limited models; the real saved-plan check is the executable workflow used for course verification.

## Worked test design: prove one property at each boundary

For the network module, a deterministic expression test can verify that private slot zero produces `10.42.128.0/24`. An input test can verify duplicate slots are rejected. A real integration check can verify AWS accepted the chosen zones and created the intended route associations. A workload test can verify a permitted S3 request from an actual private client. These are four distinct claims with increasing external requirements.

Write the expected failure for each test as carefully as the success. If the duplicate-slot test fails because an unrelated mocked ARN is malformed, it has not demonstrated the intended validation behavior. Fix the test fixture boundary, then rerun the meaningful assertion. A green test caused by skipping the broken branch is not equivalent.

For the health service, the local Python tests verify method/path behavior and release serialization. The mocked Terraform test verifies selected configuration settings. A real HTTP probe verifies API integration and the deployed handler. A load test would address a different claim about behavior under traffic, and it needs separate cost and capacity controls.

### Define the plan policy's trust boundary

The checker consumes a JSON representation produced by the selected Terraform CLI. It assumes that the caller supplies the intended saved plan and protects it from replacement. It cannot establish that relationship merely by reading a filename. The delivery pipeline adds digest consistency, while the runner/artifact system must supply authorization and provenance.

The checker also assumes that its rule set is the intended policy. A contributor who can change the policy script in a privileged job may be able to weaken the rule before running it. Protect policy changes through the same review and authority model as deployment workflow changes. A policy file is executable governance, not neutral documentation.

Exceptions should remain visible. If a resource deletion is legitimate, record the exact address and the surrounding approved reason. An allowance for one address should not permit another resource's deletion. The unit tests include this distinction because exception broadening is a plausible implementation mistake.

### Threat-model the course's deployment chain

| Asset or authority | Plausible exposure path | Appropriate control/evidence |
|---|---|---|
| Cloud role session | Untrusted workflow source receives credentials | Constrained event/ref trust and protected privileged execution |
| State values | Broad artifact upload or debug transcript | Scoped access and deliberate redaction/retention |
| Provider executable | Unreviewed dependency change | Source identity, lock checksums, trusted distribution |
| Application package | Mutable file changed after review | Content digest and protected artifact identity |
| Bucket data | Overbroad object permissions | Purpose-specific role, resource scope, access verification |
| Deletion authority | Replacement missed by action parser | Array-aware delete detection and exact exceptions |

This table does not claim to enumerate every threat. It demonstrates how to connect a valuable asset, a concrete path, and evidence about a control. A generic checklist can help inventory, but the architecture-specific relationship is what makes a review actionable.

### Unknown values need a rule-specific decision

Rejecting every unknown would make many valid plans impossible because generated IDs are naturally unavailable before creation. Allowing every unknown would let an unenforceable required security property pass. The policy must distinguish between unknown values that are expected identifiers and unknown values whose known safe setting is required for the rule.

For public-access blocking, the desired booleans should be explicit in configuration, so requiring known true is reasonable. For a provider-generated bucket suffix, unknown is normal and does not indicate unsafe exposure. This is why the checker targets named properties instead of treating the entire plan as a flat collection of strings.

If the input plan declares itself incomplete or errored, the educational checker rejects it. A production policy engine may have richer staged-plan semantics, but those need deliberate support. Failing closed on an unsupported schema or action prevents the parser from silently treating a new representation as safe.

### Verify the tests can detect the intended regression

A meaningful test suite should fail when the protected behavior is intentionally broken in a temporary working copy. For example, change force-destroy to true and observe the contract or policy failure; restore it afterward. This is a targeted mutation check, not a requirement to build an elaborate mutation-testing platform for every small change.

Similarly, a replacement fixture should fail regardless of action order. A malformed plan should produce an input error rather than a success. A handler test should detect an incorrect release value rather than merely checking that a dictionary exists. These examples keep test maintenance tied to plausible mistakes.

Do not leave deliberate broken mutations in the final source or package. Rebuild verification outputs from the restored canonical source so the evidence corresponds to the delivered edition.


## Keep evidence aligned with the delivered revision

When a check finds a real defect, fix the canonical source and rerun the affected checks before packaging. A report from an older revision is historical evidence, not proof about the current one. The same applies when a generated artifact is rebuilt after source changes.

Record enough version information to reproduce the relevant result: CLI/provider selection for Terraform, runtime for the handler, and model source for companion calculations. Avoid collecting unrelated machine details that add noise without explaining behavior.

A useful verification report separates local execution, mocked execution, structural inspection, browser interaction, and unexecuted cloud integration. Readers can then decide what additional evidence their environment requires. This is more actionable than an unqualified statement that everything works, and it makes future maintenance easier because each claim has an identifiable check.

## 9.16 Transition to a trusted delivery chain

Checks become most useful when they run on the same source, dependencies, inputs, and artifacts that will be deployed. The next chapter assembles that evidence chain into CI and delivery, with short-lived credentials, protected execution boundaries, explicit plan approval, and no hidden rebuild between review and apply.
