import mongoose from "mongoose";
import { Installation } from "@rolt/types/User"

const InstallationSchema = new mongoose.Schema<Installation>({
    id: {
        type: Number,
        required: [true, "ID is required"],
    },
    owner: {
        type: String,
        required: [true, "Owner is required"],
    },
    installationId: {
        type: Number,
        required: [true, "Installation ID is required"],
    },
    ownerType: {
        type: String,
        enum: ["Bot", "User", "Organization"],
        required: [true, "Owner type is required"],
    },
    provider: {
        type: String,
        enum: ["Github"],
        required: [true, "Provider is required"],
    }
});

export const InstallationModel = mongoose.model<Installation>(
    "Installation",
    InstallationSchema
);
