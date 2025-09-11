# web/Dockerfile
# Stage 1: deps + install
FROM node:18-alpine AS deps
WORKDIR /app
COPY web/package.json web/package-lock.json* web/yarn.lock* ./ 
# if using pnpm, adjust accordingly
RUN npm ci --only=production --no-audit --no-fund

# Stage 2: builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
# install dev deps for build
RUN npm ci
RUN npm run build

# Stage 3: production image
FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# minimal deps (copy node_modules production)
COPY --from=deps /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
# if you use next start
EXPOSE 3000
# Create non-root user
RUN addgroup -S web && adduser -S web -G web
USER web
CMD ["node", "server.js"]
# Note: If you use `next start`, you might create a small server.js to run next start:
# Or change CMD to ["npm","run","start"]
