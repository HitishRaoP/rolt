import { GetQueueUrlCommand, SendMessageCommand, SQSClient, SQSServiceException } from "@aws-sdk/client-sqs";
import { DEPLOYMENT_SERVER_CONSTANTS } from "../constants/deployment-server-constants.js";
import { CreateDeployment, CreateDeploymentResponse } from "@rolt/types/Deployment";
import { customAlphabet, nanoid } from "nanoid";
import { ZodError } from "zod";

export class DeploymentService {
    private sqsClient: SQSClient;
    private deploymentDetails: CreateDeployment;

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
                deploymentId: id(),
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
                    message: `AWS SQS Error: ${(error as Error).message}`,
                };
            }

            return {
                statusCode: 500,
                message: `Internal Server Error: ${(error as Error).message}`,
            };
        }
    }
}