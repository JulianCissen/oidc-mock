import Provider, {
    type Configuration,
    type FindAccount,
    type Interaction,
    type KoaContextWithOIDC,
} from 'oidc-provider';
import { claimSets } from '../../config/claims';
import { config } from '../../config';
import { generateJWKS } from '../../utils/generateJWKS';
import { ttlConfig } from '../../utils/ttlConfig';

// Account finder function.
const findAccount: FindAccount = (_, id) => {
    const idNumber = parseInt(id, 10);
    const claims = claimSets[idNumber];
    if (!claims) throw new Error('Claims not found');
    return {
        accountId: id,
        claims: () => claims,
    };
};

// Logout source HTML template.
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

// Custom interaction routes.
const interactionRoutes = (_: KoaContextWithOIDC, interaction: Interaction) => {
    if (interaction.prompt.name === 'login') return '/login';
    if (interaction.prompt.name === 'consent') return '/consent';
    return '/';
};

// Create a variable for the provider that will be initialized asynchronously
let oidcProvider: Provider;

// Initialize the provider asynchronously
export const initializeProvider = async (): Promise<Provider> => {
    // Generate the JWKS
    const privateKeys = await generateJWKS();

    // Provider configuration.
    const providerConfig: Configuration = {
        claims: config.claims,

        clientBasedCORS: () => true,

        clients: config.clients,

        findAccount,

        features: {
            devInteractions: { enabled: false },
            introspection: { enabled: true },
            jwtIntrospection: { enabled: true },
            rpInitiatedLogout: {
                enabled: true,
                logoutSource,
            },
        },

        cookies: {
            keys: config.cookies.keys,
            long: { signed: true, path: '/', secure: true },
            short: { signed: true, path: '/', secure: true },
        },

        interactions: {
            url: interactionRoutes,
        },

        jwks: privateKeys,

        pkce: {
            // Don't require PKCE since it's a mock server that doesn't serve secure content.
            required: () => false,
        },

        renderError(ctx, _, error) {
            ctx.res.err = error;
            return;
        },

        // Use the comprehensive TTL configuration with all token types
        ttl: ttlConfig,
    };

    // Initialize provider.
    const provider = new Provider(config.provider.iss, providerConfig);
    provider.proxy = true;

    // Set custom behavior to destroy session on rp-initiated logout.
    provider.use(async (ctx, next) => {
        await next();
        if (ctx['oidc']['route'] === 'end_session_confirm') {
            ctx['oidc']['session'].destroy();
        }
    });

    // Store the initialized provider
    oidcProvider = provider;
    return provider;
};

// Export a getter function that ensures the provider is initialized
export const getProvider = (): Provider => {
    if (!oidcProvider) {
        throw new Error(
            'OIDC Provider has not been initialized. Call initializeProvider() first.',
        );
    }
    return oidcProvider;
};

// For backward compatibility
export { oidcProvider };
