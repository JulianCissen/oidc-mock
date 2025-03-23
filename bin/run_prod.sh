#!/bin/bash

# Change to the parent directory of where the script is located
cd "$(dirname "$0")/.."

# Remove any existing container with the same name
docker rm -f oidc-mock 2>/dev/null || true

# Default port is 8080 if not provided
PORT=${1:-8080}

# Get version from package.json - use grep and sed to avoid tty issues
VERSION=$(grep -m1 '"version"' package.json | sed -E 's/.*"version": "([^"]+)".*/\1/')

# Build the Docker image to incorporate any changes using the build script
source ./bin/build.sh

# Run the container with the newly built image
# Using -it to keep the terminal attached to the container
docker run --name oidc-mock -it -p $PORT:$PORT -e PORT=$PORT oidc-mock:$VERSION

$SHELL
