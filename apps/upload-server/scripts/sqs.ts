import {
	CreateQueueCommand,
	DeleteQueueCommand,
	GetQueueUrlCommand,
	SQSClient,
} from '@aws-sdk/client-sqs';
import { UPLOAD_SERVER_CONSTANTS } from '../src/constants/upload-server-constants';

const sqsClient = new SQSClient({
	region: UPLOAD_SERVER_CONSTANTS.AWS.REGION,
	credentials: {
		accessKeyId: UPLOAD_SERVER_CONSTANTS.AWS.ACCESS_KEY_ID,
		secretAccessKey: UPLOAD_SERVER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
	},
	endpoint: UPLOAD_SERVER_CONSTANTS.SQS.ENDPOINT,
});

export const CreateQueue = async () => {
	try {
		const command = new CreateQueueCommand({
			QueueName: UPLOAD_SERVER_CONSTANTS.SQS.QUEUE_NAME,
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
			QueueName: UPLOAD_SERVER_CONSTANTS.SQS.QUEUE_NAME,
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
