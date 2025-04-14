#!/bin/sh

HOST_IP=$(ipconfig | grep "IPv4" | grep "192.168" | awk -F': ' '{print $2}')
TFVARS_FILE="terraform/terraform.tfvars"

# Remove existing lines for these variables (if present)
grep -v -E '^(HOST_IP)[[:space:]]*=' "$TFVARS_FILE" > "$TFVARS_FILE.tmp"

# Write updated values back
cat <<EOF >> "$TFVARS_FILE.tmp"
HOST_IP = "$HOST_IP"
EOF

# Replace the original file with the updated one
mv "$TFVARS_FILE.tmp" "$TFVARS_FILE"

echo "Updated the terraform.tfvars file With the IP Address"
