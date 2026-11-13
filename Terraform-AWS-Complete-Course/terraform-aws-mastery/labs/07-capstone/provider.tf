variable "region" {
  type    = string
  default = "us-east-1"
}
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
