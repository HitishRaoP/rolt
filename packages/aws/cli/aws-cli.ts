import inquirer from 'inquirer';
import { CreateCluster, CreateTask, DeleteCluster, DeleteTask } from '../src/ecs/aws-ecs';
import { CreateQueue, DeleteQueue } from '../src/sqs/aws-sqs';
import { AWS_CONSTANTS } from '../src/constants/aws-constants';
import { CreateECRRepository, ListECRImages } from '../src/ecr/aws-ecr';
import { CreateBucket } from '../src/s3/aws-s3';
import { CreateRole, ListRoles } from '../src/iam/aws-iam';

type ServiceAction = () => Promise<void>;

type Service = {
    name: string;
    actions: Record<string, ServiceAction>;
};

type ServiceKey = 'ecs' | "sqs" | "ecr" | "s3" | "iam";

const services: Record<ServiceKey, Service> = {
    ecr: {
        name: "ECR",
        actions: {
            "Create ECR Repository": CreateECRRepository,
            "List ECR Images": ListECRImages
        }
    },
    ecs: {
        name: 'ECS',
        actions: {
            'Create ECS Cluster': CreateCluster,
            "Delete ECS Cluster": DeleteCluster,
            "Create ECS Task": CreateTask,
            "Delete ECS Task" : DeleteTask
        },
    },
    s3: {
        name: "S3",
        actions: {
            "Create S3 Bucket": CreateBucket
        }
    },
    sqs: {
        name: "SQS",
        actions: {
            "Create Uploader Queue": () => CreateQueue({ QueueName: AWS_CONSTANTS.SQS.QUEUES.UPLOADER }),
            "Create Deployer Queue": () => CreateQueue({ QueueName: AWS_CONSTANTS.SQS.QUEUES.DEPLOYER }),
            "Delete Uploader Queue": () => DeleteQueue({ QueueName: AWS_CONSTANTS.SQS.QUEUES.UPLOADER }),
            "Delete Deployer Queue": () => DeleteQueue({ QueueName: AWS_CONSTANTS.SQS.QUEUES.DEPLOYER })
        }
    },
    iam: {
        name: "IAM",
        actions: {
            "Create Role": CreateRole,
            "List Roles" : ListRoles
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
