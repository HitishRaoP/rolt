import z, { ZodType } from "zod";
import { FrameworkEnum } from "../../../apps/deployment-server/generated/prisma";
import { ProjectRequest } from "@rolt/types/Project";

const EnvironmentVariableSchema = z.object({
    key: z.string(),
    value: z.string()
});

export const CreateProjectSchema = z.object({
    userId: z.string(),
    githubRepository: z.string(),
    name: z.string(),
    framework: z.nativeEnum(FrameworkEnum),
    installCommand: z.string().optional(),
    buildCommand: z.string().optional(),
    rootDirectory: z.string().optional(),
    outputDirectory: z.string().optional(),
    environmentVariables: z.array(EnvironmentVariableSchema).optional()
}) satisfies ZodType<ProjectRequest>;

export type CreateProjectType = z.infer<typeof CreateProjectSchema>