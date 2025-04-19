import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import DeploymentRouter from './routes/deployment.route.js';
import { DEPLOYMENT_SERVER_CONSTANTS } from './constants/deployment-server-constants.js';
import { sendResponse } from '@rolt/utils';
import WebhookRouter from './routes/webhook.route.js';
import mongoose from 'mongoose';
import GithubRouter from './routes/github.route.js';
import { deploymentDB } from './db/client.js';

const app = express();

const connectDb = async () => {
	try {
		await mongoose.connect(DEPLOYMENT_SERVER_CONSTANTS.MONGODB.URI);
		console.log("Connected To MongoDB");
	} catch (error) {
		throw new Error(`${error}`)
	}
}

const init = async () => {

	app.use(cors());

	app.use(express.json());

	await connectDb();

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

	app.listen(DEPLOYMENT_SERVER_CONSTANTS.DEV.PORT, () => {
		console.log(
			`Server Running on http://localhost:${DEPLOYMENT_SERVER_CONSTANTS.DEV.PORT}`,
		);
	});
};

init();

export default app;
