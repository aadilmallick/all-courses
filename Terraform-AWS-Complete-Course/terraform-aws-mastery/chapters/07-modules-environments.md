# 7. Reusable modules and independent environments

**Central problem:** How do we reuse a sound design while preserving clear ownership, reviewable interfaces, and independent deployment boundaries?

**Prerequisites:** expressions and types, AWS resources, dependency graphs, and state boundaries. The principal example is [the private bucket module](../modules/private-bucket/main.tf), consumed by [labs/05-modules](../labs/05-modules/main.tf) and the capstone.

## 7.1 Duplication is a symptom; coupled decisions are the problem

Suppose three teams copy the same bucket configuration. One copy gains versioning, another changes encryption, and the third leaves an old public-access assumption. Copying created independent text, but the organization still expects a common storage policy. A reusable module can express that policy once and give consumers a deliberate interface.

Now imagine a module with 150 inputs mirroring every provider argument, five optional submodules, and Boolean switches for unrelated architectures. It has removed some repeated text while creating a new language that users must learn. The module's value is uncertain because callers still need to understand nearly every provider detail and now need to understand the wrapper too.

A useful module groups resources that form a coherent responsibility and changes for a coherent reason. It exposes meaningful choices, derives routine details internally, and publishes stable results. For this course, a private bucket is a storage contract, a network is an address-and-routing contract, and a health API is a small deployment contract.

Reusability is not the only objective. Reviewability, upgradeability, and failure isolation matter. Two similar roots can legitimately remain separate when they have different owners or operational authority. Sharing a child module does not require sharing state, credentials, or approvals.

## 7.2 Every module has inputs, internals, and outputs

A **root module** is the configuration Terraform operates on as its entry point. A **child module** is called from another module using a module block. Both are directories of Terraform configuration. “Module” does not mean a published registry package; a local folder is a module too.

The private-bucket module accepts a name prefix and tags. Internally it declares the bucket and related controls. It publishes the bucket name and ARN. The consumer does not need to know the internal resource label `this` to use the module's documented outputs.

~~~hcl
module "artifacts" {
  source      = "../../modules/private-bucket"
  name_prefix = "tf-mastery-dev"
  tags = {
    Environment = "dev"
  }
}

output "bucket_name" {
  value = module.artifacts.name
}
~~~

This is the core of the supplied consumer root, with provider setup in separate files. `source` locates the child module relative to the calling module. `name_prefix` and `tags` are ordinary input arguments because the child declares variables with those names. `module.artifacts.name` refers to the child's output, not directly to an AWS resource attribute.

An output should expose a useful contract. Publishing the entire resource object can couple consumers to many provider attributes and future schema changes. Publishing only a name and ARN keeps the interface smaller. If consumers need more, add deliberately named outputs with documented meaning.

## 7.3 A contract includes behavior, not only type signatures

The storage module's types tell you that a prefix is a string and tags are a map of strings. Its behavioral contract also includes public-access blocking, ownership enforcement, versioning, encryption, TLS enforcement, and resistance to automatic object deletion.

A caller choosing a prefix should not be able to silently disable the module's defining security posture unless that flexibility is an explicit part of the contract. A generic `secure = false` switch would undermine the module's name and create a branch that needs its own tests and maintenance. If an exceptional storage design is legitimate, a separate module or carefully scoped parameter can be clearer.

Document which behaviors are invariant, which are configurable, and which remain the caller's responsibility. The module does not decide the caller's IAM data-access policy or whether the stored data is appropriate. It does not provide a cross-account backup merely because versioning is enabled. Clear limits make a contract trustworthy.

A module README should include purpose, prerequisites, inputs with defaults and validation, outputs, a complete usage example, security and cost implications, upgrade notes, and test instructions. The deliverable includes those for the course modules so you can inspect the contract from the same perspective as a future consumer.

## 7.4 Types reduce ambiguity at integration boundaries

The network module accepts a map of zone objects rather than parallel lists of names and slots. This prevents a caller from accidentally supplying three names and two slot values and hoping positional alignment works. The object groups information that belongs together.

