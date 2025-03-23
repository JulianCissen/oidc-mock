#!/bin/bash

# Change to the parent directory of where the script is located
cd "$(dirname "$0")/.."

docker build --target production -t oidc-mock:production .

# Keep terminal open only when script is run directly (not sourced)
# $0 is the name of the script when run directly, but not when sourced
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    $SHELL
fi
