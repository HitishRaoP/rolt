import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import DeploymentRouter from './routes/deployment.route';
import { UPLOAD_SERVER_CONSTANTS } from './constants/upload-server-constants';
import { sendResponse } from '@rolt/utils';

const app = express();

const init = async () => {
	app.use(express.json());

	app.use(
		cors({
			origin: UPLOAD_SERVER_CONSTANTS.DEV.FRONTEND_URL,
		}),
	);

	app.get('/', (req: Request, res: Response) => {
		return sendResponse({
			res,
			statusCode: 200,
			message: 'Upload Server is Up and Running',
		});
	});

	app.use('/deployment', DeploymentRouter);

	app.listen(UPLOAD_SERVER_CONSTANTS.DEV.PORT, () => {
		console.log(
			`Server Running on http://localhost:${UPLOAD_SERVER_CONSTANTS.DEV.PORT}`,
		);
	});
};

init();

export default app;
