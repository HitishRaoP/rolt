import inquirer from 'inquirer';
import { createCluster, createTask } from '../src/ecs/aws-ecs';

type ServiceAction = () => Promise<void>;

type Service = {
    name: string;
    actions: Record<string, ServiceAction>;
};

type ServiceKey = 'ecs';

const services: Record<ServiceKey, Service> = {
    ecs: {
        name: 'ECS',
        actions: {
            'Create ECS Cluster': createCluster,
            "Create ECS Task": createTask
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
