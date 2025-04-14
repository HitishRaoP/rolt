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
        web: `http://${owner}-${repo}.rolt.tech:8000`,
        sha: `http://${commitSha}.rolt.tech:8000`,
        id: `http://${deploymentId}.rolt.tech:8000`,
        logs: `http://${deploymentId}.rolt.tech:8000/logs`,
    }
}