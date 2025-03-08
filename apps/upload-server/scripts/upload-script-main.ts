import inquirer from "inquirer";
import { CreateBucket } from "./s3";
import { CreateQueue } from "./sqs";

const main = async () => {
    while (1) {
        const { Main } = await inquirer.prompt([
            {
                type: "list",
                name: "Main",
                message: "Select an AWS Service",
                choices: [
                    { name: "S3", value: "s3" },
                    { name: "SQS", value: "sqs" },
                    { name: "Exit", value: "exit" },
                ],
            },
        ]);

        if (Main === "exit") {
            console.log("Exiting...");
            break;
        }

        await handleService(Main);
    }
};

const handleService = async (service: string) => {
    let choices;
    switch (service) {
        case "s3":
            choices = [
                { name: "Create Bucket", value: "create_bucket" },
                { name: "Back", value: "back" },
            ];
            break;
        case "sqs":
            choices = [
                { name: "Create Queue", value: "create_queue" },
                { name: "Back", value: "back" },
            ];
            break;
        default:
            return;
    }

    const { action } = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            message: `Select an action for ${service.toUpperCase()}`,
            choices,
        },
    ]);

    if (action === "back") return;

    switch (action) {
        case "create_bucket":
            await CreateBucket();
            break;
        case "create_queue":
            await CreateQueue();
            break;
        default:
            console.log("Invalid action.");
    }
};

main();
