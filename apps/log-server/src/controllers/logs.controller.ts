import { sendResponse } from "@rolt/utils";
import { Request, Response } from "express";
import { logDB } from "../db/log-db";
import { Server } from "socket.io";
import { IncomingLog } from "@rolt/types/Log";

export const getLogsForDeployment = async (req: Request, res: Response) => {
    try {
        const { deploymentId } = req.query as { deploymentId: string };
        const response = await logDB.log.findMany({
            where: {
                deploymentId
            }
        })
        return sendResponse({
            res,
            statusCode: 200,
            data: response,
            message: `Logs fetched successfully for Deployment Id ${deploymentId}`
        });
    } catch (error) {
        sendResponse({
            res,
            statusCode: 500,
            message: "Internal Server Error"
        })
    }
}

export const getLiveLogsForDeployment = async (req: Request, res: Response) => {
    const log: IncomingLog = req.body;
    const { deploymentId } = log;

    /**
     * Insert Log into DB
     */
    await logDB.log.create({
        data: log
    });

    const io: Server = req.app.get("io");
    if (!io) {
        sendResponse({
            res,
            statusCode: 500,
            message: "Socket.IO instance not found"
        });
    }
    io.to(deploymentId).emit("log", log);
    sendResponse({
        res,
        statusCode: 200,
        message: "Log sent"
    });
};