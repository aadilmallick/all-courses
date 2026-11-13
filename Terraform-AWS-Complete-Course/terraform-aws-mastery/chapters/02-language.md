# 2. HCL as a language for values, relationships, and identity

**Central problem:** How do we express many related infrastructure objects without losing the ability to understand their values and identities?

**Prerequisite:** Chapter 1's configuration, resource, state, plan, and apply model. Use the local lab throughout. None of the experiments in this chapter requires AWS credentials.

**Outcome:** you can read and write blocks and expressions, design typed inputs, transform collections, choose stable instance keys, and explain why some values are unavailable until application.

## 2.1 Begin with a value, not a loop

A conventional program often tells a computer to perform statements in an order. A Terraform configuration describes a set of relationships. Before introducing resources in bulk, we need a reliable way to describe values. That is the job of expressions in HashiCorp Configuration Language, usually abbreviated HCL in this context.

Consider a replica count of two. The number `2` is a value. The quoted text `"2"` is a string. They can look similar when printed, but they communicate different intentions to a type system. A service name is text; a replica count is a quantity; an enabled flag is a Boolean. Choosing the right type makes invalid combinations easier to reject near the source of an error.

HCL's infrastructure-specific behavior comes from Terraform's schemas and evaluation rules. HCL alone does not know what an S3 bucket is. A provider defines which arguments a particular resource accepts, which attributes it exports, and which values are computed. This is why a configuration that is visually well formatted can still be invalid for the selected provider.

The practical pattern throughout this chapter is **input value → transformation → resource argument → output**. Keep those stages visible. If a reader must mentally execute several nested comprehensions just to discover a resource's name, the expression can probably be made clearer with a named local value.

## 2.2 Blocks and arguments are different structures

A block has a type, optional labels, and a body. An argument assigns an expression to a name. Here is a complete no-cloud module you can place in an empty scratch directory:

~~~hcl
terraform {
  required_version = "= 1.17.2"
}

variable "service_name" {
  type    = string
  default = "field-notes"
}

resource "terraform_data" "service" {
  input = {
    name     = var.service_name
    replicas = 2
    enabled  = true
  }
}

output "service" {
  value = terraform_data.service.output
}
~~~

`variable "service_name"` is a block with one label. `type = string` is an argument within that block. The braces after `input =` enclose an object expression, not a nested configuration block. This distinction becomes important when provider documentation says an argument expects an object versus a block expects a particular nested structure.

HCL permits compact single-argument blocks, but this course generally uses multiple lines for anything substantial. Do not put two block arguments on a single line separated by a space and assume they form valid syntax. Formatting is not a substitute for parsing. `terraform fmt` can normalize valid syntax, but it cannot reliably infer the missing structure of an invalid block.

All ordinary `.tf` files in a module directory contribute to one configuration. A file called `variables.tf` is a human convention; it has no special evaluation phase. Defining a resource in `a.tf` does not make it execute before a dependency in `z.tf`. This gives you freedom to organize by responsibility while preserving the same graph of relationships.

## 2.3 Learn expressions at the console

The Terraform console evaluates expressions in the current module's context. After initializing the local lab, launch it:

~~~powershell
terraform -chdir=labs/00-local console
~~~

Type one expression at a time:

~~~hcl
2 + 3
upper("field-notes")
length(["api", "worker"])
{ name = "api", replicas = 2 }.replicas
contains(["dev", "stage", "prod"], "dev")
~~~

The corresponding results are `5`, `"FIELD-NOTES"`, `2`, `2`, and `true`. Use `exit` to leave the console. The console is valuable because it isolates expression behavior from provider operations. It is not a place to enter resource declarations, and evaluating an expression there does not apply infrastructure changes.

A **function** accepts inputs and returns a value. `length` counts the elements in a collection or characters in a string under Terraform's string semantics. `contains` checks membership in a list, tuple, or set; it is not a general substring search. Function names are interfaces with defined type requirements. Guessing that a familiar function behaves exactly like one in another language is a common source of subtle errors.

## 2.4 Primitive types and structured types

