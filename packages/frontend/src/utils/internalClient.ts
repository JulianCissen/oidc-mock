import { UserManager } from 'oidc-client-ts';

// Get the current host and port from the browser
const host = window.location.host;

export const userManager = new UserManager({
    client_id: 'client',
    client_secret: 'secret',
    client_authentication: 'client_secret_basic',
    redirect_uri: `https://${host}/callback`,
    response_type: 'code',
    scope: 'openid',
    authority: '/oidc',
    post_logout_redirect_uri: `https://${host}`,
    // Use the minimal HTML page in the public directory
    silent_redirect_uri: `https://${host}/silent-renew.html`,
    automaticSilentRenew: true,
    includeIdTokenInSilentRenew: true,
});
