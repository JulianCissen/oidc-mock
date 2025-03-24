import type {
    AccessToken,
    AuthorizationCode,
    BackchannelAuthenticationRequest,
    Client,
    ClientCredentials,
    DeviceCode,
    Grant,
    IdToken,
    Interaction,
    KoaContextWithOIDC,
    RefreshToken,
    Session,
    TTLFunction,
} from 'oidc-provider';
import { config } from '../config';
import { z } from 'zod';

/**
 * Maps all possible token types to their corresponding classes
 */
export type TokenMap = {
    accessToken: AccessToken;
    authorizationCode: AuthorizationCode;
    backchannelAuthenticationRequest: BackchannelAuthenticationRequest;
    clientCredentials: ClientCredentials;
    deviceCode: DeviceCode;
    grant: Grant;
    idToken: IdToken;
    interaction: Interaction;
    refreshToken: RefreshToken;
    session: Session;
};

/**
 * Default TTL values for all token types (in seconds)
 */
export const DEFAULT_TOKEN_LIFETIMES = {
    accessToken: 3600, // 1 hour
    authorizationCode: 60, // 1 minute
    backchannelAuthenticationRequest: 600, // 10 minutes
    clientCredentials: 600, // 10 minutes
    deviceCode: 600, // 10 minutes
    grant: 60 * 60 * 24 * 14, // 14 days
    idToken: 3600, // 1 hour
    interaction: 3600, // 1 hour
    refreshToken: 60 * 60 * 24 * 7, // 7 days
    session: 60 * 60 * 24, // 24 hours
};

/**
 * Zod schema for token lifetimes configuration
 */
export const tokenLifetimesSchema = z.object({
    accessToken: z.number(),
    authorizationCode: z.number(),
    backchannelAuthenticationRequest: z.number(),
    clientCredentials: z.number(),
    deviceCode: z.number(),
    grant: z.number(),
    idToken: z.number(),
    interaction: z.number(),
    refreshToken: z.number(),
    session: z.number(),
});

/**
 * Retrieves the token lifetimes for a specific client.
 * @param client The client.
 * @returns The token lifetimes for the client.
 */
export const getClientTTLs = (
    client?: Client,
): typeof config.provider.tokenLifetimes => {
    const clientConfig = config.clients.find(
        (c) => c.client_id === client?.clientId,
    );

    const defaultsCopy = structuredClone(config.provider.tokenLifetimes);
    return Object.assign(defaultsCopy, clientConfig?.tokenLifetimes || {});
};

/**
 * Creates a TTL function for a specific token type.
 * @param tokenType The type of token.
 * @returns A properly typed TTL function for the specified token type.
 */
export const createDefaultTTLFunction = <T extends keyof TokenMap>(
    tokenType: T,
): TTLFunction<TokenMap[T]> => {
    return (
        _ctx: KoaContextWithOIDC,
        _token: TokenMap[T],
        client: Client,
    ): number => getClientTTLs(client)[tokenType];
};

/**
 * TTL function for backchannel authentication requests. This function checks for a requested expiry parameter in the request and uses it if it is valid.
 * @param ctx The Koa context.
 * @param _ The backchannel authentication request.
 * @param client The client.
 * @returns The TTL for the backchannel authentication request.
 */
export const backchannelAuthenticationRequestTTL: TTLFunction<
    BackchannelAuthenticationRequest
> = (ctx, _, client) => {
    const requestedExpiry = ctx?.oidc.params?.['requested_expiry'];
    const requestedExpiryNumber =
        typeof requestedExpiry === 'string'
            ? parseInt(requestedExpiry, 10)
            : Number.NaN;

    const clientTTLs = getClientTTLs(client);

    if (requestedExpiryNumber && requestedExpiryNumber > 0) {
        return Math.min(
            clientTTLs.backchannelAuthenticationRequest,
            requestedExpiryNumber,
        );
    } else return clientTTLs.backchannelAuthenticationRequest;
};

/**
 * TTL function for refresh tokens. This function checks if the refresh token is rotated and if the client is a web application with no client authentication method.
 * @param ctx The Koa context.
 * @param token The refresh token.
 * @param client The client.
 * @returns The TTL for the refresh token.
 */
export const refreshTokenTTL: TTLFunction<RefreshToken> = (
    ctx,
    token,
    client,
) => {
    if (
        ctx?.oidc.entities.RotatedRefreshToken &&
        client.applicationType === 'web' &&
        client.clientAuthMethod === 'none' &&
        !token.isSenderConstrained()
    ) {
        // Non-Sender Constrained SPA Refresh Tokens do not have infinite expiration through rotation
        return ctx.oidc.entities.RotatedRefreshToken.remainingTTL;
    }

    return getClientTTLs(client).refreshToken;
};

// Create a TTL configuration object with all token types
export const ttlConfig = {
    AccessToken: createDefaultTTLFunction('accessToken'),
    AuthorizationCode: createDefaultTTLFunction('authorizationCode'),
    BackchannelAuthenticationRequest: backchannelAuthenticationRequestTTL,
    ClientCredentials: createDefaultTTLFunction('clientCredentials'),
    DeviceCode: createDefaultTTLFunction('deviceCode'),
    Grant: createDefaultTTLFunction('grant'),
    IdToken: createDefaultTTLFunction('idToken'),
    Interaction: createDefaultTTLFunction('interaction'),
    RefreshToken: refreshTokenTTL,
    Session: createDefaultTTLFunction('session'),
};
