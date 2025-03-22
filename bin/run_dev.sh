#!/bin/bash

# Change to the parent directory of where the script is located
cd "$(dirname "$0")/.."

cd packages/frontend
start sh -c "npm run dev"
cd ../backend
start sh -c "npm run dev"
cd ../..

# Remove any existing container with the same name
docker rm -f oidc-mock-dev 2>/dev/null || true

# Default port is 8080 if not provided
PORT=${1:-8080}

docker build --target development -t oidc-mock .
docker run --name oidc-mock-dev -p $PORT:$PORT -e PORT=$PORT oidc-mock

$SHELL
