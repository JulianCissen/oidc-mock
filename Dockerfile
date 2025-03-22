# Use a base image with Node.js
FROM node:22-alpine AS development
# Install Nginx
RUN apk add --no-cache nginx
# Copy custom Nginx configuration
COPY ./nginx.conf /etc/nginx/nginx.conf
# Expose ports
EXPOSE 8080
# Start nginx
CMD ["sh", "-c", "nginx -g 'daemon off;'"]

FROM node:22-alpine AS project-builder
WORKDIR /app
COPY package*.json ./
RUN npm install

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
COPY ./tsconfig.json ./
RUN ["npm", "run", "build"]

# Production
FROM node:22-alpine AS production
WORKDIR /app
# Install Nginx
RUN apk add --no-cache nginx
# Copy Nginx configuration
COPY ./nginx.conf /etc/nginx/nginx.conf
# Copy frontend build output to Nginx html directory
COPY --from=frontend-build /app/frontend/dist/spa /usr/share/nginx/html
# Copy backend build output
COPY --from=backend-build /app/backend/package*.json /app/backend/
COPY --from=backend-build /app/backend/dist /app/backend
WORKDIR /app/backend
RUN ["npm", "install", "--omit=dev"]
WORKDIR /app
# Expose ports
EXPOSE 8080
# Start both Nginx and backend server
CMD ["sh", "-c", "nginx -g 'daemon off;' & node /app/backend/index.js"]
