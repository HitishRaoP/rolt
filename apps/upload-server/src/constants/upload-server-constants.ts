import { config } from 'dotenv';
import path from 'path';

config({
	path: path.resolve(__dirname, '../', '../.env'),
});

export const UPLOAD_SERVER_CONSTANTS = {
	DEV: {
		PORT: process.env.PORT!,
		FRONTEND_URL: process.env.FRONTEND_URL!,
	}
};
