import * as k8s from "@kubernetes/client-node";
import { CreateDeploymentResponse } from '@rolt/types/Deployment'
import { LAMBDA_CONSTANTS } from "./constants";

export const deployment = (deploymentResponse: CreateDeploymentResponse) => {
    const { deploymentId, owner, repo, ref, installationId, commitSha, checkRunId } = deploymentResponse;

    const deployment: k8s.V1Deployment = {
        apiVersion: "apps/v1",
        kind: "Deployment",
        metadata: {
            name: deploymentId,
            labels: {
                app: deploymentId,
            },
        },
        spec: {
            replicas: 1,
            selector: {
                matchLabels: {
                    app: deploymentId,
                },
            },
            template: {
                metadata: {
                    name: deploymentId,
                    labels: {
                        app: deploymentId,
                    },
                },
                spec: {
                    containers: [
                        {
                            name: repo,
                            image: LAMBDA_CONSTANTS.MINIKUBE.DEPLOYER_IMAGE!,
                            imagePullPolicy: "Never",
                            ports: [
                                {
                                    containerPort: 3000,
                                },
                            ],
                            env: [
                                { name: "OWNER", value: owner },
                                { name: "REF", value: ref },
                                { name: "REPO", value: repo },
                                { name: "INSTALLATION_ID", value: installationId.toString() },
                                { name: "COMMIT_SHA", value: commitSha },
                                { name: "CHECK_RUN_ID", value: checkRunId.toString() },
                                { name: "DEPLOYMENT_ID", value: deploymentId },
                                { name: "HOST_IP", value: LAMBDA_CONSTANTS.DEV.HOST_IP }
                            ],
                            resources: {
                                limits: {
                                    memory: "1024Mi",
                                    cpu: "500m"
                                }
                            },
                        },
                    ],
                },
            },
        },
    };

    return deployment;
}