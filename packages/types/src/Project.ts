import { FrameworkEnum, Installation } from "../../../apps/deployment-server/generated/prisma";
import { Deployment } from "./Deployment";

export type EnvironmentVariables = {
    key: string
    value: string
}

export type Project = {
    projectId: string
    userId: string
    githubRepository: string
    name: string
    framework: FrameworkEnum
    installCommand?: string
    buildCommand?: string
    rootDirectory?: string
    outputDirectory?: string
    environmentVariables?: EnvironmentVariables[]
    createdAt: string
    updatedAt: string
    installation: Installation
}

export type ProjectRequest = Omit<Project, "createdAt" | "updatedAt" | "installation" | "projectId">;

export type ProjectExtended = Project & {
    latestDeployment: Deployment
}