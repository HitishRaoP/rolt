import { Request, Response } from 'express';
import {
	SQSClient,
	SendMessageCommand,
	SQSServiceException,
	GetQueueUrlCommand,
} from '@aws-sdk/client-sqs';
import { sendResponse } from '@rolt/utils';
import { date, ZodError } from 'zod';
import { DEPLOYMENT_SERVER_CONSTANTS } from '../constants/deployment-server-constants.js';
import { CreateDeploymentSchema } from '@rolt/schemas';
import { nanoid } from 'nanoid';
import { CreateDeploymentResponse } from '@rolt/types/Deployment';
import { DeploymentService } from '../services/deployment.service.js';

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
		const deploymentService = new DeploymentService(
			CreateDeploymentSchema.parse(req.body));
		const response = await deploymentService.deploy();
		return sendResponse({
			res,
			message: response.message,
			statusCode: response.statusCode,
			data: response.data
		})
	} catch (error) {
		return sendResponse({
			res,
			message: "Internal Server Error",
			statusCode: 500
		})
	}
};
