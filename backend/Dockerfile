# ===== BASE IMAGE =====
FROM node:20-alpine3.18 AS base
WORKDIR /app
ENV NODE_ENV=production
# Ensure system packages are up to date
RUN apk add --no-cache libc6-compat

# ===== DEPENDENCIES =====
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

# ===== BUILDER =====
FROM base AS builder
WORKDIR /app
COPY package*.json ./
# Install ALL dependencies (including devDependencies) for building
RUN npm ci
COPY . .
# Generate Prisma client
RUN npm run prisma:generate
# Build the application using npx to ensure nest CLI is available
RUN npx nest build && npm run copy:templates

# ===== RUNTIME =====
FROM base AS runtime
WORKDIR /app

# Install only required tools
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nestjs

# Copy production deps & built app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./
COPY --from=builder --chown=nestjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nestjs:nodejs /app/src/infrastructure/database ./src/infrastructure/database

# Use non-root user
USER nestjs

# Expose API port
EXPOSE 5000

# Healthcheck (configurable via env var)
ENV HEALTH_PATH=/api/health
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -fsS http://localhost:5000$HEALTH_PATH || exit 1

# Run app
CMD ["node", "dist/main"]
