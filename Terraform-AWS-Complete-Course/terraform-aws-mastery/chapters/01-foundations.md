# 1. From a changed setting to a reproducible system

**Central problem:** How do we change infrastructure deliberately, repeat the change elsewhere, and understand what will happen before we authorize it?

**You need:** the ability to make a folder and edit a text file. This chapter teaches the command-line and cloud vocabulary required by the first experiment. No AWS account is needed yet.

**By the end:** you can initialize a Terraform working directory, distinguish configuration from state and infrastructure, read a small plan, apply a local change, and remove the local demonstration. The complete runnable example is [labs/00-local](../labs/00-local/main.tf); its language features are unpacked in Chapter 2.

## 1.1 The problem before the tool

Imagine maintaining a small internal application. It needs a place to store files, permission to read them, and a service that answers requests. You create the pieces in a cloud console. A month later, a colleague creates a second environment. They remember most settings, choose a different network option, and forget a permission. Both environments have plausible names. Only one works.

The immediate problem is not that clicking is inherently wrong. It is that the intended design, the actual changes, and the evidence of those changes have become separated. A screenshot shows some settings at a particular moment. A checklist describes actions but may omit defaults. A script describes a sequence, but running the sequence twice can create duplicate objects unless its author anticipated that case.

Infrastructure as code puts an important part of the intended design in reviewable text. Terraform adds a planning engine and a record of the objects it manages. The result is a workflow in which a person can propose a change, inspect its consequences, and authorize execution. The text is still a model. It cannot guarantee the application is useful, secure, affordable, or available. Those properties need design and evidence beyond a successful command.

Our recurring example is **Field Notes**, a fictional service with a health endpoint, private artifact storage, and a release metadata table. We begin with a representation of services that exists only on your computer. Later we provision small AWS components and assemble them into a deployment. Beginning locally separates Terraform's behavior from cloud permissions, network access, and service charges.

## 1.2 Five nouns that prevent many misunderstandings

A **configuration** is the set of Terraform language files in a module directory. It describes resources, inputs, expressions, and outputs. A **resource** is an object Terraform manages through a resource type. An S3 bucket can be a resource. In our local exercise, a built-in resource records a structured value without contacting AWS.

A **provider** is a plugin that translates between Terraform and an external system's APIs. The AWS provider understands AWS resource schemas and API interactions. Terraform itself handles expression evaluation, dependency planning, and state coordination. This separation explains why installing Terraform does not install every provider, and why upgrading Terraform and upgrading the AWS provider are different changes.

**State** records Terraform's associations between configuration addresses and managed object identities, together with information needed for future operations. Think of an address book that says which managed object belongs to each declaration. The analogy is limited: state contains considerably more than names and can include sensitive attributes. State is operational data, not a substitute for the configuration and not an automatically authoritative description of every object in an AWS account.

A **plan** is a proposed set of actions calculated for a particular configuration, inputs, state, provider behavior, and observations. It may propose creating, updating, replacing, or destroying resources. A plan is not an all-purpose forecast of AWS behavior. Permissions can change, quotas can be reached, and external objects can disappear after planning.

An **apply** executes an approved plan and records the results Terraform can observe. Execution can succeed partially. If Terraform creates a bucket and then a separate operation fails, it does not promise to delete the bucket as a transactional rollback. This is why we will learn recovery as a normal operating skill.

| Thing | Example | Where it belongs |
|---|---|---|
| Configuration | A declaration of two services | Version control |
| Dependency lock file | Selected provider versions and checksums | Version control |
| State | Associations and recorded resource values | Protected local storage or an access-controlled backend |
| Saved plan | A particular executable change proposal | Short-lived, protected change artifact |
| Actual system | The bucket, function, network, or local managed record | The managed platform |

## 1.3 A useful reconciliation model

Here is a conceptual model, not Terraform source code:

~~~text
configuration + inputs + prior state + provider observations
                         |
                         v
                    proposed actions
                         |
                      approval
                         |
                         v
                 API operations + new state
