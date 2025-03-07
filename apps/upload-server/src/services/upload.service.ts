import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { UPLOAD_SERVER_CONSTANTS } from "../constants/upload-server-constants.js";

//TODO: Running this on Fargate Triggered By AWS Lamda
/**
 * This Class should be running as a container on AWS Fargate.
 *
 *
 * This class is used to:
 * 1. Clone a github Repo.
 * 2. Zip the contents of the file.
 * 3. Upload the zip file to minio/s3.
 */
export class UploadService {
    private s3Client: S3Client;
    private repoURL: string;

    constructor(repoURL: string) {
        this.repoURL = repoURL
        this.s3Client = new S3Client({
            credentials: {
                accessKeyId: UPLOAD_SERVER_CONSTANTS.MINIO_ACCESS_KEY,
                secretAccessKey: UPLOAD_SERVER_CONSTANTS.MINIO_SECRET_ACCESS_KEY,
            },
            endpoint: UPLOAD_SERVER_CONSTANTS.MINIO_ENDPOINT,
        });
    }

    async cloneRepo() {

    }

    async zipRepo() {

    }

    async putRepoToS3() {
        const params = {
            /** input parameters */
        };
        const command = new PutObjectCommand({
            Bucket: UPLOAD_SERVER_CONSTANTS.MINIO_BUCKET,
            Body: "",
            Key: ""
        });

        try {
            const data = await this.s3Client.send(command);
            // process data.
        } catch (error) {
            // error handling.
        } finally {
            // finally.
        }
    }

    async upload() {

    }

}