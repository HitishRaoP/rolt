import { GetQueueUrlCommand, SendMessageCommand, SQSClient, SQSServiceException } from "@aws-sdk/client-sqs";
import { DEPLOYMENT_SERVER_CONSTANTS } from "../constants/deployment-server-constants.js";
import { Deployment, DeploymentExtended, DeploymentRequest } from "@rolt/types/Deployment";
import { customAlphabet } from "nanoid";
import { ZodError } from "zod";
import { Octokit as OctokitRest } from "@octokit/rest"
import { getOctokitFromInstallationId } from "../utils/get-octokit-from-InstallationId.js";
import { deploymentDB } from "../db/client.js";
import { getDomains } from "../utils/get-domains.js"

export class DeploymentService {
    private sqsClient: SQSClient;
    private request: DeploymentRequest
    private octokit: OctokitRest;
    private deploymentId: string;

    constructor(request: DeploymentRequest) {
        this.request = request;
        this.sqsClient = new SQSClient({
            region: DEPLOYMENT_SERVER_CONSTANTS.AWS.REGION,
            credentials: {
                accessKeyId: DEPLOYMENT_SERVER_CONSTANTS.AWS.ACCESS_KEY_ID,
                secretAccessKey: DEPLOYMENT_SERVER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
            },
            endpoint: DEPLOYMENT_SERVER_CONSTANTS.SQS.ENDPOINT,
        });
        this.octokit = new OctokitRest();
        this.deploymentId = this.generateDeploymentId()
    }

    private async getInstallation() {
        try {
            const appDoc = await deploymentDB.installation.findUnique({
                where: {
                    owner: this.request.owner,
                }
            });
            if (!appDoc) {
                throw new Error(`No app installation found for owner: ${this.request.owner}`);
            }
            return appDoc;
        } catch (error) {
            throw new Error(`Failed to get installation: ${error}`);
        }
    }

    private async getProjectId() {
        try {
            const appDoc = await deploymentDB.project.findUnique({
                where: {
                    githubRepository: `${this.request.owner}/${this.request.repo}`,
                },
            });
            if (!appDoc) {
                throw new Error(`No Project found for owner: ${this.request.owner}`);
            }
            return appDoc?.projectId;
        } catch (error) {
            throw new Error(`Failed to get Project  ID: ${error}`);
        }
    }

    private async commitDetails() {
        const commits = await this.octokit
            .rest
            .repos.
            listCommits({ ...this.request });
        const latestCommit = commits?.data[0];
        return {
            commitSha: latestCommit?.sha as string,
            commitMessage: latestCommit?.commit.message as string,
            commitRef: this.request.ref as string,
            commitAuthorName: latestCommit?.author?.login as string
        }
    }

    private generateDeploymentId(): string {
        const safeId = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10)();
        return `depl${safeId}`;
    }

    private async createGithubCheck() {
        const octokit = await getOctokitFromInstallationId(
            (await this.getInstallation()).installationId);
        /**
         * Create the Github Check
         */
        return await octokit.rest.checks.create({
            owner: this.request.owner,
            repo: this.request.repo,
            name: "Rolt",
            head_sha: (await this.commitDetails()).commitSha,
            status: "queued",
            output: {
                title: "Queued",
                summary: "Deployment has been Queued.",
            },
        });
    }

    private async createDeployment(response: Deployment) {
        try {
            await deploymentDB.deployment.create({
                data: {
                    ...response,
                    gitMetadata: {
                        create: {
                            ...response.gitMetadata
                        }
                    },
                    domains: {
                        create: response.domains
                    }
                }
            })
        } catch (error) {
            throw new Error((error as Error).message)
        }
    }

    async deploy() {
        try {
            /**
             * Get the Queue URL from the queue name
            */
            const getQueueURLCommand = new GetQueueUrlCommand({
                QueueName: DEPLOYMENT_SERVER_CONSTANTS.SQS.QUEUE_NAME,
            });
            const { QueueUrl } = await this.sqsClient.send(getQueueURLCommand);

            /**
             * Building the Deployment Object
             */
            const deployment: Deployment = {
                deploymentId: this.deploymentId,
                checkRunId: (await this.createGithubCheck()).data.id,
                status: "Queued",
                gitMetadata: {
                    ...(await this.commitDetails()),
                    commitRef: "main"
                },
                domains: {
                    ...(getDomains({
                        owner: this.request.owner,
                        repo: this.request.repo,
                        deploymentSha: this.deploymentId,
                        commitSha: (await this.commitDetails()).commitSha
                    }))
                },
                environment: "Production",
                isCurrent: true,
                projectId: await this.getProjectId(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const response: DeploymentExtended = {
                ...deployment,
                ...this.request,
                ref: "main",
                installation: await this.getInstallation()
            };
            /**
             * Create the Deployment
            */
            await this.createDeployment(deployment);

            /**
             * Send the message to the Queue URL obtained along with the Deployment ID (Following K8s Guidelines)
            */
            const sendMessageCommand = new SendMessageCommand({
                MessageBody: JSON.stringify(response),
                QueueUrl,
            });
            await this.sqsClient.send(sendMessageCommand);
            return {
                statusCode: 200,
                message: 'Deployment request successfully queued.',
                data: response,
            };

        } catch (error) {
            if (error instanceof ZodError) {
                return {
                    statusCode: 400,
                    message: 'Bad Request: Invalid input',
                    data: error.errors,
                };
            }

            if (error instanceof SQSServiceException) {
                return {
                    statusCode: 500,
                    message: `AWS SQS Error`,
                    data: (error as Error).message
                };
            }

            return {
                statusCode: 500,
                message: `Internal Server Error`,
                data: (error as Error).message
            };
        }
    }
}