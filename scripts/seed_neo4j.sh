# #!/usr/bin/env bash
# set -euo pipefail

# # Execute cypher-shell inside the running neo4j container and pipe the seed file in
# docker compose exec -T neo4j \
#   cypher-shell \
#   -u "$NEO4J_USER" \
#   -p "$NEO4J_PASSWORD" \
#   < api/seed.cypher

# echo "Neo4j seed completed successfully."

set -euo pipefail

if [ -f .env ]; then
set -a; . ./.env; set +a
fi

docker compose exec -T neo4j cypher-shell \
-u "$NEO4J_USER" -p "$NEO4J_PASSWORD" < api/seed.cypher

echo "seed_neo4j: recipe graph seeded."