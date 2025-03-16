import { readFileSync } from 'fs';
import path from 'path';
import {
    LambdaClient,
    GetFunctionCommand,
    UpdateFunctionCodeCommand,
    UpdateFunctionConfigurationCommand,
    CreateFunctionCommand,
    CreateEventSourceMappingCommand
} from "@aws-sdk/client-lambda";
import { LAMBDA_CONSTANTS } from '../constants/lambdas-constants';

const lambdaClient = new LambdaClient({
    region: LAMBDA_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: LAMBDA_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: LAMBDA_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: LAMBDA_CONSTANTS.LAMBDA.ENDPOINT,
});

export async function DeployLambda({
    functionName,
    roleArn
}: {
    functionName: string,
    roleArn: string
}) {
    try {
        const ZipFilePath = path.resolve(__dirname, "../", "functions/", `${functionName}/`, "dist/", "index.zip")
        const functionCode = readFileSync(ZipFilePath);

        try {
            const getCommand = new GetFunctionCommand({ FunctionName: functionName });
            await lambdaClient.send(getCommand);

            console.log(`Updating existing Lambda function: ${functionName}`);

            // Update function code
            const updateCodeCommand = new UpdateFunctionCodeCommand({
                FunctionName: functionName,
                ZipFile: functionCode,
            });
            await lambdaClient.send(updateCodeCommand);

            // Update function configuration
            const updateConfigCommand = new UpdateFunctionConfigurationCommand({
                FunctionName: functionName,
                Runtime: "nodejs22.x",
                Handler: "index.handler",
                Role: roleArn,
                Environment: {
                    Variables: {
                        SECRET_ACCESS_KEY: LAMBDA_CONSTANTS.AWS.SECRET_ACCESS_KEY,
                        ACCESS_KEY_ID: LAMBDA_CONSTANTS.AWS.ACCESS_KEY_ID,
                        REGION: LAMBDA_CONSTANTS.AWS.REGION,
                        ECS_ENDPOINT: LAMBDA_CONSTANTS.ECS.ENDPOINT,
                        ECS_CLUSTER_NAME: LAMBDA_CONSTANTS.ECS.CLUSTER_NAME,
                        ECS_UPLOADER_CONTAINER: LAMBDA_CONSTANTS.ECS.UPLOADER_CONTAINER,
                        ECS_UPLOADER_TASK_ARN: LAMBDA_CONSTANTS.ECS.UPLOADER_TASK_ARN,
                        ECS_UPLOADER_SUBNETS: LAMBDA_CONSTANTS.ECS.UPLOADER_SUBNETS
                    },
                },
            });
            await lambdaClient.send(updateConfigCommand);

            console.log("Lambda function code and configuration updated successfully!");
        } catch (getFunctionError: any) {
            if (getFunctionError.name === "ResourceNotFoundException") {
                console.log(`Lambda function "${functionName}" does not exist. Creating a new one...`);

                // Create Lambda function
                const createCommand = new CreateFunctionCommand({
                    FunctionName: functionName,
                    Runtime: "nodejs22.x",
                    Handler: "index.handler",
                    Role: roleArn,
                    Code: { ZipFile: functionCode },
                    Environment: {
                        Variables: {
                            SECRET_ACCESS_KEY: LAMBDA_CONSTANTS.AWS.SECRET_ACCESS_KEY,
                            ACCESS_KEY_ID: LAMBDA_CONSTANTS.AWS.ACCESS_KEY_ID,
                            REGION: LAMBDA_CONSTANTS.AWS.REGION,
                            ECS_ENDPOINT: LAMBDA_CONSTANTS.ECS.ENDPOINT,
                            ECS_CLUSTER_NAME: LAMBDA_CONSTANTS.ECS.CLUSTER_NAME,
                            ECS_UPLOADER_CONTAINER: LAMBDA_CONSTANTS.ECS.UPLOADER_CONTAINER,
                            ECS_UPLOADER_TASK_ARN: LAMBDA_CONSTANTS.ECS.UPLOADER_TASK_ARN,
                            ECS_UPLOADER_SUBNETS: LAMBDA_CONSTANTS.ECS.UPLOADER_SUBNETS
                        },
                    },
                });

                await lambdaClient.send(createCommand);
                console.log("Lambda function deployed successfully!");
            } else {
                throw getFunctionError;
            }
        }
    } catch (error: any) {
        console.error("Error deploying Lambda function:", error);
    }
}

export const createUploaderMapping = async ({
    functionName,
    eventSourceArn
}: {
    functionName: string,
    eventSourceArn: string
}) => {
    try {
        const command = new CreateEventSourceMappingCommand({
            FunctionName: functionName,
            EventSourceArn: eventSourceArn,
            Enabled: true,
        });
        const response = await lambdaClient.send(command);
        console.log({
            message: "Event source mapping for the uploader created Successfully",
            response
        });

    } catch (error) {
        console.log("Error Creating event source mapping for the uploader", error);
    }
}