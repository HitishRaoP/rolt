import { AWS_CONSTANTS } from "../src/constants/aws-constants";
import { CreateECRRepository } from "../src/ecr/aws-ecr";
import { CreateCluster } from "../src/ecs/aws-ecs";
import { CreateBucket } from "../src/s3/aws-s3";
import { CreateQueue } from "../src/sqs/aws-sqs";

const bootstrapAWS = async () => {
    try {
        await Promise.all([
            //ECR
            CreateECRRepository(),
            //ECS
            CreateCluster(),
            //S3
            CreateBucket(),
            //SQS
            CreateQueue({
                QueueName: AWS_CONSTANTS.SQS.QUEUES.UPLOADER
            }),
            CreateQueue({
                QueueName: AWS_CONSTANTS.SQS.QUEUES.DEPLOYER
            }),
        ]);
        console.log('AWS Requirements are initialised Successfully');
    } catch (error) {
        console.error('Error in prepare function:', error);
    }
};

bootstrapAWS();
