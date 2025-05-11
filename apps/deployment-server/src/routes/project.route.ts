import { Router } from "express";
import { createProject, GetProjectById, GetProjectsForUser } from "../controllers/project.controller.js";

const ProjectRouter = Router();

ProjectRouter.post("/", createProject);

ProjectRouter.get("/:projectId", GetProjectById);

ProjectRouter.get("/user/:userId", GetProjectsForUser);

export { ProjectRouter };