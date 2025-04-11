#!/bin/bash

# Set these paths based on your config
CRT_PATH="$HOME/.minikube/profiles/minikube/client.crt"
KEY_PATH="$HOME/.minikube/profiles/minikube/client.key"
CA_PATH="$HOME/.minikube/ca.crt"
TFVARS_FILE="terraform/terraform.tfvars"

# Base64 encode them
CRT_B64=$(base64 -w 0 "$CRT_PATH")
KEY_B64=$(base64 -w 0 "$KEY_PATH")
CA_B64=$(base64 -w 0 "$CA_PATH")

# Remove existing lines for these variables (if present)
grep -v -E '^(MINIKUBE_CA_DATA|MINIKUBE_CERT_DATA|MINIKUBE_KEY_DATA)[[:space:]]*=' "$TFVARS_FILE" > "$TFVARS_FILE.tmp"

# Write updated values back
cat <<EOF >> "$TFVARS_FILE.tmp"
MINIKUBE_CA_DATA = "$CA_B64"
MINIKUBE_CERT_DATA = "$CRT_B64"
MINIKUBE_KEY_DATA = "$KEY_B64"
EOF

# Replace the original file with the updated one
mv "$TFVARS_FILE.tmp" "$TFVARS_FILE"

echo "Updated MINIKUBE  variables in terraform.tfvars successfully"
