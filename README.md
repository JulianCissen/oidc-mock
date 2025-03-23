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
- Configurable token lifetimes
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

#### Server Configuration Format

The server configuration file should be a JSON file with the following structure:

```json
{
  "provider": {
    "iss": "http://localhost:8080"
  },
  "clients": [
    {
      "client_id": "my-client",
      "client_secret": "my-secret",
      "application_type": "web",
      "redirect_uris": ["https://my-app.example.com/callback"],
      "post_logout_redirect_uris": ["https://my-app.example.com"],
      "grant_types": ["authorization_code", "refresh_token"],
      "tokenLifetimes": {
        "accessToken": 7200,
        "authorizationCode": 600,
        "backchannelAuthenticationRequest": 600,
        "clientCredentials": 600,
        "deviceCode": 600,
        "grant": 1209600,
        "idToken": 3600,
        "interaction": 3600,
        "refreshToken": 604800,
        "session": 86400
      }
    }
  ],
  "cookies": {
    "keys": ["optional-cookie-encryption-key"]
  }
}
```

- `provider.iss`: The issuer URL of your OIDC provider
- `clients`: An array of client configurations
  - `client_id`: The client identifier
  - `client_secret`: The client secret
  - `application_type`: The type of application (optional, defaults to "web")
    - `web`: Server-side web applications that can maintain client secrets
    - `native`: Native applications (mobile, desktop) that can't securely store client secrets
  - `redirect_uris`: Array of valid redirect URIs after authentication
  - `post_logout_redirect_uris`: Array of valid redirect URIs after logout
  - `grant_types`: Array of grant types (defaults to ["authorization_code", "refresh_token"])
  - `tokenLifetimes`: Client-specific token lifetimes (all optional with defaults)
    - `accessToken`: Access token lifetime in seconds (default: 3600 - 1 hour)
    - `authorizationCode`: Authorization code lifetime in seconds (default: 60 - 1 minute)
    - `backchannelAuthenticationRequest`: Backchannel authentication request lifetime (default: 600 - 10 minutes)
    - `clientCredentials`: Client credentials token lifetime in seconds (default: 600 - 10 minutes)
    - `deviceCode`: Device code lifetime in seconds (default: 600 - 10 minutes)
    - `grant`: Grant lifetime in seconds (default: 1209600 - 14 days)
    - `idToken`: ID token lifetime in seconds (default: 3600 - 1 hour)
    - `interaction`: Interaction lifetime in seconds (default: 3600 - 1 hour)
    - `refreshToken`: Refresh token lifetime in seconds (default: 604800 - 7 days)
    - `session`: Session lifetime in seconds (default: 86400 - 24 hours)
- `cookies.keys`: Optional encryption keys for cookies (will be auto-generated if not provided)

You can use environment variables in your configuration file using `${VARIABLE_NAME}` syntax. For example:
```json
{
  "provider": {
    "iss": "http://${DOMAIN}:${PORT}"
  }
}
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

## Attributions

This project uses the Twitter Emoji (Twemoji) for its favicon:
- Copyright 2020 Twitter, Inc and other contributors
- Graphics licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/
- See [ATTRIBUTION.md](./ATTRIBUTION.md) for more details

## AI Assistance Disclaimer

This project was created with assistance from artificial intelligence tools, specifically GitHub Copilot. The AI tools helped with code generation, documentation, and project structure.

## License

MIT
