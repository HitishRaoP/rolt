import inquirer from 'inquirer';
import { createUploaderMapping, DeployLambda } from '../src/lambda/aws-lambda';
import { LAMBDA_CONSTANTS } from '../src/constants/lambdas-constants';

type ServiceAction = () => Promise<void>;

type Service = {
    name: string;
    actions: Record<string, ServiceAction>;
};

type ServiceKey = "lambda";

const services: Record<ServiceKey, Service> = {
    lambda: {
        name: "Lambda",
        actions: {
            "Deploy Uploader lambda": async () => {
                await DeployLambda({
                    functionName: LAMBDA_CONSTANTS.LAMBDA.UPLOADER_TRIGGER,
                    roleArn: LAMBDA_CONSTANTS.AWS.LAMBDA_S3_ROLE_ARN,
                });
            },
            "Create Event Uploader Source Mapping": () =>
                createUploaderMapping({
                    functionName: LAMBDA_CONSTANTS.LAMBDA.UPLOADER_TRIGGER,
                    eventSourceArn: LAMBDA_CONSTANTS.LAMBDA.UPLOADER_QUEUE_ARN,
                }),
        }
    }
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
