import {
    CreateClusterCommand,
    DeleteClusterCommand,
    DeregisterTaskDefinitionCommand,
    ECSClient,
    RegisterTaskDefinitionCommand,
    RegisterTaskDefinitionCommandInput
} from "@aws-sdk/client-ecs";
import { AWS_CONSTANTS } from "../constants/aws-constants"

const ecsClient = new ECSClient({
    region: AWS_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: AWS_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: AWS_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: AWS_CONSTANTS.ECS.ENDPOINT,
})

export const CreateCluster = async () => {
    try {
        const command = new CreateClusterCommand({
            clusterName: AWS_CONSTANTS.ECS.CLUSTER_NAME
        })
        const response = await ecsClient.send(command)
        console.log({
            message: "ECS Cluster Created Successfully",
            response
        });
    } catch (error) {
        console.error('Error Creating Cluster:', error);
    }
}

export const CreateTask = async (): Promise<void> => {

    const environmentVariables = [
        { name: 'SECRET_ACCESS_KEY', value: 'test' },
        { name: 'ACCESS_KEY_ID', value: 'test' },
        { name: 'REGION', value: 'us-east-1' },
        { name: 'S3_BUCKET', value: 'rolt-bucket' },
        { name: 'S3_ENDPOINT', value: `http://host.docker.internal:4566` }
    ];
    try {
        const input: RegisterTaskDefinitionCommandInput = {
            family: AWS_CONSTANTS.ECS.UPLOADER_FAMILY,
            networkMode: "awsvpc",
            containerDefinitions: [
                {
                    name: AWS_CONSTANTS.ECS.UPLOADER_CONTAINER,
                    image: AWS_CONSTANTS.ECS.UPLOADER_IMAGE,
                    essential: true,
                    environment: environmentVariables,
                }
            ],
            requiresCompatibilities: [
                "FARGATE"
            ],
        }

        const command = new RegisterTaskDefinitionCommand(input);
        const response = await ecsClient.send(command);
        console.log({
            message: "Task Created Successfully",
            response,
        });
    } catch (error) {
        console.error("Error Creating Task:", error);
    }
};

export const DeleteTask = async () => {
    try {
        const command = new DeregisterTaskDefinitionCommand({
            taskDefinition: "arn:aws:ecs:us-east-1:000000000000:task-definition/rolt-uploader:1",
        });
        const response = await ecsClient.send(command);
        console.log({
            message: "Task Deleted Successfully",
            response,
        });
    } catch (error) {
        console.error("Error Deleting Task:", error);
    }
};


export const DeleteCluster = async () => {
    try {
        const command = new DeleteClusterCommand({
            cluster: "rolt",
        });
        const response = await ecsClient.send(command);
        console.log({
            message: "ECS Cluster Deleted Successfully",
            response,
        });
    } catch (error) {
        console.error("Error Deleting Cluster:", error);
    }
};