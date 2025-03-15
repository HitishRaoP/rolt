import { Request, Response } from 'express';
import {
	SQSClient,
	SendMessageCommand,
	SQSServiceException,
	GetQueueUrlCommand,
} from '@aws-sdk/client-sqs';
import { sendResponse } from '@rolt/utils';
import { ZodError } from 'zod';
import { DEPLOYMENT_SERVER_CONSTANTS } from '../constants/deployment-server-constants';
import { CreateDeploymentSchema } from '@rolt/schemas';
import { nanoid } from 'nanoid';
import { CreateDeploymentResponse } from '@rolt/types/Deployment';

/**
 * @description Handles the deployment request by validating input,
 * ensuring authentication, sending a message to an SQS queue, and returning the response.
 *
 * @param {Request} req - Express request object containing deployment data in the body.
 * @param {Response} res - Express response object used to send the response.
 *
 * @returns {Promise<void>}
 */
export const CreateDeployment = async (
	req: Request,
	res: Response,
): Promise<void> => {
	try {
		/**
		 * Sanitize the input
		 */
		const body = req.body;

		/**
		 * Initialize the SQS client
		 */
		const sqsClient = new SQSClient({
			region: DEPLOYMENT_SERVER_CONSTANTS.AWS.REGION,
			credentials: {
				accessKeyId: DEPLOYMENT_SERVER_CONSTANTS.AWS.ACCESS_KEY_ID,
				secretAccessKey: DEPLOYMENT_SERVER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
			},
			endpoint: DEPLOYMENT_SERVER_CONSTANTS.SQS.ENDPOINT,
		});

		/**
		 * Get the Queue URL from the queue name
		 */
		const getQueueURLCommand = new GetQueueUrlCommand({
			QueueName: DEPLOYMENT_SERVER_CONSTANTS.SQS.QUEUE_NAME,
		});
		const { QueueUrl } = await sqsClient.send(getQueueURLCommand);

		/**
		 * Send the message to the Queue URL obtained along with the Deployment ID
		 */
		const response: CreateDeploymentResponse = {
			...body,
			deploymentId: nanoid(),
		};
		const sendMessageCommand = new SendMessageCommand({
			MessageBody: JSON.stringify(response),
			QueueUrl,
			MessageGroupId: DEPLOYMENT_SERVER_CONSTANTS.SQS.QUEUE_NAME,
		});
		await sqsClient.send(sendMessageCommand);
		return sendResponse({
			res,
			statusCode: 200,
			message: 'Deployment request successfully queued.',
			data: response,
		});
	} catch (error) {
		if (error instanceof ZodError) {
			return sendResponse({
				res,
				statusCode: 400,
				message: 'Bad Request: Invalid input',
				data: error.errors,
			});
		}

		if (error instanceof SQSServiceException) {
			return sendResponse({
				res,
				statusCode: 500,
				message: `AWS SQS Error: ${(error as Error).message}`,
			});
		}

		return sendResponse({
			res,
			statusCode: 500,
			message: `Internal Server Error: ${(error as Error).message}`,
		});
	}
};
