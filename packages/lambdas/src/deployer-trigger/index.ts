import { SQSEvent, SQSRecord } from 'aws-lambda';
import * as k8s from "@kubernetes/client-node";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager"

/**
 * Configuration to be provided while updating or deploying the lambda function.
 */
export const LAMBDA_CONSTANTS = {
    AWS: {
        REGION: process.env.AWS_REGION!,
        ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
        SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    SECRET_MANAGER: {
        ENDPOINT: process.env.AWS_ENDPOINT!
    },
    MINIKUBE: {
        SECRET: process.env.MINIKUBE_SECRET,
        DEPLOYER_IMAGE: process.env.MINIKUBE_DEPLOYER_IMAGE,
        ENDPOINT: process.env.MINIKUBE_ENDPOINT,
    },
};

const client = new SecretsManagerClient({
    region: LAMBDA_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: LAMBDA_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: LAMBDA_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: LAMBDA_CONSTANTS.SECRET_MANAGER.ENDPOINT,
});

export const handler = async (event: SQSEvent) => {
    for (const message of event.Records) {
        console.log(event);
        await processMessageAsync(message);
    }
    console.info('done');
};

async function getMinikubeKubeConfig(): Promise<k8s.KubeConfig> {
    const kc = new k8s.KubeConfig();

    const command = new GetSecretValueCommand({ SecretId: LAMBDA_CONSTANTS.MINIKUBE.SECRET });
    const response = await client.send(command);
    const secrets = JSON.parse(response.SecretString!);

    kc.loadFromOptions({
        clusters: [
            {
                name: "minikube",
                server: LAMBDA_CONSTANTS.MINIKUBE.ENDPOINT,
                caData: secrets.ca_data,
                skipTLSVerify: true
            },
        ],
        users: [
            {
                name: "minikube",
                certData: secrets.cert_data,
                keyData: secrets.key_data,
            },
        ],
        contexts: [
            {
                name: "minikube-context",
                user: "minikube",
                cluster: "minikube",
            },
        ],
        currentContext: "minikube-context",
    });
    return kc;
}


async function processMessageAsync(message: SQSRecord) {
    try {
        console.log("Received SQS message:", message);
        const deploymentData = JSON.parse(message.body);


        const kc = await getMinikubeKubeConfig();
        const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
        const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);
        const networkingV1Api = kc.makeApiClient(k8s.NetworkingV1Api);

        const deploymentId = (deploymentData.deploymentId as string).toLowerCase();

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
                                name: deploymentData.repo,
                                image: LAMBDA_CONSTANTS.MINIKUBE.DEPLOYER_IMAGE!,
                                imagePullPolicy: "Never",
                                ports: [
                                    {
                                        containerPort: 3000,
                                    },
                                ],
                                env: [
                                    { name: "OWNER", value: deploymentData.owner },
                                    { name: "REF", value: deploymentData.ref },
                                    { name: "REPO", value: deploymentData.repo },
                                    { name: "URL", value: deploymentData.url },
                                ],
                            },
                        ],
                    },
                },
            },
        };

        const service: k8s.V1Service = {
            apiVersion: "v1",
            kind: "Service",
            metadata: {
                name: `${deploymentId}-service`
            },
            spec: {
                type: "NodePort",
                selector: {
                    app: deploymentId
                },
                ports: [
                    {
                        targetPort: 3000,
                        port: 3000,
                        protocol: "TCP"
                    }
                ]
            }
        }

        const ingress: k8s.V1Ingress = {
            apiVersion: "networking.k8s.io/v1",
            kind: "Ingress",
            metadata: {
                name: `${deploymentId}-ingress`
            },
            spec: {
                rules: [
                    {
                        host: `${deploymentId}.localhost`,
                        http: {
                            paths: [
                                {
                                    path: "/",
                                    pathType: "Prefix",
                                    backend: {
                                        service: {
                                            name: `${deploymentId}-service`,
                                            port: {
                                                number: 3000
                                            }
                                        }
                                    }
                                }
                            ]
                        }
                    }
                ]
            }
        }
        const depRes = await k8sApi.createNamespacedDeployment({ namespace: "default", body: deployment });
        console.log("Deployment Created:", depRes);

        const svcRes = await coreV1Api.createNamespacedService({ namespace: "default", body: service });
        console.log("Service created", svcRes);

        const ingRes = await networkingV1Api.createNamespacedIngress({ namespace: "default", body: ingress });
        console.log("Ingress created", ingRes);
    } catch (error) {
        console.error("Error running Minikube deployment:", error);
    }
}
