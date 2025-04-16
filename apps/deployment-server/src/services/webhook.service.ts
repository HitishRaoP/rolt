import { InstallationCreatedEvent, PushEvent } from "@octokit/webhooks-types";
import { sendResponse } from "@rolt/utils";
import { Request, Response } from "express";
import { DeploymentService } from "../services/deployment.service.js";
import { CreateDeploymentSchema } from "@rolt/schemas";
import { InstallationModel } from "../models/installation.model.js";
import { MongooseError } from "mongoose";
import { EventType } from "@rolt/types/Deployment";


export class WebHookService<T> {
    private event: EventType
    private payload: T

    constructor(event: EventType, payload: T) {
        this.event = event;
        this.payload = payload
    }

    private async CreateDeployment(res: Response) {
        try {
            const payload = this.payload as PushEvent
            console.log(payload);
            const deploymentService = new DeploymentService(
                CreateDeploymentSchema.parse({
                    owner: payload.repository.owner.name,
                    repo: payload.repository.name
                }));
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
                message: "Internal Server Error Creating Deployment",
                statusCode: 500,
                data: error
            })
        }
    }

    private async PostAppInstall(res: Response) {
        try {
            const payload = this.payload as InstallationCreatedEvent;
            console.log(payload);
            /**
             * Create a Document when a New App is installed
             */
            payload.action === "created" && await InstallationModel.create([
                {
                    id: payload.installation.id,
                    owner: payload.installation.account.login,
                    installationId: payload.installation.id,
                    ownerType: payload.sender.type,
                    provider: "Github",
                }
            ])
            return sendResponse({
                res,
                message: "App installation saved",
                statusCode: 201,
            });
        } catch (error) {
            if (error instanceof MongooseError) {
                return sendResponse({
                    res,
                    message: "Failed to update Database",
                    statusCode: 500,
                    data: error
                })
            }
            return sendResponse({
                res,
                message: "Internal Server Error during app installation",
                statusCode: 500,
                data: error
            })
        }
    }

    async handle(res: Response) {
        try {
            if (this.event === "push") {
                await this.CreateDeployment(res);
            }
            else if (this.event === "installation") {
                await this.PostAppInstall(res);
            }
        } catch (error) {
            console.log(error);
            return sendResponse({
                res,
                message: "Internal Server Error handling the webook request",
                statusCode: 500,
                data: error
            })
        }
    }
}