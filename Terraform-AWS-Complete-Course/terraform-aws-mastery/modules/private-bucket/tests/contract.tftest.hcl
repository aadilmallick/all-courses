mock_provider "aws" {
  mock_data "aws_iam_policy_document" {
    defaults = { json = "{\"Version\":\"2012-10-17\",\"Statement\":[]}" }
  }
}
variables { name_prefix = "tf-mastery-test" }
run "bucket_contract" {
  command = plan
  assert {
    condition     = aws_s3_bucket.this.force_destroy == false && aws_s3_bucket_public_access_block.this.block_public_policy
    error_message = "The bucket must resist automatic data deletion and public policies."
  }
  assert {
    condition     = aws_s3_bucket_versioning.this.versioning_configuration[0].status == "Enabled"
    error_message = "Version history must be enabled."
  }
}
run "reject_bad_name" {
  command = plan
  variables { name_prefix = "INVALID NAME" }
  expect_failures = [var.name_prefix]
}
