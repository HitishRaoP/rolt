import { Request, Response } from 'express';
import { sendResponse, SSE, InitSSEHeaders } from '@rolt/utils';
import { CreateDeploymentSchema } from '@rolt/schemas';
import { DeploymentService } from '../services/deployment.service.js';
import { deploymentDB } from '../db/client.js';
import { z, ZodError } from 'zod';
import { interval } from '../utils/interval.js';

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

		const response = await deploymentDB.project.findUnique({
			where: {
				projectId
			},
			include: {
				deployments: {
					include: {
						gitMetadata: true,
						domains: true
					},
				}
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
			},
			include: {
				gitMetadata: true,
				domains: true
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

type Client = {
	deploymentId: string
	res: Response
	timer?: NodeJS.Timeout
}

export const clients: Client[] = [];

export const GetDeploymentStatus = async (req: Request, res: Response) => {
	try {
		const { deploymentId } = req.params as { deploymentId: string };

		/**
		 * Necessary Headers
		 */
		InitSSEHeaders(res);

		/**
		 * Sending Previous Status (If Missed)
		 */
		const deployment = await deploymentDB.deployment.findUnique({
			where: {
				deploymentId
			},
			select: {
				status: true,
				createdAt: true,
				updatedAt: true
			},
		});

		SSE(res, { type: "STATUS", status: deployment?.status });

		/**
		 * Timer Logic
		 */
		if (deployment?.status === "Error" || deployment?.status === "Ready") {
			const time = interval(deployment.createdAt, deployment.updatedAt);
			SSE(res, { type: 'TIMER', time });
		}

		if (deployment?.status === 'Pending' || deployment?.status === 'Queued') {
			const client: Client = { deploymentId, res }

			client.timer = setInterval(() => {
				const elapsed = interval(deployment.createdAt, new Date());
				SSE(res, { type: "TIMER", elapsed });
			}, 1000);

			clients.push(client);
		}


		/**
		* Register for live updates
		*/
		const client = { deploymentId, res };
		clients.push(client);

		/**
		* Clean Up
			*/
		req.on("close", () => {
			const index = clients.findIndex(c => c.res === res);
			if (index !== -1) clients.splice(index, 1);
			res.end();
		});
	} catch (error) {
		return sendResponse({
			res,
			message: "Internal Server Error",
			statusCode: 500,
			data: error
		})
	}
}