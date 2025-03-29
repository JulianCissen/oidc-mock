# OIDC Mock Provider - NGINX Configuration

This package contains NGINX configuration files for the OIDC Mock Provider.

## Files

- `development.conf` - NGINX configuration for development environment
- `production.conf` - NGINX configuration for production environment

## Development Configuration

The development configuration is designed to proxy requests to locally running development servers:

- Frontend server at host.docker.internal:9000
- Backend server at host.docker.internal:3000

## Production Configuration

The production configuration is designed for the Docker container:

- Serves the built frontend from /usr/share/nginx/html
- Proxies API requests to the locally running backend on port 3000
