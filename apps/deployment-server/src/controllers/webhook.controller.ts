import { PushEvent } from "@octokit/webhooks-types";
import { sendResponse } from "@rolt/utils";
import { Request, Response } from "express";
import { DeploymentService } from "../services/deployment.service.js";

export const CreateDeploymentUsingWebhook = async (req: Request, res: Response) => {
    try {
        const payload: PushEvent = req.body;
        const deploymentService = new DeploymentService(
            CreateDeploymentSchema.parse(req.body));
        const response = await deploymentService.deploy();
        return sendResponse({
            res,
            message: response.message,
            statusCode: response.statusCode,
            data: response.data
        })
        console.log(payload);
        res.send(payload)
    } catch (error) {
        return sendResponse({
            res,
            message: "Internal Server Error",
            statusCode: 500
        })
    }
}