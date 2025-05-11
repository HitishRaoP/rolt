import { Request, Response } from 'express';
import { sendResponse } from '@rolt/utils';
import { CreateDeploymentSchema } from '@rolt/schemas';
import { DeploymentService } from '../services/deployment.service.js';
import { deploymentDB } from '../db/client.js';
import { z, ZodError } from 'zod';

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
			statusCode: 500,
			data: error
		})
	}
};

export const GetDeploymentsForProject = async (req: Request, res: Response) => {
	/**
	 * Request Schema
	 */
	const getDeploymentsForUserSchema = z.object({
		projectId: z.string()
	})
	try {
		const { projectId } = getDeploymentsForUserSchema.parse(req.params);

		const response = await deploymentDB.project.findMany({
			where: {
				projectId
			},
			include: {
				deployments: true
			}
		})
		return sendResponse({
			res,
			message: `Deployments Successfully Fetched for Project ${projectId}`,
			statusCode: 200,
			data: response
		});
	} catch (error) {
		if (error instanceof ZodError) {
			return sendResponse({
				res,
				message: "Validation Error",
				statusCode: 400,
				data: error.errors.map(err => ({
					field: err.path.join("."),
					message: err.message
				}))
			});
		}
		return sendResponse({
			res,
			message: "Internal Server Error",
			statusCode: 500,
			data: error
		})
	}
}

export const GetDeploymentById = async (req: Request, res: Response) => {
	/**
	 * Request Schema
	 */
	const getDeploymentByIdSchema = z.object({
		deploymentId: z.string()
	})
	try {
		const { deploymentId } = getDeploymentByIdSchema.parse(req.params)

		const response = await deploymentDB.deployment.findUnique({
			where: {
				deploymentId
			}
		});
		return sendResponse({
			res,
			message: `Deployment Successfully Fetched for ${deploymentId}`,
			statusCode: 200,
			data: response
		});
	} catch (error) {
		if (error instanceof ZodError) {
			return sendResponse({
				res,
				message: "Validation Error",
				statusCode: 400,
				data: error.errors.map(err => ({
					field: err.path.join("."),
					message: err.message
				}))
			});
		}
		return sendResponse({
			res,
			message: "Internal Server Error",
			statusCode: 500,
			data: error
		})
	}
}