The health module accepts a package path rather than a directory to build implicitly. This keeps artifact production outside Terraform's resource graph and lets the caller supply tested bytes. It accepts a release string for visible deployment identity and a context map for selected environment values. That context is nonsecret in the reference design; adding secrets would require a different handling review.

Optional attributes can make a contract easier to adopt while preserving a normalized internal representation. They also introduce default behavior that consumers need to understand. A default is a policy choice. Changing it can alter production even when consumers make no source edit to their module calls.

Avoid `any` when a meaningful structural type is known. `any` can be appropriate for a pass-through serialization boundary, but it sacrifices early feedback when used out of convenience. A well-designed type describes the caller's intended decision in the vocabulary of the domain.

## 7.5 Compose horizontally before nesting deeply

A root can call network, storage, and application modules side by side, then pass outputs between them. This is often easier to understand than a deep chain where the application module silently creates its own network and storage through several wrappers.

Horizontal composition keeps major ownership choices visible at the root. A platform team can supply a network ID to an application module without requiring the application module to create a network. The application module can be tested with explicit inputs and reused in different deployment contexts.

Deep nesting is not automatically wrong. A coherent internal helper can reduce repeated implementation. The concern is whether a reviewer can identify resource ownership, provider destination, inputs, and lifecycle without opening ten layers. If every layer merely renames arguments, nesting may be hiding rather than simplifying the design.

Our capstone composes the artifact bucket and health API at the root and declares the release table explicitly. The Lambda receives the storage identifiers as environment context but does not use them for data operations. That visible limitation is preferable to implying an application dependency that the source does not implement.

## 7.6 Providers belong to an explicit execution context

Provider requirements declare which provider source and versions a module can use. Provider configurations supply operational settings such as region and assumed role. Reusable child modules should normally declare requirements while receiving their operational provider configuration from the caller.

The root owns the account and region choice. The child module should not silently point itself at a hard-coded account. Terraform's [provider-in-modules documentation](https://developer.hashicorp.com/terraform/language/modules/develop/providers) explains inheritance and explicit mapping.

For a root with an aliased target provider, the module call maps the child's default AWS provider to that configured alias:

~~~hcl
module "artifacts" {
  source      = "../../modules/private-bucket"
  providers   = { aws = aws.target }
  name_prefix = "tf-mastery-target"
}
~~~

This fragment is part of the complete multi-account root. The alias is a configuration handle, not a second AWS provider plugin version. Two aliases can use different regions or roles while using the same selected provider package.

If a child genuinely needs multiple provider configurations, it declares the appropriate configuration aliases and the caller supplies them. Do not add hidden provider blocks to a reusable child merely to make a one-off example easier. Such legacy-style designs can restrict use with module-level repetition and make removal harder because existing resources retain provider associations.

## 7.7 Select version constraints for the role of the module

The course pins CLI 1.17.2 and AWS provider 6.0.0 exactly in its runnable examples to make the validated baseline unambiguous. A broadly published child module often uses a compatible minimum/range and documents its tested matrix, while the consuming root chooses a narrower operational baseline and commits its dependency lock file.

Version constraints describe acceptable selections. The provider lock file records a concrete selected package and checksums. The lock file does not pin arbitrary remote module source in the same way. Registry module version arguments and immutable VCS references are separate dependency controls.

For a registry module, choose a reviewed module version. For a Git source, prefer an immutable commit reference where reproducible supply-chain identity is required. A floating branch can deliver different code at a future initialization even if the module call text has not changed. Do not assume that a friendly tag is immutable unless the repository policy enforces that property.

A provider upgrade and a module upgrade can both change a plan. Change one dimension at a time when practical so failures are attributable. Keep an upgrade note explaining the old baseline, new baseline, schema or behavior changes, and evidence from representative consumer configurations.

## 7.8 Development and production need independent authority

An environment is a set of infrastructure and operating assumptions for a purpose such as development, staging, or production. It is not merely a string inserted into names. Production may need a different AWS account, role, backend key, approval process, retention policy, capacity, and recovery objective.

A clear repository structure can look like this conceptual pattern:

~~~text
modules/
  private-bucket/
  network/
  health-api/
