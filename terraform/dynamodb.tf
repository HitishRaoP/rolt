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
