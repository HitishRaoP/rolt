import { CreateDeploymentResponse } from "@rolt/types/Deployment";
import * as k8s from "@kubernetes/client-node";

export const ingress = (deploymentResponse: CreateDeploymentResponse) => {
    const { deploymentId, repo, commitSha } = deploymentResponse;

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
                },
                {
                    host: `${commitSha}.localhost`,
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
                    host: `${repo}.localhost`,
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
    return ingress
}