import { checkPrime } from "crypto";
import { readFileSync } from "fs";
import { App } from "octokit";
import path from "path";

const app = new App({
  appId: 982451,
  privateKey: readFileSync(path.resolve("private-key.pem"), "utf8"),
});

async function main() {

  const octokit = await app.getInstallationOctokit(64259490);

  /**
   * Refererd This issue to get the token.
   * https://github.com/octokit/app.js/issues/413
   */
  const { token } = await octokit.auth({ type: "installation" }) as { token: string }
  console.log(token);

  const test = await octokit.rest.repos.createDeployment({
    owner: "HitishRaoP",
    repo: "nextjs-sample",
    ref: "main",
  });

  console.log(test);


  return octokit
}


async function random() {
  const deploymentId = 2401169746;
  const octokit = await app.getInstallationOctokit(64259490);

  const response = await octokit.rest.repos.createDeploymentStatus({
    owner: "HitishRaoP",
    repo: "nextjs-sample",
    deployment_id: deploymentId,
    state: "success",  // Can be 'success', 'error', or 'failure'
    description: "Deployment completed successfully",
    log_url: "https://your-deployment-url.com", // Optional: Add the URL where the deployment is accessible
  });

  console.log(response.data);

}
random()
async function createCheck() {
  const octokit = await app.getInstallationOctokit(64259490);

  const { data: check } = await octokit.rest.checks.update({
    owner: "HitishRaoP",
    repo: "nextjs-sample",
    check_run_id: 1,
    name: "CI Check",
    head_sha: "9470bd73325c0f48485809405c46954bf9317d34", // Use the commit SHA you want to associate the check with
    status: "queued",  // or "completed"
    output: {
      title: "CI Check",
      summary: "All tests passed successfully.",
      text: "Detailed test results can be found in the pipeline logs.",
    },
  });

  console.log(checkPrime);
}

