import { ProjectRequest } from "@rolt/types/Project";
import { DeploymentService } from "./deployment.service.js";
import { deploymentDB } from "../db/client.js";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { getOwnerRepoRef } from "../utils/get-owner-repo-ref.js";

export class ProjectService extends DeploymentService {
    projectRequest: ProjectRequest;

    constructor(request: ProjectRequest) {
        super(getOwnerRepoRef(request.githubRepository));
        this.projectRequest = request;
    }

    private async createProject() {
        try {
            const response = await deploymentDB.project.create({
                data: {
                    ...this.projectRequest,
                    environmentVariables: {
                        create: this.projectRequest.environmentVariables
                    }
                },
            })
            return {
                statusCode: 201,
                message: `Project Created Successfully`,
                data: response
            }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                return {
                    statusCode: 500,
                    message: "Prisma Client Error",
                    data: (error as Error).message
                }
            }
            return {
                statusCode: 500,
                message: "Project Service Error",
                data: (error as Error).message
            }
        }
    }

    async createProjectAndDeploy() {
        try {
            const response = await Promise.all([
                await this.createProject(),
                await this.deploy()
            ])
            return {
                message: "Project and Deployment Created Successfully",
                data: response,
                statusCode: 201
            }
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                return {
                    statusCode: 500,
                    message: "Prisma Client Error",
                    data: (error as Error).message
                }
            }
            return {
                statusCode: 500,
                message: "Project Service Error",
                data: (error as Error).message
            }
        }
    }
}