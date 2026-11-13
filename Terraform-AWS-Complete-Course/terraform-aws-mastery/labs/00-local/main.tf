terraform { required_version = "= 1.17.2" }
variable "environment" {
  type    = string
  default = "dev"
  validation {
    condition     = contains(["dev", "stage", "prod"], var.environment)
    error_message = "Use dev, stage, or prod."
  }
}
variable "services" {
  type = map(object({ replicas = number, enabled = optional(bool, true) }))
  default = {
    api    = { replicas = 2 }
    worker = { replicas = 1 }
  }
  validation {
    condition     = alltrue([for service in values(var.services) : service.replicas >= 0 && floor(service.replicas) == service.replicas])
    error_message = "Replicas must be nonnegative integers."
  }
}
locals {
  active = { for name, service in var.services : name => service if service.enabled }
}
resource "terraform_data" "service" {
  for_each = local.active
  input = {
    name        = each.key
    replicas    = each.value.replicas
    environment = var.environment
  }
}
output "manifest" {
  value = { for name, service in terraform_data.service : name => service.output }
}
