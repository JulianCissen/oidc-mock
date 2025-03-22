#!/bin/bash

# Change to the parent directory of where the script is located
cd "$(dirname "$0")/.."

docker run -p 8081:8080 oidc-mock:1.0.0

$SHELL
