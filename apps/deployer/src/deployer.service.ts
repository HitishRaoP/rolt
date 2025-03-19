import { CreateDeploymentResponse } from "@rolt/types/Deployment"

export class DeployerService {
    private deploymentDetails: CreateDeploymentResponse;

    constructor(deploymentDetails: CreateDeploymentResponse) {
        this.deploymentDetails = deploymentDetails;
    }

    //Download the Repo from S3
    //Install
    //Start the server
}