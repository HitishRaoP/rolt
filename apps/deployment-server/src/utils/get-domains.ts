type GetDomainsProps = {
    owner: string
    repo: string
    deploymentSha: string
    commitSha: string
}

export const getDomains = ({
    owner, repo, deploymentSha, commitSha
}: GetDomainsProps) => {
    return {
        project: `http://${owner}-${repo}.localhost:8000`,
        deploymentSha: `http://${deploymentSha}.localhost:8000`,
        commitSha: `http://${commitSha}.localhost:8000`,
    }
}