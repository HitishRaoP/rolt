import { CreateRepositoryCommand, ECRClient, ListImagesCommand } from '@aws-sdk/client-ecr';
import { BOOTSTRAP_CONSTANTS } from '../constants/bootstrap-constants';

const ecrClient = new ECRClient({
	region: BOOTSTRAP_CONSTANTS.AWS.REGION,
	credentials: {
		accessKeyId: BOOTSTRAP_CONSTANTS.AWS.ACCESS_KEY_ID,
		secretAccessKey: BOOTSTRAP_CONSTANTS.AWS.SECRET_ACCESS_KEY,
	},
	endpoint: BOOTSTRAP_CONSTANTS.ECR.ENDPOINT,
});

export const CreateECRRepository = async () => {
	try {
		const command = new CreateRepositoryCommand({
			repositoryName: BOOTSTRAP_CONSTANTS.ECR.REPO_NAME,
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

export const ListECRImages = async () => {
	try {
		const command = new ListImagesCommand({
			repositoryName: BOOTSTRAP_CONSTANTS.ECR.REPO_NAME,
		});
		const response = await ecrClient.send(command);
		console.log({
			message: 'ECR Repository Images Retrieved Successfully',
			response: JSON.stringify(response),
		});
	} catch (error) {
		console.error('Error Listing Repository Images:', error);
		throw error;
	}
};