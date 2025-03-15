import { config } from 'dotenv';
import path from 'path';

config({
	path: path.resolve(__dirname, '../', '../.env'),
});

export const AWS_CONSTANTS = {
	AWS: {
		SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY!,
		ACCESS_KEY_ID: process.env.ACCESS_KEY_ID!,
		REGION: process.env.REGION!,
	},
	ECS: {
		ENDPOINT: process.env.ECS_ENDPOINT!,
		CLUSTER_NAME: process.env.ECS_CLUSTER_NAME!,
		UPLOADER_FAMILY: process.env.ECS_UPLOADER_FAMILY!,
		UPLOADER_CONTAINER: process.env.ECS_UPLOADER_CONTAINER!,
		UPLOADER_IMAGE: process.env.ECS_UPLOADER_IMAGE!
	},
	SQS: {
		ENDPOINT: process.env.SQS_ENDPOINT!,
		QUEUES: {
			UPLOADER: process.env.SQS_QUEUES_UPLOADER!,
			DEPLOYER: process.env.SQS_QUEUES_DEPLOYER!,
		}
	},
	S3: {
		BUCKET: process.env.S3_BUCKET!,
		ENDPOINT: process.env.S3_ENDPOINT!,
	},
	ECR: {
		ENDPOINT: process.env.ECR_ENDPOINT!,
		REPO_NAME: process.env.ECR_REPO_NAME!,
	},
	IAM: {
		ENDPOINT: process.env.IAM_ENDPOINT!,
		UPLOADER_TRIGGER_ROLE: process.env.IAM_UPLOADER_TRIGGER_ROLE!,
		VERSION: process.env.IAM_VERSION!
	},
	EC2: {
		ENDPOINT: process.env.EC2_ENDPOINT!
	}
};
