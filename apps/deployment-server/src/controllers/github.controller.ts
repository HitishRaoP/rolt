import { getDomains, sendResponse } from "@rolt/utils";
import { Request, Response } from "express";
import { GithubCheckSchema, GithubDeploymentSchema, GetRepoForImportSchema } from "@rolt/schemas";
import { Deployment } from "@octokit/webhooks-types";
import { getOctokitFromInstallationId } from "../utils/get-octokit-from-InstallationId.js";
import { ZodError } from "zod";
import { updateStatus } from "../utils/update-status.js";

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const CreateGithubDeployment = async (req: Request, res: Response) => {
    try {
        const {
            installationId,
            owner,
            repo,
            ref,
            gitMetadata,
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
            environment_url: getDomains({ owner, repo, commitSha: gitMetadata.commitSha, deploymentId }).web,
            log_url: getDomains({ owner, repo, commitSha: gitMetadata.commitSha, deploymentId }).logs
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

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const UpdateGithubCheck = async (req: Request, res: Response) => {
    try {
        const {
            deploymentId,
            installationId,
            owner,
            repo,
            gitMetadata,
            status,
            conclusion,
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
            head_sha: gitMetadata.commitSha,
            status,
            conclusion,
            output: {
                title,
                summary,
            },
        });

        /**
         * Updating the statuses
         */
        if (status === "in_progress") {
            updateStatus({ deploymentId, status: "Pending" });
        } else if (conclusion === "success") {
            updateStatus({ deploymentId, status: "Ready" });
        } else if (conclusion === "failure") {
            updateStatus({ deploymentId, status: "Error" });
        }

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

/**
 *
 * @param req
 * @param res
 * @returns
 */
export const GetReposFromInstallationId = async (req: Request, res: Response) => {
    try {
        const { installationId } = req.query as unknown as { installationId: number };

        /**
         * Create an instance For the Installation Octokit Wrapper
         */
        const octokit = await getOctokitFromInstallationId(installationId);

        /**
         * Calling the API
         */
        const response = await octokit.rest.apps.listReposAccessibleToInstallation();

        return sendResponse({
            res,
            message: "Fetched repositories successfully",
            statusCode: 200,
            data: response.data.repositories
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

/**
 * Fetches a GitHub repository's metadata and detects the framework used in it.
 *
 * @param {Request} req - Express request object containing query parameters: `installationId`, `repo`, and `owner`.
 * @param {Response} res - Express response object used to return the API response.
 * @returns {Promise<Response>} A response containing the repository metadata and detected framework information.
 *
 * @throws {ZodError} If the query parameters do not conform to the expected schema.
 * @throws {Error} If an unexpected error occurs during repository fetch or framework detection.
 */
export const GetRepoForImport = async (req: Request, res: Response) => {
    try {
        /**
         * Get the Repository details
         */
        const { installationId, repo, owner } = GetRepoForImportSchema.parse(req.query);

        const octokit = await getOctokitFromInstallationId(installationId);

        const response = await octokit.rest.repos.get({
            owner,
            repo
        });

        /**
         * Getting the Framework Details
         */

        return sendResponse({
            res,
            message: "Repository fetched successfully",
            statusCode: 200,
            data: {
                repo: response.data,
            }
        });
    } catch (error) {
        if (error instanceof ZodError) {
            return sendResponse({
                res,
                message: "Invalid request query parameters",
                statusCode: 400,
                data: error.message
            });
        }
        return sendResponse({
            res,
            message: "Internal Server Error",
            statusCode: 500,
            data: error
        });
    }
};