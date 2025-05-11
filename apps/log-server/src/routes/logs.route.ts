import { Router } from "express";
import { getLiveLogsForDeployment, getLogsForDeployment } from "../controllers/logs.controller";

const LogRouter = Router();

LogRouter.get("/", getLogsForDeployment);

LogRouter.post("/live", getLiveLogsForDeployment)

export { LogRouter }