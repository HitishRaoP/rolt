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
	checkRunId: number;
	installationId: number
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

export type GithubDeployment = CreateDeployment & Pick<CreateDeploymentResponse, "commitSha" | "deploymentId">

export type GithubCheckStatus = "completed" | "in_progress" | "queued"

export type GithubCheckConclusion = "action_required" | "cancelled" | "failure" | "neutral" | "success" | "skipped" | "stale" | "timed_out"

export type GithubCheck = CreateDeployment & {
	status: GithubCheckStatus
	conclusion?: GithubCheckConclusion
	title: string
	summary: string
} & Pick<CreateDeploymentResponse, "commitSha" | "checkRunId">