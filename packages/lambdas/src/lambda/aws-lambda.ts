import { LambdaClient, CreateFunctionCommand, UpdateFunctionCodeCommand, CreateEventSourceMappingCommand } from "@aws-sdk/client-lambda";
import { readFileSync } from "fs";
import { LAMBDA_CONSTANTS } from "../constants/lambdas-constants";
import path from "path";

const lambdaClient = new LambdaClient({
    region: LAMBDA_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: LAMBDA_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: LAMBDA_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: LAMBDA_CONSTANTS.ECS.ENDPOINT,
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
        const functionCode = readFileSync(ZipFilePath);
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
    } catch (error: any) {
        if (error.name === "ResourceConflictException") {
            const updateCommand = new UpdateFunctionCodeCommand({
                FunctionName: functionName,
                ZipFile: readFileSync(ZipFilePath),
            });
            await lambdaClient.send(updateCommand);
            console.log("Lambda function updated successfully!");
        } else {
            console.error("Error deploying Lambda function:", error);
        }
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