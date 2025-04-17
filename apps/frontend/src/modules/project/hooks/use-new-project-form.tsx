import { zodResolver } from "@hookform/resolvers/zod"
import { NewProjectSchema } from "@rolt/schemas"
import { Project } from "@rolt/types/Project"
import { useForm } from "react-hook-form"

export const useNewProjectForm = () => {
  const form = useForm<Project>({
    resolver: zodResolver(NewProjectSchema),
    defaultValues: {
      rootDir: "./"
    }
  })

  return {
    form
  }
}
