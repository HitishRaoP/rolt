import mongoose from "mongoose";
import { FrameworkEnum, Project } from "@rolt/types/Project";

export const ProjectSchema = new mongoose.Schema<Project>({
    name: {
        type: String,
        required: true,
    },
    framework: {
        type: String,
        enum: FrameworkEnum,
        required: true,
    },
    rootDir: {
        type: String,
        required: true,
        default: "./"
    },
    settings: {
        installCommand: {
            type: String,
        },
        buildCommand: {
            type: String,
        },
        outDir: {
            type: String,
        },
    },
    env: [
        {
            key: {
                type: String,
                required: true,
            },
            value: {
                type: String,
                required: true,
            },
        },
    ],
});
