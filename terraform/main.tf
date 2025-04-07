provider "aws" {
  region                      = var.aws_region
  secret_key                  = var.aws_secret_key
  access_key                  = var.aws_access_key
  skip_credentials_validation = true
  skip_requesting_account_id  = true

  endpoints {
    ecr = var.localstack_endpoint
    ecs = var.localstack_endpoint
    sqs = var.localstack_endpoint
    ec2 = var.localstack_endpoint
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
  name = "build_logs"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "deploymentId"
  attribute {
    name = "deploymentId"
    type = "S"
  }
}

resource "aws_dynamodb_table" "production_logs" {
  name = "production_logs"
  billing_mode = "PAY_PER_REQUEST"
  hash_key = "deploymentId"
  attribute {
    name = "deploymentId"
    type = "S"
  }
}

resource "aws_vpc" "rolt_vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    name = "rolt-vpc"
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
