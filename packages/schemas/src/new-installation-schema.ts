import z, { ZodType } from "zod";
import { Installation } from '@rolt/types/User';

export const NewInstallationSchema = z.object({
  id: z.number({
    required_error: "Installation ID is required.",
    invalid_type_error: "Installation ID must be a number.",
  }),
  owner: z.string({
    required_error: "Owner is required.",
    invalid_type_error: "Owner must be a string.",
  }),
  installationId: z.number({
    required_error: "GitHub installation ID is required.",
    invalid_type_error: "Installation ID must be a number.",
  }),
  ownerType: z.enum(["Bot", "User", "Organization"], {
    required_error: "Owner type is required.",
    invalid_type_error: "Owner type must be one of: Bot, User, or Organization.",
  }),
  provider: z.literal("Github", {
    required_error: "Provider is required.",
    invalid_type_error: "Provider must be 'Github'.",
  }),
  repositories: z
    .array(
      z.object({
        fullName: z.string({
          required_error: "Repository full name is required.",
          invalid_type_error: "Repository full name must be a string.",
        }),
        id: z.number({
          required_error: "Repository ID is required.",
          invalid_type_error: "Repository ID must be a number.",
        }),
        name: z.string({
          required_error: "Repository name is required.",
          invalid_type_error: "Repository name must be a string.",
        }),
        nodeId: z.string({
          required_error: "Repository node ID is required.",
          invalid_type_error: "Repository node ID must be a string.",
        }),
        private: z.boolean({
          required_error: "Repository privacy status is required.",
          invalid_type_error: "Private must be a boolean value.",
        }),
      }),
      {
        invalid_type_error: "Repositories must be an array of repository objects.",
      }
    )
    .optional(),
}) satisfies ZodType<Installation>;