~~~

Suppose the configuration requests two service records, state contains none, and no remote objects are involved. The initial plan proposes two creates. Applying creates the records in state. Planning again with unchanged inputs proposes no resource changes. If you change a record's replica value, the next plan proposes an update for that record.

The repeatability we care about is **convergence**: repeated evaluation with the same relevant conditions reaches a stable desired configuration. This is related to idempotence, the property that repeating an operation has the same final effect. Terraform cannot make every provider operation harmless or every external system perfectly consistent. The practical lesson is to seek a stable no-change plan, while understanding the boundaries of the system being managed.

Terraform is not a daemon that continuously fixes drift merely because configuration exists on disk. Someone or some automation must run it. It also manages declared and associated objects rather than discovering every object in an account and taking ownership. Import and discovery tools help with existing infrastructure, but ownership remains an explicit design decision.

## 1.4 Files, folders, and the terminal

A terminal is a window through which a shell accepts commands. This course uses **PowerShell** as the primary shell because it works well on Windows and is available elsewhere. Terraform commands themselves are generally the same in Bash and zsh; environment-variable syntax and quoting can differ.

The **working directory** is the folder a command treats as its starting point. Terraform ordinarily reads the module in that directory. You can change directories, or use Terraform's global `-chdir` option to select a directory before the subcommand. This course often uses `-chdir` so there is less ambiguity about which lab a command affects.

An **argument** supplies additional information to a command. In `terraform version`, `version` chooses the operation. In `terraform plan -out=review.tfplan`, `-out=review.tfplan` requests a saved plan at that path. A relative path is resolved from the relevant working directory. An absolute path identifies a location from the filesystem root. Put paths containing spaces in quotes.

From the extracted course folder, these commands inspect the first lab:

~~~powershell
Get-Location
Get-ChildItem ./labs/00-local
Get-Content ./labs/00-local/main.tf
~~~

`Get-Location` displays your current directory. `Get-ChildItem` lists entries. `Get-Content` reads text. None of these commands changes the lab. On macOS or Linux in Bash, the corresponding common commands are `pwd`, `ls`, and `cat`. You do not need to memorize both shells; choose one and keep commands consistent with it.

A shell reports an **exit code** when a program finishes. Zero ordinarily means success. Nonzero codes need interpretation by that program's documentation. PowerShell exposes the last native program's exit code through `$LASTEXITCODE`. Later, Terraform's detailed plan mode deliberately uses a nonzero code to mean that changes exist, so treating every nonzero result as the same kind of failure would break the workflow.

## 1.5 Install a declared version, then verify what runs

