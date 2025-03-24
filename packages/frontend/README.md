# OIDC Mock Provider - Frontend

This package contains the Vue.js/Quasar user interface for the OIDC Mock Provider.

## Development

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The development server will start on port 9000.

## Features

- User interface for selecting claim sets during login
- Consent screen for authorization
- Internal OIDC client for testing
- Dark mode support

## Pages

- `/` - Landing page with login button
- `/login` - Claims selection page
- `/consent` - Consent page
- `/callback` - Internal client callback page

## Building

```bash
# Build for production
npm run build
```

The build output will be in the `dist/spa` directory.

## Testing

This project uses Playwright for end-to-end testing.

The tests will automatically start the complete application stack using the `run_dev.sh` script, which:
1. Builds and starts the Docker container with Nginx
2. Starts the frontend development server
3. Starts the backend development server

```bash
# Install Playwright browsers
npx playwright install

# Run tests (will use bin/run_dev.sh)
npm run test

# Run tests with UI
npm run test:ui

# Debug tests
npm run test:debug
```

### Requirements for Testing

- Docker installed and running
- Bash environment (Git Bash on Windows)
- All dependencies installed for backend and frontend
