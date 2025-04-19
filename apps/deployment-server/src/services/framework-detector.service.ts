import { SimpleGit, simpleGit } from 'simple-git';
import { listFrameworks, type Framework } from '@netlify/framework-info';
import { getOctokitFromInstallationId } from '../utils/get-octokit-from-InstallationId.js';
import fs from 'node:fs/promises';
import type { InstallationAccessTokenAuthentication } from '@octokit/auth-app';
import { ApiResponse } from '@rolt/types/Api';
import { deploymentDB } from '../db/client.js';

/**
 * A class to detect frontend frameworks used in a GitHub repository.
 *
 * Supports  single-framework repositories by cloning the repository.
 * and scanning the structure using Netlify's `listFrameworks` utility.
 *
 * **Monorepos are not supported yet**
 */
export class FrameWorkDetector {
    /** Git client instance */
    private git: SimpleGit;

    /** GitHub owner (user or organization name) */
    private owner: string;

    /** GitHub repository name */
    private repo: string;

    /** Temporary directory to clone the repository into */
    private tempDir: string;

    /** GitHub App installation ID used for authentication */
    private installationId: number;

    /**
     * Constructs a new instance of the `FrameWorkDetector` class.
     *
     * @param owner - GitHub username or organization
     * @param repo - Repository name
     * @param installationId - GitHub App installation ID for authentication
     */
    constructor(owner: string, repo: string, installationId: number) {
        this.installationId = installationId;
        this.git = simpleGit();
        this.owner = owner;
        this.repo = repo;
        this.tempDir = `temp/${repo}`;
    }

    /**
     * Clones the target GitHub repository into a temporary directory
     * using an installation token for authentication.
     *
     * @private
     */
    private async clone(): Promise<void> {
        const octokit = await getOctokitFromInstallationId(this.installationId);
        
        const { token } = await octokit.auth({
            type: 'installation',
        }) as InstallationAccessTokenAuthentication;

        /**
         * Reference on Cloning Private Repos using Installation Token
         * https://stackoverflow.com/questions/2505096/clone-a-private-repository-github
         */
        const cloneUrl = `https://${this.owner}:${token}@github.com/${this.owner}/${this.repo}.git`;

        await this.git.clone(cloneUrl, this.tempDir, ['--depth', '1']);
    }

    /**
     * Detects the framework used in the cloned GitHub repository.
     * If no common framework is found, returns `"Other"`.
     *
     * @returns An object of type `ApiResponse<Framework | string | unknown>` (without `res`),
     *          which contains detection result, status, and message.
     */
    async detect(): Promise<Omit<ApiResponse<Framework | string | unknown>, "res">> {
        try {
            await this.clone();

            const frameworks = await listFrameworks({ projectDir: this.tempDir });

            if (frameworks.length > 0) {
                return {
                    message: "Framework Detected Successfully",
                    statusCode: 200,
                    data: { ...frameworks.at(0) }
                };
            }

            return {
                message: "Framework Detected Successfully",
                statusCode: 200,
                data: "Other"
            };
        } catch (error) {
            return {
                message: "Error Detecting Framework",
                statusCode: 400,
                data: error
            };
        } finally {
            await fs.rm(this.tempDir, { recursive: true, force: true });
        }
    }
}
