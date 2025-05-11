import { Router } from 'express';
import { CreateDeployment, GetDeploymentById, GetDeploymentsForProject } from '../controllers/deployment.controller.js';

const DeploymentRouter = Router();

DeploymentRouter.post('/', CreateDeployment);

DeploymentRouter.get("/:deploymentId", GetDeploymentById)

DeploymentRouter.get("/project/:projectId", GetDeploymentsForProject)

export default DeploymentRouter;