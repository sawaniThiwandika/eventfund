#!/usr/bin/env bash
# Deploy EventFund on the server. Runs ON the EC2 host.
#
# The code is copied to ~/eventfund beforehand (e.g. by the GitHub Actions deploy job),
# so this script never talks to GitHub and the server needs no GitHub credentials.
# The server's ~/eventfund/.env holds the real settings and is never overwritten.
#
# Usage:  bash ~/eventfund/scripts/deploy.sh
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/eventfund}"
COMPOSE_FILE="docker-compose.prod.yml"
TIMEOUT_SECONDS="${TIMEOUT_SECONDS:-180}"

cd "$APP_DIR"

if [ ! -f .env ]; then
    echo "ERROR: $APP_DIR/.env is missing. Copy .env.example to .env and fill in real values." >&2
    exit 1
fi

compose() {
    docker compose -f "$COMPOSE_FILE" "$@"
}

# Print the information needed to debug a failed deploy, then stop.
fail() {
    echo "ERROR: $1. Last backend logs:" >&2
    compose logs --tail=50 backend >&2 || true
    compose ps >&2 || true
    exit 1
}

echo "==> Building and starting containers"
compose up -d --build || fail "docker compose up failed"

echo "==> Waiting for /actuator/health to return UP (max ${TIMEOUT_SECONDS}s)"
elapsed=0
until compose exec -T backend wget -qO- http://localhost:8080/actuator/health 2>/dev/null | grep -q '"status":"UP"'; do
    if [ "$elapsed" -ge "$TIMEOUT_SECONDS" ]; then
        fail "backend did not become healthy within ${TIMEOUT_SECONDS}s"
    fi
    sleep 5
    elapsed=$((elapsed + 5))
done
echo "==> Backend is UP after ${elapsed}s"

echo "==> Container status"
compose ps
