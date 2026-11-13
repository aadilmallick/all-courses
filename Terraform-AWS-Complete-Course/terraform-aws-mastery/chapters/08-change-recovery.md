# 8. Change, import, refactor, and recover without losing identity

**Central problem:** How can we alter a live infrastructure definition while distinguishing intended updates from accidental replacement, ownership changes, drift, and recovery?

**Prerequisites:** resource addresses, state associations, modules, saved plans, and AWS identity. The fully executable no-cloud migration uses [before](../labs/06-refactor/before/main.tf) and [after](../labs/06-refactor/after/main.tf) snapshots.

## 8.1 A final-state description is not a migration plan

A configuration describes a desired result, but there may be several ways to reach it. Updating a tag, replacing a server image, renaming a resource address, and moving an object into another state all have different continuity requirements. A reviewer needs to understand the transition as well as the final design.

Take a production bucket whose Terraform label is poorly named. Renaming the label can be a state-address migration with no AWS change. Changing the actual bucket name generally requires a different remote object. Copying objects between buckets is an application data migration beyond the resource rename. These operations can look like a few edited words while representing very different consequences.

Begin every change by identifying what must remain continuous: remote ID, hostname, data, permissions, service availability, or ownership history. Then inspect which mechanism preserves that property. A no-destroy plan can still change permissions or application behavior, so “zero destroys” is useful evidence but not a universal safety certificate.

The core discipline is to separate **address identity**, **remote object identity**, and **application continuity**. They are related, but no single Terraform feature guarantees all three.

## 8.2 Read actions at the resource level

A plan can show create, update, delete, replacement, read, no-op, and other operation representations depending on resource kind and CLI version. A replacement combines creation and deletion because a setting cannot be changed on the existing object under the provider's schema or lifecycle rules.

In plan JSON, replacement may have actions such as `["delete", "create"]` or `["create", "delete"]`. Any policy that checks only for actions exactly equal to `["delete"]` can miss replacements. Chapter 9's policy script therefore looks for the presence of `delete` inside the actions array.

Read why replacement is required. The changed argument may be immutable, an explicit replace request may have been made, or a lifecycle trigger may be involved. The root cause determines whether replacement is intended. Removing a lifecycle trigger without understanding it can merely hide the next symptom.

Computed values can change because a dependency is replaced. Follow the dependency chain far enough to understand the blast radius. A small upstream input can produce many downstream replacements. Conversely, a large textual refactor can preserve every remote identity if addresses are migrated correctly.

## 8.3 Preserve an address rename with a moved block

The local before snapshot declares `terraform_data.old_name`. The after snapshot declares `terraform_data.new_name` and includes:

~~~hcl
moved {
  from = terraform_data.old_name
  to   = terraform_data.new_name
}
~~~

The block tells Terraform that the object formerly associated with the old address should now be associated with the new one. It does not rename an AWS resource by itself. It supplies an address-history relationship that planning can apply to the current state.

The source and destination must describe a supported move. Moving between unrelated resource types or provider schemas can have constraints that require provider support and current documentation. Do not assume that a moved block converts arbitrary infrastructure objects into other types.

Keep migration declarations long enough for consumers of older module versions to upgrade through the supported history. Removing them too soon can turn a later consumer's upgrade into a destroy/create proposal. A shared module's migration history is part of compatibility, not obsolete clutter simply because the author has already applied it once.

HashiCorp's [module refactoring guidance](https://developer.hashicorp.com/terraform/language/modules/develop/refactoring) is the primary reference for supported address moves. We use a local built-in resource so the identity effect can be observed directly without cloud risk.

## 8.4 Execute the no-cloud continuity experiment

Use the before directory as the working root. Do not apply the after directory as an unrelated new state; the point is to change configuration against the same existing state.

~~~powershell
terraform -chdir=labs/06-refactor/before init
terraform -chdir=labs/06-refactor/before apply
$taskOriginalId = terraform -chdir=labs/06-refactor/before output -raw identity
Copy-Item ./labs/06-refactor/after/main.tf ./labs/06-refactor/before/main.tf
terraform -chdir=labs/06-refactor/before plan -out=rename.tfplan
terraform -chdir=labs/06-refactor/before show rename.tfplan
terraform -chdir=labs/06-refactor/before apply rename.tfplan
$taskRenamedId = terraform -chdir=labs/06-refactor/before output -raw identity
$taskOriginalId -eq $taskRenamedId
~~~

