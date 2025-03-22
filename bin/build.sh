#!/bin/bash

# Change to the parent directory of where the script is located
cd "$(dirname "$0")/.."

docker build --target production -t oidc-mock:1.0.0 .

$SHELL
