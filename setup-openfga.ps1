#!/usr/bin/env bash
# Save as: setup-openfga.sh (repo root)
# One-time setup: waits for OpenFGA, creates the store, and pushes the
# authorization model. Run from WSL, from the repo root.
#
# Usage:
#   docker compose -f docker/docker-compose.yml --env-file .env up -d postgres redis minio openfga-migrate openfga
#   chmod +x setup-openfga.sh
#   ./setup-openfga.sh
#   # paste the printed OPENFGA_STORE_ID into .env, then:
#   docker compose -f docker/docker-compose.yml --env-file .env up -d --build api worker

set -euo pipefail

FGA_URL="http://localhost:8080"
MODEL_PATH="docker/openfga/model.json"

if ! command -v jq &> /dev/null; then
  echo "jq is required — install it with: sudo apt install -y jq" >&2
  exit 1
fi

echo "Waiting for OpenFGA to be healthy..."
ready=""
for i in $(seq 1 20); do
  if curl -sf "$FGA_URL/healthz" > /dev/null 2>&1; then
    ready=1
    break
  fi
  sleep 2
done

if [ -z "$ready" ]; then
  echo "OpenFGA never became healthy — check: docker compose -f docker/docker-compose.yml logs openfga" >&2
  exit 1
fi

echo "Creating store..."
STORE_ID=$(curl -sf -X POST "$FGA_URL/stores" \
  -H "Content-Type: application/json" \
  -d '{"name":"social-scheduler"}' | jq -r '.id')
echo "Store created: $STORE_ID"

echo "Pushing authorization model from $MODEL_PATH ..."
MODEL_ID=$(curl -sf -X POST "$FGA_URL/stores/$STORE_ID/authorization-models" \
  -H "Content-Type: application/json" \
  -d @"$MODEL_PATH" | jq -r '.authorization_model_id')
echo "Model pushed: $MODEL_ID"

echo ""
echo "Add these to your .env file, then restart api/worker:"
echo "OPENFGA_STORE_ID=$STORE_ID"
echo "OPENFGA_MODEL_ID=$MODEL_ID"
echo "OPENFGA_API_URL=http://localhost:8080"