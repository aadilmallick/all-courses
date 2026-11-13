variable "name" { type = string }
variable "cidr" {
  type    = string
  default = "10.42.0.0/16"
  validation {
    condition     = can(cidrnetmask(var.cidr)) && endswith(var.cidr, "/16")
    error_message = "This teaching module supports an IPv4 /16 VPC CIDR."
  }
}
variable "zones" {
  type = map(object({ name = string, slot = number }))
  validation {
    condition     = length(var.zones) >= 2 && length(distinct([for z in values(var.zones) : z.slot])) == length(var.zones) && alltrue([for z in values(var.zones) : z.slot >= 0 && z.slot < 128 && floor(z.slot) == z.slot])
    error_message = "Use at least two unique integer slots from 0 to 127."
  }
}
resource "aws_vpc" "this" {
  cidr_block           = var.cidr
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags                 = { Name = var.name }
}
resource "aws_internet_gateway" "this" { vpc_id = aws_vpc.this.id }
resource "aws_subnet" "public" {
  for_each                = var.zones
  vpc_id                  = aws_vpc.this.id
  availability_zone       = each.value.name
  cidr_block              = cidrsubnet(var.cidr, 8, each.value.slot)
  map_public_ip_on_launch = false
  tags                    = { Name = "${var.name}-public-${each.key}" }
}
resource "aws_subnet" "private" {
  for_each          = var.zones
  vpc_id            = aws_vpc.this.id
  availability_zone = each.value.name
  cidr_block        = cidrsubnet(var.cidr, 8, 128 + each.value.slot)
  tags              = { Name = "${var.name}-private-${each.key}" }
}
resource "aws_route_table" "public" { vpc_id = aws_vpc.this.id }
resource "aws_route" "internet" {
  route_table_id         = aws_route_table.public.id
  destination_cidr_block = "0.0.0.0/0"
  gateway_id             = aws_internet_gateway.this.id
}
resource "aws_route_table_association" "public" {
  for_each       = aws_subnet.public
  subnet_id      = each.value.id
  route_table_id = aws_route_table.public.id
}
resource "aws_route_table" "private" {
  for_each = var.zones
  vpc_id   = aws_vpc.this.id
}
resource "aws_route_table_association" "private" {
  for_each       = aws_subnet.private
  subnet_id      = each.value.id
  route_table_id = aws_route_table.private[each.key].id
}
resource "aws_vpc_endpoint" "s3" {
  vpc_id            = aws_vpc.this.id
  service_name      = "com.amazonaws.${data.aws_region.current.region}.s3"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = [for route_table in aws_route_table.private : route_table.id]
}
data "aws_region" "current" {}
output "vpc_id" { value = aws_vpc.this.id }
output "public_subnets" { value = { for name, subnet in aws_subnet.public : name => subnet.id } }
output "private_subnets" { value = { for name, subnet in aws_subnet.private : name => subnet.id } }
output "private_cidrs" { value = { for name, subnet in aws_subnet.private : name => subnet.cidr_block } }
