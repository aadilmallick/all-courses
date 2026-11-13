# 3. AWS identity, permissions, and the first private bucket

**Central problem:** How can Terraform create the intended object in the intended account, using an identity with appropriate authority, without turning credentials or data into public artifacts?

**Prerequisites:** Chapters 1–2. This chapter introduces AWS accounts, regions, APIs, temporary credentials, IAM, and S3 before using them. You can read and inspect the source without an AWS account; applying the lab requires a sandbox account you control and may incur charges.

**Runnable source:** [labs/01-bucket](../labs/01-bucket/main.tf). The more complete reusable storage contract appears in [modules/private-bucket](../modules/private-bucket/main.tf).

## 3.1 A cloud account is an authority and billing boundary

AWS is a collection of services accessed through APIs. An API is a defined interface through which a program makes requests and receives results. The AWS console is one client of those interfaces, the AWS CLI is another, and the Terraform AWS provider is another. A setting changed through any of them can affect the same underlying object.

An **AWS account** contains resources, identities, service limits, and billing relationships. It is not the same as an individual person's login. An organization can give many people and automation systems access to an account. A **region** is a geographic service area with its own regional resource scope. An **Availability Zone** is an isolated location within a region. Different service types have different scopes: an IAM role is not a subnet, and a bucket name has naming constraints that differ from a local Terraform label.

We use `us-east-1` in examples so that values remain consistent. This is a convention, not a claim that it is the right region for your data, latency, compliance, or business continuity requirements. When changing regions, inspect every dependent assumption, including zone names, service availability, endpoints, images, and costs.

Before any real apply, establish the account and region explicitly. A friendly profile name like `sandbox` is helpful but not proof of the destination. Profiles can be edited, environment credentials can take precedence, and a shell can retain settings from another task. We add an account allowlist in the provider so that a misdirected run fails early.

## 3.2 Authentication and authorization answer different questions

**Authentication** establishes who is making a request. **Authorization** decides whether that identity may perform a particular action on particular resources under particular conditions. A valid login does not imply permission to create an S3 bucket. A successful S3 listing does not imply permission to modify IAM.

AWS IAM expresses permissions through policies, roles, and related mechanisms. A **role** is an identity that can be assumed under a trust policy and used through temporary sessions. A **trust policy** governs who may assume the role. A **permissions policy** governs what the resulting role session can do. These are different boundaries. A perfectly narrow permissions policy is useless if nobody legitimate can assume the role; an overly broad trust relationship can expose the role's permissions to an unintended principal.

For human access, the course prefers federation through IAM Identity Center or your organization's equivalent temporary-credential flow. For workloads, prefer role-based temporary credentials. The AWS [IAM guidance](https://docs.aws.amazon.com/IAM/latest/UserGuide/best-practices.html) supports these patterns and least-privilege access. Protect the account root user for account-level administration rather than using root credentials for Terraform labs.

A course cannot supply your organization's login URL, permission set, or role trust relationship. Those values must come from your account setup. If you do not yet have a safe AWS environment, continue with the local labs and companion while arranging one. Do not guess corporate account credentials or reuse a production profile merely to make an example run.

## 3.3 Configure and prove a temporary session

Install AWS CLI v2 using AWS's official installation instructions for your platform. If your account uses IAM Identity Center, the following is the common interactive flow:

~~~powershell
aws --version
aws configure sso --profile terraform-learning
aws sso login --profile terraform-learning
aws sts get-caller-identity --profile terraform-learning
~~~

The configuration wizard asks for organization-specific SSO and role information. The login opens the appropriate sign-in flow. `sts get-caller-identity` returns the account identifier and caller identity. It is an identity diagnostic, not a permissions audit and not an instruction to publish the returned details.

Select the profile for the current PowerShell session:

~~~powershell
$env:AWS_PROFILE = "terraform-learning"
$env:AWS_REGION = "us-east-1"
aws sts get-caller-identity
~~~

