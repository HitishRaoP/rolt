import { Router } from 'express';
import { CreateDeployment, GetDeploymentById, GetDeploymentsForProject, GetDeploymentStatus } from '../controllers/deployment.controller.js';

const DeploymentRouter = Router();

DeploymentRouter.post('/', CreateDeployment);

DeploymentRouter.get("/:deploymentId", GetDeploymentById)

DeploymentRouter.get("/project/:projectId", GetDeploymentsForProject)

DeploymentRouter.get("/status/:deploymentId", GetDeploymentStatus)

export default DeploymentRouter;