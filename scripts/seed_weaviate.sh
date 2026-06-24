#!/usr/bin/env bash

set -euo pipefail

export WEAVIATE_URL="${WEAVIATE_URL:-http://localhost:8080}"

docker compose exec -T api python api/seed_weaviate.py

echo "Weaviate seed completed successfully."