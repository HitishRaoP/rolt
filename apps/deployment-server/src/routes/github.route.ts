import { Router } from 'express';
import { CreateGithubDeployment, GetRepoForImport, GetReposFromInstallationId, UpdateGithubCheck } from '../controllers/github.controller.js';

const GithubRouter = Router();

GithubRouter.post('/deployment', CreateGithubDeployment);

GithubRouter.post("/check", UpdateGithubCheck);

GithubRouter.get("/repos", GetReposFromInstallationId);

GithubRouter.get("/repo", GetRepoForImport)

export default GithubRouter;