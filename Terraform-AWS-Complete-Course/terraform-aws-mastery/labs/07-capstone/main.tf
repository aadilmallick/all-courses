variable "environment" {
  type    = string
  default = "dev"
  validation {
    condition     = contains(["dev", "stage", "prod"], var.environment)
    error_message = "Use dev, stage, or prod."
  }
}
variable "release" {
  type    = string
  default = "v1"
}
locals { name = "tf-mastery-${var.environment}" }
module "artifacts" {
  source      = "../../modules/private-bucket"
  name_prefix = local.name
  tags        = { Environment = var.environment }
}
resource "aws_dynamodb_table" "releases" {
  name         = "${local.name}-releases"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "release_id"
  attribute {
    name = "release_id"
    type = "S"
  }
  point_in_time_recovery { enabled = true }
  server_side_encryption { enabled = true }
  tags = { Environment = var.environment }
}
module "api" {
  source       = "../../modules/health-api"
  name         = "${local.name}-health"
  release      = var.release
  package_path = "${path.module}/../../assets/health.zip"
  context = {
    ARTIFACT_BUCKET = module.artifacts.name
    RELEASE_TABLE   = aws_dynamodb_table.releases.name
  }
}
output "url" { value = module.api.url }
output "artifact_bucket" { value = module.artifacts.name }
output "release_table" { value = aws_dynamodb_table.releases.name }
output "function_name" { value = module.api.function_name }
