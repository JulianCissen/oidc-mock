#!/bin/bash

# Change to the parent directory of where the script is located
cd "$(dirname "$0")/.."

# Remove any existing container with the same name
docker rm -f oidc-mock 2>/dev/null || true

# Default port is 8080 if not provided
PORT=${1:-8080}

docker run --name oidc-mock -p $PORT:$PORT -e PORT=$PORT oidc-mock:1.0.0

$SHELL
