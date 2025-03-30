#!/bin/bash

# Change to the parent directory of where the script is located
cd "$(dirname "$0")/.."

# Remove any existing container with the same name
docker rm -f oidc-mock 2>/dev/null || true

# Check if a port is provided as an argument
PORT=${1:-8443}
DOMAIN=${2:-localhost}

# Get version from package.json - use grep and sed to avoid tty issues
VERSION=$(grep -m1 '"version"' package.json | sed -E 's/.*"version": "([^"]+)".*/\1/')

# Build the Docker image to incorporate any changes using the build script
source ./bin/build.sh

# Run the container with the newly built image
docker run -p $PORT:$PORT \
  -e PORT=$PORT \
  -e DOMAIN=$DOMAIN \
  oidc-mock:$VERSION

$SHELL
