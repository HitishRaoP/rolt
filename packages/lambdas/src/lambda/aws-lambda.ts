import { LambdaClient, CreateFunctionCommand, UpdateFunctionCodeCommand } from "@aws-sdk/client-lambda";
import { readFileSync } from "fs";
import { LAMBDA_CONSTANTS } from "../constants/lambdas-constants";
import path from "path";

const lambda = new LambdaClient({
    region: LAMBDA_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: LAMBDA_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: LAMBDA_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: LAMBDA_CONSTANTS.ECS.ENDPOINT,
});

export async function DeployLambda() {
    const functionName = "triggerUploaderFunction";
    const roleArn = "arn:aws:iam::000000000000:role/lambda-uploader-trigger"; // Replace with your IAM role
    const ZipFilePath = path.resolve(__dirname, "../", "../function.zip")
    console.log(ZipFilePath, LAMBDA_CONSTANTS);

    try {
        // Read the zip file
        const functionCode = readFileSync(ZipFilePath);

        // Try to create the function
        const createCommand = new CreateFunctionCommand({
            FunctionName: functionName,
            Runtime: "nodejs18.x",
            Role: roleArn,
            Handler: "index.functionHandler",
            Code: { ZipFile: functionCode },
            Environment: {
                Variables: {
                    SECRET_ACCESS_KEY: LAMBDA_CONSTANTS.AWS.SECRET_ACCESS_KEY,
                    ACCESS_KEY_ID:  LAMBDA_CONSTANTS.AWS.ACCESS_KEY_ID,
                    REGION:  LAMBDA_CONSTANTS.AWS.REGION,
                    ECS_ENDPOINT: LAMBDA_CONSTANTS.ECS.ENDPOINT,
                    ECS_CLUSTER_NAME: LAMBDA_CONSTANTS.ECS.CLUSTER_NAME,
                    ECS_UPLOADER_CONTAINER: LAMBDA_CONSTANTS.ECS.UPLOADER_CONTAINER,
                    ECS_UPLOADER_TASK_ARN: LAMBDA_CONSTANTS.ECS.UPLOADER_TASK_ARN,
                    ECS_UPLOADER_SUBNETS: LAMBDA_CONSTANTS.ECS.UPLOADER_SUBNETS
                },
            },
        });

        await lambda.send(createCommand);
        console.log("Lambda function deployed successfully!");
    } catch (error: any) {
        if (error.name === "ResourceConflictException") {
            console.log("Lambda function already exists. Updating the code...");

            const updateCommand = new UpdateFunctionCodeCommand({
                FunctionName: functionName,
                ZipFile: readFileSync(ZipFilePath),
            });

            await lambda.send(updateCommand);
            console.log("Lambda function updated successfully!");
        } else {
            console.error("Error deploying Lambda function:", error);
        }
    }
}

DeployLambda()