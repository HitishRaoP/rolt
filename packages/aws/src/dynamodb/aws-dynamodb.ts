import { CreateTableCommand, DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { AWS_CONSTANTS } from "../constants/aws-constants";

const dynamoDBClient = new DynamoDBClient(
    {
        region: AWS_CONSTANTS.AWS.REGION,
        credentials: {
            accessKeyId: AWS_CONSTANTS.AWS.ACCESS_KEY_ID,
            secretAccessKey: AWS_CONSTANTS.AWS.SECRET_ACCESS_KEY,
        },
        endpoint: AWS_CONSTANTS.DYNAMODB.ENDPOINT,
    }
);

export const CreateBuildLogsTable = async () => {
    try {
        const command = new CreateTableCommand({
            TableName: AWS_CONSTANTS.DYNAMODB.BUILD_LOGS_TABLE,
            KeySchema: [
                { AttributeName: "deploymentId", KeyType: "HASH" }
            ],
            AttributeDefinitions: [
                { AttributeName: "deploymentId", AttributeType: "S" }
            ],
        });
        const response = await dynamoDBClient.send(command);
        console.log({
            message: "Build logs table created successfully",
            response
        });

    } catch (error) {
        console.log("Error Creating Deployment Logs Table", error);
    }
}

export const CreateProductionLogsTable = async () => {
    try {
        const command = new CreateTableCommand({
            TableName: AWS_CONSTANTS.DYNAMODB.PRODUCTION_LOGS_TABLE,
            KeySchema: [
                { AttributeName: "deploymentId", KeyType: "HASH" }
            ],
            AttributeDefinitions: [
                { AttributeName: "deploymentId", AttributeType: "S" }
            ],
        });
        const response = await dynamoDBClient.send(command);
        console.log({
            message: "Production logs table created successfully",
            response
        });
    } catch (error) {
        console.log("Error Creating Deployment Logs Table", error);
    }
}
