import { CreateDeploymentResponse } from "@rolt/types/Deployment";
import * as k8s from "@kubernetes/client-node";
import { LAMBDA_CONSTANTS } from "./constants";

const HOST = LAMBDA_CONSTANTS.DEV.HOST

export const ingress = (deploymentResponse: CreateDeploymentResponse) => {
    const { deploymentId, repo, commitSha, owner } = deploymentResponse;
    const ingress: k8s.V1Ingress = {
        apiVersion: "networking.k8s.io/v1",
        kind: "Ingress",
        metadata: {
            name: `${deploymentId}-ingress`
        },
        spec: {
            rules: [
                {
                    host: `${owner.toLowerCase()}-${repo.toLowerCase()}.${HOST}`,
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
                },
                {
                    host: `${deploymentId}.${HOST}`,
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
                },
                {
                    host: `${commitSha}.${HOST}`,
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
                },
            ]
        }
    }
    return ingress
}