import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import DeploymentRouter from './routes/deployment.route.js';
import { DEPLOYMENT_SERVER_CONSTANTS } from './constants/deployment-server-constants.js';
import { sendResponse } from '@rolt/utils';
import { PushEvent } from '@octokit/webhooks-types';

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

	app.post("/webhooks", async (req: Request, res: Response) => {
		try {
			const payload: PushEvent = req.body;
			console.log(payload);
			res.send(payload)
		} catch (error) {
			throw new Error(`${error}`)
		}
	})

	app.listen(DEPLOYMENT_SERVER_CONSTANTS.DEV.PORT, () => {
		console.log(
			`Server Running on http://localhost:${DEPLOYMENT_SERVER_CONSTANTS.DEV.PORT}`,
		);
	});
};

init();

export default app;
