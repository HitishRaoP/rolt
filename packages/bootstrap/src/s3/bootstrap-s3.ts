import { CreateBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { BOOTSTRAP_CONSTANTS } from '../constants/bootstrap-constants';

const s3Client = new S3Client({
	region: BOOTSTRAP_CONSTANTS.AWS.REGION,
	credentials: {
		accessKeyId: BOOTSTRAP_CONSTANTS.AWS.ACCESS_KEY_ID,
		secretAccessKey: BOOTSTRAP_CONSTANTS.AWS.SECRET_ACCESS_KEY,
	},
	endpoint: BOOTSTRAP_CONSTANTS.S3.ENDPOINT,
});

export const CreateBucket = async () => {
	try {
		const command = new CreateBucketCommand({
			Bucket: BOOTSTRAP_CONSTANTS.S3.BUCKET,
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
