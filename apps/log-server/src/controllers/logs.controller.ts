import { sendResponse } from "@rolt/utils";
import { Request, Response } from "express";
import { logDB } from "../db/log-db";
import { IncomingLog } from "@rolt/types/Log";

const clients: { deploymentId: string; res: Response }[] = [];

export const getLogsFromKubernetes = async (req: Request, res: Response) => {
    const log: IncomingLog = req.body;
    const { deploymentId } = log;

    /**
     * Insert into DB
     */
    await logDB.log.create({ data: log });

    /**
     * Send the log to connected Clients
     */
    clients.forEach((client) => {
        if (client.deploymentId === deploymentId) {
            client.res.write(`data: ${JSON.stringify(log)}\n\n`)
        }
    });

    return sendResponse({
        res,
        statusCode: 200,
        message: "Log sent"
    });
};

export const getLiveLogsForDeployment = async (req: Request, res: Response) => {
    const { deploymentId } = req.query as { deploymentId: string };

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    /**
     * Send Previous Logs
     */
    const logs = await logDB.log.findMany({
        where: { deploymentId },
        orderBy: { timestamp: 'asc' },
    });

    logs.forEach(log => {
        res.write(`data: ${JSON.stringify(log)}\n\n`)
    });

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
};
