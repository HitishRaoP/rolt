import { ECSClient, RunTaskCommand } from '@aws-sdk/client-ecs';
import path from 'path';
import { config } from 'dotenv';
import { SQSEvent, SQSRecord } from 'aws-lambda';

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
        console.log(`Processed message ${message.body}`);
        const parsedMessage = JSON.parse(message.body);
        const environment = Object.entries(parsedMessage).map(([name, value]) => ({
            name,
            value: String(value),
        }));
        const command = new RunTaskCommand({
            cluster: LAMBDA_CONSTANTS.ECS.CLUSTER_NAME,
            taskDefinition: LAMBDA_CONSTANTS.ECS.UPLOADER_TASK_ARN,
            launchType: 'FARGATE',
            networkConfiguration: {
                awsvpcConfiguration: {
                    subnets: LAMBDA_CONSTANTS.ECS.UPLOADER_SUBNETS.split(','),
                },
            },
            overrides: {
                containerOverrides: [
                    {
                        name: LAMBDA_CONSTANTS.ECS.UPLOADER_CONTAINER,
                        environment,
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
