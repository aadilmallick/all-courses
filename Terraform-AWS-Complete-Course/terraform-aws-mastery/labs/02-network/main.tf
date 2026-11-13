variable "zones" {
  type = map(object({ name = string, slot = number }))
  default = {
    first  = { name = "us-east-1a", slot = 0 }
    second = { name = "us-east-1b", slot = 1 }
  }
}
module "network" {
  source = "../../modules/network"
  name   = "tf-mastery"
  zones  = var.zones
}
output "private_cidrs" { value = module.network.private_cidrs }
output "vpc_id" { value = module.network.vpc_id }
