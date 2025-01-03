import Provider from 'oidc-provider';
import { claimSets } from '../../config/claims';
import { config } from '../../config';

const oidcProvider = new Provider('http://localhost:8080', {
    findAccount: (_, id) => {
        const idNumber = parseInt(id, 10);
        const claims = claimSets[idNumber];
        if (!claims) throw new Error('Claims not found');
        return {
            accountId: id,
            claims: () => claims,
        };
    },
    interactions: {
        url: (_, interaction) => {
            console.log(interaction.prompt.name);
            if (interaction.prompt.name === 'login') return '/login';
            if (interaction.prompt.name === 'consent') return '/consent';
            return '/';
        },
    },
    features: {
        devInteractions: { enabled: false },
    },
    cookies: {
        // Replace with a generated cookie key.
        keys: [config.cookieKey],
        long: {
            signed: true,
            path: '/',
        },
        short: {
            signed: true,
            path: '/',
        },
    },
    // initial
    clients: [
        {
            client_id: '123',
            client_secret: 'secret',
            redirect_uris: ['http://localhost:8080/cb'],
        },
    ],
    pkce: {
        required: (_1, _2) => false,
    },
});
oidcProvider.proxy = true;

export { oidcProvider };
