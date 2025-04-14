import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { GithubBranch } from '@/components/ui/github-branch'
import { GithubRepoBadge } from '@/components/ui/github-repo-badge'
import { Text } from '@/components/ui/text'
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar'
import { Activity } from 'lucide-react'
import { BsThreeDots } from "react-icons/bs";
import { Link } from 'react-router'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from '@/components/ui/button'


/*
type ProjectCardProps = {
    name: string
    domain: string
    favion: string
    owner: string
    repo: string
    commitMessage: string
    updatedAt: number
    ref: string
}
*/

const PROJECT_NAV_LINKS = [
    {
        name: "Settings",
        path: '/settings/projectId'
    },
    {
        name: "Domains",
        path: '/domains/projectId'
    },
    {
        name: "View Logs",
        path: '/project/logs/projectId'
    },
    {
        name: "Add Favorite",
        path: '/project/logs/projectId'
    }
]

export const ProjectCard = () => {
    return (
        <Card className="shadow-none rounded-xl w-full max-w-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
                {/* Avatar */}
                <Avatar className="w-10 h-10">
                    <AvatarImage src="https://github.com/shadcn.png" className="rounded-lg" />
                    <AvatarFallback className='border'>CN</AvatarFallback>
                </Avatar>

                {/* Center Content */}
                <div className="flex flex-col flex-1 overflow-hidden">
                    <Text
                        content="instapark-listings-serverasdaaaaaaaaaaaaaaaaaaaa"
                        className="text-sm font-medium text-foreground truncate"
                    />
                    <Text
                        content="instapark-listings-server…aaaaaaaaaaa"
                        className="text-xs text-muted-foreground truncate"
                    />
                </div>

                {/* Right Icons */}
                <div className="flex items-center gap-4 shrink-0">
                    <Link to={"/logs"}>
                        <Activity className="w-7 h-7 text-muted-foreground p-1 rounded-full outline-4" />
                    </Link>
                    <Drawer>
                        <DrawerTrigger>
                            <BsThreeDots className="w-4 h-4 text-muted-foreground" />
                        </DrawerTrigger>
                        <DrawerContent>
                            {
                                PROJECT_NAV_LINKS.map((p, i) => (
                                    <DrawerClose>
                                        <Link to={p.path} key={i}>
                                            <Button className='py-7 w-full text-md justify-start' variant="ghost">
                                                {p.name}
                                            </Button>
                                        </Link>
                                    </DrawerClose>
                                ))
                            }
                        </DrawerContent>
                    </Drawer>

                </div>
            </CardHeader>

            <CardContent className='pb-4'>
                <GithubRepoBadge owner="instaparkin" repo="instapark" />
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-1">
                <Text content='cashfree requirements' className="font-semibold text-sm text-muted-foreground line-clamp-1" />
                <div className="flex items-center gap-1">
                    <Text className="font-semibold text-sm text-muted-foreground" content='Mar 4 on' />
                    <GithubBranch branch="main" />
                </div>
            </CardFooter>
        </Card>
    )
}
