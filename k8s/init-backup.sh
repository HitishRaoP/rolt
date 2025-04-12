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
# Install in the namespace "traefik-v2"
kubectl create ns traefik-v2
helm install traefik traefik/traefik \
  --namespace=traefik-v2 \
  --create-namespace \
  --set dashboard.enabled=true \
  --set ingressRoute.dashboard.enabled=true \
  --set service.enabled=false

#################
# ELASTIC SEARCH
# https://www.elastic.co/guide/en/cloud-on-k8s/current/k8s-deploy-eck.html
#################
kubectl create -f https://download.elastic.co/downloads/eck/2.16.1/crds.yaml
kubectl apply -f https://download.elastic.co/downloads/eck/2.16.1/operator.yaml

cat <<EOF | kubectl apply -f -
apiVersion: elasticsearch.k8s.elastic.co/v1
kind: Elasticsearch
metadata:
  name: elasticsearch
spec:
  version: 8.17.4
  nodeSets:
  - name: default
    count: 1
    podTemplate:
      spec:
        containers:
        - name: elasticsearch
          readinessProbe:
            exec:
              command:
              - bash
              - -c
              - /mnt/elastic-internal/scripts/readiness-probe-script.sh
            failureThreshold: 3
            initialDelaySeconds: 200
            periodSeconds: 10
            successThreshold: 3
            timeoutSeconds: 12
          env:
          - name: READINESS_PROBE_TIMEOUT
            value: "10"
          resources:
            requests:
              memory: 2Gi
              cpu: "100m"
            limits:
              memory: 2Gi
              cpu: "1000m"
EOF
#WAIT TILL THE POD STARTS
kubectl port-forward service/elasticsearch-es-http 9200
PASSWORD=$(kubectl get secret elasticsearch-es-elastic-user -o go-template='{{.data.elastic | base64decode}}')
curl -u "elastic:$PASSWORD" -k "https://localhost:9200"

#################
#KIBANA
#################
cat <<EOF | kubectl apply -f -
apiVersion: kibana.k8s.elastic.co/v1
kind: Kibana
metadata:
  name: kibana
spec:
  version: 8.17.4
  count: 1
  elasticsearchRef:
    name: elasticsearch
  podTemplate:
    spec:
      containers:
      - name: kibana
        readinessProbe:
          tcpSocket:
            port: 5601
          initialDelaySeconds: 200
          periodSeconds: 10
          successThreshold: 3
          timeoutSeconds: 5
        env:
        - name: NODE_OPTIONS
          value: "--max-old-space-size=2048"
        resources:
          requests:
            memory: 2Gi
            cpu: "100m"
          limits:
            memory: 2Gi
            cpu: "1000m"
EOF
#WAIT TILL THE POD STARTS
kubectl port-forward service/elasticsearch-kb-http 5601
#PASSWORD
kubectl get secret quickstart-es-elastic-user -o=jsonpath='{.data.elastic}' | base64 --decode; echo

#################
#FLUENT BIT
#################
