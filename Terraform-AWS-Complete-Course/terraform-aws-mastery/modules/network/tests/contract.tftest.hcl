mock_provider "aws" {
  mock_data "aws_region" { defaults = { region = "us-east-1" } }
}
variables {
  name = "tf-mastery-test"
  zones = {
    first  = { name = "us-east-1a", slot = 0 }
    second = { name = "us-east-1b", slot = 1 }
  }
}
run "network_contract" {
  command = plan
  assert {
    condition     = aws_subnet.private["first"].cidr_block == "10.42.128.0/24"
    error_message = "Private slot zero must be 10.42.128.0/24."
  }
  assert {
    condition     = length(aws_subnet.public) == 2 && length(aws_route_table.private) == 2
    error_message = "The network must have two public and private subnet groups."
  }
}
run "reject_duplicate_slots" {
  command = plan
  variables {
    zones = {
      first  = { name = "us-east-1a", slot = 0 }
      second = { name = "us-east-1b", slot = 0 }
    }
  }
  expect_failures = [var.zones]
}
