export const getOwnerRepoRef = (githubRepository: string) => {
    return {
        owner: githubRepository.split("/")[0] as string,
        repo: githubRepository.split("/")[1] as string,
        ref: "main"
    }
}