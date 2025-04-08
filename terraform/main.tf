provider "aws" {
  region                      = var.aws_region
  secret_key                  = var.aws_secret_key
  access_key                  = var.aws_access_key
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true

  endpoints {
    ecr      = var.localstack_endpoint
    ecs      = var.localstack_endpoint
    sqs      = var.localstack_endpoint
    ec2      = var.localstack_endpoint
    dynamodb = var.localstack_endpoint
    iam      = var.localstack_endpoint
    lambda   = var.localstack_endpoint
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
  container_definitions = jsonencode([
    {
      name      = var.deployer_container
      image     = var.deployer_image
      essential = true
      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]
    }
  ])
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
      SECRET_ACCESS_KEY      = var.aws_secret_key
      ACCESS_KEY_ID          = var.aws_access_key
      REGION                 = var.aws_region
      ECS_ENDPOINT           = "http://host.docker.internal:4566"
      ECS_CLUSTER_NAME       = aws_ecs_cluster.rolt.name
      ECS_DEPLOYER_CONTAINER = var.deployer_container
      ECS_DEPLOYER_TASK_ARN  = aws_ecs_task_definition.deployer_task.arn
      ECS_DEPLOYER_SUBNETS   = aws_subnet.rolt_public_subnet.id
    }
  }
}

resource "aws_lambda_event_source_mapping" "deployer_mapping" {
  function_name    = aws_lambda_function.deployer_trigger.function_name
  event_source_arn = aws_sqs_queue.deployer_queue.arn
  enabled          = true
}
