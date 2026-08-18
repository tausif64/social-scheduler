// Save as: packages/database/src/index.ts
// Exports the configured PrismaClient singleton every other package/app
// imports as `@repo/database`. Prisma 7 requires a driver adapter — a bare
// `new PrismaClient()` throws on startup now.

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// Prevents creating a new pool on every hot-reload in dev — reuses the
// same instance across module reloads instead of leaking connections.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}