variable "environment" {
  type    = string
  default = "dev"
}
module "artifacts" {
  source      = "../../modules/private-bucket"
  name_prefix = "tf-mastery-${var.environment}"
  tags        = { Environment = var.environment }
}
output "bucket_name" { value = module.artifacts.name }
