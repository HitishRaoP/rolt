import { Code2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ProjectCardProps {
    name: string
    deployUrl: string
    repoOwner: string
    branch: string
    lastDeployed: string
}

export function ProjectCard({ name, deployUrl, repoOwner, branch, lastDeployed }: ProjectCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
                <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center">
                        <Code2 className="h-4 w-4 text-gray-400" />
                    </div>
                    <h3 className="font-medium text-gray-300">{name}</h3>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                    >
                        <span className="sr-only">Analytics</span>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M8 16L12 12L16 16"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path d="M8 8H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full text-gray-400 hover:text-white hover:bg-gray-800"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More options</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-gray-950 border-gray-800 text-gray-300">
                            <DropdownMenuItem>View Project</DropdownMenuItem>
                            <DropdownMenuItem>Project Settings</DropdownMenuItem>
                            <DropdownMenuItem>Rename Project</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Delete Project</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 text-sm">
                <p className="text-gray-500">{deployUrl}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex items-center gap-2 text-sm text-gray-500">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M12 2C6.477 2 2 6.477 2 12C2 17.523 6.477 22 12 22C17.523 22 22 17.523 22 12C22 6.477 17.523 2 12 2ZM12 4C7.582 4 4 7.582 4 12C4 16.418 7.582 20 12 20C16.418 20 20 16.418 20 12C20 7.582 16.418 4 12 4Z"
                        fill="currentColor"
                    />
                    <circle cx="12" cy="12" r="4" fill="currentColor" />
                </svg>
                <span>{repoOwner}</span>
                <div className="h-1 w-1 rounded-full bg-gray-700" />
                <span>cashfree requirements</span>
                <div className="h-1 w-1 rounded-full bg-gray-700" />
                <span>{lastDeployed} on</span>
                <code className="bg-gray-900 px-1 rounded text-xs">{branch}</code>
            </CardFooter>
        </Card>
    )
}
