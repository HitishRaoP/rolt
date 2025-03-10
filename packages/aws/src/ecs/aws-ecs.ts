import { CreateClusterCommand, ECSClient, RegisterTaskDefinitionCommand, RegisterTaskDefinitionCommandInput } from "@aws-sdk/client-ecs";
import { AWS_CONSTANTS } from "../constants/aws-constants"

const ecsClient = new ECSClient({
    region: AWS_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: AWS_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: AWS_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: AWS_CONSTANTS.ECS.ENDPOINT,
})

export const createCluster = async () => {
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

export const createTask = async (): Promise<void> => {
    try {
        const input: RegisterTaskDefinitionCommandInput = {
            family: AWS_CONSTANTS.ECS.UPLOADER_FAMILY,
            networkMode: "awsvpc",
            containerDefinitions: [
                {
                    name: AWS_CONSTANTS.ECS.UPLOADER_CONTAINER,
                    image: AWS_CONSTANTS.ECS.UPLOADER_IMAGE,
                    essential: true,
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
