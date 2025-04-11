#!/bin/bash

# Set these paths based on your config
CRT_PATH="$HOME/.minikube/profiles/minikube/client.crt"
KEY_PATH="$HOME/.minikube/profiles/minikube/client.key"
CA_PATH="$HOME/.minikube/ca.crt"

# Base64 encode them
CRT_B64=$(base64 -w 0 "$CRT_PATH")
KEY_B64=$(base64 -w 0 "$KEY_PATH")
CA_B64=$(base64 -w 0 "$CA_PATH")

echo "CERT"
echo "$CRT_B64"
echo "KEY"
echo "$KEY_B64"
echo "CA"
echo "$CA_B64"