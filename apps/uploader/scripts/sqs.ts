import {
	CreateQueueCommand,
	DeleteQueueCommand,
	GetQueueUrlCommand,
	SQSClient,
} from '@aws-sdk/client-sqs';
import { UPLOADER_CONSTANTS } from '../src/constants/uploader-constants.js';

const sqsClient = new SQSClient({
	region: UPLOADER_CONSTANTS.AWS.REGION,
	credentials: {
		accessKeyId: UPLOADER_CONSTANTS.AWS.ACCESS_KEY_ID,
		secretAccessKey: UPLOADER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
	},
	endpoint: UPLOADER_CONSTANTS.SQS.ENDPOINT,
});

export const CreateQueue = async () => {
	try {
		const command = new CreateQueueCommand({
			QueueName: UPLOADER_CONSTANTS.SQS.QUEUE_NAME,
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
			QueueName: UPLOADER_CONSTANTS.SQS.QUEUE_NAME,
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
