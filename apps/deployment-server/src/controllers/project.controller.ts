import { sendResponse } from "@rolt/utils";
import { Request, Response } from "express";
import { ProjectService } from "../services/project.service.js";
import { CreateProjectSchema } from "@rolt/schemas"
import { z, ZodError } from "zod";
import { deploymentDB } from "../db/client.js";

export const createProject = async (req: Request, res: Response) => {
    try {
        const projectService = new ProjectService(
            CreateProjectSchema.parse(req.body))
        console.log(projectService);
        const response = await projectService.createProjectAndDeploy();
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
        });
    }
}

export const GetProjectsForUser = async (req: Request, res: Response) => {
    const getProjectsForUserSchema = z.object({
        userId: z.string()
    })
    try {
        const { userId } = getProjectsForUserSchema.parse(req.params);
        const response = await deploymentDB.project.findMany({
            where: {
                userId
            },
            include: {
                deployments: {
                    include: {
                        gitMetadata: true,
                        domains: true
                    },
                    orderBy: {
                        createdAt: "desc"
                    },
                    take: 1
                }
            }
        });

        /**
         * Appending the latestDeployment to each Project
         */
        const projectsWithLatestDeployment = response.map(project => ({
            ...project,
            latestDeployment: project.deployments[0],
        }));

        return sendResponse({
            res,
            message: `Projects Successfully Fetched for user: ${userId}`,
            statusCode: 200,
            data: projectsWithLatestDeployment
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
        });
    }
}

export const GetProjectById = async (req: Request, res: Response) => {
    /**
     * Request Schema
     */
    const getProjectByIdSchema = z.object({
        projectId: z.string()
    })
    try {
        const { projectId } = getProjectByIdSchema.parse(req.params)

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
                    orderBy: {
                        createdAt: "desc"
                    },
                }
            }
        });

        /**
         * Appending the latestDeployment to each Project
         */
        const projectsWithLatestDeployment = {
            ...response,
            latestDeployment: response?.deployments.at(0),
        }

        return sendResponse({
            res,
            message: `Project Successfully Fetched for ${projectId}`,
            statusCode: 200,
            data: projectsWithLatestDeployment
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