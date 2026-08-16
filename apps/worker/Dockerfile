# Save as: apps/worker/Dockerfile
# Build from repo root: docker build -f apps/worker/Dockerfile -t social-scheduler-worker .

FROM node:20-alpine AS base

FROM base AS pruner
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune worker --docker

FROM base AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm exec prisma generate --schema=packages/database/prisma/schema.prisma
RUN pnpm turbo build --filter=worker

# No EXPOSE here on purpose — the worker consumes from Redis, it never
# accepts inbound connections, so it has nothing to listen on.
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV TZ=UTC
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 workeruser
COPY --from=builder /app .
USER workeruser
CMD ["node", "apps/worker/dist/index.js"]

