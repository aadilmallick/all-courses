terraform { required_version = "= 1.17.2" }
resource "terraform_data" "old_name" { input = "keep this identity" }
output "identity" { value = terraform_data.old_name.id }