Terraform's primitive categories include string, number, and bool. Structured values include collections and structural types. A **list** is ordered and normally has one element type. A **set** represents unique values without meaningful order. A **map** associates string keys with values of a common type. A **tuple** has positional elements whose types can differ. An **object** has named attributes with specified types.

| Need | Useful type | Why |
|---|---|---|
| Ordered deployment steps | `list(string)` | Position is meaningful |
| Unique feature names | `set(string)` | Membership matters, ordering does not |
| Environment to account mapping | `map(string)` | Stable keys identify entries |
| One service specification | `object({...})` | Attributes form a declared contract |
| Catalog of service specifications | `map(object({...}))` | Keys identify services; objects describe them |

These are semantic choices, not formatting preferences. Converting a list to a set can discard duplicates and ordering. That can be correct for a set of independent names and wrong for a priority sequence. Terraform may perform type conversions where permitted, but relying on implicit conversion can hide an unclear input contract.

The local lab uses the following contract:

~~~hcl
variable "services" {
  type = map(object({
    replicas = number
    enabled  = optional(bool, true)
  }))

  default = {
    api    = { replicas = 2 }
    worker = { replicas = 1 }
  }
}
~~~

The outer map provides stable identity keys. Each object must have a numeric replica attribute. The enabled attribute is optional and receives `true` when omitted under this declaration. A caller can therefore write a short specification without losing the module's consistent internal shape. This is preferable to scattering repeated “if missing, then true” expressions throughout resource definitions.

A type constraint specifies a shape, not every business rule. A number can still be negative or fractional. We add validation to express restrictions the type alone cannot express. Also remember that object conversion can discard additional attributes in some conversions; a declared object type is not a universal unknown-key detector. If accidental extra keys are dangerous, choose an additional validation or review strategy suitable to the input format.

## 2.5 Validate at the boundary

A useful error explains what the caller should change. The local lab rejects replica values that are negative or fractional:

~~~hcl
validation {
  condition = alltrue([
    for service in values(var.services) :
    service.replicas >= 0 &&
    floor(service.replicas) == service.replicas
  ])
  error_message = "Replicas must be nonnegative integers."
}
~~~

This is a fragment inside the `services` variable block. `values` extracts the map's values. The `for` expression transforms each service object into a Boolean. `floor` rounds down, so an integer equals its floor. `alltrue` requires every resulting Boolean to be true. For replicas `2` and `1`, the intermediate list is `[true, true]`. For `2` and `-1`, it includes false and validation fails.

The difference between a helpful boundary and a brittle restriction is intent. Rejecting negative replicas reflects the domain. Restricting an AWS region to a hard-coded short list because the author remembers only three regions creates needless maintenance. Validate stable requirements, then rely on the provider and service where the accepted domain is inherently service-dependent.

Validation diagnostics should not disclose secrets. An error such as “invalid password: <actual value>” can leak data to logs. Describe the violated rule rather than echoing sensitive inputs. Chapter 9 extends this principle into the entire state-and-plan workflow.

## 2.6 Variables, locals, and outputs form an interface

An **input variable** is a parameter supplied from outside a module. A **local value** names an expression inside the module. An **output** publishes a selected result. These roles are easy to blur if every expression becomes a variable or every resource attribute becomes an output.

Use a variable when a caller should make a meaningful choice. Use a local when the module should derive a value consistently. Use an output when another module or operator has a legitimate reason to consume the result. For example, the caller can choose the environment, the module can derive a naming prefix, and an output can publish the resulting bucket name.

~~~hcl
variable "environment" {
  type    = string
  default = "dev"
}

locals {
  service_prefix = "field-notes-${var.environment}"
}

output "prefix" {
  value = local.service_prefix
}
~~~

This is a complete expression-only configuration when combined with the chapter's Terraform version block. String interpolation inserts an expression inside text. The resulting prefix for the default environment is `field-notes-dev`. The local has no separate persisted identity merely because it has a name; it is an expression result.

