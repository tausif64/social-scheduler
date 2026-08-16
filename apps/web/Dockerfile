# Save as: apps/web/Dockerfile
# Requires next.config.js to set: output: 'standalone'
# Build from repo root: docker build -f apps/web/Dockerfile -t social-scheduler-web .

FROM node:20-alpine AS base

FROM base AS pruner
RUN npm install -g turbo
WORKDIR /app
COPY . .
RUN turbo prune web --docker

FROM base AS builder
RUN npm install -g pnpm
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo build --filter=web

# Next's standalone output copies only the traced dependencies a request
# actually needs — much smaller than shipping the whole node_modules tree.
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV TZ=UTC
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 webuser
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=webuser:nodejs /app/apps/web/.next/standalone ./
COPY --from=builder --chown=webuser:nodejs /app/apps/web/.next/static ./apps/web/.next/static
USER webuser
EXPOSE 3000
CMD ["node", "apps/web/server.js"]