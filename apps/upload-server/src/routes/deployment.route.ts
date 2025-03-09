import { Router } from 'express';
import { CreateDeployment } from '../controllers/deployment.controller';

const DeploymentRouter = Router();

DeploymentRouter.post('/', CreateDeployment);

export default DeploymentRouter;
