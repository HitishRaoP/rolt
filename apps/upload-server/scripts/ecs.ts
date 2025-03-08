import { CreateTaskSetCommand, ECSClient, ListTasksCommand } from "@aws-sdk/client-ecs";
import { UPLOAD_SERVER_CONSTANTS } from "../src/constants/upload-server-constants";

const ecsClient = new ECSClient({
    region: UPLOAD_SERVER_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: UPLOAD_SERVER_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: UPLOAD_SERVER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: UPLOAD_SERVER_CONSTANTS.ECS.ENDPOINT,
});

export const createTask = async () => {
    try {
        const command = new CreateTaskSetCommand({})
    } catch (error) {
        console.error("Error Creating Bucket:", error);
    }
}
const params = {
    /** input parameters */
};
const command = new ListTasksCommand(params);