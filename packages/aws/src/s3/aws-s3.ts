import { CreateBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { AWS_CONSTANTS } from '../constants/aws-constants';

const s3Client = new S3Client({
    region: AWS_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: AWS_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: AWS_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: AWS_CONSTANTS.S3.ENDPOINT,
});

export const CreateBucket = async () => {
    try {
        const command = new CreateBucketCommand({
            Bucket: AWS_CONSTANTS.S3.BUCKET,
        });
        const response = await s3Client.send(command);
        console.log({
            message: 'S3 Bucket Created Successfully',
            response,
        });
    } catch (error) {
        console.error('Error Creating Bucket:', error);
    }
};
