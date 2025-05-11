#!/bin/sh

set -e
export NODE_NO_WARNINGS=1
export TSX_NO_LOG=true

############################
#BANNER
############################
bun scripts/banner.ts

############################
#MINIKUBE
############################
sh k8s/index.sh


############################
#GENERATE THE K8s KEYS FOR TERRAFORM
############################
sh k8s/keys.sh
sh scripts/ip.sh

############################
# PUSH DOCKER IMAGE
############################
DEPLOYER_DIR="docker/deployer"
PUSH_SCRIPT="push.sh"

eval $(minikube docker-env)
echo "Pushing Deployer Docker image to Minikube"
(cd "$DEPLOYER_DIR" && sh "$PUSH_SCRIPT")
echo "Docker image pushed successfully."
eval $(minikube docker-env -u)

############################
# LOCALSTACK CONTAINER
############################
echo "Starting LocalStack container..."
pushd docker/localstack
docker compose up -d
popd
echo "LocalStack started."

############################
# UPDATE LAMBDA FUNCTIONS
############################
echo "Updating all Lambda functions in packages/lambdas"
pushd packages/lambdas
bun run build
popd
echo "All Lambda functions built successfully"

############################
# TERRAFORM
############################
echo "Applying Terraform configuration..."
TERRAFORM_DIR="terraform"
terraform -chdir="$TERRAFORM_DIR" init
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
LOGGING_URL='http://localhost:8085/logs/k8s'

npx concurrently \
  "smee -u \"$SMEE_URL\" -t \"$WEBHOOK_URL\"" \
  "smee -u \"$LOGGING_SMEE\" -t \"$LOGGING_URL\"" \
  "kubectl port-forward deployment/traefik 8000:8000 -n traefik-v2" \
  "bun run dev"