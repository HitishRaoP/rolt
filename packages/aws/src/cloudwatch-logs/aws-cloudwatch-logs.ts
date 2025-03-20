import {
    CloudWatchLogsClient,
    CreateLogGroupCommand,
    CreateLogStreamCommand,
    PutSubscriptionFilterCommand,
} from "@aws-sdk/client-cloudwatch-logs";
import { AWS_CONSTANTS } from "../constants/aws-constants";

const cloudwatchLogsClient = new CloudWatchLogsClient({
    region: AWS_CONSTANTS.AWS.REGION,
    credentials: {
        accessKeyId: AWS_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: AWS_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
    endpoint: AWS_CONSTANTS.CLOUDWATCH_LOGS.ENDPOINT,
});

export const CreateBuildGroup = async () => {
    try {
        /**
         * Creating the Log Group
         */
        await cloudwatchLogsClient.send(
            new CreateLogGroupCommand({
                logGroupName: AWS_CONSTANTS.CLOUDWATCH_LOGS.BUILD_GROUP
            })
        );
        console.log(`Log Group ${AWS_CONSTANTS.CLOUDWATCH_LOGS.BUILD_GROUP} created`);

        /**
         * Creating the Log Stream
         */
        await cloudwatchLogsClient.send(
            new CreateLogStreamCommand({
                logGroupName: AWS_CONSTANTS.CLOUDWATCH_LOGS.BUILD_GROUP,
                logStreamName: AWS_CONSTANTS.CLOUDWATCH_LOGS.BUILD_STREAM,
            })
        );
        console.log(`Log Stream ${AWS_CONSTANTS.CLOUDWATCH_LOGS.BUILD_STREAM} created`);

        /**
         * Creating the Subscription to send the build logs to kinesis
         */
        await cloudwatchLogsClient.send(
            new PutSubscriptionFilterCommand({
                logGroupName: AWS_CONSTANTS.CLOUDWATCH_LOGS.BUILD_GROUP,
                filterName: AWS_CONSTANTS.CLOUDWATCH_LOGS.BUILD_FILTER,
                filterPattern: "",
                destinationArn: `arn:aws:kinesis:${AWS_CONSTANTS.AWS.REGION}:${AWS_CONSTANTS.AWS.ACCOUNT_ID}:stream/${AWS_CONSTANTS.KINESIS.BUILD_STREAM}`,
                roleArn: `arn:aws:iam::${AWS_CONSTANTS.AWS.ACCOUNT_ID}:role/${AWS_CONSTANTS.IAM.CLOUDWATCH_KINESIS_ROLE}`,
            })
        );
        console.log(`Subscription filter created to stream logs to Kinesis`);

    } catch (error) {
        console.error("Error creating build group and connecting to Kinesis:", error);
    }
};