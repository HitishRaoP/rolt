import { exec } from 'child_process';
import axios from 'axios';
import path from 'path';

/**
 * CONSTANTS
 */
const LOG_SERVER_SMEE = 'https://smee.io/R7CnnfFPlA0XiBv'
const ENTRYPOINT_PATH = 'entrypoint.sh'

async function logToServer(logMessage: string, type: "error" | "info" = "info") {
    try {
        const logPayload = {
            log: logMessage,
            deploymentId: process.env.DEPLOYMENT_ID,
            timestamp: new Date().toISOString(),
            type,
        };
        console.log(logPayload);
        await axios.post(LOG_SERVER_SMEE, logPayload);
    } catch (error) {
        console.error('Error sending logs to the server', error);
    }
}

function runShellScript(scriptPath: string, env: NodeJS.ProcessEnv): Promise<void> {
    return new Promise((resolve, reject) => {
        const process = exec(`sh ${scriptPath}`, { env });
        let output = '';

        process.stdout?.on('data', (data) => {
            output += data;
            logToServer(data, "info");
        });
        process.stderr?.on('data', (data) => {
            output += data;
            logToServer(data, "error");
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve();
                logToServer('Shell script completed successfully.');
            } else {
                reject(`Shell script failed with exit code ${code}`);
                logToServer(`Shell script failed with exit code ${code}`);
            }
        });
    });
}

async function main() {
    const scriptPath = path.join(__dirname, "../", ENTRYPOINT_PATH);
    console.log(scriptPath);

    const env = {
        ...process.env,
    };

    try {
        console.log('Starting shell script...');
        await runShellScript(scriptPath, env);
        console.log('Script executed successfully!');
    } catch (error) {
        console.error('Error executing the script:', error);
    }
}

main();
