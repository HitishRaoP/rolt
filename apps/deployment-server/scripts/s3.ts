import { CreateBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { DEPLOYMENT_SERVER_CONSTANTS } from '../src/constants/deployment-server-constants';

const s3Client = new S3Client({
	region: DEPLOYMENT_SERVER_CONSTANTS.AWS.REGION,
	credentials: {
		accessKeyId: DEPLOYMENT_SERVER_CONSTANTS.AWS.ACCESS_KEY_ID,
		secretAccessKey: DEPLOYMENT_SERVER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
	},
	endpoint: DEPLOYMENT_SERVER_CONSTANTS.S3.ENDPOINT,
});

export const CreateBucket = async () => {
	try {
		const command = new CreateBucketCommand({
			Bucket: DEPLOYMENT_SERVER_CONSTANTS.S3.BUCKET,
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
