import { CreateBuildGroup } from "../src/cloudwatch-logs/aws-cloudwatch-logs";
import { AWS_CONSTANTS } from "../src/constants/aws-constants";
import { CreateBuildLogsTable, CreateProductionLogsTable } from "../src/dynamodb/aws-dynamodb";
import { createVPC } from "../src/ec2/aws-ec2";
import { CreateECRRepository } from "../src/ecr/aws-ecr";
import { CreateCluster, CreateTask } from "../src/ecs/aws-ecs";
import { CreateRole } from "../src/iam/aws-iam";
import { CreateBucket } from "../src/s3/aws-s3";
import { CreateQueue } from "../src/sqs/aws-sqs";

const bootstrapAWS = async () => {
    try {
        await Promise.all([
            //ECR
            CreateECRRepository(),
            //ECS
            CreateCluster(),
            CreateTask(),
            //S3
            CreateBucket(),
            //SQS
            CreateQueue({
                QueueName: AWS_CONSTANTS.SQS.QUEUES.UPLOADER
            }),
            CreateQueue({
                QueueName: AWS_CONSTANTS.SQS.QUEUES.DEPLOYER
            }),
            //IAM
            CreateRole(AWS_CONSTANTS.IAM.UPLOADER_TRIGGER_ROLE),
            CreateRole(AWS_CONSTANTS.IAM.CLOUDWATCH_KINESIS_ROLE),
            //EC2
            createVPC(),
            //DYNAMO DB
            CreateBuildLogsTable(),
            CreateProductionLogsTable(),
            //Cloudwatch logs
            CreateBuildGroup()
        ]);
        console.log('AWS Requirements are initialised Successfully');
    } catch (error) {
        console.error('Error in prepare function:', error);
    }
};

bootstrapAWS();
