#!/bin/sh

############################
# TERRAFORM - Phase 1
############################
TERRAFORM_DIR="terraform"

echo "Initializing Terraform..."
terraform -chdir="$TERRAFORM_DIR" init

echo "Creating ECR repository (targeted apply)..."
terraform -chdir="$TERRAFORM_DIR" apply -target=aws_ecr_repository.rolt -auto-approve

############################
# PUSH DOCKER IMAGE
############################
DEPLOYER_DIR="docker/deployer"
PUSH_SCRIPT="push.sh"

echo "Pushing Deployer Docker image to ECR..."
(cd "$DEPLOYER_DIR" && sh "$PUSH_SCRIPT")
echo "Docker image pushed successfully."

############################
# TERRAFORM - Phase 2
############################

echo "Running full Terraform plan..."
terraform -chdir="$TERRAFORM_DIR" plan

echo "Applying full Terraform configuration..."
terraform -chdir="$TERRAFORM_DIR" apply -auto-approve

echo "Deployment complete."
