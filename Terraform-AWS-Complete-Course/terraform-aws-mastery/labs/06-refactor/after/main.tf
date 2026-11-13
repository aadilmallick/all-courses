terraform { required_version = "= 1.17.2" }
resource "terraform_data" "new_name" { input = "keep this identity" }
moved {
  from = terraform_data.old_name
  to   = terraform_data.new_name
}
output "identity" { value = terraform_data.new_name.id }
