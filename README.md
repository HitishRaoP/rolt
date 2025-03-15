# Project Setup Guide

## Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (Recommended: v20.11.1)
- **Yarn** (Package manager)
- **AWS CLI** (For managing AWS resources)
- **Docker** (For containerized development)
- **Zip Utility** (Needed for certain operations)

## Installation Steps

### 1. Bootstrap the Project
Run the following command to set up dependencies:
```sh
yarn bootstrap
```

### 2. AWS EC2 Configuration
- Run the AWS EC2 file (make sure you have execution permissions).
- Copy and paste the **subnet** details as required.

### 3. Install Zip Utility
#### **Windows (Using Chocolatey)**
If you are using Windows, install `7zip` using Chocolatey:
```sh
choco install 7zip -y
```

#### **macOS**
On macOS, `zip` is typically pre-installed. You can verify this by running:
```sh
zip --version
```
If not installed, use Homebrew:
```sh
brew install zip
```

#### **Linux (Debian/Ubuntu)**
On Linux, install `zip` using the package manager:
```sh
sudo apt update && sudo apt install zip -y
```

#### **Linux (RHEL/CentOS)**
For Red Hat-based distributions:
```sh
sudo yum install zip -y
```

### 4. Set Up Environment Variables
Configure LocalStack environment variables:
```sh
export EDGE_PORT=4566
export LOCALSTACK_HOSTNAME='host.docker.internal'
```

### 5. Running the Project
Once all dependencies are installed and environment variables are set, start the application as needed.