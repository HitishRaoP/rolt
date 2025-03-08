import { CreateQueueCommand, SQSClient } from "@aws-sdk/client-sqs";
import { UPLOAD_SERVER_CONSTANTS } from "../constants/upload-server-constants";

const sqsClient = new SQSClient({
    region: UPLOAD_SERVER_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: UPLOAD_SERVER_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: UPLOAD_SERVER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: UPLOAD_SERVER_CONSTANTS.SQS.SQS_ENDPOINT,
});

export const CreateQueue = async () => {
    try {
        const command = new CreateQueueCommand({
            QueueName: UPLOAD_SERVER_CONSTANTS.SQS.SQS_QUEUE_NAME
        })
        const response = await sqsClient.send(command);
        console.log({
            message: "SQS Queue Created Successfully",
            response
        });
    } catch (error) {
        throw new Error(`${error}`)
    }
}