variable "engine_version" { type = string }
variable "instance_class" { type = string }
variable "final_snapshot_identifier" { type = string }
variable "multi_az" {
  type    = bool
  default = false
}
variable "zones" {
  type = map(object({ name = string, slot = number }))
  default = {
    first  = { name = "us-east-1a", slot = 0 }
    second = { name = "us-east-1b", slot = 1 }
  }
}
module "network" {
  source = "../../modules/network"
  name   = "tf-mastery-db"
  zones  = var.zones
}
resource "aws_db_subnet_group" "this" {
  name_prefix = "tf-mastery-db-"
  subnet_ids  = values(module.network.private_subnets)
}
resource "aws_security_group" "client" {
  name_prefix = "tf-mastery-client-"
  description = "Attach only to an authorized database client"
  vpc_id      = module.network.vpc_id
}
resource "aws_vpc_security_group_egress_rule" "client_db" {
  security_group_id            = aws_security_group.client.id
  referenced_security_group_id = aws_security_group.database.id
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
}
resource "aws_security_group" "database" {
  name_prefix = "tf-mastery-db-"
  description = "PostgreSQL access from the controlled client group"
  vpc_id      = module.network.vpc_id
}
resource "aws_vpc_security_group_ingress_rule" "client_db" {
  security_group_id            = aws_security_group.database.id
  referenced_security_group_id = aws_security_group.client.id
  ip_protocol                  = "tcp"
  from_port                    = 5432
  to_port                      = 5432
}
resource "aws_db_instance" "this" {
  identifier                  = "tf-mastery-postgres"
  engine                      = "postgres"
  engine_version              = var.engine_version
  instance_class              = var.instance_class
  allocated_storage           = 20
  max_allocated_storage       = 100
  storage_type                = "gp3"
  storage_encrypted           = true
  username                    = "fieldnotes_admin"
  manage_master_user_password = true
  db_subnet_group_name        = aws_db_subnet_group.this.name
  vpc_security_group_ids      = [aws_security_group.database.id]
  publicly_accessible         = false
  multi_az                    = var.multi_az
  backup_retention_period     = 7
  deletion_protection         = true
  skip_final_snapshot         = false
  final_snapshot_identifier   = var.final_snapshot_identifier
  apply_immediately           = false
  auto_minor_version_upgrade  = false
}
output "endpoint" { value = aws_db_instance.this.address }
output "client_security_group_id" { value = aws_security_group.client.id }
output "managed_secret_arn" { value = aws_db_instance.this.master_user_secret[0].secret_arn }
