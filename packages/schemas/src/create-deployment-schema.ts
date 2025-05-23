import z, { ZodType } from 'zod';
import { DeploymentRequest } from '@rolt/types/Deployment';

export const CreateDeploymentSchema = z.object({
	repo: z.string().min(1, 'Repository name cannot be empty'),
	owner: z.string().min(1, 'Owner name cannot be empty'),
	ref: z.string().min(1, 'Branch name cannot be empty').optional(),
}) satisfies ZodType<DeploymentRequest>;

export type CreateDeploymentType = z.infer<typeof CreateDeploymentSchema>;