The reference prefixes are deliberately different: `var.environment`, `local.service_prefix`, and resource addresses such as `terraform_data.service`. These prefixes tell a reader where a value originates. Do not turn a literal into a variable solely to avoid writing the literal once. An unnecessary parameter expands the interface without adding a useful decision.

## 2.7 Input sources and repeatable runs

For a local CLI workflow, values can come from defaults, environment variables named `TF_VAR_name`, variable definition files, and explicit command-line assignments. Precedence matters when more than one source supplies a value. Keep a project's documented entry point and input files explicit rather than depending on whatever happens to be set in a shell.

~~~powershell
terraform -chdir=labs/00-local plan -var='environment=stage'
terraform -chdir=labs/00-local plan -var-file=stage.tfvars
~~~

The second command assumes you have created `stage.tfvars` in the lab directory. A variable file uses assignments such as `environment = "stage"`; it does not wrap them in a variable declaration. The file is configuration data, not a second module. Terraform loads specifically named automatic variable files by convention, so a forgotten local file can influence later plans.

PowerShell environment syntax is `$env:TF_VAR_environment = "stage"`; Bash uses `export TF_VAR_environment=stage`. Remove the variable when you no longer want it to apply. In PowerShell, `Remove-Item Env:TF_VAR_environment` removes it from the current process environment. Do not place real credentials in a variable file just because the filename ends in `.tfvars`.

The course ignores real local `terraform.tfvars` files in version control and distributes `.example` files with synthetic values. Some nonsecret environment settings can reasonably be committed in a team repository. Decide based on the contents and workflow, not the extension alone. Record which inputs a saved plan used so its review is reproducible.

## 2.8 Transform collections one stage at a time

The local lab filters disabled services:

~~~hcl
locals {
  active = {
    for name, service in var.services :
    name => service if service.enabled
  }
}
~~~

For the defaults, `active` has both `api` and `worker`. If the worker has `enabled = false`, the result has only the API entry. The expression preserves the original keys rather than converting the result into a position-based list. That matters because the next stage uses those keys as resource identity.

A `for` expression calculates a value. It does not issue an API operation for every iteration. Terraform evaluates the resulting collection, then uses resource and module declarations to construct managed instances. Keeping expression transformations separate from resource repetition makes the configuration easier to debug.

For another example, a list of enabled service names can be derived with `[for name, service in var.services : name if service.enabled]`. A list of readable labels can be derived with `[for name in keys(local.active) : "service:${name}"]`. Start with the simplest intermediate value at the console before composing several transformations. Small intermediate observations are often faster than reading a long provider diagnostic caused by a malformed final object.

## 2.9 Resource repetition is identity design

The local lab declares resources with `for_each`:

~~~hcl
resource "terraform_data" "service" {
  for_each = local.active

  input = {
    name        = each.key
    replicas    = each.value.replicas
    environment = var.environment
  }
}
~~~

`each.key` is the current stable service name. `each.value` is its specification. The result is a set of instances addressed by key. Updating the API replica count keeps the API address. Removing the worker key removes that instance from the desired set. Adding a new key creates a new managed identity.

The alternative `count` creates numbered instances. For a simple optional singleton, `count = var.enabled ? 1 : 0` can be readable. For an ordered list whose elements may be inserted or removed, positions can be fragile. If `["api", "worker", "scheduler"]` supplies names to count-based resources and you remove `worker`, index one now means scheduler. Terraform associates identity with the numeric index, not with the name you mentally attached to that position.

| Choice | Address form | Suitable use |
|---|---|---|
| Singleton | `resource_type.name` | One persistent object |
| Count | `resource_type.name[0]` | Homogeneous indexed objects or an optional singleton |
| For each | `resource_type.name["api"]` | Objects with meaningful stable keys |

Switching between these forms changes addresses and often needs explicit migration. Choosing `for_each` does not make renaming keys free. A key change from `api` to `public-api` is an identity change unless a `moved` declaration establishes continuity. Chapter 8 provides an executable migration lab.

## 2.10 Known, unknown, null, and sensitive are separate ideas

