import "dotenv/config";
import express, { Request, Response } from "express"
import cors from "cors";
import { USER_SERVER_CONSTANTS } from "./constants/user-server-constants";

const app = express();

async function init() {

    app.use(express.json());

    app.use(cors({
        origin: USER_SERVER_CONSTANTS.FRONTEND_URL
    }));

    app.get("/", (req: Request, res: Response) => {
        res.send("Upload Server is Up and Running.")
    })

    app.listen(USER_SERVER_CONSTANTS.PORT, () => {
        console.log(`Server running on port http://localhost:${USER_SERVER_CONSTANTS.PORT} `);
    })
}

init()

export default app;