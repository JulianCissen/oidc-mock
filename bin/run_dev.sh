#!/bin/bash

# Change to the parent directory of where the script is located
cd "$(dirname "$0")/.."

# Remove any existing container with the same name
docker rm -f oidc-mock-dev 2>/dev/null || true

# Default port is 8080 if not provided
PORT=${1:-8080}

# Build the Docker image to incorporate any changes (explicit rebuild)
echo "Building Docker development image..."
docker build --target development -t oidc-mock:development .

# Run frontend and backend in the same terminal using background jobs
echo "Starting frontend and backend development servers..."
(cd packages/frontend && npm run dev) &
FRONTEND_PID=$!

# Run backend with PORT environment variable set using cross-env
(cd packages/backend && npx cross-env PORT=$PORT npm run dev) &
BACKEND_PID=$!

# Run the container with the newly built image with explicit host mapping
echo "Starting development container on port $PORT..."
docker run --name oidc-mock-dev \
  -p $PORT:$PORT \
  -e PORT=$PORT \
  --add-host=host.docker.internal:host-gateway \
  oidc-mock:development &
DOCKER_PID=$!

# Handle cleanup on script exit (Ctrl+C)
trap 'echo "Shutting down all processes..."; kill $FRONTEND_PID $BACKEND_PID; docker stop oidc-mock-dev; echo "Done!"' EXIT

# Keep the script running until user presses Ctrl+C
echo "All development services started. Press Ctrl+C to stop."
wait
