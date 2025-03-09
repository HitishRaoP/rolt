import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import DeploymentRouter from './routes/deployment.route';
import { DEPLOYMENT_SERVER_CONSTANTS } from './constants/deployment-server-constants';
import { sendResponse } from '@rolt/utils';

const app = express();

const init = async () => {
	app.use(express.json());

	app.use(
		cors({
			origin: DEPLOYMENT_SERVER_CONSTANTS.DEV.FRONTEND_URL,
		}),
	);

	app.get('/', (req: Request, res: Response) => {
		return sendResponse({
			res,
			statusCode: 200,
			message: 'Deployment Server is Up and Running',
		});
	});

	app.use('/deployment', DeploymentRouter);

	app.listen(DEPLOYMENT_SERVER_CONSTANTS.DEV.PORT, () => {
		console.log(
			`Server Running on http://localhost:${DEPLOYMENT_SERVER_CONSTANTS.DEV.PORT}`,
		);
	});
};

init();

export default app;
