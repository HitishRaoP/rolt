import { Octokit } from "@octokit/rest"

export class FrameWorkDetector {
    private repoUrl: string
    private octokit: Octokit

    constructor(repoUrl: string) {
        this.repoUrl = repoUrl
        this.octokit = new Octokit();
    }

    async getContent() {
        
    }
}