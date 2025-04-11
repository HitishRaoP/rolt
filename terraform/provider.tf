provider "aws" {
  region                      = var.aws_region
  secret_key                  = var.aws_secret_key
  access_key                  = var.aws_access_key
  skip_credentials_validation = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true

  endpoints {
    apigateway             = var.localstack_endpoint
    apigatewayv2           = var.localstack_endpoint
    cloudformation         = var.localstack_endpoint
    cloudwatch             = var.localstack_endpoint
    dynamodb               = var.localstack_endpoint
    ec2                    = var.localstack_endpoint
    ecr                    = var.localstack_endpoint
    ecs                    = var.localstack_endpoint
    es                     = var.localstack_endpoint
    elasticache            = var.localstack_endpoint
    firehose               = var.localstack_endpoint
    iam                    = var.localstack_endpoint
    kinesis                = var.localstack_endpoint
    lambda                 = var.localstack_endpoint
    rds                    = var.localstack_endpoint
    redshift               = var.localstack_endpoint
    route53                = var.localstack_endpoint
    s3                     = "http://s3.localhost.localstack.cloud:4566"
    secretsmanager         = var.localstack_endpoint
    ses                    = var.localstack_endpoint
    elasticloadbalancing   = var.localstack_endpoint
    elasticloadbalancingv2 = var.localstack_endpoint
    sns                    = var.localstack_endpoint
    sqs                    = var.localstack_endpoint
    ssm                    = var.localstack_endpoint
    stepfunctions          = var.localstack_endpoint
    sts                    = var.localstack_endpoint
    eks                    = var.localstack_endpoint
  }
}
