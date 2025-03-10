import {
    CreateQueueCommand,
    DeleteQueueCommand,
    GetQueueUrlCommand,
    SQSClient,
} from '@aws-sdk/client-sqs';
import { AWS_CONSTANTS } from '../constants/aws-constants';

const sqsClient = new SQSClient({
    region: AWS_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: AWS_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: AWS_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: AWS_CONSTANTS.SQS.ENDPOINT,
});

export const CreateQueue = async (
    {
        QueueName
    }: { QueueName: string }) => {
    try {
        const command = new CreateQueueCommand({
            QueueName,
            Attributes: {
                FifoQueue: 'true',
                ContentBasedDeduplication: 'true',
            },
        });
        const response = await sqsClient.send(command);
        console.log({
            message: 'SQS Queue Created Successfully',
            response,
        });
    } catch (error) {
        console.error('Error Creating Queue:', error);
    }
};

export const DeleteQueue = async (
    {
        QueueName
    }: { QueueName: string }) => {
    try {
        const getQueueURLCommand = new GetQueueUrlCommand({
            QueueName,
        });
        const { QueueUrl } = await sqsClient.send(getQueueURLCommand);

        const command = new DeleteQueueCommand({
            QueueUrl,
        });
        const response = await sqsClient.send(command);
        console.log({
            message: 'SQS Queue Deleted Successfully',
            response,
        });
    } catch (error) {
        console.error('Error Deleting Queue:', error);
    }
};
