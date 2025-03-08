import { CreateDeploymentType } from "@rolt/schemas";
import { UploadService } from "./tasks/create-deployment-task";

// Sample deployment details
const deploymentDetails: CreateDeploymentType = {
    owner: "your-github-username",
    repo: "your-repo-name",
    ref: "main"
};

(async () => {
    try {
        const uploadService = new UploadService(deploymentDetails);
        await uploadService.upload();
    } catch (error) {
        console.error("Error:", error);
    }
})();
