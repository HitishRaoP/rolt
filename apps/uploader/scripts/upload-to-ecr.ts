import { exec } from "child_process";
import util from "util";
import inquirer from "inquirer";

const execPromise = util.promisify(exec);

async function runCommand(command: string) {
    console.log(`\n🟢 Running: ${command}`);
    return new Promise<void>((resolve, reject) => {
        const process = exec(command);

        process.stdout?.on("data", (data) => console.log(`📜 STDOUT: ${data.trim()}`));
        process.stderr?.on("data", (data) => console.error(`⚠️ STDERR: ${data.trim()}`));

        process.on("close", (code) => {
            if (code === 0) {
                console.log("✅ Command executed successfully!\n");
                resolve();
            } else {
                reject(new Error(`❌ Process exited with code ${code}`));
            }
        });
    });
}

export async function uploadToECR({ imageName }: { imageName: string }) {
    const repositoryUri = "000000000000.dkr.ecr.us-east-1.localhost.localstack.cloud:4566/rolt";

    try {
        console.log(`\n🔄 Tagging image: ${imageName} -> ${repositoryUri}`);
        await runCommand(`docker tag ${imageName} ${repositoryUri}`);

        console.log(`🚀 Pushing image to ECR...`);
        await runCommand(`docker push ${repositoryUri}`);

        console.log(`🎉 Successfully uploaded ${imageName} to ${repositoryUri}`);
    } catch (error) {
        console.error("❌ Error uploading image to ECR:", error);
    }
}