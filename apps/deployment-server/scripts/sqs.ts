import {
	CreateQueueCommand,
	DeleteQueueCommand,
	GetQueueUrlCommand,
	SQSClient,
} from '@aws-sdk/client-sqs';
import { DEPLOYMENT_SERVER_CONSTANTS } from '../src/constants/deployment-server-constants';

const sqsClient = new SQSClient({
	region: DEPLOYMENT_SERVER_CONSTANTS.AWS.REGION,
	credentials: {
		accessKeyId: DEPLOYMENT_SERVER_CONSTANTS.AWS.ACCESS_KEY_ID,
		secretAccessKey: DEPLOYMENT_SERVER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
	},
	endpoint: DEPLOYMENT_SERVER_CONSTANTS.SQS.ENDPOINT,
});

export const CreateQueue = async () => {
	try {
		const command = new CreateQueueCommand({
			QueueName: DEPLOYMENT_SERVER_CONSTANTS.SQS.QUEUE_NAME,
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

export const DeleteQueue = async () => {
	try {
		const getQueueURLCommand = new GetQueueUrlCommand({
			QueueName: DEPLOYMENT_SERVER_CONSTANTS.SQS.QUEUE_NAME,
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