In Bash, use `export AWS_PROFILE=terraform-learning` and `export AWS_REGION=us-east-1`. The profile is not a secret, but the temporary credentials behind the session are sensitive. Do not paste access keys into Terraform source. If environment variables contain an old access key and secret, they can influence which identity a client uses. Diagnose the credential chain deliberately rather than repeatedly signing in to different profiles.

The precise SSO setup depends on prerequisites in your account. AWS documents the required configuration and session behavior in [IAM Identity Center authentication for the CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html). The course does not create accounts, identities, or permission sets on your behalf.

## 3.4 Give Terraform a second destination check

The lab's provider configuration includes typed inputs and an account allowlist:

~~~hcl
variable "expected_account_id" {
  type = string

  validation {
    condition     = can(regex("^[0-9]{12}$", var.expected_account_id))
    error_message = "Supply the 12-digit sandbox account ID."
  }
}

provider "aws" {
  region              = var.region
  allowed_account_ids = [var.expected_account_id]

  default_tags {
    tags = {
      Project   = "terraform-aws-mastery"
      ManagedBy = "Terraform"
    }
  }
}
~~~

This excerpt belongs with the supplied region variable and provider requirements. The regular expression checks only the format of an account ID. It cannot prove that the account is yours or that it is a sandbox. The provider's allowlist compares the authenticated account against the value you supplied. Use the independently verified sandbox account ID, not a number copied uncritically from an old configuration.

Provider default tags add consistent metadata to supported resources. Tags help with organization, ownership, and cost allocation, but they are not universal security enforcement and not every service exposes the same tagging behavior. Do not place secrets in tags. Tags and resource names can appear widely in logs, billing tools, and inventories.

The root pins `hashicorp/aws` to version `6.0.0`. This is a deliberate reproducibility baseline, not a claim that it is the newest provider. The provider lock file records the installed package selection and checksums. Production adoption should include a provider-version review and a planned upgrade process, which Chapter 11 teaches.

## 3.5 Understand S3 before creating a bucket

Amazon S3 stores **objects** inside **buckets**. An object consists of data and metadata addressed by a key. A key such as `notes/intro.txt` looks like a filesystem path, but S3 does not become a conventional mounted directory tree because keys contain slashes. Service APIs and permissions operate on buckets and objects with distinct resource identifiers.

A bucket name has service-wide naming requirements and uniqueness constraints within the applicable AWS partition. A Terraform label such as `notes` only needs to be unambiguous within its module and resource type. The lab uses a bucket prefix so the provider can generate a suffix rather than assuming a globally available exact name.

Creating a bucket does not upload a file. Enabling versioning does not create an independent backup account. Encrypting at rest does not decide who is authorized to read data. Blocking public access does not remove every possible cross-account grant. Each control addresses a particular threat or operating requirement.

Our first bucket is intentionally small in purpose: private learning storage with versioning and explicit default encryption. The reusable module later adds ownership controls and an HTTPS-only policy. We add these concepts incrementally so each security decision has an explanation and an observable configuration.

## 3.6 Trace the first resource graph

The lab declares an S3 bucket, a public-access block, versioning configuration, and server-side encryption configuration. The bucket is the parent object. The supporting resources refer to its ID. Those references form dependency edges.

~~~hcl
resource "aws_s3_bucket" "notes" {
  bucket_prefix = "tf-mastery-notes-"
  force_destroy = false
}

