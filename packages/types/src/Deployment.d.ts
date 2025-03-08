export type CreateDeployment = {
    owner: string;
    repo: string;
    ref: string;
}

export type CreateDeploymentResponse = CreateDeployment &
{
    deploymentId: string
}