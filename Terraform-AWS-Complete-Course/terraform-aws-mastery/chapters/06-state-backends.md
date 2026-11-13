# 6. State as a shared operational system

**Central problem:** How can a team coordinate ownership, prevent simultaneous writes, protect sensitive values, and recover when state storage or an operation fails?

**Prerequisites:** the difference between configuration, state, and remote objects; AWS identities, S3, and IAM. This chapter uses [the bootstrap root](../labs/04-bootstrap/main.tf) and [the module-consumer root](../labs/05-modules/main.tf).

## 6.1 Why a configuration file cannot replace state

Suppose the code declares a bucket with a generated name suffix. After creation, Terraform needs to remember which actual bucket belongs to the declaration. The configuration describes intent but does not necessarily contain the final identifier. State preserves that association and other information needed for future operations.

Now imagine two operators each copying the configuration into a new directory with an empty state. Both can plan to create a bucket because neither state associates the declaration with the existing object. Shared code alone does not establish shared ownership. A coordinated backend and a consistent root identity are required.

A **backend** controls how Terraform stores state and, for supported backends, participates in coordination such as locking. A remote backend is not the same as remote execution. You can run the CLI on your laptop while storing state in S3. A hosted execution platform can run plans and applies elsewhere with additional orchestration and access controls.

