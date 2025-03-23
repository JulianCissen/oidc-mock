# OIDC Mock Provider - Backend

This package contains the Express.js implementation of the OIDC provider using [oidc-provider](https://github.com/panva/node-oidc-provider).

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The backend server will start on port 3000 by default, or the port specified in the `PORT` environment variable.

## API Routes

### OIDC Endpoints

All standard OIDC endpoints are available at `/oidc/`:

- `GET /oidc/.well-known/openid-configuration` - OIDC discovery endpoint
- `GET /oidc/auth` - Authorization endpoint
- `POST /oidc/token` - Token endpoint
- `GET /oidc/userinfo` - User info endpoint
- `GET /oidc/jwks` - JSON Web Key Set endpoint

### Authentication Endpoints

Custom authentication endpoints:

- `GET /auth/claims` - Get available claim sets
- `POST /auth/select-claims?claims_index=X` - Select a claim set for authentication
- `POST /auth/consent` - Grant consent for the requested scopes
- `GET /auth/abort` - Abort the authentication process

## Configuration

For configuration options, please see the main README.md file in the project root.
