# Stage 1 - Install dependencies (only prod deps for runtime)
FROM node:18-alpine AS deps
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Stage 2 - Build with dev deps + generate Prisma client
FROM node:18-alpine AS builder
WORKDIR /app
COPY backend/package*.json ./
RUN npm ci
COPY backend/ ./
# Generate Prisma client using your schema
RUN npm run prisma:generate
# Build NestJS
RUN npm run build

# Stage 3 - Runtime container
FROM node:18-alpine AS runtime
WORKDIR /app
ENV NODE_ENV=production

# Copy production node_modules from deps
COPY --from=deps /app/node_modules ./node_modules
# Copy dist
COPY --from=builder /app/dist ./dist
# Copy Prisma schema + migrations
COPY --from=builder /app/src/infrastructure/database ./src/infrastructure/database
# Copy package.json
COPY --from=builder /app/package*.json ./
# Copy generated Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 5000
CMD ["node", "dist/main"]
