import { OidcClient } from 'oidc-client-ts';

export const oidcClient = new OidcClient({
    client_id: 'client',
    client_secret: 'secret',
    client_authentication: 'client_secret_basic',
    redirect_uri: 'http://localhost:8080/callback',
    response_type: 'code',
    scope: 'openid',
    authority: '/oidc',
    post_logout_redirect_uri: 'http://localhost:8080',
});
