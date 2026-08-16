# Save as: apps/api/Dockerfile
# Build from repo root: docker build -f apps/api/Dockerfile -t social-scheduler-api .

FROM node:20-alpine AS base

# ── Stage 1: prune the monorepo down to only what `api` needs ──
# turbo prune walks the dependency graph and outputs a minimal subset
# (api + packages/database + packages/shared, not worker or web) — this
# is what keeps the image small and the build cache actually useful.
FROM base AS pruner
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune api --docker

# ── Stage 2: install deps for the pruned subset, then build ──
FROM base AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm exec prisma generate --schema=packages/database/prisma/schema.prisma
RUN pnpm turbo build --filter=api

# ── Stage 3: minimal runtime image, no build tools, non-root user ──
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV TZ=UTC
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 apiuser
COPY --from=builder /app .
USER apiuser
EXPOSE 4000
CMD ["node", "apps/api/dist/server.js"]