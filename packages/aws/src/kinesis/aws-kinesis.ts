import { CreateStreamCommand, KinesisClient } from "@aws-sdk/client-kinesis";
import { AWS_CONSTANTS } from "../constants/aws-constants";

const kinesisClient = new KinesisClient({
    region: AWS_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: AWS_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: AWS_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: AWS_CONSTANTS.KINESIS.ENDPOINT,
});

export const CreateBuildStream = async () => {
    try {
        const command = new CreateStreamCommand({
            StreamName : AWS_CONSTANTS.KINESIS.BUILD_STREAM
        });
        const response = await kinesisClient.send(command);
        console.log({
            message: "Build stream created successfully",
            response
        });
        
    } catch (error) {
        console.log("Error Creating build stream", error);
    }
}