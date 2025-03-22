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

docker build --target development -t oidc-mock .
docker run --name oidc-mock-dev -p 8080:8080 oidc-mock

$SHELL
