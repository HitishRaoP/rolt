import "dotenv/config";
import express, { Request, Response } from "express"
import cors from "cors";
import { UPLOAD_SERVER_CONSTANTS } from "./constants/upload-server-constants.js";
import { graphql } from "@octokit/graphql";
import { GET_REPOS } from "./graphql/get-repos.js";
import { getRepo } from "./controllers/github.controller.js";

const app = express();

async function init() {

    app.use(express.json());

    app.use(cors({
        origin: UPLOAD_SERVER_CONSTANTS.FRONTEND_URL
    }));

    app.get("/", (req: Request, res: Response) => {
        res.send("Upload Server is Up and Running.")
    })

    app.get("/repos", async (req: Request, res: Response) => {
        try {
            const { username } = req.query as { username: string };

            if (!username) {
                res.status(400).json({ error: "Username is required" });
            }

            const response = await graphql<{ user: { repositories: { nodes: { name: string, url: string }[] } } }>(
                GET_REPOS,
                {
                    username,
                    headers: {
                        authorization: `Bearer ${process.env.GITHUB_ACCESS_TOKEN}`,
                    },
                }
            );

            const repos = response.user.repositories.nodes;

            res.json(repos);
        } catch (error) {
            res.status(500).json({ error: error || "Internal Server Error" });
        }
    });

    app.get("/repo", getRepo)

    app.listen(UPLOAD_SERVER_CONSTANTS.PORT, () => {
        console.log(`Server running on port http://localhost:${UPLOAD_SERVER_CONSTANTS.PORT} `);
    })
}

init()

export default app;