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
