import path from "path"
import { config } from "dotenv"

config({
    path: path.resolve(__dirname, "../", "../.env")
})

export const LAMBDA_CONSTANTS = {
    AWS: {
        SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY!,
        ACCESS_KEY_ID: process.env.ACCESS_KEY_ID!,
        REGION: process.env.REGION!,
    },
    ECS: {
        ENDPOINT: process.env.ECS_ENDPOINT!,
        CLUSTER_NAME: process.env.ECS_CLUSTER_NAME!,
        UPLOADER_CONTAINER: process.env.ECS_UPLOADER_CONTAINER!,
        UPLOADER_TASK_ARN: process.env.ECS_UPLOADER_TASK_ARN!,
        UPLOADER_SUBNETS: process.env.ECS_UPLOADER_SUBNETS!
    },
    LAMBDA: {
        ENDPOINT: process.env.LAMBDA_ENDPOINT!,
    }
}