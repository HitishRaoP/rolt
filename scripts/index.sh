#!/bin/sh

set -e
export NODE_NO_WARNINGS=1
############################
#LAMBDA FUNCTION
############################
base64 -w 0 ~/.kube/config > packages/lambdas/src/deployer-trigger/kubeconfig.b64


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

eval $(minikube docker-env)
echo "Pushing Deployer Docker image to ECR..."
(cd "$DEPLOYER_DIR" && sh "$PUSH_SCRIPT")
echo "Docker image pushed successfully."
eval $(minikube docker-env -u)



############################
# TERRAFORM - Phase 2
############################
echo "Applying full Terraform configuration..."
terraform -chdir="$TERRAFORM_DIR" apply -auto-approve

echo "Deployment complete."


############################
# TUNNELING ENDPOINTS
############################

#GITHUB WEBHOOKS
WEBHOOK_URL="http://localhost:8081/webhooks"
SMEE_URL="https://smee.io/R4afGEA1VtckDWo"

#LOG SERVER
LOGGING_SMEE='https://smee.io/R7CnnfFPlA0XiBv'
LOGGING_URL='http://localhost:8085/logs'

npx concurrently \
  "smee -u \"$SMEE_URL\" -t \"$WEBHOOK_URL\"" \
  "smee -u \"$LOGGING_SMEE\" -t \"$LOGGING_URL\""



############################
#Forward the Traefik Port
#TEMPORARY FIX
############################
#kubectl port-forward pod/traefik-5f9fd446dc-qnzdq  8000:8000