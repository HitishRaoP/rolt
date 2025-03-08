import z from "zod";

export const CreateDeploymentSchema = z.object({
    repo: z.string()
        .min(1, "Repository name cannot be empty"),
    owner: z.string()
        .min(1, "Owner name cannot be empty"),
    ref: z.string()
        .min(1, "Branch name cannot be empty")
});

export type CreateDeploymentType = z.infer<typeof CreateDeploymentSchema>