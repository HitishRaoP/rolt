import z from "zod";

export const GetRepoForImportSchema = z.object({
  owner: z.string({
    required_error: "Repository owner is required",
    invalid_type_error: "Owner must be a string",
  }).min(1, { message: "Owner cannot be empty" }),

  repo: z.string({
    required_error: "Repository name is required",
    invalid_type_error: "Repository name must be a string",
  }).min(1, { message: "Repository name cannot be empty" }),
});
