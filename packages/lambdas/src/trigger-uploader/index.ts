import { RunTaskCommand } from "@aws-sdk/client-ecs";
import { SQSEvent, SQSHandler, SQSRecord } from "aws-lambda";

export const functionHandler: SQSHandler = async (
  event: SQSEvent,
): Promise<void> => {
  for (const message of event.Records) {
    await processMessageAsync(message);
  }
  console.info("done");
};

/**
 * Trigger the fargate task
 */
async function processMessageAsync(message: SQSRecord) {
  try {
    console.log(`Processed message ${message.body}`);
    const command = new RunTaskCommand({
      cluster: LAMBDA_TRIGGER_CONSTANTS.ECS.CLUSTER_NAME,
      taskDefinition: LAMBDA_TRIGGER_CONSTANTS.ECS.TASK_DEFINITION,
      launchType: "FARGATE",
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: LAMBDA_TRIGGER_CONSTANTS.ECS.SUBNETS,
        },
      },
      overrides: {
        containerOverrides: [
          {
            name: LAMBDA_TRIGGER_CONSTANTS.ECS.CONTAINER_NAME,
            environment: [
              { name: "ENV_VAR_1", value: "VALUE_1" },
              { name: "ENV_VAR_2", value: "VALUE_2" },
            ],
          },
        ],
      },
    });

  } catch (err) {
    console.error("An error occurred");
    throw err;
  }
}

