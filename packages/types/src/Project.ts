export const FrameworkEnum = ["Vite", "Next.js", "Express.js", "Other"] as const;

export type FrameworkType = typeof FrameworkEnum[number]

export type Env = {
    key: string
    value: string
}

export type Project = {
    name: string
    framework: FrameworkType
    rootDir: string
    settings?: {
        installCommand?: string
        buildCommand?: string
        outDir?: string
    },
    env?: Env[]
}