A **known** value is available during the relevant evaluation phase. An **unknown** value is not yet available, often because a provider will return it after resource creation. **Null** represents absence or omission in contexts that allow it. A **sensitive** value carries metadata used to restrict normal display. These categories answer different questions.

A generated bucket name can be unknown during planning. That does not mean it is null. An optional argument set to null can tell Terraform to omit a value, allowing a provider default where supported. A sensitive value can be fully known to Terraform and still be hidden from ordinary output. None of these concepts is equivalent to encryption.

`for_each` keys must be available early enough to establish instance addresses. Use a known map of service names even when the values contain future resource IDs. Trying to use newly generated IDs as instance keys fails because Terraform cannot establish the instance set before those IDs exist. This is an evaluation constraint with a design consequence: choose identity from stable intent, then carry computed details as values.

Avoid using sensitive material as keys. Resource addresses are routinely exposed in plans, logs, and diagnostics. An API token is a poor instance key even if the language allowed your intended construction. A nonsecret logical key such as `payments` makes the identity safer and easier to review.

## 2.11 References define dependency edges

When a resource argument refers to another resource's attribute, Terraform can infer that the second resource must provide the required value. This is an **implicit dependency**. It usually expresses the true reason for the ordering more accurately than a broad `depends_on` list.

A dependency graph is a set of nodes connected by directed relationships. Terraform can execute independent operations concurrently while respecting required order. File position is irrelevant. A bucket policy referring to the bucket ARN depends on the bucket value even when the policy appears first in the file.

Use explicit `depends_on` for a real hidden dependency that values do not express. For example, a function may require its logging policy to be attached before successful execution, even though its configuration refers directly only to the role ARN. This does not guarantee that every distributed AWS system is instantly consistent; it establishes Terraform's ordering relationship.

Broad module-level dependencies can make many downstream values unknown and reduce parallelism. Adding them to silence a symptom without identifying the actual hidden dependency often makes plans harder to review. Ask what fact or readiness condition the operation actually needs, then model the narrowest accurate relationship.

## 2.12 Conditionals and defensive expressions

A conditional has the form `condition ? true_value : false_value`. Both alternatives must be compatible with the surrounding type expectations. A conditional is useful for a deliberate choice, such as a retention period selected by environment. It should not become a substitute for clearly different architectural modules.

`try` and `can` help handle expressions that may raise dynamic errors. `can(regex(...))` is useful when validating a string format. `try` is most useful while normalizing uncertain external data into a predictable internal shape. Repeating `try` around every resource argument can hide misspelled attributes and produce plausible defaults that conceal a real bug.

Do not assume Boolean operators short-circuit every invalid expression the way you expect from another language. A null or malformed value can still require an explicitly safe conditional or normalization. For example, validate the presence and shape of an optional object before dereferencing its attributes through an unsafe expression. Test the expression with representative null and missing values in the console.

Prefer `jsonencode` when building JSON for an IAM policy or API payload. It converts HCL values into correctly escaped JSON. Hand-built JSON strings are easy to break with quotation marks and interpolation. A provider-specific policy-document data source adds additional structure for IAM policies, which Chapter 3 introduces.

## 2.13 Dynamic blocks have a narrower purpose

A `dynamic` block generates repeated nested blocks where a provider schema requires them. It does not create top-level resources, and it does not make unsupported resource arguments valid. Use ordinary expressions for ordinary collection arguments; use resource `for_each` for resource instances.

Dynamic blocks can be appropriate for a small, well-understood list of nested rules. They can also obscure a schema behind a generic abstraction. A module that accepts an arbitrary copy of every nested provider option may offer little value beyond making the official documentation harder to map to the code.

We will use explicit resource types for security group rules and ordinary map transformations for service catalogs. This is a teaching choice that makes ownership visible. When you encounter dynamic blocks in a real repository, identify the required nested block type, the collection being iterated, and the mapping from each element into the generated body.

## 2.14 Read the complete manifest from inputs to outputs

