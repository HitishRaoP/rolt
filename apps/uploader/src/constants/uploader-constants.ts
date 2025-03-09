import { config } from 'dotenv';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({
	path: path.resolve(__dirname, '../', '../.env'),
});

export const UPLOAD_SERVER_CONSTANTS = {
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
};
