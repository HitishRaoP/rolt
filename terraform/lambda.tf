
data "archive_file" "lambda" {
  type        = "zip"
  source_file = "${path.module}/../packages/lambdas/src/deployer-trigger/dist/index.js"
  output_path = "${path.module}/../packages/lambdas/src/deployer-trigger/dist/function.zip"
}

resource "aws_lambda_function" "deployer_trigger" {
  filename         = data.archive_file.lambda.output_path
  function_name    = "deployer_trigger"
  role             = aws_iam_role.iam_for_lambda.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda.output_base64sha256
  runtime          = "nodejs22.x"
  environment {
    variables = {
      SECRET_ACCESS_KEY  = var.aws_secret_key
      ACCESS_KEY_ID      = var.aws_access_key
      REGION             = var.aws_region
      ECS_ENDPOINT       = "http://host.docker.internal:4566"
      ECS_CLUSTER_NAME   = aws_ecs_cluster.rolt.name
      ECS_DEPLOYER_IMAGE = var.deployer_image
    }
  }
}

resource "aws_lambda_event_source_mapping" "deployer_mapping" {
  function_name    = aws_lambda_function.deployer_trigger.function_name
  event_source_arn = aws_sqs_queue.deployer_queue.arn
  enabled          = true
}
