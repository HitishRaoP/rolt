#!/bin/sh

set -e

#################
# DELETE EXISTING MINIKUBE
#################
minikube delete


#################
#MINIKUBE
#################
minikube start --driver=docker --ports 52335:8443


#################
# TRAEFIK
# https://doc.traefik.io/traefik/getting-started/install-traefik/#use-the-helm-chart
#################
helm repo add traefik https://traefik.github.io/charts
helm repo update
kubectl create ns traefik-v2
helm install traefik traefik/traefik \
  --namespace=traefik-v2 \
  --create-namespace \
  --set dashboard.enabled=true \
  --set ingressRoute.dashboard.enabled=true \
  --set service.enabled=true