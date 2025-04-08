#!/bin/sh

LOCAL_TAG="deployer:latest"
ECR_REPO="000000000000.dkr.ecr.us-east-1.localhost.localstack.cloud:4566/rolt"

echo "Building Docker image..."
docker build -t "$LOCAL_TAG" .

echo "Tagging image with ECR repo..."
docker tag "$LOCAL_TAG" "$ECR_REPO"

echo "Pushing image to LocalStack ECR..."
docker push "$ECR_REPO"

echo "Done!"
