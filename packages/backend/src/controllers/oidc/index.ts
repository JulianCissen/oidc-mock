import Provider, {
    type FindAccount,
    type Interaction,
    type KoaContextWithOIDC,
} from 'oidc-provider';
import { claimSets } from '../../config/claims';
import { config } from '../../config';

// Account finder function
const findAccount: FindAccount = (_, id) => {
    const idNumber = parseInt(id, 10);
    const claims = claimSets[idNumber];
    if (!claims) throw new Error('Claims not found');
    return {
        accountId: id,
        claims: () => claims,
    };
};

// Logout source HTML template
const logoutSource = (ctx: KoaContextWithOIDC, form: string) => {
    ctx.body = `<!DOCTYPE html>
                <html>
                <head>
                    <title>Logging out...</title>
                </head>
                <body>
                    <div>
                        ${form}
                        <script>
                        document.forms['op.logoutForm'].submit();
                        </script>
                    </div>
                </body>
                </html>`;
};

// Custom interaction routes
const interactionRoutes = (_: KoaContextWithOIDC, interaction: Interaction) => {
    if (interaction.prompt.name === 'login') return '/login';
    if (interaction.prompt.name === 'consent') return '/consent';
    return '/';
};

// Provider configuration
const providerConfig = {
    clients: config.clients,
    findAccount,

    features: {
        devInteractions: { enabled: false },
        introspection: { enabled: true },
        jwtIntrospection: { enabled: true, ack: 'draft-10' },
        rpInitiatedLogout: {
            enabled: true,
            logoutSource,
        },
    },

    clientBasedCORS: () => true,

    cookies: {
        keys: config.cookies.keys,
        long: { signed: true, path: '/' },
        short: { signed: true, path: '/' },
    },

    interactions: {
        url: interactionRoutes,
    },

    pkce: {
        // Don't require PKCE since it's a mock server that doesn't serve secure content.
        required: () => false,
    },
};

// Initialize provider
const oidcProvider = new Provider(config.provider.iss, providerConfig);
oidcProvider.proxy = true;

// Set custom behavior to destroy session on rp-initiated logout.
oidcProvider.use(async (ctx, next) => {
    await next();
    if (ctx['oidc']['route'] === 'end_session_confirm') {
        ctx['oidc']['session'].destroy();
    }
});

export { oidcProvider };
