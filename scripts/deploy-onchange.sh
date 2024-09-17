#!/usr/bin/env bash

echo "Fetching remote Docker image information..."

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

# Variables (replace with your actual repository and tag)
DOCKER_REPO=${1:-'registry.gitlab.com/lokaly/monorepo/webserver'}
DOCKER_TAG=${2:-'main'}

# Fetch local image digest
LOCAL_DIGEST=$(docker image inspect --format='{{index .Id}}' "$DOCKER_REPO:$DOCKER_TAG" 2>/dev/null)

# Fetch remote image digest using docker manifest inspect
REMOTE_DIGEST=$(docker manifest inspect "$DOCKER_REPO:$DOCKER_TAG" 2>/dev/null | jq -r '.config.digest')

if [ -z "$REMOTE_DIGEST" ]; then
    echo "Failed to fetch remote image digest."
    exit 1
fi

if [ "$LOCAL_DIGEST" = "$REMOTE_DIGEST" ]; then
    echo "No changes detected in Docker image."
else
    echo "Changes detected in Docker image, deploying new version."
    echo "New remote image digest: $REMOTE_DIGEST"
    
    # Pull new Docker image
    docker pull "$DOCKER_REPO:$DOCKER_TAG"

    git pull
    
    # Deploy new version (customize as needed)
    $SCRIPT_DIR/deploy.sh
fi
