<p align="center">
    <img
      src="https://github.com/user-attachments/assets/e7fcf502-38d3-480c-9367-17f4a093eec2"
      height="96"
    >
    <h3 align="center">Rolt</h3>
</p>

ROLT is a deployment automation tool that streamlines the process from GitHub push to live preview environments using Kubernetes.

---

## System Architecture

![diagram-export-4-14-2025-9_06_59-PM](https://github.com/user-attachments/assets/2362dbde-30f1-4b1b-b381-cfd05f6cdd24)

---

## Key Components

### Frontend (ROLT GitHub App)
- Users install the ROLT GitHub App.
- On push/create events, GitHub triggers a **Webhook** to the ROLT backend.

### Backend - Framework Detectors
- Listens for webhook events.
- Detects project framework.
- Enqueues jobs into `deployer-queue`.

### Deployer Queue
- A job queue system to manage deployments.
- Triggers a serverless function (e.g., AWS Lambda).

### Lambda Trigger
- Pulls the code repository.
- Initiates deployment into a **Kubernetes Cluster**.

### Kubernetes Cluster
- Deploys via:
  - **Traefik** for ingress.
  - **Service** and **Deployment** components.
- Live URLs:
  - `http://deploymentId.localhost:8000`
  - `http://owner-repo.localhost:8000`
  - `http://commitsha.localhost:8000`

### CI/CD Integration
- Updates GitHub Checks and Deployment statuses via the GitHub API.

### Observability
- Logs collected via **Fluent-Bit**.
- Stored in **ElasticSearch**.
- Visualized and analyzed through:
  - A polling service
  - Real-time updates via **SSE (Server-Sent Events)** to a **React** frontend.
