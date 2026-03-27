#!/usr/bin/env bash
set -euo pipefail

WEB_PORT="${WEB_HOST_PORT:-3001}"
API_PORT="${API_HOST_PORT:-4000}"
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

kill_port() {
  local port="$1"
  local pids

  pids="$(lsof -ti tcp:"${port}" 2>/dev/null || true)"
  if [[ -z "${pids}" ]]; then
    echo "Port ${port} is already free."
    return
  fi

  echo "Stopping processes on port ${port}: ${pids}"
  kill ${pids} 2>/dev/null || true
  sleep 1

  pids="$(lsof -ti tcp:"${port}" 2>/dev/null || true)"
  if [[ -n "${pids}" ]]; then
    echo "Force-stopping remaining processes on port ${port}: ${pids}"
    kill -9 ${pids} 2>/dev/null || true
  fi
}

echo "Bringing down existing compose stack (if any)..."
(cd "${PROJECT_ROOT}" && docker compose down --remove-orphans >/dev/null 2>&1 || true)

kill_port "${WEB_PORT}"
kill_port "${API_PORT}"

echo "Starting Docker Compose with WEB_HOST_PORT=${WEB_PORT} and API_HOST_PORT=${API_PORT}"
cd "${PROJECT_ROOT}"
WEB_HOST_PORT="${WEB_PORT}" \
API_HOST_PORT="${API_PORT}" \
CORS_ORIGIN="${CORS_ORIGIN:-http://localhost:${WEB_PORT}}" \
NEXT_PUBLIC_SITE_URL="${NEXT_PUBLIC_SITE_URL:-http://localhost:${WEB_PORT}}" \
docker compose up --build "$@"
