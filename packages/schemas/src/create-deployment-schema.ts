import z, { ZodType } from "zod";
import { CreateDeployment } from "@rolt/types"

export const CreateDeploymentSchema = z.object({
    repo: z.string()
        .min(1, "Repository name cannot be empty"),
    owner: z.string()
        .min(1, "Owner name cannot be empty"),
    ref: z.string()
        .min(1, "Branch name cannot be empty")
}) satisfies ZodType<CreateDeployment>;

export type CreateDeploymentType = z.infer<typeof CreateDeploymentSchema>