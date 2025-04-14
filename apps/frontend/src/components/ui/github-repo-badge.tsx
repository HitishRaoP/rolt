import { githubRepo } from "@/lib/utils";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router";

type GithubRepoBadgeProps = {
    owner: string
    repo: string
}

export const GithubRepoBadge = ({ owner, repo }: GithubRepoBadgeProps) => {
    return (
        <Link to={`https://github.com/${owner}/${repo}`}>
            <div className="w-fit rounded-full p-1.5 flex items-center gap-1 px-4 bg-secondary text-sm">
                <FaGithub className="w-4 h-4" />
                <span className="font-medium">
                    {githubRepo(owner, repo)}
                </span>
            </div>
        </Link>
    )
}
