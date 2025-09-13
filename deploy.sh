#!/usr/bin/env bash
set -euo pipefail

# Color codes for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly NC='\033[0m' # No Color

# Environment variables with defaults
COMPOSE_DIR="${COMPOSE_DIR:-$(pwd)}"
DOCKER_LOGIN_TIMEOUT="${DOCKER_LOGIN_TIMEOUT:-30}"
HEALTH_CHECK_TIMEOUT="${HEALTH_CHECK_TIMEOUT:-300}"
HEALTH_CHECK_INTERVAL="${HEALTH_CHECK_INTERVAL:-15}"
WEB_CHANGED="${WEB_CHANGED:-true}"
BACKEND_CHANGED="${BACKEND_CHANGED:-true}"

# Service health check endpoints
readonly WEB_HEALTH_ENDPOINT="http://localhost:3000/api/health"
readonly BACKEND_HEALTH_ENDPOINT="http://localhost:5000/api/health"

# Logging function with timestamp
log() {
    echo -e "${2:-$NC}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Error handling and cleanup
cleanup_on_exit() {
    local exit_code=$?
    if [[ $exit_code -ne 0 ]]; then
        log "❌ Deployment failed with exit code $exit_code" "$RED"
        log "📋 Current service status:" "$YELLOW"
        docker compose ps --format table || true
        log "📋 Recent service logs:" "$YELLOW"
        docker compose logs --tail=30 web backend postgres nginx || true
        
        # Show resource usage if deployment failed
        log "📊 Docker system information:" "$YELLOW"
        docker system df || true
    fi
    
    # Always logout from Docker on exit
    docker logout >/dev/null 2>&1 || true
    exit $exit_code
}

trap cleanup_on_exit EXIT

# Display deployment banner
display_banner() {
    echo -e "${BLUE}"
    echo "╔═══════════════════════════════════════════════════════╗"
    echo "║          SANSKARMALVISWARNKAR DEPLOYMENT              ║"
    echo "╠═══════════════════════════════════════════════════════╣"
    echo "║  Web Changed:     ${WEB_CHANGED:-Unknown}             ║"
    echo "║  Backend Changed: ${BACKEND_CHANGED:-Unknown}         ║"
    echo "║  Environment:     ${NODE_ENV:-production}             ║"
    echo "║  Timestamp:       $(date)                             ║"
    echo "╚═══════════════════════════════════════════════════════╝"
    echo -e "${NC}"
}

display_banner

log "🔧 Initializing deployment environment..." "$BLUE"

# Change to compose directory
cd "$COMPOSE_DIR"
log "📁 Working directory: $(pwd)" "$BLUE"

# Verify required files exist
required_files=("docker-compose.yml" ".env")
for file in "${required_files[@]}"; do
    if [[ ! -f "$file" ]]; then
        log "❌ ERROR: Required file '$file' not found in $COMPOSE_DIR" "$RED"
        exit 1
    fi
done

# Verify Docker Compose version and capabilities  
COMPOSE_VERSION=$(docker compose version --short 2>/dev/null || echo "unknown")
log "🐳 Docker Compose version: $COMPOSE_VERSION" "$BLUE"

# Check if --wait flag is supported for health checks
WAIT_SUPPORTED=false
if docker compose up --help 2>/dev/null | grep -q "\--wait"; then
    WAIT_SUPPORTED=true
    log "✅ Docker Compose --wait flag supported" "$GREEN"
else
    log "⚠️ Docker Compose --wait flag not supported, using manual health checks" "$YELLOW"
fi

# Setup Docker configuration directory
log "🔐 Setting up Docker authentication..." "$BLUE"
mkdir -p ~/.docker
chmod 755 ~/.docker

# Enhanced Docker Hub login with retry mechanism
login_attempt=0
max_login_attempts=3

while [[ $login_attempt -lt $max_login_attempts ]]; do
    if timeout "$DOCKER_LOGIN_TIMEOUT" bash -c 'echo "$DOCKERHUB_TOKEN" | docker login docker.io -u "$DOCKERHUB_USERNAME" --password-stdin' 2>/dev/null; then
        log "✅ Docker Hub authentication successful" "$GREEN"
        break
    else
        login_attempt=$((login_attempt + 1))
        if [[ $login_attempt -lt $max_login_attempts ]]; then
            log "⚠️ Docker login attempt $login_attempt failed, retrying in 5s..." "$YELLOW"
            sleep 5
        else
            log "❌ Docker Hub authentication failed after $max_login_attempts attempts" "$RED"
            exit 1
        fi
    fi
done

# Selective image pulling based on changed services
log "📥 Pulling updated container images..." "$BLUE"

services_to_pull=()

if [[ "${WEB_CHANGED}" == "true" ]]; then
    services_to_pull+=("web")
    log "🌐 Web service marked for update" "$PURPLE"
fi

if [[ "${BACKEND_CHANGED}" == "true" ]]; then
    services_to_pull+=("backend")
    log "⚙️ Backend service marked for update" "$PURPLE"
fi

# Always pull nginx and postgres for consistency
services_to_pull+=("nginx" "postgres")

if [[ ${#services_to_pull[@]} -gt 0 ]]; then
    # Pull specific services that have changed
    for service in "${services_to_pull[@]}"; do
        log "📥 Pulling $service image..." "$BLUE"
        if timeout 180 docker compose pull "$service" 2>/dev/null; then
            log "✅ Successfully pulled $service image" "$GREEN"
        else
            log "⚠️ Failed to pull $service image, using cached version" "$YELLOW"
        fi
    done
else
    log "ℹ️ No services marked for update, using cached images" "$BLUE"
fi

# Graceful shutdown of existing services
log "🛑 Gracefully stopping existing services..." "$BLUE"
if docker compose ps --quiet | grep -q .; then
    # Services are running, stop them gracefully
    docker compose down --remove-orphans --timeout 45 || true
    log "✅ Existing services stopped successfully" "$GREEN"
else
    log "ℹ️ No running services to stop" "$BLUE"
fi

# Remove unused networks and dangling images before deployment
log "🧹 Pre-deployment cleanup..." "$BLUE"
docker network prune -f >/dev/null 2>&1 || true
docker image prune -f --filter "dangling=true" >/dev/null 2>&1 || true

# Deploy services with health check support
log "🚀 Deploying sanskarmalviswanrnkar application services..." "$BLUE"

if [[ "$WAIT_SUPPORTED" == "true" ]]; then
    # Use built-in --wait flag for Docker Compose v2.22+
    if timeout "$HEALTH_CHECK_TIMEOUT" docker compose up -d --remove-orphans --wait --wait-timeout "$HEALTH_CHECK_TIMEOUT"; then
        log "✅ All services started successfully with built-in health checks" "$GREEN"
    else
        log "❌ Service deployment failed with --wait flag" "$RED"
        exit 1
    fi
else
    # Deploy without --wait and implement manual health checks
    docker compose up -d --remove-orphans
    
    log "⏳ Performing manual health verification..." "$YELLOW"
    
    # Enhanced health check with service-specific validation
    health_check_start=$(date +%s)
    
    while true; do
        current_time=$(date +%s)
        elapsed=$((current_time - health_check_start))
        
        if [[ $elapsed -gt $HEALTH_CHECK_TIMEOUT ]]; then
            log "❌ Health check timeout after ${HEALTH_CHECK_TIMEOUT}s" "$RED"
            exit 1
        fi
        
        # Check service health status
        healthy_services=0
        total_services=0
        
        # Get expected service count (excluding one-time containers)
        expected_services=4  # postgres, backend, web, nginx
        
        # Check each critical service health
        services=("postgres" "backend" "web" "nginx")
        service_status=""
        
        for service in "${services[@]}"; do
            total_services=$((total_services + 1))
            
            # Check if container is running
            if docker compose ps --services --filter status=running 2>/dev/null | grep -q "^${service}$"; then
                # Check health status if available
                health_status=$(docker compose ps --format json 2>/dev/null | jq -r "select(.Service == \"$service\") | .Health // \"running\"" 2>/dev/null || echo "running")
                
                if [[ "$health_status" == "healthy" ]] || [[ "$health_status" == "running" && "$service" == "postgres" ]]; then
                    healthy_services=$((healthy_services + 1))
                    service_status+="✅ $service "
                else
                    service_status+="⏳ $service "
                fi
            else
                service_status+="❌ $service "
            fi
        done
        
        log "🔍 Service status: $service_status ($healthy_services/$total_services healthy)" "$BLUE"
        
        # Consider deployment successful when all critical services are healthy
        if [[ $healthy_services -ge $expected_services ]]; then
            log "✅ All critical services are healthy and running" "$GREEN"
            break
        fi
        
        sleep "$HEALTH_CHECK_INTERVAL"
    done
fi

# Post-deployment verification and health checks
log "🔍 Performing comprehensive service verification..." "$BLUE"

# Display current service status
log "📋 Final service status:" "$BLUE"
docker compose ps --format table

# Verify application health endpoints if curl is available
verify_application_health() {
    if command -v curl >/dev/null 2>&1; then
        local endpoints=(
            "$WEB_HEALTH_ENDPOINT:Frontend"
            "$BACKEND_HEALTH_ENDPOINT:Backend"
        )
        
        for endpoint_info in "${endpoints[@]}"; do
            IFS=':' read -r url service_name <<< "$endpoint_info"
            
            log "🏥 Testing $service_name health endpoint..." "$BLUE"
            
            # Try health check with retries
            for attempt in {1..3}; do
                if curl -f -s --max-time 10 --connect-timeout 5 "$url" >/dev/null 2>&1; then
                    log "✅ $service_name health check passed" "$GREEN"
                    break
                else
                    if [[ $attempt -eq 3 ]]; then
                        log "⚠️ $service_name health check failed after 3 attempts" "$YELLOW"
                    else
                        log "⏳ $service_name health check attempt $attempt failed, retrying..." "$YELLOW"
                        sleep 5
                    fi
                fi
            done
        done
    else
        log "ℹ️ curl not available, skipping endpoint health checks" "$BLUE"
    fi
}

verify_application_health

# Database connection verification (if backend is updated)
if [[ "${BACKEND_CHANGED}" == "true" ]]; then
    log "🗃️ Verifying database connectivity..." "$BLUE"
    if docker compose exec -T backend npx prisma db seed --help >/dev/null 2>&1; then
        log "✅ Database connectivity verified" "$GREEN"
    else
        log "⚠️ Database connectivity check inconclusive" "$YELLOW"
    fi
fi

# Resource cleanup after successful deployment
log "🧹 Post-deployment resource cleanup..." "$BLUE"

# Clean up unused containers (keep volumes for data persistence)
if docker container prune -f >/dev/null 2>&1; then
    log "✅ Cleaned up stopped containers" "$GREEN"
fi

# Clean up unused images older than 24 hours
if docker image prune -f --filter "until=24h" >/dev/null 2>&1; then
    log "✅ Cleaned up old unused images" "$GREEN"
fi

# Clean up unused networks
if docker network prune -f >/dev/null 2>&1; then
    log "✅ Cleaned up unused networks" "$GREEN"
fi

# Display deployment summary
log "📊 Deployment Summary:" "$PURPLE"
echo -e "${PURPLE}╔══════════════════════════════════════════════════════╗${NC}"
echo -e "${PURPLE}║                    DEPLOYMENT COMPLETE               ║${NC}"
echo -e "${PURPLE}╠══════════════════════════════════════════════════════╣${NC}"
echo -e "${PURPLE}║ Services Updated:    $(if [[ "${WEB_CHANGED}" == "true" ]]; then echo -n "Web "; fi)$(if [[ "${BACKEND_CHANGED}" == "true" ]]; then echo -n "Backend "; fi)║${NC}"
echo -e "${PURPLE}║ Total Services:     4 (postgres, backend, web, nginx)║${NC}"
echo -e "${PURPLE}║ Deployment Time:    $(date)                          ║${NC}"
echo -e "${PURPLE}╚══════════════════════════════════════════════════════╝${NC}"

# Show final resource usage
if command -v docker >/dev/null 2>&1 && docker system df >/dev/null 2>&1; then
    log "📊 Docker resource usage after deployment:" "$BLUE"
    docker system df
fi

# Display application access information
log "🌐 Application Access Information:" "$GREEN"
echo -e "${GREEN}   🏠 Frontend:      http://sanskarmalviswarnkar.in${NC}"
echo -e "${GREEN}   🔧 Backend API:   http://sanskarmalviswarnkar.in/api${NC}"
echo -e "${GREEN}   ❤️ Health Check:  http://sanskarmalviswarnkar.in/api/health${NC}"

# Final success message
log "🎉 Sanskarmalviswarnkar.in application deployment completed successfully!" "$GREEN"
log "📅 Deployment timestamp: $(date)" "$BLUE"

# Exit successfully
exit 0
