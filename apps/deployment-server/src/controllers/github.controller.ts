import { getDomains, sendResponse } from "@rolt/utils";
import { Request, Response } from "express";
import { GithubCheckSchema, GithubDeploymentSchema } from "@rolt/schemas";
import { Deployment } from "@octokit/webhooks-types";
import { getOctokitFromInstallationId } from "../utils/get-octokit-from-InstallationId.js";

export const CreateGithubDeployment = async (req: Request, res: Response) => {
    try {
        const {
            installationId,
            owner,
            repo,
            ref,
            commitSha,
            deploymentId } = GithubDeploymentSchema.parse(req.body)

        /**
         * Get the Octokit Instance
         */
        const octokit = await getOctokitFromInstallationId(installationId);

        /**
         * Create The Deployment First
         */
        const { data } = await octokit
            .rest
            .repos
            .createDeployment({
                owner,
                repo,
                ref,
                auto_merge: false
            });

        /**
         * Create the Deployment Status
         */
        const response = await octokit.rest.repos.createDeploymentStatus({
            owner,
            repo,
            deployment_id: (data as Deployment).id,
            state: "success",
            description: "Deployment completed successfully",
            environment_url: getDomains({ owner, repo, commitSha, deploymentId }).web,
            log_url: getDomains({ owner, repo, commitSha, deploymentId }).logs
        });

        return sendResponse({
            res,
            message: "Deployment Created Successfully",
            statusCode: 201,
            data: response
        });

    } catch (error) {
        return sendResponse({
            res,
            message: "Internal Server Error",
            statusCode: 500,
            data: error
        })
    }
}

export const UpdateGithubCheck = async (req: Request, res: Response) => {
    try {
        const {
            installationId,
            owner,
            repo,
            commitSha,
            status,
            checkRunId,
            title,
            summary } = GithubCheckSchema.parse(req.body)

        /**
        * Get the Octokit Instance
        */
        const octokit = await getOctokitFromInstallationId(installationId);

        /**
         * Create the Github Check
         */
        const { data } = await octokit.rest.checks.update({
            owner,
            repo,
            check_run_id: checkRunId,
            name: "Rolt",
            head_sha: commitSha,
            status,
            output: {
                title,
                summary,
            },
        });

        return sendResponse({
            res,
            message: "Github Check Updated Successfully",
            statusCode: 201,
            data
        })
    } catch (error) {
        return sendResponse({
            res,
            message: "Internal Server Error",
            statusCode: 500,
            data: error
        })
    }
}