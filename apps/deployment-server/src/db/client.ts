import { PrismaClient } from "../../generated/prisma/index.js";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const deploymentDB =
    globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = deploymentDB;