import { LambdaClient, CreateFunctionCommand, UpdateFunctionCodeCommand, CreateEventSourceMappingCommand, UpdateFunctionConfigurationCommand, LambdaServiceException, GetFunctionCommand } from "@aws-sdk/client-lambda";
import { readFileSync } from "fs";
import { LAMBDA_CONSTANTS } from "../constants/lambdas-constants";
import path from "path";

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
    ZipFilePath,
    roleArn
}: {
    functionName: string,
    ZipFilePath: string,
    roleArn: string
}) {
    try {
        console.log(LAMBDA_CONSTANTS);

        const functionCode = readFileSync(ZipFilePath);

        // Try to get the function to check if it exists
        try {
            const getCommand = new GetFunctionCommand({ FunctionName: functionName });
            await lambdaClient.send(getCommand);

            // Function exists, update both code and configuration
            const updateCodeCommand = new UpdateFunctionCodeCommand({
                FunctionName: functionName,
                ZipFile: readFileSync(ZipFilePath),
            });
            await lambdaClient.send(updateCodeCommand);

            // Update function configuration including environment variables
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
            // Function doesn't exist, create a new one
            if (getFunctionError.name === "ResourceNotFoundException") {
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
DeployLambda({
    functionName: LAMBDA_CONSTANTS.LAMBDA.UPLOADER_TRIGGER,
    roleArn: LAMBDA_CONSTANTS.AWS.LAMBDA_S3_ROLE_ARN,
    ZipFilePath: path.resolve(__dirname, "../", "../index.zip")
})