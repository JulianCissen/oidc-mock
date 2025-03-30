#!/bin/bash

# Change to the parent directory of where the script is located
cd "$(dirname "$0")/.."

# Get arguments with defaults
PORT=${1:-8443}
DOMAIN=${2:-localhost}
CONTAINER_NAME=${3:-oidc-mock}

# Remove any existing container with the same name
docker rm -f $CONTAINER_NAME 2>/dev/null || true

# Get version from package.json - use grep and sed to avoid tty issues
VERSION=$(grep -m1 '"version"' package.json | sed -E 's/.*"version": "([^"]+)".*/\1/')

# Build the Docker image to incorporate any changes using the build script
source ./bin/build.sh

# Run the container with the newly built image
docker run --name $CONTAINER_NAME -p $PORT:$PORT \
  -e PORT=$PORT \
  -e DOMAIN=$DOMAIN \
  oidc-mock:$VERSION

$SHELL
