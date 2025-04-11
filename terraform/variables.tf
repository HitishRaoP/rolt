variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "localstack_endpoint" {
  type    = string
  default = "http://localhost:4566"
}

variable "aws_endpoint" {
  type = string
  default = "http://host.docker.internal:4566"
}

variable "aws_secret_key" {
  type    = string
  default = "test"
}

variable "aws_access_key" {
  type    = string
  default = "test"
}


variable "deployer_container" {
  type    = string
  default = "deployer"
}

variable "MINIKUBE_DEPLOYER_IMAGE" {
  type    = string
  default = "deployer:latest"
}

variable "MINIKUBE_ENDPOINT" {
  type = string
  default = "https://host.docker.internal:52335"
}

variable "MINIKUBE_CA_DATA" {
  type = string
}

variable "MINIKUBE_CERT_DATA" {
  type = string
}

variable "MINIKUBE_KEY_DATA" {
  type = string
}
