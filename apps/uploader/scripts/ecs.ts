import { CreateClusterCommand, CreateTaskSetCommand, ECSClient, ListTasksCommand } from "@aws-sdk/client-ecs";
import { UPLOADER_CONSTANTS } from "../src/constants/uploader-constants.js";

const ecsClient = new ECSClient({
    region: UPLOADER_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: UPLOADER_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: UPLOADER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: UPLOADER_CONSTANTS.ECS.ENDPOINT,
})

export const createCluster = async () => {
    try {
        const command = new CreateClusterCommand({
            clusterName: UPLOADER_CONSTANTS.ECS.CLUSTER_NAME
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

export const createTask = async () => {
    try {
        const command = new CreateTaskSetCommand({
            cluster: UPLOADER_CONSTANTS.ECS.CLUSTER_NAME,
            service: "",
            taskDefinition: "ACTIVE"
        })
    } catch (error) {
        console.error('Error Creating Task:', error);
    }
}