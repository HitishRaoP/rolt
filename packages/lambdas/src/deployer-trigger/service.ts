import * as k8s from "@kubernetes/client-node";
import { DeploymentExtended } from "@rolt/types/Deployment";

export const service = (deploymentResponse: DeploymentExtended) => {
    const { deploymentId } = deploymentResponse;

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

    return service
}