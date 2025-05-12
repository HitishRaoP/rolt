import { deploymentDB } from "../db/client.js";
import { RoltStatus } from "@rolt/types/Deployment";
import { clients } from "../controllers/deployment.controller.js";
import { SSE } from "@rolt/utils";
import { interval } from "./interval.js";

export type UpdateStatusProps = {
    deploymentId: string;
    status: RoltStatus;
};

export const updateStatus = async ({
    deploymentId,
    status,
}: UpdateStatusProps) => {
    const updatedDeployment = await deploymentDB.deployment.update({
        where: { deploymentId },
        data: { status },
    });

    const remainingClients: typeof clients = [];

    for (const client of clients) {
        if (client.deploymentId === deploymentId) {
            /**
             * Send updated status
             */
            SSE(client.res, { type: "STATUS", status });

            /**
             * Send the timer
             */
            if (status === "Ready" || status === "Error") {
                const time = interval(updatedDeployment.createdAt, updatedDeployment.updatedAt);
                SSE(client.res, { type: "TIMER", time });
                /**
                 * Clearing the Timer
                 */
                if (client.timer) clearInterval(client.timer);
                client.res.end();
                continue;
            }
        }
        remainingClients.push(client);
    }

    clients.length = 0;
    clients.push(...remainingClients);
};