The authoring baseline is **Terraform CLI 1.17.2**. The release index was checked on November 13, 2026; this book uses an exact version so its examples have an identifiable target. Future readers should review supported releases and security advisories before choosing a production baseline. The installation procedure and official archives are available from [HashiCorp's installation page](https://developer.hashicorp.com/terraform/install) and [release index](https://releases.hashicorp.com/terraform/).

On Windows, download the archive for your processor architecture, verify it using the published checksums and signature guidance, extract the executable into a dedicated tools directory, and add that directory to your user PATH. PATH is the ordered list of directories the shell searches for programs. Adding the directory makes `terraform` available without typing the executable's full location. Open a new terminal after changing PATH.

On macOS and Linux, use an official package installation route or the matching binary archive. Package managers can install a newer version than the course target. Check what was installed rather than assuming that the command and the declared version agree. A version manager can help when different projects require different Terraform versions, but it is optional and not part of this course's runtime dependencies.

~~~powershell
terraform version
Get-Command terraform
~~~

The first command should identify the installed version and platform. The second shows the executable PowerShell resolves. If the version is unexpected, inspect PATH ordering or your version manager. Downloading a new executable is not enough if an older executable appears first in PATH.

The AWS CLI is unnecessary for this chapter. Node.js 22 or later runs the companion, and Python 3.12 or later runs the optional local packaging and policy scripts. We keep these roles separate: Node runs the educational browser experiments, Python supplies a few course tools, and Terraform evaluates the infrastructure configuration. None substitutes for the others.

## 1.6 A smallest complete local configuration

Create a scratch directory if you want to type the example yourself. Put only this configuration in `main.tf`:

~~~hcl
terraform {
  required_version = "= 1.17.2"
}

resource "terraform_data" "greeting" {
  input = "Hello, infrastructure"
}

output "message" {
  value = terraform_data.greeting.output
}
~~~

The `terraform` block constrains the CLI version. It does not download a matching executable. The `resource` block declares a managed object. Its first label, `terraform_data`, is the resource type; its second label, `greeting`, is the name within this module. The address is `terraform_data.greeting`. `input` is an argument whose value we choose.

The built-in `terraform_data` resource stores and exposes values through Terraform's own lifecycle machinery. It does not create a file, server, container, or AWS resource. This makes it useful for observing planning and state without adding a cloud prerequisite. Its `output` attribute contains the stored input value after application.

The `output` block exposes a value from the module. Its `value` expression refers to the resource's output. That reference also tells Terraform about a dependency. The word `output` appears in two roles: the block publishes a module result, while the resource attribute is a field defined by that resource type. Their shared spelling does not make them the same construct.

## 1.7 Initialize, plan, and apply with intermediate evidence

In the scratch directory, run:

~~~powershell
terraform init
terraform fmt
terraform validate
terraform plan -out=first.tfplan
terraform show first.tfplan
terraform apply first.tfplan
terraform output message
terraform plan
~~~

`init` prepares the directory, installs required providers where necessary, and initializes the configured backend. The built-in provider requires no external provider download. `fmt` rewrites language formatting consistently. `validate` checks configuration structure and internal consistency using available schemas; it does not verify that AWS credentials work or that a deployment can fit within quotas.

`plan -out` calculates and saves a particular proposal. `show` presents its contents for review. The first plan should contain one resource creation. Some values, such as the resource identifier, are unknown until application. An unknown is an intentional part of Terraform's model, not an error or a missing string that you should replace manually.

`apply first.tfplan` executes the saved plan. Supplying a saved plan counts as approval; Terraform does not offer the usual interactive yes/no approval step for that plan. Treat the command itself as the authorization boundary. In this local demonstration the effect is small, but the same command structure can operate on production infrastructure.

`output message` should display the greeting. A subsequent plan should report no changes. That second plan matters: it checks convergence for the conditions observed during the run. It does not certify that every future run will be unchanged.

The generated state contains the managed record. The `.terraform` directory holds local working data. A dependency lock file may be absent when no separately installed provider is needed. This is normal. Do not invent a provider dependency merely to force a lock file into a local demonstration.

## 1.8 Observe one controlled change

Change the input string to `Hello, Field Notes`, then plan again. The resource address remains `terraform_data.greeting`. Terraform can associate the declaration with the existing managed object and propose an update to its input. The output changes because it depends on the updated value.

Now consider a different edit: rename the resource label from `greeting` to `welcome` and update the output reference. You may intend only a cosmetic rename, but the configuration address has changed. Without migration information, Terraform sees one address removed and another added. For a cloud resource this can turn a harmless organizational edit into a destructive proposal. Chapter 8 teaches `moved` blocks, which preserve identity while changing addresses.

The key relationship is worth stating precisely: **labels help form Terraform identity; arguments configure the object represented by that identity**. An AWS tag called Name is another piece of metadata and does not replace Terraform's address. Later, a provider-specific immutable argument can also force replacement even when the address stays unchanged. Both address changes and immutable-attribute changes matter during review.

## 1.9 The supplied local lab adds a realistic shape

The course's `labs/00-local/main.tf` manages a map of service records. A **map** associates stable keys such as `api` and `worker` with values. Each value contains a replica count and an enabled flag. The lab filters out disabled services and uses `for_each` to manage one resource instance per remaining key.

~~~powershell
terraform -chdir=labs/00-local init
terraform -chdir=labs/00-local plan -out=local.tfplan
terraform -chdir=labs/00-local apply local.tfplan
terraform -chdir=labs/00-local output manifest
terraform -chdir=labs/00-local test
~~~

The initial default configuration creates two service records. Their addresses include keys: `terraform_data.service["api"]` and `terraform_data.service["worker"]`. The output is a structured manifest rather than a single string. Chapter 2 explains every language feature used to produce it, so reading the full file now is an orientation, not a prerequisite test.

The test file contains a default behavior case, a disabled-worker case, and an invalid-environment case. It uses only the built-in provider, so executing it creates no AWS resources. Terraform's testing system can create real infrastructure in other configurations; this lab's no-cloud behavior comes from its actual resource types, not from the word “test.”

## 1.10 Clean up deliberately

To remove the records from the local lab:

~~~powershell
terraform -chdir=labs/00-local plan -destroy -out=cleanup.tfplan
terraform -chdir=labs/00-local show cleanup.tfplan
terraform -chdir=labs/00-local apply cleanup.tfplan
~~~

A destroy plan proposes removing all managed resources selected by that root module and state. It does not search your disk or account and delete unrelated objects with similar names. Conversely, removing a resource declaration from configuration normally proposes destroying its associated managed object. “I deleted a line of code” can therefore represent an infrastructure deletion request.

Do not use deletion of the state file as cleanup. That removes Terraform's record while leaving actual remote objects behind. With cloud resources, you would lose useful associations and could continue paying for unmanaged infrastructure. Even for this local lab, following the normal plan-and-apply lifecycle builds the right habit.

## 1.11 Review is a technical activity

When reading a plan, start with the account, environment, and state identity. Then inspect resource addresses, action types, important before-and-after values, and unexpected replacements or deletions. A summary such as “3 to add, 1 to change, 0 to destroy” is helpful but insufficient. A single change to an access policy can be more consequential than twenty harmless resource creations.

Unknown values require thought. A planned bucket identifier can be unknown because AWS will assign a suffix. That is expected. A critical policy whose full content becomes unknown because of unnecessarily broad dependencies may deserve a design improvement. The objective is not to eliminate every unknown, but to know which facts the reviewer can establish before application and what needs verification afterward.

Keep operational outputs as evidence. For local learning, notes about the command, selected lab, and observed result are enough. In a team, useful evidence includes the commit, dependency lock file, selected inputs, plan, approval, executor identity, and post-deployment checks. Later chapters build that chain without assuming a particular commercial platform.

## 1.12 Common first-day failures

| Symptom | Likely distinction | Next useful check |
|---|---|---|
| Command not found | Installation or PATH problem | Inspect `Get-Command terraform` and reopen the shell |
| Wrong version error | Configuration constraint differs from executable | Compare `required_version` with `terraform version` |
| No configuration files | Command is using a different directory | Inspect location or use `-chdir` |
| Invalid expression | Language syntax problem | Read the exact filename and line in the diagnostic |
| Provider installation failed | Initialization or network problem | Check the required provider and registry reachability |
| Test proposes AWS resources | Test uses a real provider | Inspect resource types and test provider configuration |
| Unexpected deletion | Address or declaration removed | Compare addresses and stop before apply |

Read the first meaningful diagnostic before trying unrelated commands. Repeated `init -upgrade` runs do not fix malformed expressions and may introduce a provider-version change that obscures the original problem. Troubleshooting is faster when the attempted remedy matches the layer that failed.

## 1.13 Optional guided application

Use a separate scratch directory to create a local release record. Give it an input object with `service = "field-notes"` and `release = "v1"`, then publish that object as an output. Apply once, change the release to `v2`, and inspect the next plan before applying.

A reference approach is the greeting example with an object substituted for the input string. HCL object attributes use `name = value` inside braces. The resource can accept the entire object as its input, and the output can expose the resulting stored object. A useful observation is that the address stays the same while the value changes. If you see a new address, compare the labels you typed rather than assuming that all updates require replacement.

For an application design extension, write a short change note: what changed, which object identity was preserved, what the plan proposed, and how you confirmed the final value. This is optional practice, not a gate that prevents reading further.

## 1.14 Use the companion as a model you can inspect

Start the companion from the course root with `node companion/server.mjs`, then open the localhost address printed by the server. The **Reconciliation** experiment lets you vary desired and recorded replica values and choose whether a remote object exists. Its output classifies the resulting conceptual action and explains the inputs behind it.

This experiment computes from its controls; it does not invoke Terraform or interrogate AWS. Its limited model omits provider schemas, unknown values, refresh details, and partial execution. That limitation is useful: first isolate the relationship among desired values, recorded ownership, and actual existence, then return to the CLI to see the richer behavior. The source is included so the model's assumptions are reviewable.

The next chapter gives you enough language fluency to explain the supplied service manifest, build collections without fragile addresses, and recognize the difference between a value that is absent, a value that is unknown, and a value whose type is wrong.

## Worked comparison: three edits that look equally small

Use the greeting configuration to distinguish three different changes. First, edit only the input text. The address remains `terraform_data.greeting`, and the resource type supports updating its stored input. The plan therefore has an existing association and a changed value. This is the simplest configuration update.

Second, edit only the output label from `message` to `greeting_message`. The managed resource address and input are unchanged. The published module interface changes, so a caller or operator using the old output name must adapt, but there is no reason to recreate the underlying resource. An output change can be operationally important even when the resource action summary is empty.

Third, edit the resource label and update the reference. The intended message may be identical, but the address association changes. Without a move declaration, the plan can propose removing the old managed instance and creating a new one. The remote or local object ID can change even though the visible text does not.

This comparison gives you a practical way to read future diffs. Ask whether the edit changes a configured value, a published interface, or an identity. Some changes affect several at once. Separating them during learning makes later combined changes easier to reason about.

### A source-control habit before the cloud labs

Version control records intentional source changes. Before adding the course to a repository, inspect `.gitignore` and the actual staged file list. A rule excluding `*.tfstate` helps prevent a common mistake, but it does not retroactively remove a state file already committed. A repository can also contain secrets under unexpected filenames. Review contents as well as patterns.

Keep `.terraform.lock.hcl` when one is generated for external providers. It is dependency metadata, not infrastructure state. The leading dot does not make it disposable. Conversely, the `.terraform` working directory is normally machine-local initialization data and should not be copied into the source package.

A useful first commit contains the configuration, example nonsecret inputs, documentation, tests, and dependency records. A later commit changes one understandable behavior and includes a concise explanation. You do not need a sophisticated branching strategy to gain the core benefit: the next reader can see what changed and why.

### What to retain from a local learning run

Keep the source and a short note of the observed relationship. You might record that the first plan created one resource, the second unchanged plan converged, and a value edit preserved its ID. Avoid retaining every generated plan forever; plans are short-lived execution artifacts whose value depends on context.

For the cloud chapters, retain enough operational evidence under appropriate access controls to investigate a failure. The standard becomes more rigorous because real resources, data, and costs are involved. The mechanism is the same: preserve the facts that connect the proposed change to the observed result, rather than collecting files indiscriminately.


A useful stopping rule for the first lab is that you can point to the configuration address, the stored ID, the proposed action, and the observed output without treating them as interchangeable. If one is unclear, repeat the smallest local change and inspect that boundary. There is no benefit in adding AWS permissions while the underlying lifecycle model is still uncertain. The next examples deliberately preserve this same sequence so that new cloud concepts add one layer at a time.

## References and version notes

The executable workflow is grounded in the [Terraform plan reference](https://developer.hashicorp.com/terraform/cli/commands/plan). Exact flags and behavior should be checked against the project's selected CLI version. The official [resource overview](https://developer.hashicorp.com/terraform/language/resources) supplies the terminology used for managed resources. The explanations and fictional examples in this chapter are original teaching material; the links provide authoritative API and language references rather than a claim that a command was executed in your AWS account.
