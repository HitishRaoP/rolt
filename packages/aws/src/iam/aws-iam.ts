import { CreateRoleCommand, IAMClient, ListGroupsCommand, ListRolesCommand } from "@aws-sdk/client-iam";
import { AWS_CONSTANTS } from "../constants/aws-constants";

const iamClient = new IAMClient(
    {
        region: AWS_CONSTANTS.AWS.REGION,
        credentials: {
            accessKeyId: AWS_CONSTANTS.AWS.ACCESS_KEY_ID,
            secretAccessKey: AWS_CONSTANTS.AWS.SECRET_ACCESS_KEY,
        },
        endpoint: AWS_CONSTANTS.IAM.ENDPOINT,
    }
);

export const CreateRole = async (RoleName: string) => {
    try {
        const command = new CreateRoleCommand({
            RoleName,
            AssumeRolePolicyDocument: JSON.stringify({
                Version: AWS_CONSTANTS.IAM.VERSION,
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: { Service: 'lambda.amazonaws.com' },
                        Action: 'sts:AssumeRole'
                    }
                ]
            })
        })
        const response = await iamClient.send(command);
        console.log({
            message: "IAM Role Created Successfully",
            response
        });

    } catch (error) {
        console.log("Error Creating Role", error);
    }
}

export const ListRoles = async () => {
    try {
        const command = new ListRolesCommand({});
        const response = await iamClient.send(command);
        console.log({
            message: "IAM Roles Listed Successfully",
            roles: response.Roles
        });
    } catch (error) {
        console.log("Error Listing Roles", error);
    }
};
