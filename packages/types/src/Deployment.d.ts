export type CreateDeployment = {
	owner: string;
	repo: string;
	ref: string;
	buildCommand?: string;
	startCommand?: string;
};

export type CreateDeploymentResponse = CreateDeployment & {
	deploymentId: string;
};

export type BuildLog = {
	deploymentId: string;
	timestamp: number;
	timezone: string;
	log: string
};
