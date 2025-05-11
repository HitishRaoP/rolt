import { Router } from "express";
import { getLogsFromKubernetes, getLiveLogsForDeployment } from "../controllers/logs.controller";

const LogRouter = Router();

LogRouter.post("/k8s", getLogsFromKubernetes);

LogRouter.get("/live", getLiveLogsForDeployment);

export { LogRouter }