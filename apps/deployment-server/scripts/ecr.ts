import { CreateRepositoryCommand, ECRClient } from '@aws-sdk/client-ecr';
import { DEPLOYMENT_SERVER_CONSTANTS } from '../src/constants/deployment-server-constants';

const ecrClient = new ECRClient({
	region: DEPLOYMENT_SERVER_CONSTANTS.AWS.REGION,
	credentials: {
		accessKeyId: DEPLOYMENT_SERVER_CONSTANTS.AWS.ACCESS_KEY_ID,
		secretAccessKey: DEPLOYMENT_SERVER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
	},
	endpoint: DEPLOYMENT_SERVER_CONSTANTS.ECR.ENDPOINT,
});

export const CreateECRRepository = async () => {
	try {
		const command = new CreateRepositoryCommand({
			repositoryName: DEPLOYMENT_SERVER_CONSTANTS.ECR.REPO_NAME,
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
