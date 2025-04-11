import { SQSEvent, SQSRecord } from 'aws-lambda';
import * as k8s from "@kubernetes/client-node";
/**
 * Configuration to be provided while updating or deploying the lambda function.
 */
export const LAMBDA_CONSTANTS = {
    ECS: {
        DEPLOYER_IMAGE: process.env.ECS_DEPLOYER_IMAGE,
    },
    MINIKUBE: {
        ENDPOINT: "https://host.docker.internal:50662", // replace with your Minikube cluster IP
        CA_DATA: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURCakNDQWU2Z0F3SUJBZ0lCQVRBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwdGFXNXAKYTNWaVpVTkJNQjRYRFRJMU1EUXdPVEU1TURNME5sb1hEVE0xTURRd09ERTVNRE0wTmxvd0ZURVRNQkVHQTFVRQpBeE1LYldsdWFXdDFZbVZEUVRDQ0FTSXdEUVlKS29aSWh2Y05BUUVCQlFBRGdnRVBBRENDQVFvQ2dnRUJBTTNKCjR1YVF4MjFGcXlHL2V5b2NDcHdYaGc3enZkSzJyK1kxOTBidXB1U2ZOTG1GZmo0cFBtZmV3UDRRWUNieHRBMUcKZFdaQ0RyY3YremkzZEMveldMRWkxWUp6MFptRnoxSURncCt5K3NWTWJ0dG9LOG1Kd0pSMWNCeTQ4MFJ5WnFlQQpLQW5aaU1PREFhRkI0VitXU2VCaFI4TG0xbzh4WDdubmtnVU1zMjlqMFZCMDhEVDRKbGxHTWhpTUVLa3lEUzhNCmZSbnlPZ2kvRHl3Ym0xb1J1Um9MNTNsMWlZTzBNbGlTamVDMFNPd2pyVXRVTTJzUm9sL3pwSnN3MlJyQmhWcmEKUCtOZUFSajhjK3JNM1dUSzBZTnZPaDBXYUhiaW5HUXUzMitHQit6TDJEN0JHL1FBdnFoRlFDczRLK3I3WEZHYgpRQXNnd3g0Szk2Z2M3NG9wZ3AwQ0F3RUFBYU5oTUY4d0RnWURWUjBQQVFIL0JBUURBZ0trTUIwR0ExVWRKUVFXCk1CUUdDQ3NHQVFVRkJ3TUNCZ2dyQmdFRkJRY0RBVEFQQmdOVkhSTUJBZjhFQlRBREFRSC9NQjBHQTFVZERnUVcKQkJUZ3pwMERMYXZYRmdaL1dlSzVQY1dlR1pNakxUQU5CZ2txaGtpRzl3MEJBUXNGQUFPQ0FRRUFCWmlaT1FkbgpRZVVmTkZKZlVKaEZjY2xwcHJNSVhoSVpNTDk2KzhkTURjNENic01tOTltd3lHSHZJTlMzc0ZmM1dNR1MyRlVQCkhlaHBmVTBhNER0ZEpSSHlQdDAwNFBUUzVid3JEOHY4Q3pkNGVPMXZGL0pZTGhCL1ppTjhPa1lxVDJJV0VUMnkKbUY3M1l4ZExpcGNjQWVBcjVCZ0ZwKzZCb2hwaHU3TzNjOXcwRVN3MmZwYktuQzgyTDhJN2FNbFFvcXVBd1BXYgprRUx5SzdYSDEveUtwendxSjdQTkhWQVA0RVNhRGdLRnU0dytJV0pXNjhYTnFwZVNDbEtpSFpWcVhDL3N6RzlaCndYSnozZFN2TjdVRUhSM25tMjNZZzVpSGZiNkgyOHY4ZjhVeTJaUmErQXRCNTlxUEJTMldBN1A5L282azRPemoKNWNiVzE0YmJZdDU3S3c9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==",
        CERT_DATA: "LS0tLS1CRUdJTiBDRVJUSUZJQ0FURS0tLS0tCk1JSURJVENDQWdtZ0F3SUJBZ0lCQWpBTkJna3Foa2lHOXcwQkFRc0ZBREFWTVJNd0VRWURWUVFERXdwdGFXNXAKYTNWaVpVTkJNQjRYRFRJMU1EUXdPVEU1TURNME5sb1hEVEk0TURRd09URTVNRE0wTmxvd01URVhNQlVHQTFVRQpDaE1PYzNsemRHVnRPbTFoYzNSbGNuTXhGakFVQmdOVkJBTVREVzFwYm1scmRXSmxMWFZ6WlhJd2dnRWlNQTBHCkNTcUdTSWIzRFFFQkFRVUFBNElCRHdBd2dnRUtBb0lCQVFDdnlnOU92UytvR2ZJZHRIYTk2ZnlvWHErc1cvcnEKeG9pZlZZYzBGNCtGWFNOQ2gwRkk2QTh6R2p6YVBvZjVJVDZ3QVNyK0FEVktvZWprNmtHcDFMOG05SStRKy9vRApTeHE5eUJac1pGTHVxeFgzckZxalN3Y2VIV2wrbjNDa3cyMEJpQmk4STRHejhBeTFIRTU0eEZseG1PYVErYzFyCjlJcE1IVHFKcmM5VVRsbHVjeXB0aHZTWGtWQjFJSkxydDdBdzY0bmcyZHdoREFtbnJtVGR3UVVJOUcxYnJFVWIKdW11MjVDU0wvdSt2Rkg4Z1JBQXRvR0ZERW5oS0tRWEZFaFRsaVNjR0duS05wbFFQc0hhTENUQUQxUzBONFlLaQpPRUpFTS9KZ1Bva0pTdFhmYzR4Z3VORVd1T05jZUVoVmpQRCtmdkNEWFlna0dXNWlmRzJQbHVNekFnTUJBQUdqCllEQmVNQTRHQTFVZER3RUIvd1FFQXdJRm9EQWRCZ05WSFNVRUZqQVVCZ2dyQmdFRkJRY0RBUVlJS3dZQkJRVUgKQXdJd0RBWURWUjBUQVFIL0JBSXdBREFmQmdOVkhTTUVHREFXZ0JUZ3pwMERMYXZYRmdaL1dlSzVQY1dlR1pNagpMVEFOQmdrcWhraUc5dzBCQVFzRkFBT0NBUUVBdTdOeXVvUU8yVDdCNjAra0dyT0FGd3A4TEtVVTFrc28xRHhECmkvSEkySnhwbUJHazZPaElhUGtQdHRrSXNUT3Z1NWUvaThGTmxtdnJ5aUVGN01yTlFObXBpQndGZnpEd2hkTk8KQXhib2VleHRQM3BCY0thMTJIMWh6UllMMlU0ajdUTjQzY0N4dkR5dWFsaFVrRmx4bjlFWFAza3ZiUC9qOG1BQgoyUklFRmE1bnVlalBFbkwzTGNGdTJEOWJPMGNnbDJUa3R6K25uN2k2YS90WGxkQ3pDYmllaWVGM1NSM3RJdW9FCjBpV0ZscnpQckdySlYvSHZ6L2RaWWlVY25DWlBOM0VRNko2dGVNYWJvbVdHMXJqNGw2QW1JZWZtSndhZWl0QU8KTGVMRnFlY2w1RXd0bzNqQmo5MXZkMDZGbnRlWmVEOVZOYVREeFlEY1BKdE5mY1NtR3c9PQotLS0tLUVORCBDRVJUSUZJQ0FURS0tLS0tCg==",
        KEY_DATA: "LS0tLS1CRUdJTiBSU0EgUFJJVkFURSBLRVktLS0tLQpNSUlFcFFJQkFBS0NBUUVBcjhvUFRyMHZxQm55SGJSMnZlbjhxRjZ2ckZ2NjZzYUluMVdITkJlUGhWMGpRb2RCClNPZ1BNeG84Mmo2SCtTRStzQUVxL2dBMVNxSG81T3BCcWRTL0p2U1BrUHY2QTBzYXZjZ1diR1JTN3FzVjk2eGEKbzBzSEhoMXBmcDl3cE1OdEFZZ1l2Q09Ccy9BTXRSeE9lTVJaY1pqbWtQbk5hL1NLVEIwNmlhM1BWRTVaYm5NcQpiWWIwbDVGUWRTQ1M2N2V3TU91SjRObmNJUXdKcDY1azNjRUZDUFJ0VzZ4Rkc3cHJ0dVFraS83dnJ4Ui9JRVFBCkxhQmhReEo0U2lrRnhSSVU1WWtuQmhweWphWlVEN0IyaXdrd0E5VXREZUdDb2poQ1JEUHlZRDZKQ1VyVjMzT00KWUxqUkZyampYSGhJVll6dy9uN3dnMTJJSkJsdVlueHRqNWJqTXdJREFRQUJBb0lCQVFDa3ZQNTFjdFE3ZS8wcgpHMWtBQjB6UTJOTlcrbWYrSndvWUQ4WUI2bWFFdTlEMFl0NnFuVmJKTkRoODZvYncwTmYzaDFDcjhyUCtlaGRRCmw3dnJsVVdDRTBTTHdhZjkrQjlhWlMybWJLcFBvcU9XbEwzb004SzYxU050RjZ3dnJEajJhMzJLcXRlOU1pUW0KZ2gyRURiWW92L3FyT0g3clFhTnRTeUwxclo0VHlUOGZjRW1yQ0NZMWI0MmI1cEV2NWZvclpWQzN1dFpaNGlYdQo4Y2tsNEhRMm5yNHdJcGtGWHhwOG1qcWRZbEt5aGxUVWszTUVrQUdiYWk3Ukk4N3lMZHY3TFExbnlCUmZCRFhFCllFeUh0Y1A5UVJ1N1BRNEh6L3dWem1IYU9lci8zQ1JlUVhwdDZDSkVBNGNEcllTRmtDQTc3eTlvdnRoOWgwdk8Kenlqakt1WUpBb0dCQU54V20vbmtDR1BXdC9uUVBKclZxa2ppVXRyU2pDSkZzNjdHNHBKODZ3a2s5OHJmMVRmZwo3YTA5WmNZNUduMzNnSVE1cTQwZkdaQi9yNm41Z2Q5L2c5dWYySXdCN3JyVWxBSFB1MmZpRXlvRDBpaHVwRlo2ClBHZm13dzdhZzR1b3NiZGE5NlZpaVFLZzh6ZUpGMUM3ejNVaE0rVFRvNXUzemZtZHNWTkYxNE05QW9HQkFNdzkKb01YZi81Vms3N2VzbzNVQ21DbmRwTThIdUR5QzFLeFNHaTRPUDQrREh5RzZUREwwMlJ1TFFvSDBsaU81M2NUTApHK3JCYzZ1TUs1cnBQOFhmaDlxZnlDTU5IakR1TDFNZ2U1SU5Bbjc3bGJDUFdLMXdQNC9sZGZWd1pmMkdMclFUCmRZQlF2SE00bXJKWURSMDM3UVRuS1drcDB6Z3lGeXd6RDAzeW5hY3ZBb0dCQUk3YWNFSHh3Q2JLdlhqdnMzdEgKY0NIVTZwY0l6dVloZnIrZ0hxR083K3Q3MWxQb0R4c3RiNnRVRlRvUko4WG53NkQycXV6Ujd3Y3FZYis0RHFYUwp6TENGMENYbDB0dTZtME1aWlkyU200NHY3Lzlhekoxc251RldVYnk5bTIvZXJXb05SbVlwbmw3Zjd4QmdoNGRHClhOaTU4Q1U1dWVkcG9kZG1qK05IY3RTWkFvR0JBTVFSeWIwTVhDMU1PQUVwSDhaZDFqd2l4bXZscWsyVS81dnEKT2EzTENlTzQ2Zk1VQ01ER1k0Sll2MkZJcjdYZVlmTGhWWXlaYUhUZ1hLQWJtWmhaRGUrb2dwWjdxbWNvMFkvSQoyRGdPZXozeVFmSzh1bEhPTjRicHJzTVB3eW1PWGxtTGNMcmRSdnlKODZDUWZRNTJ1UGlDL2pNeDdzNjg3NWdECjhJWlJDbDRMQW9HQVFUU2J2WWpqZEFta3g1MjU4a1FsMTd1UFdOalFzUmhja0I5cXRoSzBrR3JmdUtuVm5XNmMKYUgweTNZak9URWtNcUt5VTJuU2l4MTR1Z1NUWG8za3ZHSzVWQkkrMmhCZmZ1MEtZRHQ2YlZuYVJzUEI3R2dzMQpDUFNjbkYycFl3QVZJVmxjTUMvTUt5L1BiUXR6ZHNHKytXL2hkV2hpUm9kL0pTR2N3VFdnRy9rPQotLS0tLUVORCBSU0EgUFJJVkFURSBLRVktLS0tLQo="
    },
};

export const handler = async (event: SQSEvent) => {
    for (const message of event.Records) {
        console.log(event);
        await processMessageAsync(message);
    }
    console.info('done');
};
function getMinikubeKubeConfig(): k8s.KubeConfig {
    const kc = new k8s.KubeConfig();
    kc.loadFromOptions({
        clusters: [
            {
                name: "minikube",
                server: LAMBDA_CONSTANTS.MINIKUBE.ENDPOINT,
                caData: LAMBDA_CONSTANTS.MINIKUBE.CA_DATA,
                skipTLSVerify: true
            },
        ],
        users: [
            {
                name: "minikube",
                certData: LAMBDA_CONSTANTS.MINIKUBE.CERT_DATA,
                keyData: LAMBDA_CONSTANTS.MINIKUBE.KEY_DATA,
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

        const kc = getMinikubeKubeConfig();
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
                                image: LAMBDA_CONSTANTS.ECS.DEPLOYER_IMAGE!,
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
