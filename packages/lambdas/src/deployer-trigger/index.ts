import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import { SQSEvent, SQSRecord } from 'aws-lambda';

/**
 * Configuration to be provided while updating or deploying the lambda function.
 */
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

        const deploymentData = JSON.parse(message.body);
        const command = new RunTaskCommand({
            cluster: LAMBDA_CONSTANTS.ECS.CLUSTER_NAME,
            taskDefinition: LAMBDA_CONSTANTS.ECS.UPLOADER_TASK_ARN,
            launchType: "FARGATE",
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
                            { name: "OWNER", value: deploymentData.owner },
                            { name: "REF", value: deploymentData.ref },
                            { name: "REPO", value: deploymentData.repo },
                            { name: "URL", value: deploymentData.url },
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