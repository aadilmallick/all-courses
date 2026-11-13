run "default_manifest" {
  command = apply
  assert {
    condition     = output.manifest["api"].replicas == 2
    error_message = "The API defaults to two replicas."
  }
}
run "disabled_worker" {
  command = apply
  variables {
    services = {
      api    = { replicas = 3 }
      worker = { replicas = 1, enabled = false }
    }
  }
  assert {
    condition     = keys(output.manifest) == ["api"]
    error_message = "Disabled services must be excluded."
  }
}
run "invalid_environment" {
  command = plan
  variables { environment = "production-ish" }
  expect_failures = [var.environment]
}
