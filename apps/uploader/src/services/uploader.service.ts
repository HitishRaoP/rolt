import { S3Client, PutObjectCommand, S3ServiceException } from "@aws-sdk/client-s3";
import { Octokit } from "octokit";
import { UPLOAD_SERVER_CONSTANTS } from "../constants/uploader-constants.js";
import { CreateDeploymentResponse } from "@rolt/types/Deployment"

/**
 * UploadService Class
 *
 * This class runs as a container on AWS Fargate and is responsible for:
 * 1. Downloading a GitHub repository as a zip file.
 * 2. Uploading the zip file to MinIO/S3 storage.
 *
 * Logging is used to track the progress and errors.
 */
export class UploadService {
    private s3Client: S3Client;
    private octokit: Octokit;
    private zipBuffer: Buffer | null = null;
    private deploymentDetails: CreateDeploymentResponse;

    constructor(deploymentDetails: CreateDeploymentResponse) {
        this.deploymentDetails = deploymentDetails;
        this.octokit = new Octokit();
        this.s3Client = new S3Client({
            region: UPLOAD_SERVER_CONSTANTS.AWS.REGION,
            forcePathStyle: true,
            credentials: {
                accessKeyId: UPLOAD_SERVER_CONSTANTS.AWS.ACCESS_KEY_ID,
                secretAccessKey: UPLOAD_SERVER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
            },
            endpoint: UPLOAD_SERVER_CONSTANTS.S3.ENDPOINT,
        });
    }

    /**
     * Downloads the latest zip archive of the specified repository branch.
     *
     * @throws {Error} If the repository download fails.
     */
    async downloadRepo(): Promise<void> {
        try {
            const { url } = await this.octokit
                .rest
                .repos.downloadZipballArchive(this.deploymentDetails);
            const response = await fetch(url);

            if (!(response.ok)) {
                throw new Error("Unexpected response type. Expected Buffer.");
            }

            const arrayBuffer = await response.arrayBuffer();
            this.zipBuffer = Buffer.from(arrayBuffer);
            console.log("Repository downloaded successfully.");
        } catch (error) {
            throw new Error(`Failed to download repository: ${(error as Error).message}`);
        }
    }

    /**
     * Uploads the downloaded zip file to the specified S3 bucket.
     *
     * @throws {Error} If the upload fails.
     */
    async putRepoToS3(): Promise<void> {
        if (!this.zipBuffer) {
            throw new Error("No zip file available for upload.");
        }
        const params = {
            Bucket: UPLOAD_SERVER_CONSTANTS.S3.BUCKET,
            Key: `${this.deploymentDetails.deploymentId}.zip`,
            Body: this.zipBuffer,
            ContentType: "application/zip",
        };

        try {
            console.log(`Uploading repository to S3 bucket: ${UPLOAD_SERVER_CONSTANTS.S3.BUCKET}`);
            await this.s3Client.send(new PutObjectCommand(params));
            console.log("Upload successful.");
        } catch (error) {
            if (error instanceof S3ServiceException) {
                throw new Error(`AWS S3 Error: ${(error as Error).message}`);
            }
            throw new Error(`Failed to upload repository to S3: ${(error as Error).message}`);
        }
    }

    /**
     * Orchestrates the repository download and upload process.
     */
    async upload(): Promise<void> {
        try {
            console.log("Starting upload process...");
            await this.downloadRepo();
            await this.putRepoToS3();
            console.log("Upload process completed successfully.");
        } catch (error) {
            throw new Error(`Upload process failed: ${(error as Error).message}`);
        }
    }
}