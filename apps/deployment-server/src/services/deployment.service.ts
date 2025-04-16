import { GetQueueUrlCommand, SendMessageCommand, SQSClient, SQSServiceException } from "@aws-sdk/client-sqs";
import { DEPLOYMENT_SERVER_CONSTANTS } from "../constants/deployment-server-constants.js";
import { CreateDeployment, CreateDeploymentResponse } from "@rolt/types/Deployment";
import { customAlphabet } from "nanoid";
import { ZodError } from "zod";
import { Octokit as OctokitRest } from "@octokit/rest"
import { getOctokitFromInstallationId } from "../utils/get-octokit-from-InstallationId.js";
import { InstallationModel } from "../models/installation.model.js";

export class DeploymentService {
    private sqsClient: SQSClient;
    private deploymentDetails: CreateDeployment;
    private octokit: OctokitRest;

    constructor(deploymentDetails: CreateDeployment) {
        this.deploymentDetails = deploymentDetails;
        this.sqsClient = new SQSClient({
            region: DEPLOYMENT_SERVER_CONSTANTS.AWS.REGION,
            credentials: {
                accessKeyId: DEPLOYMENT_SERVER_CONSTANTS.AWS.ACCESS_KEY_ID,
                secretAccessKey: DEPLOYMENT_SERVER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
            },
            endpoint: DEPLOYMENT_SERVER_CONSTANTS.SQS.ENDPOINT,
        });
        this.octokit = new OctokitRest();
    }

    private async getInstallationId() {
        try {
            const appDoc = await InstallationModel.findOne({
                owner: this.deploymentDetails.owner,
            });
            if (!appDoc) {
                throw new Error(`No app installation found for owner: ${this.deploymentDetails.owner}`);
            }
            return appDoc.installationId as number;
        } catch (error) {
            throw new Error(`Failed to get installation ID: ${error}`);
        }
    }

    private async commitDetails() {
        const commits = await this.octokit
            .rest
            .repos.
            listCommits(this.deploymentDetails);
        const latestCommit = commits?.data[0];
        return {
            date: latestCommit?.commit.committer?.date as string,
            message: latestCommit?.commit.message as string,
            commitSha: latestCommit?.sha as string
        }
    }

    private async createGithubCheck() {
        const octokit = await getOctokitFromInstallationId(
            await this.getInstallationId());
        /**
         * Create the Github Check
         */
        return await octokit.rest.checks.create({
            owner: this.deploymentDetails.owner,
            repo: this.deploymentDetails.repo,
            name: "Rolt",
            head_sha: (await this.commitDetails()).commitSha,
            status: "queued",
            output: {
                title: "Queued",
                summary: "Deployment has been Queued.",
            },
        });
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
             * Send the message to the Queue URL obtained along with the Deployment ID (Following K8s Guidelines)
            */
            const id = () => {
                const safeId = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 10)();
                return `d${safeId}`;
            };

            const response: CreateDeploymentResponse = {
                ...this.deploymentDetails,
                ref: this.deploymentDetails.ref ?? "main",
                deploymentId: id(),
                ...(await this.commitDetails()),
                checkRunId: (await this.createGithubCheck()).data.id,
                installationId: await this.getInstallationId()
            };
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