#!/usr/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

cd $SCRIPT_DIR/../

# Load environment variables from .env file
if [ -f ".env" ]; then
    export $(cat .env | sed 's/#.*//g' | xargs)
else
    echo ".env file not found!"
    exit 1
fi

# Prepare the database URL
DB_URL="postgresql://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"

# Determine the backup file to use
if [ -n "$1" ]; then
    BACKUP_FILE="$1"
else
    BACKUP_FILE=$(ls -t $SCRIPT_DIR/../deployement/backups/db-* | head -n 1)
fi

# Check if the backup file exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo "Backup file not found: $BACKUP_FILE"
    exit 1
fi

# Run the restore command
docker exec -i -u postgres monorepo-db-1 pg_restore --format=custom --verbose --clean --no-owner --dbname="$DB_URL" < "$BACKUP_FILE"