The first interactive apply should create one local resource after you review and approve it. Copying the after configuration changes the address while preserving the state file in the before directory. The next plan should describe a move with no resource recreation. The final comparison should be true.

The course's verification runner performs this experiment in a temporary copy, so the distributed before snapshot remains the original version. If you follow the commands manually, restore the before source from the archive after destroying the local demonstration, or use your own scratch copy from the beginning.

The intermediate evidence is the important part: original ID, move proposal, applied association, unchanged ID, and a subsequent no-change plan. A script returning success without comparing identity would be weaker evidence because it could have silently recreated the record.

## 8.5 Move a singleton into a module or keyed instance

Extracting resources into a child module changes addresses. A resource that was `aws_s3_bucket.notes` might become `module.storage.aws_s3_bucket.this`. Preserving it requires a move from the old address to the new one in the correct module scope.

Changing a singleton module call into `for_each` similarly changes the address. A migration can associate `module.artifacts` with `module.artifacts["dev"]`. The choice of key becomes part of the long-term identity contract. Do not use a secret, a generated ID, or an unstable list position as a supposedly stable environment key.

This is a conceptual fragment for a compatible module-call change:

~~~hcl
moved {
  from = module.artifacts
  to   = module.artifacts["dev"]
}
~~~

It belongs in the configuration scope containing those module calls. It does not imply that any arbitrary old and new module implementation are compatible. Review the full plan for internal address and argument changes as well.

When converting count-based instances into keyed instances, write the mapping explicitly and verify each existing remote ID. A map such as index zero to `api` and index one to `worker` preserves the intended association only if those indices actually represented those services in the current state. Never reconstruct migration mappings from memory when state can provide evidence.

## 8.6 Import existing objects as a controlled ownership transition

Import associates an existing remote object with a Terraform address. It is useful when adopting infrastructure created manually or by another system. It does not automatically produce a well-designed configuration or guarantee that the object is not already managed elsewhere.

Before importing, identify the remote object, current owner, provider/account/region, and intended Terraform root. Confirm that no other state continues to manage it. Two states managing one object create conflicting authority even if both import operations are syntactically valid.

A declarative import block can look like this illustrative S3 example:

~~~hcl
import {
  to = aws_s3_bucket.adopted
  id = "existing-sandbox-bucket-name"
}

resource "aws_s3_bucket" "adopted" {
  bucket        = "existing-sandbox-bucket-name"
  force_destroy = false
}
~~~

This is a fragment requiring a configured AWS provider and a real authorized sandbox bucket. Resource-specific import identity formats come from the selected provider documentation. Do not invent an ID format from the resource's display name.

Planning the import lets a reviewer inspect both the association and proposed configuration changes. If the configuration omits meaningful existing settings, the same plan may propose changing them. The goal of an adoption phase is often a faithful no-unintended-change representation first, followed by separately reviewed improvements.

## 8.7 Generated configuration is a starting observation

Terraform can generate configuration for some import workflows through documented plan options. Generated text reflects schema and observed values, but it does not understand your architecture, ownership boundaries, or desired module interface. It may contain computed-looking details, defaults, or incompatible combinations that need review.

Treat generation as assistance in reconstructing an object description, not permission to apply a large unexplained file. Normalize names, remove unsuitable attributes, preserve required settings, and compare the resulting plan against the current object. Do this in a controlled adoption branch with the correct state and provider destination.

Importing a parent resource does not necessarily import separately managed companion resources. For S3, versioning, encryption, public-access configuration, and policies have their own resource ownership patterns in the provider. Read the resource-specific guidance and plan the complete ownership transition.

