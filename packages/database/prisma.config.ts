// Save as: packages/database/prisma.config.ts
// This is what `prisma migrate` / `prisma generate` read for the connection
// string now — schema.prisma no longer holds it (Prisma 7 change).
//
// `dotenv/config`'s default (no path) only looks in the current working
// directory. `pnpm --filter @repo/database exec` runs with its CWD set to
// packages/database, not the repo root — so plain `import "dotenv/config"`
// silently misses the root .env. Resolve the path explicitly instead, based
// on this file's own location, so it works regardless of where the command
// was invoked from.

import { config } from "dotenv";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { defineConfig, env } from "prisma/config";

const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: resolve(__dirname, "../../.env") }); // packages/database -> packages -> repo root

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});