import { CreateECRRepository } from './ecr';
import { CreateRule, CreateTarget } from './events-bridge';
import { CreateBucket } from './s3';
import { CreateQueue } from './sqs';

const prepare = async () => {
	try {
		await Promise.all([
			CreateBucket(),
			CreateQueue(),
			CreateECRRepository(),
			CreateRule(),
			CreateTarget(),
		]);
		console.log('AWS Requirements are initialised Successfully');
	} catch (error) {
		console.error('Error in prepare function:', error);
	}
};

prepare();
