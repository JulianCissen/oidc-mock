# OIDC Mock Provider

A mock OpenID Connect (OIDC) provider for development and testing purposes, packaged as a Docker container.

## Overview

This project consists of:
- **Backend**: An Express.js server implementing the OIDC provider using [oidc-provider](https://github.com/panva/node-oidc-provider)
- **Frontend**: A Vue.js/Quasar application providing a user interface for login and consent screens

## Features

- Complete OIDC authentication flow with authorization code grant
- Customizable user claims
- Customizable server configuration
- Dark mode support
- Docker containerization for easy deployment

## Quick Start

### Running in Development Mode

```bash
# Clone the repository
git clone https://github.com/JulianCissen/oidc-mock.git
cd oidc-mock

# Start development servers and Docker container
./bin/run_dev.sh 8080
```

This starts:
1. Frontend development server
2. Backend development server
3. Docker container with Nginx reverse proxy

### Running in Production Mode

```bash
# Build and run the production Docker container
./bin/run_prod.sh 8080
```

## Configuration

### Custom Claims

You can provide a custom claims file during runtime by mounting it to the container and setting the `CUSTOM_CLAIMS_PATH` environment variable.

Example:
```bash
docker run -p 8080:8080 \
    -v /path/to/custom_claims.json:/app/backend/config/custom_claims.json \
    -e CUSTOM_CLAIMS_PATH=/app/backend/config/custom_claims.json \
    oidc-mock:1.0.0
```

Default claims structure:
```json
[
    {
        "sub": "admin",
        "username": "admin"
    },
    {
        "sub": "foo",
        "roles": ["user"]
    }
]
```

### Custom Server Configuration

You can provide a custom server configuration file during runtime by mounting it to the container and setting the `CUSTOM_SERVER_CONFIG_PATH` environment variable.

Example:
```bash
docker run -p 8080:8080 \
    -v /path/to/custom_server_config.json:/app/backend/config/custom_server_config.json \
    -e CUSTOM_SERVER_CONFIG_PATH=/app/backend/config/custom_server_config.json \
    oidc-mock:1.0.0
```

### Custom Port Configuration

You can specify a custom port for the Nginx server by setting the `PORT` environment variable:

```bash
docker run -p 9000:9000 \
    -e PORT=9000 \
    oidc-mock:1.0.0
```

If no port is specified, the default port 8080 will be used.

## Project Structure

- `/packages/backend`: OIDC provider implementation
- `/packages/frontend`: Quasar UI for login and consent screens
- `/bin`: Helper scripts for building and running the application
- `/nginx.*.conf`: Nginx configuration files for development and production

## License

MIT
