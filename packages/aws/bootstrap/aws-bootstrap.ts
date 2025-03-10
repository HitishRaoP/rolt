import { createCluster } from "../src/ecs/aws-ecs";

const prepare = async () => {
    try {
        await Promise.all([
            createCluster()
        ]);
        console.log('AWS Requirements are initialised Successfully');
    } catch (error) {
        console.error('Error in prepare function:', error);
    }
};

prepare();
