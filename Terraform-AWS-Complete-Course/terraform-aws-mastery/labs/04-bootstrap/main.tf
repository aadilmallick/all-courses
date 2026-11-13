module "state_bucket" {
  source      = "../../modules/private-bucket"
  name_prefix = "tf-mastery-state"
  tags        = { Purpose = "terraform-state" }
}
output "bucket_name" { value = module.state_bucket.name }
