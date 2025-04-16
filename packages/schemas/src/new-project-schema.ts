import z, { ZodType } from "zod";
import { FrameworkType, Project } from "@rolt/types/Project";

export const NewProjectSchema = z.object({
    name:
        z.string({
            required_error: "Project name is required",
            invalid_type_error: "Project name must be a string",
        }).min(1, "Project name cannot be empty"),

    framework: z.custom<FrameworkType>(),

    rootDir:
        z.string({
            required_error: "Root directory is required",
            invalid_type_error: "Root directory must be a string",
        }).min(1, "Root directory cannot be empty"),

    settings: z.object({
        installCommand:
            z.string({
                invalid_type_error: "Install command must be a string",
            }).optional(),

        buildCommand:
            z.string({
                invalid_type_error: "Build command must be a string",
            }).optional(),

        outDir:
            z.string({
                invalid_type_error: "Output directory must be a string",
            }).optional(),
    }).optional(),
}) satisfies ZodType<Project>;