environments/
  dev/
    backend.tf
    main.tf
  prod/
    backend.tf
    main.tf
~~~

This is an architectural pattern, not an extra set of generated runnable roots in the course. The supplied roots demonstrate the components and the capstone shows composition. Create real environment roots when you have their actual account and backend choices.

Repeated small root declarations can be acceptable because they make different authority boundaries explicit. Reuse the coherent child module rather than creating a large conditional root that chooses every production behavior through `terraform.workspace` checks. A single wrong workspace selection should not be the only barrier between a developer and production.

## 7.9 Promote a tested definition, not a copied state

Promotion means taking an approved application or module version through environments with environment-appropriate inputs and evidence. It does not mean copying development state into production. State contains object identities tied to the environment it manages.

For a health API release, the promoted unit can include an immutable package digest and a reviewed module/root commit. Development and production use the same intended release identity but different provider destinations, backend keys, and possibly capacity settings. Each environment receives its own plan against its own state.

If you copy state between accounts without a deliberate migration, its resource identifiers and provider associations can point at the wrong objects. Renaming a backend key is a state migration operation, not an ordinary promotion mechanism. Keep code reuse, artifact promotion, and state transfer conceptually separate.

A release record should let an operator answer which source, module version, provider selection, package, and inputs produced a deployment. That information is more useful than a manual note saying “production matches dev.” It also supports comparisons when environments intentionally differ.

## 7.10 Design optional resources with lifecycle in mind

An optional resource is often represented with count or for_each. Disabling it removes it from the desired instance set and can therefore propose deletion. A Boolean named `enable_database` is not a harmless display setting when false means destroy the database.

Default values should reflect the safe and useful behavior for the module's purpose, but no default can replace explicit data-retention review. A module that creates storage may need deletion protection or a separate destructive action process. A one-line toggle can carry a large operational consequence.

When optionality changes architecture, separate modules may be clearer. For example, adding a NAT gateway changes routing, addresses, costs, and availability dependencies. Representing it as a casual convenience flag can obscure the magnitude of the choice. If a module supports it, document the graph change and test both branches meaningfully.

A migration from a singleton to a repeated optional instance changes the address form. Use a migration declaration when preserving an existing object. Test the migration with an existing state, not just a fresh empty deployment, because fresh deployments cannot reveal continuity failures.

## 7.11 Minimize hidden dependencies between modules

A consumer should depend on an output value when that value expresses its real need. If an application needs a subnet ID, pass that ID. Avoid making the entire application module depend on the entire network module unless there is a genuine hidden dependency that cannot be expressed more narrowly.

Broad dependencies can defer data-source reads and make previously known values unknown during planning. That can cause noisy changes or obscure policy content. More ordering is not automatically more correctness; the ordering needs to correspond to a real requirement.

Cross-state dependencies require additional care because Terraform does not automatically plan every related root as one transaction. A network change can break an application state even if the network plan is internally valid. Publish stable interfaces and coordinate incompatible changes through a documented migration.

One useful design is the expand-and-contract pattern: add a new compatible output or resource path, update consumers, verify migration, then remove the old interface later. This spreads a risky synchronized change into reviewable stages. It also requires tracking adoption rather than deleting compatibility code as soon as one consumer upgrades.

## 7.12 Test a module through its promises

The private-bucket tests use a mocked provider to check selected invariant settings and invalid prefix rejection. They are not intended to retest every AWS feature. A good module test asks whether a supported caller gets the promised shape and whether an unsupported input receives a meaningful failure.

Examples of contract tests include stable output shape, disabled-resource behavior, validation boundaries, and required security settings. Integration tests add real service acceptance and behavior. Upgrade tests use prior state to check that a new module version preserves intended identity or proposes only the documented migration.

A test that merely asserts a string literal equals itself adds little evidence. A test that checks a dangerous branch, such as automatic deletion being disabled, can be useful even if the implementation currently sets a literal, because it protects a meaningful behavioral promise. Explain the promise in the assertion message so future maintainers understand why it exists.

The next chapter's local migration lab is especially valuable for module evolution. It proves that the same managed ID survives an address rename. A test on an empty state would pass even if the module accidentally replaced every existing object during upgrade.

