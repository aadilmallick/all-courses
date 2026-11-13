# Module contract: network

Creates one IPv4 /16 VPC, at least two logically keyed zones, public/private /24 subnets per key, explicit route tables/associations, an internet gateway, and an S3 gateway endpoint on private tables. Inputs: name, optional /16 cidr defaulting to 10.42.0.0/16, zones map with name and unique integer slot 0–127. Outputs: vpc_id, public_subnets, private_subnets, private_cidrs.

Complete usage: labs/02-network. No NAT, compute, public IPv4 allocations, general private-subnet egress, custom ACL, workload security group, or complete endpoint data perimeter is supplied. Confirm selected zones and region. Baseline: Terraform 1.17.2, AWS provider 6.0.0. Mock tests check selected address/count/input contracts; they do not test actual reachability. Initialize with backend disabled and run terraform test. See Chapter 4.
