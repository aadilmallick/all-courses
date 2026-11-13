resource "aws_cloudwatch_metric_alarm" "function_errors" {
  alarm_name          = "${local.name}-function-errors"
  namespace           = "AWS/Lambda"
  metric_name         = "Errors"
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 1
  threshold           = 1
  comparison_operator = "GreaterThanOrEqualToThreshold"
  treat_missing_data  = "notBreaching"
  dimensions          = { FunctionName = module.api.function_name }
  alarm_description   = "Investigate health-handler failures; attach an approved notification action for operations."
}
