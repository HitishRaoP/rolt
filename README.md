# Project Setup Guide

## Architecture
![diagram-export-4-14-2025-8_19_44-PM](https://github.com/user-attachments/assets/2efd17ef-a430-423c-82cb-1ff4335d745f)

## Prerequisites
Ensure you have the following installed on your system:
- **Node.js** (Recommended: v20.11.1)
- **Yarn** (Package manager)
- **Docker** (For containerized development)
- **7zip** (For compression and packaging)

## Installation Steps

### 1. Bootstrap the Project
Run the following command to set up dependencies:
```sh
yarn bootstrap
```

### 2. AWS EC2 Configuration
- Run the AWS EC2 file (make sure you have execution permissions).
- Copy and paste the **subnet** details as required.

### 3. Install 7zip
#### **Windows (Using Chocolatey)**
If you are using Windows, install `7zip` using Chocolatey:
```sh
choco install 7zip -y
```

#### **macOS & Linux**
On macOS and Linux, install **p7zip** (the command-line version of 7zip):

- **macOS** (Using Homebrew):
  ```sh
  brew install p7zip
  ```
- **Debian/Ubuntu**:
  ```sh
  sudo apt update && sudo apt install p7zip-full -y
  ```
- **RHEL/CentOS**:
  ```sh
  sudo yum install p7zip -y
  ```

### 4. Running the Project
Once all dependencies are installed and environment variables are set, start the application as needed.

#### **Using 7zip for Compression**
To compress files using **7zip**, use the following commands:

- **Windows**:
  ```sh
  7z a archive.7z folder_to_compress/
  ```
- **macOS & Linux**:
  ```sh
  7z a archive.7z folder_to_compress/
  ```
