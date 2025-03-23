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
