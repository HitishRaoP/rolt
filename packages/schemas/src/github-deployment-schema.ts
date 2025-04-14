import z, { ZodType } from "zod";
import { CreateDeploymentSchema } from "./create-deployment-schema";
import { GithubDeployment } from "@rolt/types/Deployment";

export const GithubDeploymentSchema = CreateDeploymentSchema.extend({
    installationId: z.number().min(2),
    ref: z.string().min(1),
    commitSha: z.string().min(1),
    deploymentId: z.string().min(1)
}) satisfies ZodType<GithubDeployment>

export type GithubDeploymentType = z.infer<typeof GithubDeploymentSchema>