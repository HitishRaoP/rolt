import { GithubCheck, GithubCheckConclusion, GithubCheckStatus } from "@rolt/types/Deployment";
import z, { ZodType } from "zod";
import { CreateDeploymentSchema } from "./create-deployment-schema";


export const GithubCheckSchema = CreateDeploymentSchema.extend({
    installationId: z.number().min(2),
    commitSha: z.string().min(1),
    checkRunId: z.number(),
    status: z.custom<GithubCheckStatus>(),
    title: z.string(),
    summary: z.string(),
    conclusion: z.custom<GithubCheckConclusion>().optional()
}) satisfies ZodType<GithubCheck>