Open `labs/00-local/main.tf`. First locate the environment variable and its allowed values. Then locate the services contract and replica validation. Next inspect `local.active`: it normalizes the desired instance set by filtering disabled entries. The resource block maps each active service into a stored record. Finally the output maps each managed instance into a published manifest.

For default input, the conceptual progression is:

~~~text
services keys:       api, worker
active keys:         api, worker
resource addresses:  service["api"], service["worker"]
output keys:         api, worker
API output fields:   name=api, replicas=2, environment=dev
~~~

The resource's computed output is available after application. A plan can know the configured inputs while still representing some output values as unknown. The final manifest is not evidence that a real application has two running replicas. These are managed local data records. This distinction prevents a successful language experiment from being mistaken for cloud deployment.

Run the supplied tests and inspect their assertions. The disabled-worker case changes the collection shape and verifies that only the API key remains. The invalid-environment case expects variable validation to reject the input. These are meaningful behavioral checks because they target the interface and instance-set semantics, not merely the presence of a particular line of source code.

## 2.15 Debug expressions by reducing uncertainty

When an expression fails, identify whether the problem is syntax, type, shape, timing, or identity. A missing equals sign is syntax. A list passed where an object is expected is type or shape. A computed resource ID used as a repetition key is timing. A renamed map key producing a destroy/create proposal is identity.

Use `terraform console` to inspect a small value. Use `type(...)` in the console when you need to understand a value's type. Build a transformation in stages with locals while debugging, then keep the intermediate names that clarify intent. Do not hide a failure behind an empty default until you understand whether an empty result is a legitimate business case.

A good diagnostic path for an invalid `for_each` begins with the instance keys: are they strings, stable, nonsecret, and known at plan time? Then inspect the values. Many advanced-looking failures are a mismatch between the intended identity scheme and the data structure chosen to represent it.

## 2.16 Optional application and reference approach

Extend the local catalog with a scheduler service, enabled only in stage. Add a computed output listing service names and total desired replicas. Keep the same service keys and validate the replica domain. The reference approach is to construct the input map explicitly for the chosen environment or use a conditional for the scheduler's enabled attribute, filter it through the existing active map, and sum active replica counts.

An appropriate total expression is `sum([for service in values(local.active) : service.replicas])`. With API two and worker one, the total is three. If scheduler has one replica and is active in stage, the total is four. This total is a calculation over declarations; it remains distinct from observing runtime capacity.

In the companion, the **Collection identity** experiment computes address changes when an element is inserted into a list or a key is added to a map. Use it to see why stable keys reduce unintended reassociation. Its model deliberately excludes provider-specific replacement rules, which the change-management chapter adds to the discussion.

## Worked normalization: accept a choice, derive one internal shape

Suppose a caller may optionally provide a display name for a service. A useful design is to keep the stable service key separate from its human-readable label. The key might remain `api` while the display name becomes `Public API`. Renaming the display name then changes metadata without changing the instance address.

A typed object can declare `display_name = optional(string)`. A local expression can choose the supplied value when it is non-null and otherwise derive a readable label from the key. Keep that normalization near the input boundary, then let every resource consume the normalized shape. This avoids inconsistent defaults scattered across several resources.

The same pattern applies to tags, retention, and optional configuration. The contract accepts a bounded choice; the local transformation makes the internal representation predictable; resource repetition continues to use stable keys. Do not derive identity from a display label merely because the label happens to be unique today.

When debugging, inspect the raw input and normalized local separately. If the raw object is correct but the normalized value is wrong, the failure is in transformation. If the local is correct but a provider rejects the argument, inspect the resource schema and service constraint. This small separation turns one large mystery into two observable boundaries.

## References

The authoritative language definitions are [types and values](https://developer.hashicorp.com/terraform/language/expressions/types), [for_each](https://developer.hashicorp.com/terraform/language/meta-arguments/for_each), and [module provider relationships](https://developer.hashicorp.com/terraform/language/modules/develop/providers). These pages were partially inspected for the concepts used here; the runnable source is checked against the course's pinned CLI and provider baseline. Chapter 3 now gives these values real AWS meaning by adding identity, permissions, and private storage.
