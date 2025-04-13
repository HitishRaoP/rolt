/**
 * Configuration to be provided while updating or deploying the lambda function.
 */
export const LAMBDA_CONSTANTS = {
    AWS: {
        REGION: process.env.AWS_REGION!,
        ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID!,
        SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY!,
    },
    SECRET_MANAGER: {
        ENDPOINT: process.env.AWS_ENDPOINT!
    },
    MINIKUBE: {
        SECRET: process.env.MINIKUBE_SECRET,
        DEPLOYER_IMAGE: process.env.MINIKUBE_DEPLOYER_IMAGE,
        ENDPOINT: process.env.MINIKUBE_ENDPOINT,
    },
};
