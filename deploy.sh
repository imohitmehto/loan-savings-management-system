#!/usr/bin/env bash
set -euo pipefail

# Environment variables with defaults
COMPOSE_DIR="${COMPOSE_DIR:-$(pwd)}"
DOCKER_LOGIN_TIMEOUT="${DOCKER_LOGIN_TIMEOUT:-30}"
HEALTH_CHECK_TIMEOUT="${HEALTH_CHECK_TIMEOUT:-300}"

echo "🚀 Starting deployment at $(date)"

cd "$COMPOSE_DIR"

# Verify docker-compose.yml exists
if [[ ! -f docker-compose.yml ]]; then
  echo "❌ ERROR: docker-compose.yml not found in $COMPOSE_DIR"
  exit 1
fi

# Ensure docker config directory exists with proper permissions
echo "🔧 Setting up Docker configuration..."
mkdir -p ~/.docker
chmod 755 ~/.docker

# Login to Docker Hub with timeout
echo "🔐 Logging into Docker Hub..."
timeout "$DOCKER_LOGIN_TIMEOUT" bash -c 'echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USERNAME" --password-stdin' || {
  echo "❌ Docker login failed or timed out"
  exit 1
}

# Pull latest images with error handling
echo "📥 Pulling latest images..."
if ! docker compose pull; then
  echo "⚠️ Warning: Some images failed to pull, continuing with cached versions..."
fi

# Deploy services with wait flag (if supported)
echo "🚀 Deploying services..."
if docker compose up -d --remove-orphans --wait 2>/dev/null; then
  echo "✅ Services started successfully with --wait flag"
else
  echo "⚠️ --wait flag not supported, using manual health check..."
  docker compose up -d --remove-orphans
  
  # Manual health check with improved compatibility
  echo "⏳ Waiting for services to be ready..."
  
  # Simple approach - wait for containers to be running
  timeout "$HEALTH_CHECK_TIMEOUT" bash -c '
    while true; do
      if docker compose ps --format json >/dev/null 2>&1; then
        # Use docker compose ps with JSON if available
        unhealthy=$(docker compose ps --format json | grep -c "\"Health\":\"unhealthy\"" || echo "0")
        if [[ $unhealthy -eq 0 ]]; then
          running=$(docker compose ps --services --filter status=running | wc -l)
          total=$(docker compose ps --services | wc -l)
          if [[ $running -eq $total ]] && [[ $total -gt 0 ]]; then
            echo "✅ All services are running"
            break
          fi
        fi
      else
        # Fallback for older docker-compose versions
        if docker compose ps | grep -q "Up"; then
          echo "✅ Services appear to be running"
          break
        fi
      fi
      echo "⏳ Still waiting for services to be ready..."
      sleep 10
    done
  ' || {
    echo "❌ Services failed to start properly within timeout"
    echo "📋 Current service status:"
    docker compose ps
    
    echo "📋 Service logs (last 50 lines):"
    docker compose logs --tail=50
    exit 1
  }
fi

# Verify services are actually responding (if you have health checks)
echo "🔍 Verifying service health..."
docker compose ps

# Clean up old images
echo "🧹 Cleaning up old images..."
if ! docker image prune -f; then
  echo "⚠️ Warning: Image cleanup failed, continuing..."
fi

# Optional: Clean up old containers and volumes
echo "🧹 Cleaning up old containers..."
if ! docker container prune -f; then
  echo "⚠️ Warning: Container cleanup failed, continuing..."
fi

echo "✅ Deployment completed successfully at $(date)"

# Display final status
echo "📋 Final service status:"
docker compose ps

# Optional: Show resource usage
echo "📊 Resource usage:"
docker system df
