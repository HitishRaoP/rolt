export type CreateDeployment = {
	owner: string;
	repo: string;
	ref?: string;
	buildCommand?: string;
	startCommand?: string;
};

export type CreateDeploymentResponse = CreateDeployment & {
	deploymentId: string;
	commitSha: string;
	date: string;
	message: string;
	checkRunId: number
};

export type BuildLog = {
	deploymentId: string;
	timestamp: number;
	timezone: string;
	log: string
};

export type App = {
	owner: string
	installationId: Number
}

export type EventType = "push" | "installation"

export type GithubDeployment = CreateDeployment & {
	installationId: number
} & Pick<CreateDeploymentResponse, "commitSha" | "deploymentId">

export type GithubCheckStatus = "completed" | "in_progress" | "queued"

export type GithubCheck = CreateDeployment & {
	installationId: number
	status: GithubCheckStatus
	title: string
	summary: string
} & Pick<CreateDeploymentResponse, "commitSha" | "checkRunId">