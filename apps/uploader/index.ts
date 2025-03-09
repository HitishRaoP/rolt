import { CreateDeploymentResponse } from "@rolt/types/Deployment";
import { UploadService } from "./src/services/uploader.service.js";

/**
 * Extracts deployment details from the Lambda event
 * In AWS ECS tasks triggered by Lambda, the event is passed through environment variables
 */
const getDeploymentDetailsFromLamda = async () => {
	try {
		const eventData = process.env.CREATE_DEPLOYMENT_DATA;

		if (!eventData) {
			throw new Error("No event data provided");
		}

		return JSON.parse(eventData) as CreateDeploymentResponse;
	} catch (error) {
		throw new Error(`Failed to parse deployment details: ${(error as Error).message}`);
	}
}

/**
 * Main entry point that receives events from AWS Lambda
 *
 * The Lambda function will invoke this container with deployment details
 * Once processing is complete, the container will exit
 */
export async function main() {
	try {
		console.log("Container started, processing deployment request");
		const deploymentDetails = await getDeploymentDetailsFromLamda()
		const uploadService = new UploadService(deploymentDetails);
		await uploadService.upload();
		console.log("Processing complete, container will now exit");
		process.exit(0);
	} catch (error) {
		console.error(`Error in container execution: ${(error as Error).message}`);
		process.exit(1);
	}
}
