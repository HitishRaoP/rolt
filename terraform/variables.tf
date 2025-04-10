variable "aws_region" {
  type = string
  default = "us-east-1"
}

variable "localstack_endpoint" {
  type = string
  default = "http://localhost:4566"
}

variable "aws_secret_key" {
  type = string
  default = "test"
}

variable "aws_access_key" {
  type = string
  default = "test"
}

variable "deployer_image" {
  type = string
  default = "deployer:latest"
}

variable "deployer_container" {
  type = string
  default = "deployer"
}