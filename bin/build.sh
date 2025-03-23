#!/bin/bash

# Change to the parent directory of where the script is located
cd "$(dirname "$0")/.."

# Get version from package.json - use grep and sed to avoid tty issues
VERSION=$(grep -m1 '"version"' package.json | sed -E 's/.*"version": "([^"]+)".*/\1/')

docker build --target production -t oidc-mock:$VERSION .
docker tag oidc-mock:$VERSION oidc-mock:latest

echo "Built Docker image oidc-mock:$VERSION and tagged as oidc-mock:latest"

# Keep terminal open only when script is run directly (not sourced)
# $0 is the name of the script when run directly, but not when sourced
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    $SHELL
fi