## 7.13 Write documentation for the next decision-maker

A good usage example is complete in context: it names the provider baseline, declares required inputs, shows a module source, and explains how to initialize, plan, and verify. A code fragment can be concise when it is explicitly labeled and points to the complete runnable root.

Document costs in terms of resource categories and variables rather than freezing an unsupported price estimate. State whether a module creates NAT gateways, load balancers, persistent storage, logs, or public endpoints. A consumer deciding whether to adopt the module needs those facts before application.

Document destroy behavior as carefully as create behavior. Does the module resist deleting nonempty storage? Does it retain logs? Does disabling a flag remove resources? Are there service-level deletion protections? These are interface properties, not incidental details for an appendix.

For a shared module, include a support and ownership expectation appropriate to the organization. A module can be technically reusable while operationally abandoned. Expert platform engineering includes deciding who reviews changes, handles incidents, and communicates deprecations.

## 7.14 A worked consumer change

Suppose Field Notes needs an additional artifact bucket for staging. The existing root calls the module once for development. A clear approach is to create a separate staging root with its own provider destination and backend, then call the same module with an appropriate prefix and tags.

If the two buckets genuinely belong to one deployment boundary and one owner, a single root can call the module twice or use module-level for_each with stable environment keys. The difference is not syntax. It is whether the resources should be planned, approved, and recovered together.

A reference module-level repetition fragment is:

~~~hcl
module "artifacts" {
  for_each    = toset(["dev", "stage"])
  source      = "../../modules/private-bucket"
  name_prefix = "tf-mastery-${each.key}"
  tags        = { Environment = each.key }
}
~~~

This fragment requires the ordinary root provider setup. The resulting addresses include `module.artifacts["dev"]` and `module.artifacts["stage"]`. Converting an existing singleton call into this form needs an address migration if you want to preserve its current bucket. Do not paste it over a live singleton and assume Terraform infers your intent.

## 7.15 Recognize abstraction failure from concrete symptoms

If every consumer asks for a new bypass flag, the contract may be too broad or incorrectly grouped. If upgrading the module requires reading all its internals to know what it does, documentation and interface stability may be weak. If a module takes an entire provider resource object as input and returns it unchanged, the abstraction may add little.

If unrelated teams must coordinate every small change because they share one giant root, the state boundary may be too broad. If dozens of tiny states require brittle manual ordering for ordinary work, boundaries may be too narrow. There is no universal module-to-state ratio. Choose boundaries from ownership, lifecycle, risk, and dependency frequency.

Repeated implementation patterns can justify a helper module, but wait until the repeated decision is understood. Premature generic design often encodes guesses that become difficult to remove. A focused module can grow deliberately as real consumers reveal stable requirements.

Use provider documentation as a reference underneath the module. A good abstraction helps users reason about the system; it does not forbid them from understanding the resources it creates. The full source remains included and readable for that reason.

## 7.16 Optional application and reference direction

Add an output to the storage module that publishes a small object containing the bucket name and ARN. Preserve the existing scalar outputs so current consumers continue to work. Then update one consumer to use the new object and verify that the plan contains no infrastructure changes caused solely by the output addition.

The reference approach treats the new output as an additive interface change. It does not rename internal resources, alter bucket names, or remove prior outputs. If a plan proposes bucket replacement, the implementation changed more than the output contract and should be inspected before application.

For a design exercise, compare one shared root with two independent environment roots. Write the backend key, provider identity, owner, approval path, and recovery procedure for each. The comparison becomes meaningful only when those operational facts are explicit; folder count alone cannot determine the better design.

## Worked compatibility review: changing a retention default

Imagine version one of a logging module defaults retention to seven days. Team A explicitly passes seven. Team B omits the input and relies on the default. Version two changes the default to thirty. Both teams upgrade the source version without editing their module arguments.

Team A's effective retention remains seven because its explicit input still wins. Team B's effective retention changes to thirty. The source diff in Team B's root can be a single version string, yet its plan contains a real operational change. This is why defaults belong in the compatibility contract and release notes.

