variable "name" { type = string }
variable "package_path" { type = string }
variable "release" {
  type    = string
  default = "lesson-05"
}
variable "context" {
  type    = map(string)
  default = {}
}
resource "aws_cloudwatch_log_group" "function" {
  name              = "/aws/lambda/${var.name}"
  retention_in_days = 7
}
data "aws_iam_policy_document" "trust" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}
resource "aws_iam_role" "function" {
  name_prefix        = "${var.name}-"
  assume_role_policy = data.aws_iam_policy_document.trust.json
}
data "aws_iam_policy_document" "logs" {
  statement {
    actions   = ["logs:CreateLogStream", "logs:PutLogEvents"]
    resources = ["${aws_cloudwatch_log_group.function.arn}:*"]
  }
}
resource "aws_iam_role_policy" "logs" {
  role   = aws_iam_role.function.id
  policy = data.aws_iam_policy_document.logs.json
}
resource "aws_lambda_function" "this" {
  function_name    = var.name
  role             = aws_iam_role.function.arn
  runtime          = "python3.13"
  handler          = "handler.main"
  filename         = var.package_path
  source_code_hash = filebase64sha256(var.package_path)
  timeout          = 5
  memory_size      = 128
  environment {
    variables = merge(var.context, { RELEASE = var.release })
  }
  depends_on = [aws_iam_role_policy.logs]
}
resource "aws_apigatewayv2_api" "this" {
  name          = var.name
  protocol_type = "HTTP"
}
resource "aws_apigatewayv2_integration" "this" {
  api_id                 = aws_apigatewayv2_api.this.id
  integration_type       = "AWS_PROXY"
  integration_method     = "POST"
  integration_uri        = aws_lambda_function.this.invoke_arn
  payload_format_version = "2.0"
}
resource "aws_apigatewayv2_route" "health" {
  api_id             = aws_apigatewayv2_api.this.id
  route_key          = "GET /health"
  target             = "integrations/${aws_apigatewayv2_integration.this.id}"
  authorization_type = "NONE"
}
resource "aws_apigatewayv2_stage" "this" {
  api_id      = aws_apigatewayv2_api.this.id
  name        = "$default"
  auto_deploy = true
  default_route_settings {
    throttling_burst_limit = 10
    throttling_rate_limit  = 5
  }
}
resource "aws_lambda_permission" "gateway" {
  statement_id  = "HealthRoute"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.this.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.this.execution_arn}/*/GET/health"
}
output "url" { value = "${aws_apigatewayv2_api.this.api_endpoint}/health" }
output "function_name" { value = aws_lambda_function.this.function_name }
