#!/usr/bin/env bash

set -euo pipefail

for i in $(seq 1 45); do
    OUT="$(docker compose ps --format json || true)"

    if echo "$OUT" | grep -q '"Health":"healthy"' ; then

        healthy_count=$(
          echo "$OUT" | grep -o '"Health":"healthy"' | wc -l
        )

        if [ "$healthy_count" -ge 4 ]; then
            echo "All services healthy."
            exit 0
        fi
    fi

    sleep 2
done

echo "Timeout waiting for healthy services."
exit 1