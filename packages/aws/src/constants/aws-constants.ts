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
};
