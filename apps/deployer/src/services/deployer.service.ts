import { CodeBuildClient, StartBuildCommand } from "@aws-sdk/client-codebuild";
import { DEPLOYER_CONSTANTS } from "../constants/deployer-constants.js";

/**
 * Deployment Service
 *
 * **When the deployment is created FIRST TIME.**
 * 1. User Hits the deployment server ```POST /deployment```.
 * 2. Code Build creates an image using the source.
 * 3. The image of the project is pushed to ECR.
 * 4. Code Build triggers EKS
 * 5. EKS Deploys the image as a POD.
 * 6. A Github Webhook should be setup for that repo.
 */
export class DeployService {
    private deploymentId: string;
    private owner: string;
    private repo: string;
    private ref: string;
    private codeBuildClient: CodeBuildClient;

    constructor(deploymentDetails: { owner: string, repo: string, ref: string, deploymentId: string }) {
        this.deploymentId = deploymentDetails.deploymentId;
        this.owner = deploymentDetails.owner;
        this.repo = deploymentDetails.repo;
        this.ref = deploymentDetails.ref;
        this.codeBuildClient = new CodeBuildClient({
            region: DEPLOYER_CONSTANTS.AWS.REGION,
            endpoint: DEPLOYER_CONSTANTS.CODE_BUILD.ENDPOINT,
            credentials: {
                accessKeyId: DEPLOYER_CONSTANTS.AWS.ACCESS_KEY_ID,
                secretAccessKey: DEPLOYER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
            },
        })
    }

    async triggerCodeBuild(): Promise<void> {
        const imageTag = `${DEPLOYER_CONSTANTS.AWS.ACCOUNT_ID}.dkr.ecr.${DEPLOYER_CONSTANTS.AWS.REGION}.amazonaws.com/${DEPLOYER_CONSTANTS.ECR.REPO_NAME}:${this.deploymentId}`;

        console.log(`Starting CodeBuild for repo ${this.repo}...`);
        const command = new StartBuildCommand({
            projectName: "UserDeploymentsBuild",
            environmentVariablesOverride: [
                { name: "REPO_OWNER", value: this.owner, type: "PLAINTEXT" },
                { name: "REPO_NAME", value: this.repo, type: "PLAINTEXT" },
                { name: "REPO_BRANCH", value: this.ref, type: "PLAINTEXT" },
                { name: "IMAGE_TAG", value: imageTag, type: "PLAINTEXT" },
            ],
        });

        await this.codeBuildClient.send(command);
        console.log("CodeBuild triggered successfully.");
    }

    async deployToEKS(): Promise<void> {
        console.log(`Updating Kubernetes deployment for ${this.deploymentId}...`);

        const deploymentYaml = `
apiVersion: apps/v1
kind: Deployment
metadata:
  name: deployment-${this.deploymentId}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: deployment-${this.deploymentId}
  template:
    metadata:
      labels:
        app: deployment-${this.deploymentId}
    spec:
      containers:
      - name: app
        image: ${DEPLOYER_CONSTANTS.AWS.ACCOUNT_ID}.dkr.ecr.${DEPLOYER_CONSTANTS.AWS.REGION}.amazonaws.com/${DEPLOYER_CONSTANTS.ECR.REPO_NAME}:${this.deploymentId}
        ports:
        - containerPort: 3000
`;

        // Apply Kubernetes YAML using EKS SDK (requires additional setup)
        console.log("Deployment YAML:");
        console.log(deploymentYaml);
    }

    async deploy(): Promise<void> {
        try {
            await this.triggerCodeBuild();
            await this.deployToEKS();
            console.log("Deployment process completed successfully.");
        } catch (error) {
            console.error("Deployment failed:", error);
        }
    }
}
