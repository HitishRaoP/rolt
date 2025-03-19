import { config } from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({
	path: path.resolve(__dirname, '../', '../.env'),
});

export const UPLOADER_CONSTANTS = {
	DEV: {
		PORT: process.env.PORT!,
		FRONTEND_URL: process.env.FRONTEND_URL!,
	},
	AWS: {
		SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY!,
		ACCESS_KEY_ID: process.env.ACCESS_KEY_ID!,
		REGION: process.env.REGION!,
	},
	S3: {
		BUCKET: process.env.S3_BUCKET!,
		ENDPOINT: process.env.S3_ENDPOINT!,
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
			DEPLOYER: process.env.SQS_QUEUES_DEPLOYER!
		},
	},
};
