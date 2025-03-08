import { CreateBucketCommand, S3Client } from "@aws-sdk/client-s3";
import { UPLOAD_SERVER_CONSTANTS } from "../src/constants/upload-server-constants";

const s3Client = new S3Client({
    region: UPLOAD_SERVER_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: UPLOAD_SERVER_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: UPLOAD_SERVER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: UPLOAD_SERVER_CONSTANTS.S3.S3_ENDPOINT,
});

export const CreateBucket = async () => {
    try {
        const command = new CreateBucketCommand({
            Bucket: UPLOAD_SERVER_CONSTANTS.S3.S3_BUCKET
        })
        const response = await s3Client.send(command);
        console.log({
            message: "S3 Bucket Created Successfully",
            response
        });
    } catch (error) {
        throw new Error(`${error}`)
    }
}