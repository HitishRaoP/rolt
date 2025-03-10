import { CreateRepositoryCommand, ECRClient, ListImagesCommand } from '@aws-sdk/client-ecr';
import { AWS_CONSTANTS } from '../constants/aws-constants';

const ecrClient = new ECRClient({
	region: AWS_CONSTANTS.AWS.REGION,
	credentials: {
		accessKeyId: AWS_CONSTANTS.AWS.ACCESS_KEY_ID,
		secretAccessKey: AWS_CONSTANTS.AWS.SECRET_ACCESS_KEY,
	},
	endpoint: AWS_CONSTANTS.ECR.ENDPOINT,
});

export const CreateECRRepository = async () => {
	try {
		const command = new CreateRepositoryCommand({
			repositoryName: AWS_CONSTANTS.ECR.REPO_NAME,
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
			repositoryName: AWS_CONSTANTS.ECR.REPO_NAME,
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