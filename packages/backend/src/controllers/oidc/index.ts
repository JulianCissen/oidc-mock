import Provider, {
    type Configuration,
    type FindAccount,
    type Interaction,
    type KoaContextWithOIDC,
    errors,
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

const corsProp = 'urn:custom:client:allowed-cors-origins';
const isOrigin = (value: unknown) => {
    return typeof value === 'string' && URL.parse(value)?.origin === value;
};

// Initialize the provider asynchronously
export const initializeProvider = async (): Promise<Provider> => {
    // Generate the JWKS
    const privateKeys = await generateJWKS();

    // Provider configuration.
    const providerConfig: Configuration = {
        clientBasedCORS(_, origin, client) {
            // ctx.oidc.route can be used to exclude endpoints from this behaviour, in that case just return
            // true to always allow CORS on them, false to deny
            // you may also allow some known internal origins if you want to
            return (client[corsProp] as string[]).includes(origin);
        },

        clients: config.clients,

        extraClientMetadata: {
            properties: [corsProp],
            validator(_, key, value, metadata) {
                if (key === corsProp) {
                    // set default (no CORS)
                    if (value === undefined) {
                        metadata[corsProp] = [];
                        return;
                    }
                    // validate an array of Origin strings
                    if (!Array.isArray(value) || !value.every(isOrigin)) {
                        throw new errors.InvalidClientMetadata(
                            `${corsProp} must be an array of origins`,
                        );
                    }
                }
            },
        },

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
