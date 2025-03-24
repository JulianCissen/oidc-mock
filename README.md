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
    "iss": "http://localhost:8080",
    "tokenLifetimes": {
      "accessToken": 3600,
      "authorizationCode": 60,
      "backchannelAuthenticationRequest": 600,
      "clientCredentials": 600,
      "deviceCode": 600,
      "grant": 1209600,
      "idToken": 3600,
      "interaction": 3600,
      "refreshToken": 604800,
      "session": 86400
    }
  },
  "clients": [
    {
      "client_id": "my-client",
      "client_secret": "my-secret",
      "application_type": "web",
      "redirect_uris": ["https://my-app.example.com/callback"],
      "post_logout_redirect_uris": ["https://my-app.example.com"],
      "grant_types": ["authorization_code", "refresh_token"],
      "response_types": ["code"],
      "token_endpoint_auth_method": "client_secret_basic",
      "tokenLifetimes": {
        "accessToken": 7200,
        "authorizationCode": 600
      }
    }
  ],
  "cookies": {
    "keys": ["optional-cookie-encryption-key"]
  }
}
```

- `provider`: Configuration settings for the OIDC provider
  - `iss`: The issuer URL of your OIDC provider (required)
  - `tokenLifetimes`: Global default token lifetimes that apply to all clients

- `clients`: An array of client configurations
  - `client_id`: The client identifier (required)
  - `client_secret`: The client secret (required)
  - `application_type`: The type of application (optional, defaults to "web")
    - `web`: Server-side web applications that can maintain client secrets
    - `native`: Native applications (mobile, desktop) that can't securely store client secrets
  - `redirect_uris`: Array of valid redirect URIs after authentication (required)
  - `post_logout_redirect_uris`: Array of valid redirect URIs after logout (required)
  - `grant_types`: Array of grant types (optional, defaults to ["authorization_code", "refresh_token"])
  - `response_types`: Array of response types (optional, defaults to ["code"])
  - `token_endpoint_auth_method`: Authentication method for the token endpoint (optional, defaults to "client_secret_basic")
  - `tokenLifetimes`: Client-specific token lifetimes - these override the global defaults (all optional)

- `cookies`: Configuration for cookie handling
  - `keys`: Encryption keys for cookies (optional, auto-generated if not provided)

All token lifetimes are specified in seconds:

| Token Type                    | Default Value | Description                                    |
|-------------------------------|---------------|------------------------------------------------|
| `accessToken`                 | 3600          | Access token lifetime (1 hour)                 |
| `authorizationCode`           | 60            | Authorization code lifetime (1 minute)         |
| `backchannelAuthenticationRequest` | 600      | Backchannel authentication request (10 minutes)|
| `clientCredentials`           | 600           | Client credentials token lifetime (10 minutes) |
| `deviceCode`                  | 600           | Device code lifetime (10 minutes)              |
| `grant`                       | 1209600       | Grant lifetime (14 days)                       |
| `idToken`                     | 3600          | ID token lifetime (1 hour)                     |
| `interaction`                 | 3600          | Interaction lifetime (1 hour)                  |
| `refreshToken`                | 604800        | Refresh token lifetime (7 days)                |
| `session`                     | 86400         | Session lifetime (24 hours)                    |

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
