# Use a base image with Node.js
FROM node:22-alpine AS development
# Install Nginx and gettext (for envsubst)
RUN apk add --no-cache nginx gettext
# Copy custom Nginx configuration
COPY ./nginx.development.conf /etc/nginx/nginx.conf.template
# Set default port to 8080
ENV PORT=8080
# Expose ports
EXPOSE ${PORT}
# Start nginx with envsubst to replace environment variables
CMD ["sh", "-c", "envsubst '$$PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]

FROM node:22-alpine AS project-builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY tsconfig.json ./

# Build frontend
FROM project-builder AS frontend-build
WORKDIR /app/frontend
COPY ./packages/frontend/package*.json ./
RUN ["npm", "install", "--ignore-scripts"]
COPY ./packages/frontend ./
RUN ["npm", "run", "postinstall"]
RUN ["npm", "run", "build"]

# Build backend
FROM project-builder AS backend-build
WORKDIR /app/backend
COPY ./packages/backend/package*.json ./
RUN ["npm", "install"]
COPY ./packages/backend ./
# Copy the root tsconfig.json into the backend directory
COPY ./tsconfig.json ./tsconfig.root.json
RUN ["sh", "-c", "sed 's|../../tsconfig.json|./tsconfig.root.json|' ./tsconfig.json > ./tsconfig.temp.json && mv ./tsconfig.temp.json ./tsconfig.json"]
RUN ["npm", "run", "build"]

# Production
FROM node:22-alpine AS production
WORKDIR /app
# Install Nginx and other required packages
RUN apk add --no-cache nginx gettext dumb-init
# Copy Nginx configuration template
COPY ./nginx.production.conf /etc/nginx/nginx.conf.template
# Copy frontend build output to Nginx html directory
COPY --from=frontend-build /app/frontend/dist/spa /usr/share/nginx/html
# Copy backend build output
COPY --from=backend-build /app/backend/package*.json /app/backend/
COPY --from=backend-build /app/backend/dist /app/backend
# Ensure the default claims.json and development.json are included in the correct location
COPY ./packages/backend/src/config/claims.json /app/backend/defaults/claims.json
COPY ./packages/backend/src/config/development.json /app/backend/defaults/development.json
WORKDIR /app/backend
RUN ["npm", "install", "--omit=dev"]
WORKDIR /app

# Allow mounting a custom claims file, default to the built-in claims.json
ENV CUSTOM_CLAIMS_PATH=/app/backend/defaults/claims.json
# Allow mounting a custom server config file, default to the built-in development.json
ENV CUSTOM_SERVER_CONFIG_PATH=/app/backend/defaults/development.json
ENV NODE_ENV=production
# Set default port
ENV PORT=8080

# Expose ports
EXPOSE ${PORT}

# Create a startup script that properly handles the environment variables
RUN printf '#!/bin/sh\n\
# Use the PORT environment variable directly - no need to redefine default\n\
# Replace PORT with the actual value in nginx conf\n\
sed "s/\${PORT}/$PORT/g" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf\n\
# Start nginx in the background\n\
nginx -g "daemon off;" &\n\
# Start the backend server\n\
cd /app/backend && node index.js\n\
' > /app/start.sh && \
    chmod +x /app/start.sh

# Start both Nginx and backend server using dumb-init
CMD ["dumb-init", "/app/start.sh"]
