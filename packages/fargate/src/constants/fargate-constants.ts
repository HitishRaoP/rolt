export const UPLOAD_SERVER_CONSTANTS = {
    PORT: process.env.PORT,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN!,
    REGION: process.env.REGION!,
    ACCESS_KEY_ID: process.env.ACCESS_KEY_ID!,
    SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY!,
    S3_ENDPOINT: process.env.S3_ENDPOINT!,
    S3_BUCKET: process.env.S3_BUCKET!,
    SQS_ENDPOINT: process.env.SQS_ENDPOINT!,
    SQS_QUEUE_URL: process.env.SQS_QUEUE_URL!,
    SQS_DEPLOYMENT_QUEUE: process.env.SQS_DEPLOYMENT_QUEUE!,
    ECR_ENDPOINT: process.env.ECR_ENDPOINT!,
    ECR_REPO_NAME: process.env.ECR_REPO_NAME!
}