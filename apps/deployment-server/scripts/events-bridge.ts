import {
	EventBridgeClient,
	ListRulesCommand,
	PutRuleCommand,
	PutTargetsCommand,
} from '@aws-sdk/client-eventbridge';
import { DEPLOYMENT_SERVER_CONSTANTS } from '../src/constants/deployment-server-constants';

const eventBridgeClient = new EventBridgeClient({
	region: DEPLOYMENT_SERVER_CONSTANTS.AWS.REGION,
	credentials: {
		accessKeyId: DEPLOYMENT_SERVER_CONSTANTS.AWS.ACCESS_KEY_ID,
		secretAccessKey: DEPLOYMENT_SERVER_CONSTANTS.AWS.SECRET_ACCESS_KEY,
	},
	endpoint: DEPLOYMENT_SERVER_CONSTANTS.EVENTS_BRIDGE.ENDPOINT,
});

export const CreateRule = async () => {
	try {
		const command = new PutRuleCommand({
			Name: DEPLOYMENT_SERVER_CONSTANTS.EVENTS_BRIDGE.CREATE_DEPLOYMENT_RULE,
			State: 'ENABLED',
			EventBusName: DEPLOYMENT_SERVER_CONSTANTS.EVENTS_BRIDGE.BUS_NAME,
			EventPattern: JSON.stringify({
				source: ['aws.sqs'],
			}),
		});
		const response = await eventBridgeClient.send(command);
		console.log({
			message: 'Events Bridge Rule Created Successfully',
			response,
		});
	} catch (error) {
		console.log('Error Creating Rule', error);
	}
};

export const CreateTarget = async () => {
	try {
		/**
		 * Command to get the Rule Arn
		 */
		const listRulesCommand = new ListRulesCommand({
			NamePrefix: DEPLOYMENT_SERVER_CONSTANTS.EVENTS_BRIDGE.CREATE_DEPLOYMENT_RULE,
			EventBusName: DEPLOYMENT_SERVER_CONSTANTS.EVENTS_BRIDGE.BUS_NAME,
			Limit: 1,
		});
		const { Rules } = await eventBridgeClient.send(listRulesCommand);

		/**
		 * Command to Create the target
		 */
		const createTargetCommand = new PutTargetsCommand({
			Rule: DEPLOYMENT_SERVER_CONSTANTS.EVENTS_BRIDGE.CREATE_DEPLOYMENT_RULE,
			EventBusName: DEPLOYMENT_SERVER_CONSTANTS.EVENTS_BRIDGE.BUS_NAME,
			Targets: [
				{
					Id: DEPLOYMENT_SERVER_CONSTANTS.EVENTS_BRIDGE.CREATE_DEPLOYMENT_TARGET,
					Arn: Rules?.at(0)?.Arn,
				},
			],
		});
		const response = await eventBridgeClient.send(createTargetCommand);
		console.log({
			message: 'Events Bridge Target Created Successfully',
			response,
		});
	} catch (error) {
		console.log('Error Creating Rule', error);
	}
};
