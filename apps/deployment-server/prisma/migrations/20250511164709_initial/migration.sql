-- CreateEnum
CREATE TYPE "FrameworkEnum" AS ENUM ('Vite', 'Next_js', 'Express_js', 'Other');

-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('Bot', 'User', 'Organization');

-- CreateEnum
CREATE TYPE "Provider" AS ENUM ('Github');

-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('Production', 'Development');

-- CreateEnum
CREATE TYPE "RoltStatus" AS ENUM ('Queued', 'Error', 'Pending', 'Ready');

-- CreateTable
CREATE TABLE "Installation" (
    "_id" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "ownerType" "OwnerType" NOT NULL,
    "provider" "Provider" NOT NULL,

    CONSTRAINT "Installation_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Deployment" (
    "_id" TEXT NOT NULL,
    "checkRunId" INTEGER NOT NULL,
    "status" "RoltStatus" NOT NULL,
    "environment" "Environment" NOT NULL,
    "isCurrent" BOOLEAN NOT NULL,
    "projectId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Deployment_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "GitMetadata" (
    "commitSha" TEXT NOT NULL,
    "commitMessage" TEXT NOT NULL,
    "commitRef" TEXT NOT NULL,
    "commitAuthorName" TEXT NOT NULL,
    "_id" TEXT NOT NULL,

    CONSTRAINT "GitMetadata_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Domains" (
    "project" TEXT NOT NULL,
    "deploymentSha" TEXT NOT NULL,
    "commitSha" TEXT NOT NULL,
    "_id" TEXT NOT NULL,

    CONSTRAINT "Domains_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "Project" (
    "_id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "githubRepository" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "framework" "FrameworkEnum" NOT NULL,
    "install_command" TEXT DEFAULT 'npm run install',
    "build_command" TEXT DEFAULT 'npm run build',
    "rootDirectory" TEXT NOT NULL DEFAULT './',
    "out_dir" TEXT DEFAULT 'dist',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "EnvironmentVariables" (
    "_id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "EnvironmentVariables_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Installation_owner_key" ON "Installation"("owner");

-- CreateIndex
CREATE UNIQUE INDEX "Deployment_checkRunId_key" ON "Deployment"("checkRunId");

-- CreateIndex
CREATE UNIQUE INDEX "Project_githubRepository_key" ON "Project"("githubRepository");

-- AddForeignKey
ALTER TABLE "Deployment" ADD CONSTRAINT "Deployment_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitMetadata" ADD CONSTRAINT "GitMetadata__id_fkey" FOREIGN KEY ("_id") REFERENCES "Deployment"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Domains" ADD CONSTRAINT "Domains__id_fkey" FOREIGN KEY ("_id") REFERENCES "Deployment"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EnvironmentVariables" ADD CONSTRAINT "EnvironmentVariables_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
