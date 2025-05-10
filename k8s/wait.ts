import { execSync, spawn, ChildProcess } from 'child_process';
import ora from 'ora';
import { setTimeout as sleep } from 'timers/promises';

const waitForPodsReady = async (namespace: string, labelSelector: string, name: string) => {
  const spinner = ora(`Waiting for ${name} pods in ${namespace}...`).start();

  while (true) {
    try {
      const output = execSync(`kubectl get pods -n ${namespace} -l ${labelSelector} -o json`).toString();
      const pods = JSON.parse(output).items;
      const allRunning = pods.length > 0 && pods.every((p: any) =>
        p.status.phase === 'Running' &&
        p.status.containerStatuses?.every((cs: any) => cs.ready)
      );

      if (allRunning) {
        spinner.succeed(`${name} pods are ready`);
        break;
      }
    } catch { }
    await sleep(2000);
  }
};

(async () => {
  await waitForPodsReady('traefik-v2', 'app.kubernetes.io/name=traefik', 'Traefik');

  ora('Starting port forwarding...').start();

  const processes: ChildProcess[] = [];

  const traefikForward = spawn('kubectl', ['port-forward', 'deployment/traefik', '8000:8000', '-n', 'traefik-v2'], {
    stdio: 'inherit',
  });

  processes.push(traefikForward);

  const shutdown = () => {
    console.log('\nStopping port forwarding...');
    for (const proc of processes) {
      proc.kill();
    }
    process.exit();
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
})();
