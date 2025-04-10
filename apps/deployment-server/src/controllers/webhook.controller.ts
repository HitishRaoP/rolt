import { InstallationCreatedEvent, PushEvent } from "@octokit/webhooks-types";
import { sendResponse } from "@rolt/utils";
import { Request, Response } from "express";
import { DeploymentService } from "../services/deployment.service.js";
import { CreateDeploymentSchema } from "@rolt/schemas";
import { AppModel } from "../models/app.model.js";
import { MongooseError } from "mongoose";
import { WebHookService } from "../services/webhook.service.js";
import { EventType } from "@rolt/types/Deployment";

export const CreateDeploymentUsingWebhook = async (req: Request, res: Response) => {
    try {
        const payload: PushEvent = req.body;
        const event = req.headers["X-GitHub-Event"];
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
            message: "Internal Server Error",
            statusCode: 500,
            data: error
        })
    }
}

export const PostAppInstall = async (req: Request, res: Response) => {
    try {
        const payload: InstallationCreatedEvent = req.body;
        console.log(payload);
        /**
         * Create a Document when a New App is installed
         */
        payload.action === "created" && await AppModel.create([
            {
                owner: payload.installation.account.login,
                installationId: payload.installation.id,
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
            message: "Internal Server Error",
            statusCode: 500,
            data: error
        })
    }
}

export const handleWebhook = async (req: Request, res: Response) => {
    try {
        const event = req.headers["x-github-event"] as EventType;
        const payload = req.body;
        const webhookService = new WebHookService(event, payload)
        await webhookService.handle(res);
    } catch (error) {
        return sendResponse({
            res,
            message: "Internal Server Error",
            statusCode: 500,
            data: error
        })
    }
}