State is neither a cache to delete casually nor an editable business document. It may contain sensitive values. Treat its storage, backups, access, and recovery procedures as part of the managed system. The official [state overview](https://developer.hashicorp.com/terraform/language/state) explains Terraform's need to maintain this information; our operating design builds on that model.

## 6.2 The coordination problem with two writers

Consider a state snapshot at serial 10. Alice and Ben both read it. Alice adds a logging resource and writes serial 11. Ben, still reasoning from serial 10, adds a monitoring resource. If coordination is absent or bypassed, one write can conflict with the other's assumptions. Even when a storage service rejects a stale write, the team still needs a clear execution sequence and recovery path.

A state lock aims to ensure that only the legitimate lock holder performs a conflicting state operation at a time. A lock is not a data backup. It does not validate the proposed architecture, stop an administrator from changing AWS directly, or coordinate operations against another state file. If two different state keys manage the same bucket, each key's lock can work perfectly while the ownership model remains broken.

The companion's **State lock** experiment makes these distinctions explicit. Two named clients can acquire, write, and release a modeled lock. A second client is refused while the first holds it, and stale serial writes are rejected by the educational model. The experiment is not an implementation of S3's backend protocol and must not be used as evidence of cloud locking behavior.

Coordination should also exist above the backend. A pipeline concurrency group can serialize a state's apply jobs. The backend lock remains necessary because not every writer will necessarily use the same pipeline. Two complementary controls are useful when they address different ways concurrent operations can arise.

## 6.3 S3 native locking is the current baseline

The S3 backend supports opt-in lock files through `use_lockfile = true`. DynamoDB-based backend locking is deprecated in the documentation inspected for this edition. Existing organizations may need a coordinated transition while older clients remain in use; do not remove the old mechanism before every legitimate writer supports the intended new one.

The backend also recommends bucket versioning for recovery. Lock files use a related `.tflock` object, with permissions that differ from merely reading and writing the state object. These are version-sensitive details checked against the [S3 backend reference](https://developer.hashicorp.com/terraform/language/backend/s3).

A lock file is not S3 Object Lock. Object Lock is a separate retention/WORM capability with different semantics and can conflict with the deletion behavior a transient Terraform lock requires. Similar names are not evidence of interchangeable behavior.

For a new learning backend, we use a private versioned bucket and S3 native locking. The decision is explicit and narrow. A production backend may also need customer-managed encryption, access logging, organization boundaries, replication strategy, and recovery objectives. Those requirements should be designed around the sensitivity and criticality of the actual state.

## 6.4 Bootstrap the storage before using it

Terraform must initialize its backend before it can perform ordinary resource operations. It cannot rely on a bucket that will be created later in the same first operation through that backend. This is the **bootstrap problem**: the storage for managing infrastructure must exist before normal infrastructure management can depend on it.

The course separates a bootstrap root from application roots. `labs/04-bootstrap` initially uses local state and creates a private bucket through the storage module. That bucket can then hold state for `labs/05-modules` and other roots. The bootstrap root's own local state must be protected until an independently designed backend migration is performed.

This separation avoids a particularly confusing learning cycle in which a root tries to create, use, and destroy its own backend storage as if all three were ordinary resources in one transaction. Backend configuration has a different initialization lifecycle from provider-managed resources.

Apply the bootstrap root only after setting its verified account ID and reviewing its plan. Record the output bucket name in a protected operational note. The name is not a credential, but it identifies a sensitive system component. The real state and any plan artifacts are not committed to Git.

~~~powershell
terraform -chdir=labs/04-bootstrap init
terraform -chdir=labs/04-bootstrap plan -out=bootstrap.tfplan
terraform -chdir=labs/04-bootstrap show bootstrap.tfplan
terraform -chdir=labs/04-bootstrap apply bootstrap.tfplan
terraform -chdir=labs/04-bootstrap output -raw bucket_name
~~~

These commands assume the example variables were copied and edited as in earlier labs. The resulting bucket remains empty until a root actually writes state into it. Merely creating it does not automatically redirect other Terraform directories to the backend.

## 6.5 Configure a root with a partial backend

The course includes a backend block as `backend.tf.example` so AWS backend access is not required for ordinary local validation. To enable it for the module-consumer root, copy it to `backend.tf`. Its content is intentionally small:

~~~hcl
terraform {
  backend "s3" {}
}
~~~

Backend configuration cannot use ordinary input variables, locals, or resource references. It is processed too early for those values. A partial backend lets you provide selected nonsecret settings during initialization through a separate file.

~~~hcl
bucket       = "REPLACE_WITH_BOOTSTRAP_OUTPUT"
key          = "sandbox/dev/artifacts.tfstate"
region       = "us-east-1"
encrypt      = true
use_lockfile = true
~~~

This is the shape of `backend.hcl`, not a resource declaration. Replace the bucket placeholder with the actual bootstrap output. The key is the object path for this root's state. It is not the bucket name and not a local directory to create manually.

Credentials should come from the approved environment or profile/role flow rather than being embedded in this file or command history. Backend configuration can be retained in working-directory metadata and related artifacts. Treat “not in a `.tf` file” as a location change, not a security boundary.

## 6.6 Migrate existing local state deliberately

If the module-consumer root has already been applied locally, configuring a backend must preserve its existing associations. Freeze other writers first. Preserve a protected copy of the current state and record the expected resource addresses and identifiers. Then initialize with migration:

~~~powershell
terraform -chdir=labs/05-modules init -migrate-state -backend-config=backend.hcl
terraform -chdir=labs/05-modules state list
terraform -chdir=labs/05-modules plan
~~~

Read every prompt. The command is intended to move state from the old backend to the new one after initialization recognizes the change. If the destination unexpectedly already contains state, stop and investigate ownership rather than accepting an overwrite without understanding both histories.

`-reconfigure` is a different operation: it tells Terraform to disregard previously saved backend configuration and configure the selected backend. It is not a general synonym for “migrate my state safely.” Choose the option based on whether you need data migration or only a deliberate backend reconfiguration.

After migration, compare the resource list and identifiers, then inspect a normal plan. An unexpected create proposal may mean the wrong state key, workspace, or account was selected. Do not apply a replacement fleet just to make an initialization warning disappear.

The final evidence should show the selected bucket/key, the migration operation, expected associations, and a plausible post-migration plan. It should not publish the state contents. Only after verification should the team resume ordinary writes.

## 6.7 Scope backend access to the root's needs

For a single default-workspace key, the backend needs bucket listing under appropriate conditions, state-object read/write access, and lock-object access including deletion of the lock file. The precise permissions depend on options such as workspaces and encryption. A customer-managed KMS key introduces its own permissions and key-policy requirements.

The important distinction is between the bucket resource and object resources. A statement granting `s3:GetObject` on a bucket ARN is not equivalent to granting it on the state's object ARN. Likewise, restricting the state object but allowing unrestricted bucket-wide writes may defeat the intended isolation.

Use separate state prefixes or buckets to reflect real trust boundaries. If the production executor can read every development and shared-services state, then the practical confidentiality boundary is much broader than the folder structure suggests. State readers can often learn sensitive infrastructure attributes even when they cannot modify resources.

A full IAM policy is not pasted here as a universal template because workspace paths, KMS design, account boundaries, and read/write roles materially affect it. The S3 backend documentation lists required operations. Translate those operations into the exact bucket/key model, then verify permitted and forbidden access in the intended environment.

## 6.8 Backend credentials and provider credentials are independent

The backend accesses state storage. The AWS provider accesses the infrastructure being managed. They may use the same initial environment credentials, but they are configured independently and can assume different roles.

For example, an organization can store state in a tooling account while the provider assumes a deployment role in a workload account. A provider `assume_role` block does not automatically tell the S3 backend to assume that same role. If initialization fails before provider configuration is evaluated, changing provider arguments may be irrelevant.

This distinction explains a common sequence: `init` succeeds because the caller can read the state bucket, but `plan` fails because the provider cannot assume the workload role. The reverse is also possible. Diagnose the caller and target for the failing stage rather than speaking about “Terraform credentials” as if there were only one identity relationship.

A mature run record includes both the backend scope and provider destination. Account allowlists in providers reduce wrong-account mistakes, but they do not prove that the correct backend key was selected. Both must be checked.

## 6.9 CLI workspaces partition state, not authority

A CLI workspace selects a distinct state instance for the same configuration and backend convention. It can be useful for temporary similar environments. It does not by itself create separate AWS accounts, permissions, approvals, or billing controls.

For the S3 backend, nondefault workspace paths follow a documented prefix/workspace/key scheme. This affects IAM scoping and recovery procedures. A team that assumes every workspace uses the literal key configured for the default workspace can accidentally inspect or restore the wrong object.

Separate root directories with separate backend keys are often clearer when development and production differ in accounts, credentials, lifecycle, and approval requirements. Reusing a module is compatible with keeping those roots distinct. Do not confuse avoiding source duplication with merging operational authority.

HCP Terraform workspaces add platform-specific execution and configuration concepts and should not be treated as identical to CLI workspace switching. The shared word “workspace” has a contextual meaning. Identify which system's workspace is being discussed before following a recovery or automation instruction.

## 6.10 State outputs can become an accidental data-sharing API

One root may need a value produced by another, such as a VPC ID. Reading a remote state output is convenient, but access to the underlying state storage can expose more than the single output a consumer intends to read. Output-level convenience is not necessarily output-level confidentiality.

For less privileged consumers, publish selected values through a deliberate interface such as a parameter, DNS record, or other service with narrower read permissions. The tradeoff is an additional publication lifecycle and possible propagation delay. Choose it when the trust boundary warrants the extra system.

Outputs are contracts. If a network root publishes a map keyed by logical zone, downstream modules should understand whether those keys are stable. Changing a string output into a differently shaped object can break consumers even when the network resources remain unchanged.

Prefer clear dependencies between roots with explicit promotion order. An infrastructure graph divided across state files is not automatically coordinated by Terraform's single-root dependency engine. The team or orchestration platform must manage cross-root sequencing and compatibility.

## 6.11 Protect state as sensitive operational data

Setting `sensitive = true` on an output normally affects presentation. It does not remove the underlying value from state. JSON output and state inspection can expose values that were hidden in ordinary terminal presentation. Saved plans can also contain sensitive information.

Use protected storage, transport security, least-privilege access, short-lived credentials, and careful artifact retention. Keep state and plans out of ordinary source control. A private Git repository is still a poor default state backend because it creates history and distribution semantics that do not match Terraform's coordination needs.

When you inspect state with `terraform state show` or `terraform show -json`, consider where the output goes. Terminal transcripts, CI logs, uploaded debugging bundles, and copied screenshots can become secondary data stores. Minimize the scope of the inspection and protect any necessary capture.

The goal is a coherent data-handling design, not a rule that operators may never inspect state. Recovery sometimes requires detailed inspection. Use an authorized role, a protected environment, and an evidence record that avoids unnecessarily redistributing the sensitive payload.

## 6.12 Recovery begins by stopping uncertainty from spreading

Suppose an apply fails after several resources are created. First stop concurrent writers and preserve diagnostics. Inspect the current state associations and actual AWS objects. A normal subsequent plan often identifies the remaining work because Terraform has recorded successful operations.

Do not restore an old state snapshot merely because the latest apply failed. The old snapshot may omit resources created by the partial apply. Restoring it can make Terraform forget live objects. A backup is a recovery input to reconcile with reality, not an automatic rollback of the world.

If the state object itself is lost or corrupted, use the versioned backend's recovery mechanisms under a documented procedure. Identify the correct bucket/key/workspace, preserve the current object/version if possible, examine candidate snapshots, compare their lineage and serial history, and reconcile them with actual resource identities before resuming writes.

A **lineage** identifies a state history, while a **serial** orders snapshots within that history. They help detect incompatible or stale operations. Editing them casually to force a push can bypass useful safeguards. Manual state pushes belong to exceptional, reviewed recovery, not routine troubleshooting.

## 6.13 Handle a suspected stale lock without creating two writers

A lock can remain after a process crashes or loses connectivity. Before removing it, determine whether the original process is still running, whether another runner owns it, and whether the reported operation is legitimate. Check pipeline status and contact the appropriate operator through your normal team process.

`terraform force-unlock` exists for recovery, but the name should be taken literally: it can remove the coordination barrier without proving that no writer remains. Removing a live lock can allow conflicting operations. Do not teach force-unlock as the default response to impatience.

If a lock is confirmed stale, record the lock identity and reason, remove it through the supported backend workflow, and run a fresh plan before applying. A previously calculated plan may no longer represent the relevant state after an interrupted operation.

A reasonable timeout while waiting for a legitimate lock can reduce noisy job failures, but it does not solve a permanently blocked writer. Lock duration, run duration, and incident diagnosis are separate concerns. Monitor actual run ownership rather than making the timeout arbitrarily large.

## 6.14 A recovery rehearsal has measurable outcomes

A useful learning rehearsal uses the local built-in resource lab or a disposable sandbox. Record a known resource ID, preserve state safely, perform an intentional configuration rename with a correct migration, and confirm that the ID remains unchanged. Later, Chapter 8 provides the exact executable procedure.

For a backend drill, choose a nonproduction state and test the documented restore procedure under supervision appropriate to your organization. The evidence should establish that operators can locate versions, select the right state, restore associations, and produce a plausible normal plan. Merely seeing a bucket version in the console does not establish a tested recovery capability.

Define recovery objectives in terms of acceptable lost changes and acceptable time to resume safe management. Those objectives apply to state operations, while the application has its own data recovery objectives. A restored state file does not recover deleted customer records or replay missed messages.

The capstone combines a change rehearsal with an application probe and a data-retention decision. That makes recovery part of the system design rather than an appendix read only during an incident.

## 6.15 Teardown must respect dependency on the backend

Application roots can be destroyed and their states retained or archived according to policy. Backend storage should outlive the roots that depend on it until their ownership and recovery needs are resolved. Destroying the state bucket first can leave the team unable to manage still-running infrastructure normally.

The bootstrap bucket uses `force_destroy = false`, so stored state versions can prevent deletion. That resistance is useful. Do not enable automatic destruction merely to make a cleanup command succeed without examining what the bucket contains.

For a complete learning teardown, remove application resources through their own reviewed plans, verify the remaining inventory, preserve any needed evidence, and only then decide whether the backend bucket and all its versions are disposable. The bootstrap root's own state also needs a deliberate disposition. No single universal destroy command understands all those business decisions.


## Verify the writer boundary after an incident

After an interrupted run, a successful unlock is only one observation. Confirm the original runner has stopped, establish which snapshot is current, inspect a fresh normal plan, and resume through the usual approved executor. If a second person ran a manual repair, include that action in the reconciliation record before proceeding.

State access should also be reviewed when people or teams change roles. A former deployment operator may retain read authority through a bucket policy, group, or backup location even after a CI permission is removed. Inventory the actual access paths rather than checking only the most visible interface.

For the learning backend, keep the process modest but explicit: one owner, one active state key per root, temporary credentials, native locking, protected versions, and a recorded cleanup decision. Those basics are more valuable than copying an elaborate policy that nobody can explain. As requirements grow, add controls to address the new authority, sensitivity, and recovery needs with corresponding evidence.


A lock timeout should be interpreted with run ownership and timestamps. If the holder is making progress, wait through the normal process. If ownership is unclear, investigate before removing coordination. A faster second writer is not a recovery success if the first writer remains active.

## Worked backend review: a state key is a security scope

Assume the tooling bucket contains `sandbox/dev/artifacts.tfstate` and its companion lock object. A narrowly scoped writer needs the operations documented for the backend on the intended bucket/key, including lock-object deletion for the transient lock. It should not automatically be granted unrestricted object deletion throughout every production prefix in the same bucket.

Write the intended resource scopes before writing policy syntax. The bucket scope is used for relevant listing behavior. The state object scope is the exact state key. The lock scope is the corresponding lock filename. If CLI workspaces are introduced, enumerate their actual prefixed paths rather than assuming the default key remains the only object involved.

A review table can make the design concrete:

| Capability | Intended scope | Reason |
|---|---|---|
| Locate state | Required bucket/prefix view | Let the backend identify the intended state path |
| Read state | Exact root state object | Load existing associations |
| Write state | Exact root state object | Record approved operations |
| Read/write/delete lock | Exact lock object | Coordinate a transient exclusive writer |
| Read older versions | Recovery role as designed | Inspect or restore a selected snapshot |

This table is a requirements model, not a copy-paste IAM policy. Translate it using the current backend operations, workspace scheme, encryption design, and AWS resource semantics. Test that the normal role can run its legitimate workflow and cannot read an unrelated state. An access test that proves only “the happy path works” leaves the isolation claim untested.

### Walk through a stale snapshot numerically

Suppose serial 40 records a bucket and a function. An apply at serial 41 adds an alarm, then fails while modifying another resource. The latest state may legitimately include the alarm even though the overall run failed. Restoring serial 40 would remove the alarm association from Terraform's knowledge while the alarm could still exist in AWS.

The correct first investigation compares serial 41's associations with actual objects and the failure diagnostic. If the state is intact, fix the cause and calculate a fresh plan. The next plan can continue from the partial result. The older version is useful evidence of history, not automatically the desired replacement state.

Now suppose the current object is corrupted and serial 40 is the latest readable candidate. Recovery must identify the alarm and any other post-40 objects through surviving diagnostics, inventories, or service records, then reconcile ownership. A state restore without that reconciliation can cause duplicate resources or name collisions on the next apply.

### Establish the right recovery permission

The ordinary deployment role and an exceptional recovery role need not have identical authority. Recovery may require reading historical versions or performing a controlled restoration that normal application deployment should not do casually. Separate those powers when the organization's operating model supports it.

A recovery procedure must remain usable under the failure it addresses. If all instructions and credentials are stored only in the broken platform, operators may be blocked. Preserve an approved independent access path and an offline-accessible procedure appropriate to the system's criticality. This does not mean storing secrets in the course or runbook; it means designing the identity recovery path intentionally.

### A practical migration acceptance record

After moving a root from local state to S3, record the old and new backend types, intended bucket/key, resource address count, selected important remote IDs, and the observed normal plan. Compare important IDs explicitly. The count alone can remain unchanged while an association points at the wrong object.

Keep the protected pre-migration snapshot until the migration is verified and your retention policy permits disposal. Prevent other writers from using the old local copy as an independent active state. Two valid snapshots are not a problem by themselves; two active authorities managing the same objects are.

Finally, rehearse the return path for an interrupted migration. Determine which storage location contains the latest coherent snapshot before resuming. Do not alternate `-reconfigure` and `-migrate-state` options until the CLI stops asking questions. Every initialization choice should follow an understood source and destination history.


## 6.16 Optional application and transition

Use the companion lock model to walk through two operators attempting to change one state. Then write a short operating note with the root identity, backend location, normal executor, lock ownership check, and recovery contact/process. A reference note identifies a specific bucket/key and account rather than saying “the shared bucket.”

For the real sandbox, migrate `labs/05-modules` only after a protected local application and state backup. Confirm that a post-migration plan does not propose recreating the bucket. This optional application is successful when identity and the management path are preserved, not merely when initialization prints a success message.

State boundaries now have a clear purpose. The next chapter designs the reusable module boundaries inside and across those roots. It shows how to share architecture without sharing every operational decision or creating an unmaintainable generic wrapper.

