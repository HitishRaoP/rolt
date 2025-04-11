import { sendResponse } from "@rolt/utils";
import { Request, Response } from "express";
import { WebHookService } from "../services/webhook.service.js";
import { EventType } from "@rolt/types/Deployment";

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