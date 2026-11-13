variable "region" {
  type    = string
  default = "us-east-1"
}
variable "source_profile" { type = string }
variable "target_account_id" { type = string }
variable "deployment_role_name" { type = string }
provider "aws" {
  alias               = "target"
  region              = var.region
  profile             = var.source_profile
  allowed_account_ids = [var.target_account_id]
  assume_role {
    role_arn     = "arn:aws:iam::${var.target_account_id}:role/${var.deployment_role_name}"
    session_name = "tf-mastery"
  }
}
module "artifacts" {
  source      = "../../modules/private-bucket"
  providers   = { aws = aws.target }
  name_prefix = "tf-mastery-target"
}
output "bucket_name" { value = module.artifacts.name }
