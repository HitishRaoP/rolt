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
		ACCOUNT_ID: process.env.ACCOUNT_ID!
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
		CLOUDWATCH_KINESIS_ROLE: process.env.IAM_CLOUDWATCH_KINESIS_ROLE!,
		VERSION: process.env.IAM_VERSION!
	},
	EC2: {
		ENDPOINT: process.env.EC2_ENDPOINT!
	},
	DYNAMODB: {
		ENDPOINT: process.env.DYNAMODB_ENDPOINT!,
		BUILD_LOGS_TABLE: process.env.DYNAMODB_BUILD_LOGS_TABLE!,
		PRODUCTION_LOGS_TABLE: process.env.DYNAMODB_PRODUCTION_LOGS_TABLE!
	},
	KINESIS: {
		ENDPOINT: process.env.KINESIS_ENDPOINT!,
		BUILD_STREAM: process.env.KINESIS_BUILD_STREAM!
	},
	CLOUDWATCH_LOGS: {
		ENDPOINT: process.env.CLOUDWATCH_LOGS_ENDPOINT!,
		BUILD_GROUP: process.env.CLOUDWATCH_LOGS_BUILD_GROUP!,
		BUILD_STREAM: process.env.CLOUDWATCH_LOGS_BUILD_STREAM!,
		BUILD_FILTER: process.env.CLOUDWATCH_LOGS_BUILD_FILTER
	}
};