The companion's module experiment computes exactly this distinction. It does not claim that every AWS retention change has the same service behavior; it isolates how the caller interface selects a value. In the real module, plan and service verification establish the downstream result.

A careful release note states the old default, new default, affected callers, reason, cost/retention consequence, and how to preserve the old behavior if supported. A vague note saying “improved logging” does not give consumers enough information to review their plans.

### Additive output migration with a concrete shape

Suppose the old module exposes `name` and `arn`, and the new preferred interface is an object named `bucket`. An additive output can be:

~~~hcl
output "bucket" {
  value = {
    name = aws_s3_bucket.this.id
    arn  = aws_s3_bucket.this.arn
  }
}
~~~

This fragment belongs inside the existing private-bucket module. Keep the old outputs during the supported migration window. A consumer can switch from `module.artifacts.name` to `module.artifacts.bucket.name` without altering the bucket declaration. The expected infrastructure effect is none; the interface effect is real and should be tested.

Now imagine changing that object's `name` field into a nested object without changing its output name. Consumers expecting a string can fail even though the provider resources are unchanged. An output is an API, so version and document its shape deliberately. If an incompatible redesign is needed, introduce a new output or a major-version migration with clear consumer guidance.

### Choose a module boundary through a change scenario

Consider a network and database managed by one giant module. The networking team needs to add a subnet, while the database team controls maintenance windows and credentials. If every networking edit requires database access and approval, the abstraction may combine responsibilities that need independent authority.

Splitting them into network and database modules inside the same root improves source organization but does not automatically separate state access or apply authority. Separate roots may be needed for that operating boundary. The split then requires a stable network interface, such as subnet IDs and security-group relationships, plus coordination for incompatible changes.

Conversely, splitting every small resource into its own state can make a routine deployment require many ordered operations and expose fragile intermediate states. The right question is which resources should be reviewed, applied, and recovered together. Let that answer guide state boundaries, then use modules to express coherent reusable implementation within them.

### Review a module source before trusting its interface

Inspect provider requirements, variables, outputs, resource types, data sources, provisioners, external programs, and backend assumptions. A polished README can omit a consequential side effect. A source dependency can also change behavior through a floating reference or newly introduced provider.

For an internal module review, trace one caller input to the resource arguments it affects. Trace one output back to the resource value it publishes. Identify the resource addresses that existing consumers depend on. This review is finite and concrete; it is more useful than declaring the module “clean” because its files are short.

When a module uses a public third-party module internally, its compatibility surface includes that dependency too. Pin it appropriately and preserve applicable notices if code is redistributed. Do not claim your wrapper eliminates the need to understand the dependency's lifecycle and security model.

### A consumer adoption note that is actually useful

For the private-bucket module, a concise adoption note might say: “Creates a new private versioned bucket with generated name suffix; does not import existing buckets; resists deletion while object versions remain; publishes name and ARN; inherits the caller's AWS provider; requires the course's pinned CLI/provider baseline.” Each clause answers a likely operational question.

For an existing bucket, add a separate adoption/migration plan rather than implying that replacing an inline declaration with a module call will preserve identity automatically. The module's fresh-deployment example and its existing-resource migration are different workflows and deserve different evidence.


## Avoid accidental interface promises

Consumers sometimes depend on an internal naming convention even when it was never documented. If a bucket prefix or output key appears in monitoring, scripts, or another root, it has become a practical interface. Inventory those dependencies before reorganizing names.

The remedy is not to promise that internals can never change. Publish the supported interface, migrate legitimate consumers to it, and explain which details remain implementation choices. A small documented contract is easier to maintain than a large collection of accidental dependencies discovered during incidents.

For the course modules, treat the published outputs and explicit behavioral settings as the supported reference contract. Use direct internal addresses only for the tests and migration operations that deliberately need them. This keeps ordinary consumers independent of routine file organization while preserving the ability to inspect source when debugging.

## 7.17 Transition: a module will eventually need to change

Once a module has real consumers, internal organization becomes a compatibility concern because addresses identify live objects. A rename, extraction into a child module, or shift from count to for_each can require a migration. The next chapter teaches those changes as controlled transitions with observable intermediate evidence, then extends the same reasoning to import, drift, and incident recovery.
