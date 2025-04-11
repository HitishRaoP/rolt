#!/bin/sh

LOCAL_TAG="deployer:latest"
ECR_REPO="000000000000.dkr.ecr.us-east-1.localhost.localstack.cloud:4566/rolt"

echo "Building Docker image..."
docker build -t "$LOCAL_TAG" .

echo "Done!"
