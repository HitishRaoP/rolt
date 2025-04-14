type GetDomainsProps = {
    owner: string
    repo: string
    commitSha: string
    deploymentId: string
}

export const getDomains = ({
    owner,
    repo,
    commitSha,
    deploymentId
}: GetDomainsProps) => {

    return {
        web: `http://${owner.toLowerCase()}-${repo.toLowerCase()}.localhost:8000`,
        sha: `http://${commitSha}.localhost:8000`,
        id: `http://${deploymentId}.localhost:8000`,
        logs: `http://${deploymentId}.localhost:8000/logs`,
    }
}