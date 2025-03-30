#######################################################
# Development stage - for local development environment
#######################################################
FROM node:22-alpine AS development
# Install required packages.
RUN ["apk", "add", "--no-cache", "nginx", "gettext", "wget", "nss"]
# Install mkcert
RUN ["wget", "-O", "/usr/local/bin/mkcert", "https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64"]
RUN ["chmod", "+x", "/usr/local/bin/mkcert"]
# Copy and configure Nginx.
COPY ./packages/nginx/development.conf /etc/nginx/nginx.conf.template
# Copy certificate setup script
COPY ./packages/nginx/setup-certs.sh /app/setup-certs.sh
RUN ["chmod", "+x", "/app/setup-certs.sh"]
# Configure networking.
ENV PORT=8443
ENV DOMAIN=localhost
EXPOSE ${PORT}
# Start Nginx with environment variable substitution.
CMD ["sh", "-c", "/app/setup-certs.sh && envsubst '$$PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]

#######################################################
# Base builder stage - shared dependencies
#######################################################
FROM node:22-alpine AS project-builder
WORKDIR /app
COPY package*.json ./
RUN ["npm", "install"]
COPY tsconfig.json ./

#######################################################
# Frontend build stage
#######################################################
FROM project-builder AS frontend-build
WORKDIR /app/frontend
# Install frontend dependencies.
COPY ./packages/frontend/package*.json ./
RUN ["npm", "install", "--ignore-scripts"]
COPY ./packages/frontend ./
# These commands need to be run separately.
RUN ["npm", "run", "postinstall"]
RUN ["npm", "run", "build"]

#######################################################
# Backend build stage
#######################################################
FROM project-builder AS backend-build
WORKDIR /app/backend
# Install backend dependencies.
COPY ./packages/backend/package*.json ./
RUN ["npm", "install"]
COPY ./packages/backend ./
# Fix tsconfig path references.
COPY ./tsconfig.json ./tsconfig.root.json
RUN ["sh", "-c", "sed 's|../../tsconfig.json|./tsconfig.root.json|' ./tsconfig.json > ./tsconfig.temp.json && mv ./tsconfig.temp.json ./tsconfig.json"]
RUN ["npm", "run", "build"]

#######################################################
# Production stage - final image
#######################################################
FROM node:22-alpine AS production
WORKDIR /app
# Install runtime dependencies.
RUN ["apk", "add", "--no-cache", "nginx", "gettext", "dumb-init", "wget", "nss"]
# Install mkcert
RUN ["wget", "-O", "/usr/local/bin/mkcert", "https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64"]
RUN ["chmod", "+x", "/usr/local/bin/mkcert"]
# Copy nginx cert setup script
COPY ./packages/nginx/setup-certs.sh /app/setup-certs.sh
RUN ["chmod", "+x", "/app/setup-certs.sh"]
# Copy Nginx configuration template.
COPY ./packages/nginx/production.conf /etc/nginx/nginx.conf.template
# Copy frontend build artifacts.
COPY --from=frontend-build /app/frontend/dist/spa /usr/share/nginx/html
# Copy backend build artifacts.
COPY --from=backend-build /app/backend/package*.json /app/backend/
COPY --from=backend-build /app/backend/dist /app/backend
# Copy default configuration files.
COPY ./packages/backend/src/config/claims.json /app/backend/defaults/claims.json
COPY ./packages/backend/src/config/development.json /app/backend/defaults/development.json
# Install production-only backend dependencies.
WORKDIR /app/backend
RUN ["npm", "install", "--omit=dev"]
WORKDIR /app
# Configuration environment variables.
ENV CUSTOM_CLAIMS_PATH=/app/backend/defaults/claims.json
ENV CUSTOM_SERVER_CONFIG_PATH=/app/backend/defaults/development.json
ENV NODE_ENV=production
ENV PORT=8443
ENV DOMAIN=localhost
# Expose port.
EXPOSE ${PORT}
# Create startup script.
RUN ["sh", "-c", "printf '#!/bin/sh\\n\
/app/setup-certs.sh\\n\
sed \"s/\\${PORT}/$PORT/g\" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf\\n\
nginx -g \"daemon off;\" &\\n\
cd /app/backend && node index.js\\n\
' > /app/start.sh && chmod +x /app/start.sh"]
# Start services with proper process management.
CMD ["dumb-init", "/app/start.sh"]
