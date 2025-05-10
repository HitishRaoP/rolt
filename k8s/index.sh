#!/bin/sh

set -e

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


# #################
# # ELASTIC SEARCH
# # https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-eck.html
# #################
# kubectl create -f https://download.elastic.co/downloads/eck/2.16.1/crds.yaml
# kubectl apply -f https://download.elastic.co/downloads/eck/2.16.1/operator.yaml
# kubectl apply -f k8s/elasticsearch-values.yaml

# #################
# #KIBANA
# #################
# kubectl apply -f k8s/kibana-values.yaml

#################
#FLUENT BIT
#################
# helm repo add fluent https://fluent.github.io/helm-charts
# helm upgrade --install fluent-bit fluent/fluent-bit -f k8s/fluentbit-values.yaml

# kubectl get secret elasticsearch-es-elastic-user -o=jsonpath='{.data.elastic}' | base64 --decode; echo
#PORT FORWARDING
bun tsx k8s/wait.ts