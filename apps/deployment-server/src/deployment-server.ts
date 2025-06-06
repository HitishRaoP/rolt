import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import DeploymentRouter from './routes/deployment.route.js';
import { DEPLOYMENT_SERVER_CONSTANTS } from './constants/deployment-server-constants.js';
import { sendResponse } from '@rolt/utils';
import WebhookRouter from './routes/webhook.route.js';
import GithubRouter from './routes/github.route.js';
import { ProjectRouter } from './routes/project.route.js';

const app = express();

const init = async () => {

	app.use(cors());

	app.use(express.json());

	app.get('/', (req: Request, res: Response) => {
		return sendResponse({
			res,
			statusCode: 200,
			message: 'Deployment Server is Up and Running',
		});
	});

	app.use('/deployment', DeploymentRouter);

	app.use("/webhooks", WebhookRouter);

	app.use("/github", GithubRouter);

	app.use("/project", ProjectRouter)

	app.listen(DEPLOYMENT_SERVER_CONSTANTS.DEV.PORT, () => {
		console.log(
			`Server Running on http://localhost:${DEPLOYMENT_SERVER_CONSTANTS.DEV.PORT}`,
		);
	});
};

init();

export default app;
