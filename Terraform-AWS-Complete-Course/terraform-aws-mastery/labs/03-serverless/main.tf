module "api" {
  source       = "../../modules/health-api"
  name         = "tf-mastery-health"
  package_path = "${path.module}/../../assets/health.zip"
}
output "url" { value = module.api.url }
