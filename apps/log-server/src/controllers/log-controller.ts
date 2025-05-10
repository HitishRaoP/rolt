import { sendResponse } from "@rolt/utils";
import { Request, Response } from "express";
import { Socket } from "socket.io";

export const logController = (io: Socket, req: Request, res: Response) => {
    try {

    } catch (error) {
        sendResponse({
            res,
            statusCode: 500,
            message: "Internal Server Error"
        })
    }
}