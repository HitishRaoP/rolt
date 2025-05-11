import { Project } from "./Project";

export type Environment = "Production" | "Development"

export type RoltStatus = "Queued" | "Error" | "Pending" | "Ready"

export type Deployment = {
	deploymentId: string;
	checkRunId: number;
	status: RoltStatus
	gitMetadata: {
		commitSha: string;
		commitMessage: string;
		commitRef: string
		commitAuthorName: string
	}
	domains: {
		project: string;
		deploymentSha: string;
		commitSha: string
	}
	environment: Environment
	isCurrent: boolean
	projectId: string;
	createdAt: string
	updatedAt: string
};

export type DeploymentRequest = {
	owner: string
	repo: string
	ref?: string
}

export type DeploymentExtended = Deployment & Pick<Project, "installation"> & DeploymentRequest

export type EventType = "push" | "installation"

export type GithubDeployment = DeploymentRequest & Pick<Deployment, "deploymentId" | "gitMetadata">

export type GithubCheckStatus = "completed" | "in_progress" | "queued"

export type GithubCheckConclusion = "action_required" | "cancelled" | "failure" | "neutral" | "success" | "skipped" | "stale" | "timed_out"

export type GithubCheck = DeploymentRequest & {
	status: GithubCheckStatus
	conclusion?: GithubCheckConclusion
	title: string
	summary: string
} & Pick<Deployment, 'gitMetadata' | "checkRunId">