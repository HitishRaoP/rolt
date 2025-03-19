import { readFileSync } from 'fs';
import path from 'path';
import {
    LambdaClient,
    UpdateFunctionCodeCommand,
    UpdateFunctionConfigurationCommand,
    CreateFunctionCommand,
    CreateEventSourceMappingCommand,
} from "@aws-sdk/client-lambda";
import { LAMBDA_CONSTANTS } from '../constants/lambdas-constants';
import { DescribeSubnetsCommand, EC2Client } from "@aws-sdk/client-ec2"

async function getVariables() {
    return {
        SECRET_ACCESS_KEY: LAMBDA_CONSTANTS.AWS.SECRET_ACCESS_KEY,
        ACCESS_KEY_ID: LAMBDA_CONSTANTS.AWS.ACCESS_KEY_ID,
        REGION: LAMBDA_CONSTANTS.AWS.REGION,
        ECS_ENDPOINT: LAMBDA_CONSTANTS.ECS.ENDPOINT,
        ECS_CLUSTER_NAME: LAMBDA_CONSTANTS.ECS.CLUSTER_NAME,
        ECS_UPLOADER_CONTAINER: LAMBDA_CONSTANTS.ECS.UPLOADER_CONTAINER,
        ECS_UPLOADER_TASK_ARN: LAMBDA_CONSTANTS.ECS.UPLOADER_TASK_ARN,
        ECS_UPLOADER_SUBNETS: (await getSubnets())?.at(0)?.subnetId as string,
    }
}

const lambdaClient = new LambdaClient({
    region: LAMBDA_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: LAMBDA_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: LAMBDA_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: LAMBDA_CONSTANTS.LAMBDA.ENDPOINT,
});

const ec2Client = new EC2Client({
    region: LAMBDA_CONSTANTS.AWS.REGION,
    endpoint: LAMBDA_CONSTANTS.EC2.ENDPOINT,
    credentials: {
        accessKeyId: LAMBDA_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: LAMBDA_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
});

async function getSubnets() {
    try {
        const response = await ec2Client.send(new DescribeSubnetsCommand({}));
        return response.Subnets?.map((subnet) => ({
            subnetId: subnet.SubnetId,
            vpcId: subnet.VpcId,
            cidrBlock: subnet.CidrBlock,
            availabilityZone: subnet.AvailabilityZone,
            tags: subnet.Tags,
        }));
    } catch (error) {
        console.error("Error fetching subnets:", error);
        return [];
    }
}

export async function DeployLambda({
    functionName,
    roleArn
}: {
    functionName: string,
    roleArn: string
}) {
    const ZipFilePath = path.resolve(__dirname, "../functions/", `${functionName}/dist/index.zip`);
    const functionCode = readFileSync(ZipFilePath);
    try {
        console.log(`Creating Lambda function "${functionName}"...`);
        const createCommand = new CreateFunctionCommand({
            FunctionName: functionName,
            Runtime: "nodejs22.x",
            Handler: "index.handler",
            Role: roleArn,
            Code: { ZipFile: functionCode },
            Environment: {
                Variables: await getVariables()
            },
        });

        await lambdaClient.send(createCommand);
        console.log("Lambda function created successfully!");
    } catch (error: any) {
        console.error("Error deploying Lambda function:", error);
    }
}

export async function UpdateLambda({
    functionName,
}: {
    functionName: string,
}) {
    const ZipFilePath = path.resolve(__dirname, "../functions/", `${functionName}/dist/index.zip`);
    const functionCode = readFileSync(ZipFilePath);
    try {
        const updateCodeCommand = new UpdateFunctionCodeCommand({
            FunctionName: functionName,
            ZipFile: functionCode,
        });
        await lambdaClient.send(updateCodeCommand);
        console.log("Lambda function code updated successfully!");
    } catch (error: any) {
        console.error("AWS Lambda Service Error:", error.message);
    }
}

export async function UpdateLambdaConfiguration({
    functionName,
}: {
    functionName: string,
}) {
    try {
        const updateCodeCommand = new UpdateFunctionConfigurationCommand({
            FunctionName: functionName,
            Environment: {
                Variables: await getVariables()

            },
        });
        const response = await lambdaClient.send(updateCodeCommand);
        console.log({
            message: "Lambda function configuration updated successfully!",
            response
        }
        );
    } catch (error: any) {
        console.error("AWS Lambda Service Error:", error.message);
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