import { Router } from 'express';
import { CreateGithubDeployment, UpdateGithubCheck } from '../controllers/github.controller.js';

const GithubRouter = Router();

GithubRouter.post('/deployment', CreateGithubDeployment);

GithubRouter.post("/check", UpdateGithubCheck);

export default GithubRouter;