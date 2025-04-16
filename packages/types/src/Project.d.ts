export type FrameworkType = "Vite" | "Next.js" | "Express.js" | "Other"

export type Project = {
    name: string
    framework: FrameworkType
    rootDir: string
    settings?: {
        installCommand?: string
        buildCommand?: string
        outDir?: string
    }
}