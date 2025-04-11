
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
      MINIKUBE_SECRET         = aws_secretsmanager_secret.minikube_certs.name
      MINIKUBE_DEPLOYER_IMAGE = var.MINIKUBE_DEPLOYER_IMAGE
      MINIKUBE_ENDPOINT       = var.MINIKUBE_ENDPOINT
      AWS_ENDPOINT            = var.aws_endpoint
      AWS_ACCESS_KEY_ID       = var.aws_access_key
      AWS_SECRET_ACCESS_KEY   = var.aws_secret_key
      AWS_REGION              = var.aws_region
    }
  }
}

resource "aws_lambda_event_source_mapping" "deployer_mapping" {
  function_name    = aws_lambda_function.deployer_trigger.function_name
  event_source_arn = aws_sqs_queue.deployer_queue.arn
  enabled          = true
}
