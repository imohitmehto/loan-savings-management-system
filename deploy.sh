#!/usr/bin/env bash
set -euo pipefail

COMPOSE_DIR="${COMPOSE_DIR}"

echo "🚀 Starting deployment at $(date)"

cd "$COMPOSE_DIR"

if [[ ! -f docker-compose.yml ]]; then
  echo "❌ ERROR: docker-compose.yml not found in $COMPOSE_DIR"
  exit 1
fi

echo "🔐 Logging into Docker Hub..."
echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin

echo "📥 Pulling latest images..."
docker compose pull

echo "🚀 Deploying services..."
docker compose up -d --remove-orphans --wait

echo "⏳ Waiting for services to be ready..."
timeout 120 bash -c 'until docker compose ps --format json | jq -e ".[].Health" | grep -q "healthy\|null"; do sleep 5; done' || {
  echo "❌ Services failed to start properly"
  docker compose ps
  exit 1
}

echo "🧹 Cleaning up old images..."
docker image prune -f

echo "✅ Deployment completed successfully at $(date)"
docker compose ps
