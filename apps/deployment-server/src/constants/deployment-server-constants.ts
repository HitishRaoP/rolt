import { config } from 'dotenv';
import path from 'path';
import { cwd } from 'process';

const __dirname = cwd();

config({
	path: path.resolve(__dirname, '../', '../.env'),
});

export const DEPLOYMENT_SERVER_CONSTANTS = {
	MONGODB: {
		URI: process.env.MONGODB_URI!
	},
	DEV: {
		PORT: process.env.PORT!,
		FRONTEND_URL: process.env.FRONTEND_URL!,
	},
	AWS: {
		SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY!,
		ACCESS_KEY_ID: process.env.ACCESS_KEY_ID!,
		REGION: process.env.REGION!,
	},
	SQS: {
		ENDPOINT: process.env.SQS_ENDPOINT!,
		QUEUE_NAME: process.env.SQS_QUEUE_NAME!,
	},
	GITHUB: {
		APP_ID: process.env.GITHUB_APP_ID!,
	}
};
