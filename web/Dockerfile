# ===== BASE =====
FROM node:18.19-alpine3.18 AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1
RUN apk add --no-cache libc6-compat curl

# ===== DEPENDENCIES =====
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# ===== BUILDER =====
FROM base AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
# Build Next.js in standalone mode
RUN npm run build

# ===== RUNNER =====
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

# Copy build artifacts
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# Configurable health endpoint
ENV HEALTH_PATH=/api/health
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD curl -fsS http://localhost:3000$HEALTH_PATH || exit 1

CMD ["node", "server.js"]
