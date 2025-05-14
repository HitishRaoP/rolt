import { Router } from 'express';
import { CreateGithubDeployment, GetRepoForImport, GetReposForOwner, UpdateGithubCheck } from '../controllers/github.controller.js';

const GithubRouter = Router();

GithubRouter.post('/deployment', CreateGithubDeployment);

GithubRouter.post("/check", UpdateGithubCheck);

GithubRouter.get("/repos/:owner", GetReposForOwner);

GithubRouter.get("/repo", GetRepoForImport)

export default GithubRouter;