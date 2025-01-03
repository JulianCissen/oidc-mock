import Provider from 'oidc-provider';
import { claimSets } from '../../config/claims';
import { config } from '../../config';

const oidcProvider = new Provider(config.provider.iss, {
    clients: config.clients,
    findAccount: (_, id) => {
        const idNumber = parseInt(id, 10);
        const claims = claimSets[idNumber];
        if (!claims) throw new Error('Claims not found');
        return {
            accountId: id,
            claims: () => claims,
        };
    },
    // should configure JWKS, but where to set the private key?
    features: {
        devInteractions: { enabled: false },
        introspection: { enabled: true },
        jwtIntrospection: { enabled: true, ack: 'draft-10' },
    },
    cookies: {
        keys: config.cookies.keys,
        long: {
            signed: true,
            path: '/',
        },
        short: {
            signed: true,
            path: '/',
        },
    },
    interactions: {
        url: (_, interaction) => {
            if (interaction.prompt.name === 'login') return '/login';
            if (interaction.prompt.name === 'consent') return '/consent';
            return '/';
        },
    },
    pkce: {
        // Don't require PKCE since it's a mock server that doesn't serve secure content.
        required: (_1, _2) => false,
    },
});
oidcProvider.proxy = true;

export { oidcProvider };
