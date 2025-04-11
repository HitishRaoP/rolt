import express from "express";
import cors from "cors";
import { sendResponse } from "@rolt/utils";
import { LOG_SERVER_CONSTANTS } from "./constants/log-server-constants";

const app = express();

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
        res.sendStatus(200);
    })

    app.listen(LOG_SERVER_CONSTANTS.DEV.PORT, () => {
        console.log(`Server is running at http://localhost:${LOG_SERVER_CONSTANTS.DEV.PORT}`);
    })
}

init()

export default app;