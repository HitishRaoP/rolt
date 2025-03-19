import { EC2Client, CreateVpcCommand, CreateSubnetCommand } from "@aws-sdk/client-ec2";
import { AWS_CONSTANTS } from "../constants/aws-constants";

const ec2Client = new EC2Client({
    region: AWS_CONSTANTS.AWS.REGION,
    endpoint: AWS_CONSTANTS.EC2.ENDPOINT,
    credentials: {
        accessKeyId: AWS_CONSTANTS.AWS.ACCESS_KEY_ID,
        secretAccessKey: AWS_CONSTANTS.AWS.SECRET_ACCESS_KEY,
    },
});

export async function createVPC() {
    try {
        const vpcResponse = await ec2Client.send(
            new CreateVpcCommand({
                CidrBlock: "10.0.0.0/16",
                TagSpecifications: [
                    {
                        ResourceType: "vpc",
                        Tags: [{ Key: "Name", Value: "rolt" }],
                    },
                ],
            })
        );

        const vpcId = vpcResponse.Vpc?.VpcId;
        console.log("VPC Created:", vpcId);

        if (!vpcId) {
            throw new Error("Failed to create VPC");
        }

        // Create a Subnet
        const subnetResponse = await ec2Client.send(
            new CreateSubnetCommand({
                VpcId: vpcId,
                CidrBlock: "10.0.1.0/24",
                TagSpecifications: [
                    {
                        ResourceType: "subnet",
                        Tags: [{ Key: "Name", Value: "rolt-subnet" }],
                    },
                ],
            })
        );

        console.log("Subnet Created:", subnetResponse.Subnet?.SubnetId);
        return { vpcId, subnetId: subnetResponse.Subnet?.SubnetId };
    } catch (error) {
        console.error("Error creating VPC:", error);
    }
}