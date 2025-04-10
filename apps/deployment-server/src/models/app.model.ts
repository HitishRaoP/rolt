import { App } from "@rolt/types/Deployment";
import mongoose from "mongoose";

export const AppSchema = new mongoose.Schema<App>({
    owner: {
        type: String,
        required: true
    },
    installationId: {
        type: Number,
        required: true
    }
})

export const AppModel = mongoose.model("AppModel", AppSchema);