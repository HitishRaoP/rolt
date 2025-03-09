import { CreateRepositoryCommand, ECRClient } from '@aws-sdk/client-ecr';
import { UPLOAD_SERVER_CONSTANTS } from '../src/constants/upload-server-constants';

const ecrClient = new ECRClient({
	region: UPLOAD_SERVER_CONSTANTS.AWS.REGION,
	credentials: {
		accessKeyId: UPLOAD_SERVER_CONSTANTS.AWS.ACCESS_KEY_ID,
		secretAccessKey: UPLOAD_SERVER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
	},
	endpoint: UPLOAD_SERVER_CONSTANTS.ECR.ENDPOINT,
});

export const CreateECRRepository = async () => {
	try {
		const command = new CreateRepositoryCommand({
			repositoryName: UPLOAD_SERVER_CONSTANTS.ECR.REPO_NAME,
		});
		const response = await ecrClient.send(command);
		console.log({
			message: 'ECR Repository Created Successfully',
			response,
		});
	} catch (error) {
		console.error('Error Creating Repository:', error);
	}
};
