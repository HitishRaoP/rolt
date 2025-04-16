import { Router } from 'express';
import { CreateGithubDeployment, GetReposForInstallation, UpdateGithubCheck } from '../controllers/github.controller.js';

const GithubRouter = Router();

GithubRouter.post('/deployment', CreateGithubDeployment);

GithubRouter.post("/check", UpdateGithubCheck);

GithubRouter.get("/repos", GetReposForInstallation);

export default GithubRouter;