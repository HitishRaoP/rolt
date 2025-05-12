import { GithubCheck, GithubCheckConclusion, GithubCheckStatus } from "@rolt/types/Deployment";
import z, { ZodType } from "zod";
import { CreateDeploymentSchema } from "./create-deployment-schema";

export const GithubCheckSchema = CreateDeploymentSchema.extend({
    deploymentId: z.string(),
    installationId: z.number().min(2),
    gitMetadata: z.object({
        commitSha: z.string().min(1),
        commitMessage: z.string().min(1),
        commitRef: z.string().min(1),
        commitAuthorName: z.string().min(1),
    }),
    checkRunId: z.number(),
    status: z.custom<GithubCheckStatus>(),
    conclusion: z.custom<GithubCheckConclusion>().optional(),
    title: z.string(),
    summary: z.string(),
}) satisfies ZodType<GithubCheck>