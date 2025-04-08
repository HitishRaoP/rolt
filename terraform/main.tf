provider "aws" {
  region                      = var.aws_region
  secret_key                  = var.aws_secret_key
  access_key                  = var.aws_access_key
  skip_credentials_validation = true
  skip_requesting_account_id  = true

  endpoints {
    ecr      = var.localstack_endpoint
    ecs      = var.localstack_endpoint
    sqs      = var.localstack_endpoint
    ec2      = var.localstack_endpoint
    dynamodb = var.localstack_endpoint
  }
}

resource "aws_ecs_cluster" "rolt" {
  name = "rolt"
}

resource "aws_ecr_repository" "rolt" {
  name = "rolt"
}

resource "aws_dynamodb_table" "build_logs" {
  name         = "build_logs"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "deploymentId"
  attribute {
    name = "deploymentId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "production_logs" {
  name         = "production_logs"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "deploymentId"
  attribute {
    name = "deploymentId"
    type = "S"
  }
}

resource "aws_vpc" "rolt_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    name     = "rolt-vpc"
    resource = "vpc"
  }
}

resource "aws_subnet" "rolt_public_subnet" {
  vpc_id     = aws_vpc.rolt_vpc.id
  cidr_block = "10.0.1.0/24"
  tags = {
    resource = "subnet"
    name     = "rolt_public_subnet"
  }
}

resource "aws_sqs_queue" "deployer_queue" {
  name = "deployer_queue"
}

resource "aws_ecs_task_definition" "deployer_task" {
  family                   = "deployer_task"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  container_definitions = [
    {
      name      = "deployer"
      image     = var.deployer_image
      essential = true
    }
  ]
}

data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "iam_for_lambda" {
  name               = "iam_for_lambda"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

data "archive_file" "lambda" {
  type        = "zip"
  source_file = "index.js"
  output_path = "function.zip"
}

resource "aws_lambda_function" "deployer_trigger" {
  filename         = "${path.module}/../packages/lambdas/src/functions/uploader-trigger/dist/function.zip"
  function_name    = "deployer_trigger"
  role             = aws_iam_role.iam_for_lambda.arn
  handler          = "index.handler"
  source_code_hash = data.archive_file.lambda.output_base64sha256
  runtime          = "nodejs18.x"
  environment {
    variables = {
      CLUSTER_NAME       = aws_ecs_cluster.rolt.name
      ENDPOINT           = var.localstack_endpoint
      UPLOADER_CONTAINER = aws_ecs_task_definition.deployer_task.container_definitions[0].name
      UPLOADER_TASK_ARN  = aw
    }
  }
}

resource "aws_lambda_event_source_mapping" "deployer_mapping" {
  function_name    = aws_lambda_function.deployer_trigger.function_name
  event_source_arn = aws_sqs_queue.deployer_queue.arn
  enabled          = true
}