resource "aws_s3_bucket_public_access_block" "notes" {
  bucket                  = aws_s3_bucket.notes.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
~~~

The bucket's `id` identifies the created bucket for the related resource. The public-access settings are explicit so the desired posture is visible in the configuration rather than merely relying on remembered account defaults. These settings do not grant the Terraform executor permission to do anything; IAM still authorizes the calls.

`force_destroy = false` means Terraform should not automatically empty a nonempty bucket to destroy it. That is a data-retention choice. It can make cleanup require additional deliberate action, which is appropriate for teaching the difference between removing infrastructure and deleting stored data.

The supporting resources can be planned before the bucket name is fully known because Terraform understands the references. It does not need you to apply the bucket, copy its name, and paste it into the next resource. Manual copy-and-paste would lose the dependency relationship and make the configuration less reusable.

## 3.7 Versioning and encryption solve different problems

Versioning preserves multiple versions of an object key as the object changes. Deleting a versioned object normally creates a delete marker rather than erasing every previous version. This gives recovery options but also means that “the bucket looks empty” is not sufficient evidence that all versions have been removed.

The lab's encryption configuration requests server-side encryption using S3-managed encryption keys with the `AES256` setting. This makes the at-rest encryption choice explicit. A customer-managed KMS key introduces additional control and additional key-policy, availability, and cost responsibilities. It is appropriate when those controls are needed, not automatically superior for every tiny learning bucket.

The important causal distinction is that encryption protects stored data through a key-management mechanism, while authorization governs who may request access. A permitted caller can receive decrypted data through the normal service path. A broad read policy does not become acceptable merely because encryption is enabled.

For Terraform state, encryption is especially relevant because state can contain secrets. A private, encrypted bucket with versioning is part of a backend design, but it still needs carefully scoped access and an operating process. Chapter 6 builds that larger system; do not assume this first bucket is already a complete shared-state platform.

## 3.8 Prepare the lab without hiding inputs

From the extracted course root, copy the example variable file, replace its synthetic account ID with the independently verified sandbox account, and inspect it:

~~~powershell
Copy-Item ./labs/01-bucket/terraform.tfvars.example ./labs/01-bucket/terraform.tfvars
Get-Content ./labs/01-bucket/terraform.tfvars
terraform -chdir=labs/01-bucket init
terraform -chdir=labs/01-bucket fmt -check
terraform -chdir=labs/01-bucket validate
terraform -chdir=labs/01-bucket plan -out=bucket.tfplan
terraform -chdir=labs/01-bucket show bucket.tfplan
~~~

Stop at the plan while reviewing. Initialization can download provider executables and contact registries; it does not itself create this lab's AWS bucket. Validation checks structure. Planning may call AWS to obtain information, confirm the caller, and refresh managed resources. A plan is therefore not an offline operation merely because it does not intentionally create the declared bucket.

The normal initial proposal contains four resource creations. A provider version or future lab revision can change the presentation, so review the actual addresses and arguments rather than trusting a memorized count. The bucket name suffix is generally not known until creation. Verify that there are no unexpected managed resources and that the provider destination is the intended account and region.

When you choose to execute the reviewed change:

~~~powershell
terraform -chdir=labs/01-bucket apply bucket.tfplan
terraform -chdir=labs/01-bucket output -raw bucket_name
terraform -chdir=labs/01-bucket plan
~~~

`-raw` prints a supported scalar output without Terraform's surrounding presentation quotes. The final plan checks whether the declared configuration has converged. It does not verify the contents of any uploaded file, because no file has been uploaded yet.

## 3.9 Verify an independent property through AWS

A useful post-deployment check inspects the service directly through a second interface. Capture the bucket name from Terraform, then query selected settings:

~~~powershell
$taskBucketName = terraform -chdir=labs/01-bucket output -raw bucket_name
aws s3api get-public-access-block --bucket $taskBucketName
aws s3api get-bucket-versioning --bucket $taskBucketName
aws s3api get-bucket-encryption --bucket $taskBucketName
~~~

Each command asks AWS for a particular property. A permission error means the diagnostic caller lacks the required read action or is otherwise denied; it does not automatically prove that Terraform failed to configure the resource. Compare caller identity and the exact API action before drawing a conclusion.

If you choose to upload a harmless synthetic text file, create a tiny local note and use `aws s3 cp` with the verified bucket name. An upload is a data-plane action distinct from creating the bucket. The executor may be allowed to configure the bucket without being allowed to read and write its objects, depending on policy design. This separation becomes important in production, where infrastructure operators do not always need application data access.

Do not use private company documents for a learning upload. The subject of the exercise is lifecycle and access behavior; synthetic content provides the same teaching value without introducing unrelated data handling concerns.

## 3.10 Read an IAM policy as a bounded decision

An IAM policy statement includes an effect, actions, resources, and optional conditions. Here is an explanatory identity-policy fragment for reading objects under a particular prefix:

~~~json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": ["arn:aws:s3:::example-learning-bucket/notes/*"]
  }]
}
~~~

This is a teaching fragment using a synthetic bucket name; it is not attached by the lab. The action identifies the API permission. The object ARN scopes it to keys under `notes/`. The bucket ARN without the trailing object path represents a different resource scope. Listing a bucket typically requires a bucket-level permission such as `s3:ListBucket`, which is why adding a GetObject statement does not automatically make every command succeed.

The full authorization result can involve identity policies, resource policies, permission boundaries, session policies, organization policies, and explicit denies. A small browser experiment cannot implement that entire system. Our companion's **Policy reasoning** model explicitly covers a simplified allow/deny case to teach the idea of intersecting limits; use AWS IAM tools and documentation for real evaluations.

Least privilege means granting the actions and resources required for the legitimate job under appropriate conditions. It is not achieved by changing one wildcard in an otherwise unexplained policy. Begin with the workflow, identify the actual API operations, scope them, and verify both permitted and prohibited behavior in an appropriate environment.

## 3.11 Why policy documents are generated from values

The reusable bucket module uses `aws_iam_policy_document` to construct a policy denying non-TLS requests. The statement references the bucket ARN and object ARN, uses effect Deny, and checks the `aws:SecureTransport` condition. It then assigns the generated JSON to an S3 bucket-policy resource.

This separates the policy's structured inputs from JSON serialization. An expression such as `"${aws_s3_bucket.this.arn}/*"` derives the object resource scope from the actual bucket. Terraform can then see the dependency. The data source itself does not grant permissions or create an AWS policy attachment; the consuming resource is what applies the resulting policy to AWS.

A TLS-only deny is a narrow control, not an all-encompassing policy. It does not grant anyone access, and it does not replace public-access blocking. Likewise, object ownership enforcement addresses ACL behavior, while versioning addresses recovery. A sound storage contract composes controls whose purposes you can explain.

When testing with a mocked provider, computed policy-document JSON must still be valid for consumers that validate JSON syntax. Chapter 9 shows why mocks need purposeful defaults and why passing a mock test does not prove AWS accepts a real policy.

## 3.12 Diagnose failures at the correct boundary

An expired SSO session is an authentication problem. An AccessDenied response is usually an authorization or explicit-deny problem. A naming conflict is a service constraint. A resource already managed elsewhere is an ownership problem. A wrong-region endpoint or an unreachable API is a connectivity or configuration problem. Similar-looking command failures can require very different remedies.

For an authorization failure, record the caller, action, resource, and relevant conditions. Do not immediately attach AdministratorAccess. An apparently broad allow can be limited by an explicit deny or another policy boundary. Increasing permissions without understanding that boundary can fail to fix the issue while increasing risk elsewhere.

For a bucket conflict, distinguish an exact name from a generated prefix. A prefix reduces the chance of a collision; it does not permit violating naming rules. For a destroy failure, inspect whether object versions or delete markers remain. For a provider identity error, compare the actual account with `allowed_account_ids` before editing the allowlist.

Terraform diagnostics often include request identifiers from AWS. Those can help an account administrator investigate service behavior. Preserve useful diagnostics in a protected place while keeping credentials and sensitive payloads out of public issues. A reproducible failure report should explain the action and context without requiring access to secret values.

## 3.13 Costs and cleanup are design topics

An empty learning bucket is inexpensive in many situations, but “inexpensive” is not a spending guarantee. Requests, storage, transfers, logs, KMS operations, and related services can be billed. Free-tier eligibility depends on current account programs and usage. This course does not assume that every learner qualifies for a free tier.

Use a budget or billing alert appropriate to your account and understand that an alert does not automatically stop all resource usage. The companion's cost experiment accepts your own rates and labels its output as an estimate. Obtain live prices for the actual region and services before a substantial deployment.

For an untouched empty bucket, a reviewed destroy plan should remove the lab resources. If you uploaded objects after enabling versioning, normal object deletion may leave versions behind. Deliberately inspect versions and delete only the synthetic lab data you intend to discard, including delete markers where necessary. Keep `force_destroy = false` as the default habit for storage whose data matters.

~~~powershell
terraform -chdir=labs/01-bucket plan -destroy -out=cleanup.tfplan
terraform -chdir=labs/01-bucket show cleanup.tfplan
terraform -chdir=labs/01-bucket apply cleanup.tfplan
~~~

If a deletion fails, do not delete Terraform state to suppress the error. Resolve the service condition and rerun a normal plan. State preservation is particularly valuable after partial operations because it records which associations Terraform already established.

## 3.14 Optional application: compare a setting with an invariant

Add a nonsecret Environment tag to the first bucket and plan the change. Observe whether the bucket identity remains the same. Then inspect the reusable private-bucket module and write one sentence for each control explaining which property it aims to maintain.

A reference explanation is: public-access blocking limits public grants; ownership enforcement disables ACL-based ownership ambiguity; versioning preserves prior object versions; encryption defines at-rest handling; the TLS policy rejects insecure transport; force-destroy being false resists automatic deletion of stored contents. None of these sentences should claim that the control independently proves “the bucket is secure.”

For a deeper application, draft an access requirement that separates the Terraform executor from an application reader. The executor manages bucket settings. The application can read only a specific object prefix. This is a design exercise with a clear reference direction, not a requirement to modify a corporate IAM system.

## 3.15 Connect identity to the network chapter

IAM answers whether an authenticated principal may ask a service to perform an action. Network routing answers whether packets can reach the relevant endpoint. Both can block a workflow, but they operate at different layers. A private subnet does not grant S3 permissions, and a permissive IAM statement does not create an internet route.

Chapter 4 introduces IP addresses, CIDR ranges, subnets, routes, gateways, and security groups in that dependency order. We will build the network as a reusable set of relationships, while keeping paid NAT gateways and always-on compute out of the default network lab. The result is a practical network foundation whose reachability can be reasoned about before any application is placed inside it.

## Worked request trace: a private object read

Assume a role session tries to retrieve `notes/intro.txt` from the learning bucket. First, the client needs a route to the S3 endpoint and a successful authenticated request. Second, the applicable authorization must permit `s3:GetObject` on the object ARN. Third, explicit denies and relevant limits must not prohibit the request. If a customer-managed encryption key is involved, the necessary key authorization also matters.

The public-access block does not supply the role's allow. It constrains public access behavior. The TLS-only bucket policy does not supply the allow either; it denies a class of insecure requests. The at-rest encryption setting does not choose which role can read the data. Each mechanism has a different causal role in the final result.

Now change only the request to use an insecure transport path. The TLS deny becomes relevant even if the role has an object-read allow. Change only the object key to `private/other.txt`, and a prefix-scoped allow may no longer apply. Change only the role session, and a different set of identity/session constraints may be evaluated. A useful diagnostic changes one relevant dimension at a time.

For a real failure report, record the action, bucket/key scope, caller role, endpoint context, time, and request identifier where available. Do not include the temporary secret access key. The request can be investigated through its identity and service evidence without distributing the credential that signed it.

An independent service query can also fail because the diagnostic role lacks read access to bucket settings while the deployment role successfully configured them. In that case, the absence of diagnostic permission is not evidence of an absent control. Ask an authorized operator to verify the specific setting or use a purpose-built read role. Avoid broadening an application role to administrative access merely to make a convenience command work.

This trace is the beginning of a security habit used throughout the course: describe the actual request and enumerate the boundaries it crosses. A statement such as “the bucket is encrypted and private” is a useful inventory summary, but it is too broad to explain why one concrete request succeeds or fails.

## References and limits

The pinned provider's [S3 bucket schema](https://raw.githubusercontent.com/hashicorp/terraform-provider-aws/v6.0.0/website/docs/r/s3_bucket.html.markdown) was inspected for bucket naming, prefixes, deletion, and resource behavior. AWS's [Terraform provider guidance](https://docs.aws.amazon.com/prescriptive-guidance/latest/terraform-aws-provider-best-practices/introduction.html) supplies further primary reading on operating practices. The course validates configuration and mock contracts locally; real account permissions, organization policies, billing behavior, and service acceptance require verification in your own authorized sandbox.
