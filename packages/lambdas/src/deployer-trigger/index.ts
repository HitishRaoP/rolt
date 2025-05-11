import { SQSEvent, SQSRecord } from 'aws-lambda';
import * as k8s from "@kubernetes/client-node";
import { GetSecretValueCommand, SecretsManagerClient } from "@aws-sdk/client-secrets-manager"
import { LAMBDA_CONSTANTS } from './constants';
import { deployment } from './deployment';
import { ingress } from './ingress';
import { service } from './service';
import { DeploymentExtended } from '@rolt/types/Deployment';

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
        const deploymentData = JSON.parse(message.body) as DeploymentExtended;

        /**
         * K8s Configs
         */
        const kc = await getMinikubeKubeConfig();
        const k8sApi = kc.makeApiClient(k8s.AppsV1Api);
        const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);
        const networkingV1Api = kc.makeApiClient(k8s.NetworkingV1Api);

        /**
         * Creating the Deployment, Service and Ingress
         */
        const depRes = await k8sApi.createNamespacedDeployment(
            {
                namespace: "default",
                body: deployment(deploymentData)
            });
        console.log("Deployment Created:", depRes);

        const svcRes = await coreV1Api.createNamespacedService({
            namespace: "default",
            body: service(deploymentData)
        });
        console.log("Service created", svcRes);

        const ingRes = await networkingV1Api.createNamespacedIngress({
            namespace: "default",
            body: ingress(deploymentData)
        });
        console.log("Ingress created", ingRes);
    } catch (error) {
        console.error("Error running Minikube deployment:", error);
    }
}
