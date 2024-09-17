#!/usr/bin/env bash

echo "Releasing new webserver version..."

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
cd $SCRIPT_DIR/../

# Pull the latest image from the Docker registry
echo "Pulling the latest Docker image from registry..."
docker compose pull webserver

OLD_CONTAINER=$(docker ps -aqf "name=webserver")

echo "Scaling webserver up..."
docker compose up -d --no-deps --scale webserver=2 --no-recreate webserver

# Wait for new webserver containers to log "Server is running on port"
while true; do
  # Get IDs of newly started containers, excluding the old one
  NEW_CONTAINERS=$(docker ps -aqf "name=webserver" | grep -v "$OLD_CONTAINER")
  if echo $(docker logs $NEW_CONTAINERS) | grep -m1 "Server is running on port"; then
    echo "Server is running on new webserver containers."
    break
  fi
  echo "Waiting for new servers to start..."
  sleep 5 # Check every 5 seconds
done

echo "Removing old webserver container..."
docker container rm -f $OLD_CONTAINER

echo "Scaling old webserver down..."
docker compose up -d --no-deps --scale webserver=1 --no-recreate webserver

echo "Reloading caddy..."
CADDY_CONTAINER=$(docker ps -aqf "name=caddy")
docker exec $CADDY_CONTAINER caddy reload -c /etc/caddy/Caddyfile

echo "Updating crontasks..."
echo "
* * * * * $SCRIPT_DIR/deploy-crontask.sh
" | crontab