import { exec } from "child_process";

export class NextJSDeployer {
    static async download() {
         exec(
            "git clone https://github.com/HitishRaoP/nextjs-sample && cd nextjs-sample && npm install && npm build",
            (error, stdout, stderr) => {
                if (error) {
                    console.error(`Execution error: ${error}`);
                    return;
                }
                console.log(`stdout: ${stdout}`);
                console.error(`stderr: ${stderr}`);
            }
        );
    }
}

NextJSDeployer.download();