import inquirer from 'inquirer';
import { CreateBucket } from './s3';
import { CreateQueue, DeleteQueue } from './sqs';
import { CreateRule, CreateTarget } from './events-bridge';
import { CreateECRRepository, ListECRImages } from './ecr';

type ServiceAction = () => Promise<void>;

type Service = {
	name: string;
	actions: Record<string, ServiceAction>;
};

type ServiceKey = 's3' | 'sqs' | 'events_bridge' | 'ecr';

const services: Record<ServiceKey, Service> = {
	s3: {
		name: 'S3',
		actions: { 'Create Bucket': CreateBucket },
	},
	sqs: {
		name: 'SQS',
		actions: {
			'Create Queue': CreateQueue,
			'Delete Queue': DeleteQueue,
		},
	},
	events_bridge: {
		name: 'Events Bridge',
		actions: {
			'Create Rule': CreateRule,
			'Create Target': CreateTarget,
		},
	},
	ecr: {
		name: 'ECR',
		actions: {
			'Create Repository': CreateECRRepository,
			"List Images": ListECRImages
		},
	},
};

const main = async () => {
	while (true) {
		const { serviceKey } = await inquirer.prompt<{
			serviceKey: ServiceKey | 'exit';
		}>([
			{
				type: 'list',
				name: 'serviceKey',
				message: 'Select an AWS Service',
				choices: [
					...Object.entries(services).map(([key, { name }]) => ({
						name,
						value: key,
					})),
					{ name: 'Exit', value: 'exit' },
				],
			},
		]);

		if (serviceKey === 'exit') {
			console.log('Exiting...');
			break;
		}

		await handleService(serviceKey);
	}
};

const handleService = async (serviceKey: ServiceKey) => {
	const service = services[serviceKey];
	if (!service) return;

	const actions: Record<string, ServiceAction | null> = {
		...service.actions,
		Back: null,
	};

	while (true) {
		const { actionKey } = await inquirer.prompt<{ actionKey: string }>([
			{
				type: 'list',
				name: 'actionKey',
				message: `Select an action for ${service.name}`,
				choices: Object.keys(actions).map((key) => ({ name: key, value: key })),
			},
		]);

		if (actionKey === 'Back') break;
		await actions[actionKey]?.();
	}
};

main();
