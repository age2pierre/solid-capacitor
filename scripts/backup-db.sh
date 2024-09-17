#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
TIMESTAMP=$(date +"%Y%m%d%H%M%S")

DB_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"

mkdir -p $SCRIPT_DIR/../deployement/backups

docker exec -u postgres monorepo-db-1 pg_dump --dbname="$DB_URL" -Fc > "$REPO_PATH/deployement/backups/db-${TIMESTAMP}"
