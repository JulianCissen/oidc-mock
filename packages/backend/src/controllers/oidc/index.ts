import Provider from 'oidc-provider';
import { claimSets } from '../../config/claims';

export const oidcProvider = new Provider('http://localhost:8080', {
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
            return `/login?session_id=${interaction.uid}`;
        },
    },
    features: {
        devInteractions: { enabled: false },
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
