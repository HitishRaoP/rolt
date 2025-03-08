import { CreateBucket } from "./s3";
import { CreateQueue } from "./sqs";

const prepare = async () => {
    try {
        await CreateBucket();
        await CreateQueue();
        console.log("AWS Requirements are initialised Successfully");
    } catch (error) {
        console.error("Error in prepare function:", error);
    }
};

prepare();
