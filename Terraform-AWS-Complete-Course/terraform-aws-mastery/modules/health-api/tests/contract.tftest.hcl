mock_provider "aws" {
  mock_data "aws_iam_policy_document" {
    defaults = { json = "{\"Version\":\"2012-10-17\",\"Statement\":[]}" }
  }
}
variables {
  name         = "tf-mastery-test"
  package_path = "../../assets/health.zip"
}
run "health_contract" {
  command = plan
  assert {
    condition     = aws_lambda_function.this.timeout == 5 && aws_lambda_function.this.memory_size == 128
    error_message = "The health function must retain its bounded resource configuration."
  }
  assert {
    condition     = aws_apigatewayv2_route.health.route_key == "GET /health" && aws_apigatewayv2_route.health.authorization_type == "NONE"
    error_message = "Only the explicitly public health route belongs in this module."
  }
}
