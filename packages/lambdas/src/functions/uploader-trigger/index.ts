import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import { SQSEvent, SQSRecord } from 'aws-lambda';
import { config } from 'dotenv';
import path from 'path';

config({
    path: path.resolve(__dirname, './.env'),
});

export const LAMBDA_CONSTANTS = {
    AWS: {
        SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY!,
        ACCESS_KEY_ID: process.env.ACCESS_KEY_ID!,
        REGION: process.env.REGION!,
    },
    ECS: {
        ENDPOINT: process.env.ECS_ENDPOINT!,
        CLUSTER_NAME: process.env.ECS_CLUSTER_NAME!,
        UPLOADER_CONTAINER: process.env.ECS_UPLOADER_CONTAINER!,
        UPLOADER_TASK_ARN: process.env.ECS_UPLOADER_TASK_ARN!,
        UPLOADER_SUBNETS: process.env.ECS_UPLOADER_SUBNETS!,
    },
    LAMBDA: {
        ENDPOINT: process.env.LAMBDA_ENDPOINT!,
    },
};

export const handler = async (event: SQSEvent) => {
    for (const message of event.Records) {
        console.log(event);
        await processMessageAsync(message);
    }
    console.info('done');
};

/**
 * Trigger the fargate task
 */
const ecsClient = new ECSClient({
    region: LAMBDA_CONSTANTS.AWS.REGION!,
    credentials: {
        accessKeyId: LAMBDA_CONSTANTS.AWS.ACCESS_KEY_ID!,
        secretAccessKey: LAMBDA_CONSTANTS.AWS.SECRET_ACCESS_KEY!,
    },
    endpoint: LAMBDA_CONSTANTS.ECS.ENDPOINT!,
});

async function processMessageAsync(message: SQSRecord) {
    try {
        console.log("Received SQS message:", message);
        console.log(LAMBDA_CONSTANTS);

        const deploymentData = JSON.stringify(JSON.parse(message.body));
        const command = new RunTaskCommand({
            cluster: LAMBDA_CONSTANTS.ECS.CLUSTER_NAME,
            taskDefinition: LAMBDA_CONSTANTS.ECS.UPLOADER_TASK_ARN,
            launchType: "FARGATE",
            networkConfiguration: {
                awsvpcConfiguration: {
                    subnets: ['subnet-83eb0c4b07c8b0a2d'], // Ensure it's an array
                },
            },
            overrides: {
                containerOverrides: [
                    {
                        name: LAMBDA_CONSTANTS.ECS.UPLOADER_CONTAINER,
                        environment: [
                            { name: "CREATE_DEPLOYMENT_DATA", value: deploymentData },
                        ],
                    },
                ],
            },
        });

        const response = await ecsClient.send(command);
        console.log("Task started successfully:", response);
    } catch (error) {
        console.error("Error running ECS task:", error);
    }
}


async function test() {
    try {
        console.log(LAMBDA_CONSTANTS);

        const parsedMessage = JSON.parse("{\"owner\":\"HitishRaoP\",\"repo\":\"rolt\",\"ref\":\"main\",\"deploymentId\":\"123\"}");
        const command = new RunTaskCommand({
            cluster: LAMBDA_CONSTANTS.ECS.CLUSTER_NAME,
            taskDefinition: LAMBDA_CONSTANTS.ECS.UPLOADER_TASK_ARN,
            launchType: 'FARGATE',
            networkConfiguration: {
                awsvpcConfiguration: {
                    subnets: [LAMBDA_CONSTANTS.ECS.UPLOADER_SUBNETS],
                },
            },
            overrides: {
                containerOverrides: [
                    {
                        name: LAMBDA_CONSTANTS.ECS.UPLOADER_CONTAINER,
                        environment: [
                            {
                                name: "CREATE_DEPLOYMENT_DATA", value: "{\"owner\":\"HitishRaoP\",\"repo\":\"rolt\",\"ref\":\"main\",\"deploymentId\":\"123\"}"
                            }
                        ],
                    },
                ],
            },
        });
        const response = await ecsClient.send(command);
        console.log({
            message: 'Lambda Function deployed successfully',
            response,
        });
    } catch (error) {
        console.error('An error occurred', error);
    }
}

test()