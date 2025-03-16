import { LAMBDA_CONSTANTS } from "../src/constants/lambdas-constants";
import { createUploaderMapping, DeployLambda } from "../src/lambda/aws-lambda";

const lambdasBootstrap = async () => {
    try {
        await Promise.all([
            DeployLambda({
                functionName: LAMBDA_CONSTANTS.LAMBDA.UPLOADER_TRIGGER,
                roleArn: LAMBDA_CONSTANTS.AWS.LAMBDA_S3_ROLE_ARN,
            }),
            createUploaderMapping({
                functionName: LAMBDA_CONSTANTS.LAMBDA.UPLOADER_TRIGGER,
                eventSourceArn: LAMBDA_CONSTANTS.LAMBDA.UPLOADER_QUEUE_ARN,
            }),
        ])
        console.log("Lambdas initialised successfully");
    } catch (error) {
        console.log("Error bootstrapping lambdas", error);
    }
}

lambdasBootstrap();