export const UPLOAD_SERVER_CONSTANTS = {
    PORT: process.env.PORT!,
    FRONTEND_URL: process.env.FRONTEND_URL!,
    GITHUB_ACCESS_TOKEN: process.env.GITHUB_ACCESS_TOKEN!,
    AWS: {
        SECRET_ACCESS_KEY: process.env.SECRET_ACCESS_KEY!,
        ACCESS_KEY_ID: process.env.ACCESS_KEY_ID!,
        REGION: process.env.REGION!,
    },
    SQS: {
        SQS_ENDPOINT: process.env.SQS_ENDPOINT!,
        SQS_QUEUE_NAME: process.env.SQS_QUEUE_NAME!,
    },
    S3: {
        S3_BUCKET: process.env.S3_BUCKET!,
        S3_ENDPOINT: process.env.S3_ENDPOINT!
    }
}