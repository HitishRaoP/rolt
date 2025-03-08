import { config } from "dotenv";
import path from "path";

config({
    path: path.resolve(__dirname, "../", "../.env")
})

export const UPLOAD_SERVER_CONSTANTS = {
    DEV: {
        PORT: process.env.PORT!,
        FRONTEND_URL: process.env.FRONTEND_URL!,
    },
    AWS: {
        SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY!,
        ACCESS_KEY_ID: process.env.ACCESS_KEY_ID!,
        REGION: process.env.REGION!,
    },
    SQS: {
        ENDPOINT: process.env.SQS_ENDPOINT!,
        QUEUE_NAME: process.env.SQS_QUEUE_NAME!,
    },
    S3: {
        BUCKET: process.env.S3_BUCKET!,
        ENDPOINT: process.env.S3_ENDPOINT!
    },
    ECR: {
        ENDPOINT: process.env.S3_ENDPOINT!,
        REPO_NAME: process.env.ECR_REPO_NAME!
    },
    EVENTS_BRIDGE: {
        ENDPOINT: process.env.EVENTS_BRIDGE_ENDPOINT,
        BUS_NAME: process.env.EVENTS_BRIDGE_BUS_NAME,
        CREATE_DEPLOYMENT_RULE: process.env.EVENTS_BRIDGE_CREATE_DEPLOYMENT_RULE,
        CREATE_DEPLOYMENT_TARGET: process.env.EVENTS_BRIDGE_CREATE_DEPLOYMENT_TARGET
    }
}