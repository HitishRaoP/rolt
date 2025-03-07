import { graphql } from "@octokit/graphql";
import { Request, Response } from "express";
import { Octokit, App } from "octokit";
import { GET_REPOS } from "../graphql/get-repos.js";
import { UPLOAD_SERVER_CONSTANTS } from "../constants/upload-server-constants.js";
import { z } from "zod";

export const getRepos = async (req: Request, res: Response) => {
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
}

const octokit = new Octokit();

const repoSchema = z.object({
    owner: z.string().min(1, "Owner is required"),
    repo: z.string().min(1, "Repository name is required"),
});

/**
 * Controller to fetch a repository's tree structure recursively.
 *
 * This function retrieves:
 * 1. The default branch of the repository.
 * 2. The latest commit SHA for that branch.
 * 3. The full repository tree in a recursive manner.
 *
 * @param req - Express request object (expects owner and repo as query params)
 * @param res - Express response object
 */
export const getRepo = async (req: Request, res: Response) => {
    try {
        const { owner, repo } = repoSchema.parse(req.query);

        const { data: repoData } = await octokit.rest.repos.get({ owner, repo });

        const { data: branchData } = await octokit.rest.repos.getBranch({
            owner,
            repo,
            branch: repoData.default_branch,
        });

        const { data: treeData } = await octokit.rest.git.getTree({
            owner,
            repo,
            tree_sha: branchData.commit.sha,
            recursive: "true",
        });

        res.json(treeData);
    } catch (error) {
        res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
    }
};