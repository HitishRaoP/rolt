#!/bin/sh

set -e



############################
# TERRAFORM - Phase 1
############################
TERRAFORM_DIR="terraform"

echo "Initializing Terraform..."
terraform -chdir="$TERRAFORM_DIR" init

echo "Creating ECR repository (targeted apply)..."
terraform -chdir="$TERRAFORM_DIR" apply -target="aws_ecr_repository.rolt" -auto-approve



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
echo "Applying full Terraform configuration..."
terraform -chdir="$TERRAFORM_DIR" apply -auto-approve

echo "Deployment complete."


############################
# EXPOST 8081/api/github/webhooks
############################
WEBHOOK_URL="http://localhost:8081/webhooks"
SMEE_URL="https://smee.io/R4afGEA1VtckDWo"

echo "Exposing $WEBHOOK_URL via $SMEE_URL"
yarn smee -u "$SMEE_URL" -t "$WEBHOOK_URL"
echo "Listening for GitHub Webhooks"