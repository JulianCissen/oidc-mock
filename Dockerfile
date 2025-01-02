# Use a base image with Node.js
FROM node:22-alpine

# Set the working directory for the frontend
#WORKDIR /app/frontend
#COPY ./packages/frontend/package*.json ./
#RUN ["npm", "install", "--ignore-scripts"]
#COPY ./packages/frontend .
#RUN ["npm", "run", "postinstall"]
#COPY ./eslint.config.js ./eslint.config.cjs
#
## Set the working directory for the backend
#WORKDIR /app/backend
#COPY ./packages/backend/package*.json ./
#RUN ["npm", "install"]
#COPY ./packages/backend .

# Install Nginx
RUN apk add --no-cache nginx

# Copy custom Nginx configuration
COPY ./nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 8080

# Start both the Vue.js and Node.js servers and Nginx
#CMD ["sh", "-c", "cd /app/frontend && npm run dev & cd /app/backend && npm run dev & nginx -g 'daemon off;'"]
CMD ["sh", "-c", "nginx -g 'daemon off;'"]
