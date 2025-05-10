import express from "express";
import cors from "cors";
import { sendResponse } from "@rolt/utils";
import { LOG_SERVER_CONSTANTS } from "./constants/log-server-constants";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

async function init() {

    app.use(express.json());

    app.use(cors());

    app.get("/", (req: express.Request, res: express.Response) => {
        sendResponse({
            res,
            statusCode: 200,
            message: "Log Server is up and running"
        })
    })

    app.post("/logs", (req, res) => {
        const logs = req.body;
        console.log('Received log batch:', logs);

        const { deploymentId } = logs;

        io.to(deploymentId).emit("log", logs);

        res.sendStatus(200);
    });

    io.on("connection", (socket) => {
        console.log("Client connected:", socket.id);

        socket.on("subscribe", (deploymentId: string) => {
            console.log(`Socket ${socket.id} subscribed to ${deploymentId}`);
            socket.join(deploymentId);
        });

        socket.on("disconnect", () => {
            console.log("Client disconnected:", socket.id);
        });
    });


    httpServer.listen(LOG_SERVER_CONSTANTS.DEV.PORT, () => {
        console.log(`Server is running at http://localhost:${LOG_SERVER_CONSTANTS.DEV.PORT}`);
    })
}

init()

export default app;