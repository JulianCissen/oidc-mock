#!/bin/bash

# Change to the parent directory of where the script is located
cd "$(dirname "$0")/.."

# Remove any existing container with the same name
docker rm -f oidc-mock 2>/dev/null || true

docker run --name oidc-mock -p 8080:8080 oidc-mock:1.0.0

$SHELL
