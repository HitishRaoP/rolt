import { IoIosGitBranch } from "react-icons/io";

type GithubBranchProps = {
    branch: string
}

export const GithubBranch = ({ branch }: GithubBranchProps) => {
    return (
        <div className="flex items-center gap-1">
            <IoIosGitBranch />
            <span className="text-sm font-mono">
                {branch}
            </span>
        </div>
    )
}
