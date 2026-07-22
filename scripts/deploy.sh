#!/usr/bin/env bash
# Blueprint Eternity — VPS deploy helper.
#
# Pulls the latest main, rebuilds the app image, restarts the container,
# and runs a small smoke test against /health. Safe to re-run: it will
# fast-forward, rebuild, and recreate only the `app` service so the
# other containers on the host are not touched.
#
# Required environment (or hardcode REPO_DIR / ENV_FILE below):
#   REPO_DIR   absolute path to the cloned repo on the VPS
#              (default: /srv/anan-blueprint)
#   ENV_FILE   absolute path to the production env file
#              (default: /etc/anan-blueprint/app.env)
#
# Usage:
#   ./scripts/deploy.sh
#
# Rollback (in case of a bad release):
#   git -C "$REPO_DIR" checkout <previous-sha>
#   docker compose -f "$REPO_DIR/docker-compose.yml" up -d --build app
set -euo pipefail

REPO_DIR="${REPO_DIR:-/srv/anan-blueprint}"
ENV_FILE="${ENV_FILE:-/etc/anan-blueprint/app.env}"
COMPOSE_FILE="$REPO_DIR/docker-compose.yml"
HEALTH_URL="${HEALTH_URL:-http://localhost:8080/health}"

if [[ ! -d "$REPO_DIR" ]]; then
  echo "❌ REPO_DIR does not exist: $REPO_DIR" >&2
  exit 1
fi

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "❌ docker-compose.yml not found at $COMPOSE_FILE" >&2
  exit 1
fi

cd "$REPO_DIR"

echo "→ Pulling latest main"
git fetch --prune origin
git checkout main
git pull --ff-only origin main

echo "→ Rebuilding the app image"
docker compose -f "$COMPOSE_FILE" build --pull app

if [[ -f "$ENV_FILE" ]]; then
  echo "→ Using env file: $ENV_FILE"
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
else
  echo "⚠️  No env file at $ENV_FILE; falling back to whatever is in the current shell."
fi

echo "→ Restarting the app container"
docker compose -f "$COMPOSE_FILE" up -d app

echo "→ Waiting for /health to come back up"
for attempt in {1..15}; do
  if curl -fsS "$HEALTH_URL" >/dev/null 2>&1; then
    echo "✅ /health is healthy (attempt $attempt)"
    break
  fi
  if [[ "$attempt" -eq 15 ]]; then
    echo "❌ /health never came up. Last 40 log lines:" >&2
    docker compose -f "$COMPOSE_FILE" logs --tail=40 app >&2 || true
    exit 1
  fi
  sleep 2
done

echo "→ Container status"
docker compose -f "$COMPOSE_FILE" ps

echo "✅ Deploy complete."