The official [import overview](https://developer.hashicorp.com/terraform/language/import) explains the language workflow. Discovery and generation capabilities continue to evolve; this course's advanced survey distinguishes those from the stable identity principles taught here.

## 8.8 Stop managing without destroying through an explicit removal

Sometimes an object should remain alive while Terraform relinquishes ownership. Deleting its resource declaration normally proposes destruction, which is not the intended transition. A supported `removed` block with destruction disabled can express the different intent.

~~~hcl
removed {
  from = aws_s3_bucket.adopted

  lifecycle {
    destroy = false
  }
}
~~~

This illustrative fragment replaces the corresponding resource declaration in the relevant scope. Review the exact supported address forms and behavior for the selected CLI in the [removed block reference](https://developer.hashicorp.com/terraform/language/block/removed). The resulting object remains in AWS and can continue to incur costs.

A removal is an ownership handoff, not cleanup. Record who manages the object afterward. If another state will adopt it, coordinate the sequence so there is neither dual ownership nor an undocumented gap. Preserve identifiers and evidence without copying sensitive state indiscriminately.

Imperative state commands also exist for exceptional operations. Prefer declarative transitions when they make intent reviewable and repeatable. If an imperative operation is necessary, record its exact target and verify a normal plan afterward. The absence of a resource from `state list` is not evidence that the remote object was deleted.

## 8.9 Lifecycle rules change transition behavior

`create_before_destroy` asks Terraform to create a replacement before deleting the old object where feasible. It can support continuity when both versions may coexist. It cannot override unique-name constraints, account quotas, subnet exhaustion, application incompatibility, or external service limits.

`prevent_destroy` rejects certain plans that would destroy the protected configured resource. It is a useful guardrail but not a complete backup or organizational access control. Removing the resource block also removes the configured rule, so do not rely on it as protection against every possible deletion path. AWS service-level deletion protection can provide a separate layer where supported.

`ignore_changes` delegates management of selected attributes after creation under its documented semantics. It can be appropriate when an autoscaler owns a desired count. It can also conceal important drift if applied broadly. Document the external owner and why ignoring that attribute is correct.

`replace_triggered_by` can make replacement follow another managed change. Use it for a real lifecycle relationship, not as a vague “refresh everything” mechanism. Lifecycle rules are interpreted during graph construction, so their expression capabilities differ from ordinary resource arguments. Check the [lifecycle reference](https://developer.hashicorp.com/terraform/language/meta-arguments/lifecycle) for the selected version.

## 8.10 Preconditions, postconditions, and checks have different force

A precondition expresses an assumption that must hold before the relevant operation proceeds. A postcondition verifies a condition about a resulting value. They can make domain constraints visible near the resource or data they protect. Use error messages that explain the violated assumption without exposing secrets.

A `check` block is intended for ongoing validation-style observations and reports failures differently from a hard blocking precondition. Do not assume every failed check automatically stops an apply. Choose the construct based on the required enforcement behavior, then test that behavior under the pinned CLI.

Conditions can depend on unknown values, so their evaluation may be deferred. A reviewer should know which assertions are established during planning and which can only be checked after application. An assertion that cannot be evaluated until after a destructive operation is not a substitute for pre-change risk review.

For example, a network module can reject duplicate address slots before resource creation. An application readiness check needs an actual endpoint and may run after deployment. Both are useful, but they protect different stages of the workflow.

## 8.11 Drift is an observed difference, not automatically an error

Drift occurs when actual infrastructure differs from the configuration/state expectations used by Terraform. A console edit, external controller, service default, or emergency response can cause it. The correct response depends on whether the external change is legitimate and who should own the setting.

A normal plan refreshes relevant observations unless options alter that behavior, then proposes reconciliation toward the configuration. A refresh-only plan proposes recording observed remote changes in state without the ordinary configuration-driven infrastructure reconciliation. Applying refresh-only does not update the configuration text to match the world.

If an operator intentionally increased capacity during an incident, choose whether to adopt that change into code or restore the declared setting. Do not blindly apply the old configuration just to make a drift alert green. The incident may have exposed a real capacity requirement.

If an external controller legitimately owns an attribute, establish a documented delegation rather than fighting it on every apply. Conversely, do not use ignore_changes to conceal an unauthorized security change. Ownership and intent determine the remedy.

## 8.12 Targeted operations are exceptional tools

The `-target` option narrows selected operations and their dependencies. It can assist recovery or unusual workflows, but routine targeted applies can leave the overall configuration only partially reconciled. They weaken the assumption that a completed run represents the root's full desired state.

Use an ordinary plan after a targeted operation to reveal remaining changes. Record why targeting was necessary and what was excluded. A pipeline that always targets one convenient resource may be encoding a root boundary problem rather than a sustainable deployment model.

Similarly, `-refresh=false` can reduce observation work in particular circumstances but can produce plans based on stale information. Disabling refresh to remove an inconvenient difference does not resolve the underlying ownership or drift issue. Understand which evidence you are choosing to omit.

An explicit `-replace=ADDRESS` request can ask for replacement of a managed resource without relying on the older taint workflow. Review the resulting plan and replacement effects. A replace request is an instruction with operational consequences, not a repair spell that makes any failed application healthy.

## 8.13 Rollback is often a forward change

Reverting a Git commit changes configuration text. It does not guarantee that the previous infrastructure state can be restored safely. A database engine downgrade may be unsupported, a deleted bucket's contents may be gone, or an older provider may not read a state schema written by a newer provider.

For application artifacts, rollback may mean redeploying an earlier immutable package. For infrastructure, recovery may require a new forward change that restores a compatible setting or creates replacement capacity. For data, it may require restoring a backup and reconciling writes. Keep these recovery planes separate.

Before a risky migration, define the point at which reversal becomes difficult. For a schema expansion, old and new application versions may coexist until a later contraction. For a storage migration, dual-read or controlled cutover may be necessary. Terraform can manage supporting resources, but it does not automatically implement the application data movement.

A plan review should include the recovery path and the evidence required to decide whether to continue. “We can revert the PR” is insufficient when the remote operation is irreversible or the old software cannot interpret the new state.

## 8.14 Work a partial apply incident

Imagine a plan creates an IAM role, a log group, and a function. The role and group succeed, but the function fails because the package's handler path is wrong. First preserve the error and current state. The successful resources may already be recorded, so deleting state or restoring a pre-apply snapshot can make the situation worse.

Fix the artifact layout or handler configuration, rebuild if needed, and calculate a fresh normal plan. The expected next proposal should focus on the remaining or corrected function-related work while preserving already-created identities. If it proposes recreating the role and log group unexpectedly, inspect the backend, workspace, and current associations.

After the apply succeeds, invoke the health endpoint and inspect the release. A successful resource operation is not enough to close an application incident. Capture the new evidence and remove obsolete plan artifacts through the normal retention process.

For a destructive data incident, the workflow differs: stop additional harm, preserve relevant versions and logs, establish the last good data state, restore into an appropriate target, and validate before cutover. Terraform state recovery alone cannot recreate deleted object contents without the underlying storage recovery mechanisms.

## 8.15 Make change review readable to another engineer

A good change description names the concrete trigger, before-and-after behavior, preserved identities, intentional replacements, test evidence, and material limits. It need not narrate every command. It should let a reviewer connect the source diff to the plan and the operating objective.

For the local rename, a concise description is: “Rename the managed release record address while preserving its ID through a moved block. The migration plan shows no resource recreation, and the before/after ID comparison passes.” For a production database change, substantially more evidence would be appropriate.

Separate routine generated noise from meaningful differences during your analysis, but do not hide unknowns or replacements in the deliverable. If a provider upgrade changes many computed fields, explain which differences are expected and how you established that. Reviewers cannot approve what they cannot connect to a known mechanism.

Retain migration evidence for the supported consumer window. Shared modules need a versioned compatibility story so a user upgrading from an older release can follow a supported path. Technical correctness on the author's current state is only one consumer case.

## 8.16 Optional application and reference approach

In a scratch copy of the local lab, change the greeting record from a singleton into a `for_each` map with key `primary`. Add the appropriate moved block, plan against the existing state, and verify the original ID survives. The reference direction maps the old singleton address to the new keyed address and keeps its input unchanged during the identity migration.

Then make a separate input change. Separating the rename from the behavior change makes the evidence easier to interpret. If the first plan preserves identity and the second updates only the intended value, you have demonstrated two independent mechanisms rather than hoping a combined diff behaved as intended.

In the companion's **Migration planner**, compare a rename with and without an explicit move mapping. Its output computes continuity from the modeled address relationships and flags deletion/recreation when ownership is not preserved. Return to the real local experiment for executable Terraform evidence.

## Worked handoff: moving ownership between two states

A move inside one state and a handoff between states are different operations. A `moved` block changes addresses within the supported configuration/state context; it is not a general cross-backend transaction. If a platform team transfers a bucket to an application team's state, both sides need a coordinated ownership procedure.

Begin by freezing writers to the affected object. Record its exact remote identity, current owner/state, destination provider/account, and intended destination address. Preserve protected snapshots. The source owner must relinquish management without destroying the object, and the destination must adopt it without creating a duplicate or changing settings unintentionally.

A useful conceptual sequence is:

| Stage | Source state | Destination state | Remote object |
|---|---|---|---|
| Before | Owns object | Does not own object | Exists |
| Controlled handoff window | Relinquishes through reviewed procedure | Not yet authoritative | Remains unchanged |
| Adoption | No longer owns object | Imports exact identity | Same object |
| Verification | Normal plan confirms removal of authority | Normal plan confirms intended association | Settings and ID verified |

The exact commands depend on CLI version, resource support, backend scheme, and organization process. This table is a design contract, not permission to improvise with state files. Avoid a period in which both active states can apply changes to the same object. Also avoid leaving an unowned object without a recorded destination and responsible operator.

### Separate data migration from resource ownership

Suppose the destination architecture requires a differently named bucket. Importing the old bucket under a new Terraform label does not rename the bucket. If the name itself must change, provision the new bucket, design object/version transfer and permissions, verify readers and writers, cut over deliberately, and retire the old bucket under a retention decision.

Terraform can create the source/destination infrastructure and encode selected policies. It does not automatically preserve every object version, metadata field, event notification, application pointer, and external reference through a business data migration. List those dependencies explicitly.

The same principle applies to databases. A new endpoint and a copied snapshot do not necessarily preserve in-flight writes or client behavior. A schema migration can need application compatibility across old and new versions. The infrastructure plan must be integrated with the data and application transition.

### Maintenance windows create a fourth state to observe

For some services, a requested update is accepted but pending a maintenance window. There is then a distinction among desired configuration, recorded Terraform information, current service behavior, and pending service modification. Repeated plans can reflect this transition without indicating a broken provider.

Inspect the service's actual pending changes and the provider's documented update semantics. Decide whether waiting, scheduling, or an immediate-apply change is appropriate. Forcing replacement just to eliminate a temporary diff can produce unnecessary downtime and data risk.

### A stop condition is part of the migration design

Before a risky transition, define observations that require stopping: an unexpected replacement, a mismatched account, missing backup evidence, an unrecognized current owner, a changed remote ID, or an application probe that reports the wrong release. A stop condition should trigger a specific next investigation rather than a vague instruction to be careful.

Also define the resume evidence. For example, after resolving a package error, require a fresh plan against the current state and a successful local handler check. After resolving ownership ambiguity, require both state owners to agree on the handoff and verify the exact object ID. This makes recovery purposeful and prevents repeated trial-and-error applies.


## Compare observed identity after the transition

A migration review should not stop at the plan. Record the important IDs again after application and compare them with the intended continuity claims. If an object was intentionally replaced, verify the new identifier and the old object's disposition. If it was only moved, verify the original identifier remains associated with the new address.

Then check the application-facing property separately: endpoint, release, permitted access, or data availability. Identity continuity is valuable, but an unchanged ID can still contain a harmful configuration update. Conversely, an intentionally new ID can be part of a successful blue/green migration if traffic and data continuity were designed correctly.

The smallest sufficient evidence depends on the promise. For the local record, an ID comparison and normal plan are enough. For a database cutover, connection behavior, data validation, and recovery readiness need their own observations. Scale the evidence to the actual transition.

## 8.17 Transition to systematic evidence

You can now explain the major ways a live system changes: update an object, replace it, preserve it under a new address, adopt it, relinquish it, reconcile drift, or recover from partial work. The next chapter turns those distinctions into tests, policy checks, and security reviews that help a team detect mistakes before authorization and verify behavior afterward.
