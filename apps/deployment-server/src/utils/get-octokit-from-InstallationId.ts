import { App, Octokit } from "octokit";
import { DEPLOYMENT_SERVER_CONSTANTS } from "../constants/deployment-server-constants.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

/**
 * https://stackoverflow.com/questions/8817423/why-is-dirname-not-defined-in-node-repl
 */
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getOctokitFromInstallationId = async (
    installationId: number
): Promise<InstanceType<typeof Octokit>> => {
    const app = new App({
        appId: DEPLOYMENT_SERVER_CONSTANTS.GITHUB.APP_ID,
        privateKey: fs.readFileSync(
            path.resolve(__dirname, "../../", "private-key.pem"),
            "utf8"
        ),
    });
    return await app.getInstallationOctokit(installationId);
};