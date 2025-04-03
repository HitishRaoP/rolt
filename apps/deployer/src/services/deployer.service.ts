import { exec } from "child_process";
import { promisify } from "util";
import { UPLOADER_CONSTANTS } from "../constants/deployer-constants.js";
import { CreateDeploymentResponse } from "@rolt/types/Deployment";
import fs from "fs";
import path from "path";

const execAsync = promisify(exec);

export class DeployService {
    private deploymentDetails: CreateDeploymentResponse;
    private repoPath: string;

    constructor(deploymentDetails: CreateDeploymentResponse) {
        this.deploymentDetails = deploymentDetails;
        this.repoPath = path.join("./tmp1", this.deploymentDetails.deploymentId);
    }

    /**
     * Clone the repository from GitHub
     */
    async downloadRepo(): Promise<void> {
        try {
            console.log(`Cloning repository: ${this.deploymentDetails.repo}`);
            await execAsync(`git clone --branch ${this.deploymentDetails.ref} https://github.com/${this.deploymentDetails.owner}/${this.deploymentDetails.repo}.git ${this.repoPath}`);
            console.log("Repository cloned successfully.");
        } catch (error) {
            throw new Error(`Failed to clone repository: ${(error as Error).message}`);
        }
    }

    /**
     * Install dependencies using npm or yarn
     */
    async installDependencies(): Promise<void> {
        try {
            console.log("Installing dependencies...");
            await execAsync(`cd ${this.repoPath} && npm install`);
            console.log("Dependencies installed.");
        } catch (error) {
            throw new Error(`Failed to install dependencies: ${(error as Error).message}`);
        }
    }

    /**
     * Build the project if a build script exists
     */
    async buildProject(): Promise<void> {
        try {
            const packageJsonPath = path.join(this.repoPath, "package.json");
            if (fs.existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
                if (packageJson.scripts?.build) {
                    console.log("Building project...");
                    await execAsync(`cd ${this.repoPath} && npm run build`);
                    console.log("Project built successfully.");
                } else {
                    console.log("No build script found. Skipping build.");
                }
            }
        } catch (error) {
            throw new Error(`Failed to build project: ${(error as Error).message}`);
        }
    }

    /**
     * Start the project using npm start or a custom command
     */
    async startProject(): Promise<void> {
        try {
            const startCommand = this.deploymentDetails.startCommand || "npm start";
            console.log(`Starting project using: ${startCommand}`);
            await execAsync(`cd ${this.repoPath} && ${startCommand}`);
            console.log("Project started successfully.");
        } catch (error) {
            throw new Error(`Failed to start project: ${(error as Error).message}`);
        }
    }

    /**
     * Orchestrates the deployment process
     */
    async deploy(): Promise<void> {
        try {
            console.log("Starting deployment...");
            await this.downloadRepo();
            await this.installDependencies();
            await this.buildProject();
            await this.startProject();
            console.log("Deployment completed successfully.");
        } catch (error) {
            throw new Error(`Deployment failed: ${(error as Error).message}`);
        }
    }
}


new DeployService(
    {
        owner: "HitishRaoP",
        repo: "nextjs-sample",
        ref: "main",
        deploymentId: "123"
    }).deploy();