# Module contract: private-bucket

Creates a new versioned, encrypted general-purpose S3 bucket with public-access blocking, enforced object ownership, TLS-only policy, and force-destroy disabled. Inputs: validated name_prefix and optional map(string) tags. Outputs: name and arn. Inherits the caller's AWS configuration. Baseline: Terraform 1.17.2 and AWS provider 6.0.0.

Complete usage: labs/05-modules. Does not import existing buckets, grant application read/write permissions, or provide independent cross-account backup. A nonempty versioned bucket requires deliberate data disposition before destruction. Mock test: initialize this directory with `terraform init -backend=false`, then run `terraform test`. Computed policy JSON uses a valid fake document for schema testing; it is not a real access-policy acceptance test. See Chapters 3, 6, 7, and 9.
