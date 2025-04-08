#!/bin/sh

# Terraform steps
TERRAFORM_DIR="terraform"

echo "Initializing Terraform..."
terraform -chdir="$TERRAFORM_DIR" init

echo "Running Terraform plan..."
terraform -chdir="$TERRAFORM_DIR" plan

echo "Applying Terraform changes..."
terraform -chdir="$TERRAFORM_DIR" apply -auto-approve

# Docker deployer image push
DEPLOYER_DIR="docker/deployer"
PUSH_SCRIPT="push.sh"

echo "Pushing Deployer Docker image to ECR..."
cd "$DEPLOYER_DIR" && sh "$PUSH_SCRIPT"
echo "Docker image pushed successfully."