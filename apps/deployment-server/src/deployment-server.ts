import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import DeploymentRouter from './routes/deployment.route.js';
import { DEPLOYMENT_SERVER_CONSTANTS } from './constants/deployment-server-constants.js';
import { sendResponse } from '@rolt/utils';
import { createNodeMiddleware } from '@octokit/webhooks';
import { Webhooks } from "@octokit/webhooks";

export const webhooks = new Webhooks({
    secret: "secret"
});

webhooks.on("push", ({ id, name, payload }) => {
    console.log(
        payload
    );
})

webhooks.onAny(({ name, payload }) => {
	console.log(`Received ${name} event`);
	console.log(payload);
});

const app = express();

const middleWare = createNodeMiddleware(webhooks);

const init = async () => {

	app.use(
		cors({
			origin: "*",
		}),
	);

	app.use("/webhooks", async (req, res, next) => {
		try {
			await middleWare(req, res);
		} catch (error) {
			next(error)
		}
	})

	app.use(express.json());

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
