import type { Grant } from 'oidc-provider';
import type Provider from 'oidc-provider';

/**
 * Returns either an existing grant or a new one.
 * @param oidcProvider The OIDC provider instance.
 * @param existingGrantId The existing grant ID.
 * @param accountId The account ID.
 * @param params The request parameters.
 * @returns The grant.
 */
export const getGrant = async (
    oidcProvider: Provider,
    existingGrantId: string | undefined,
    accountId: string,
    params: Record<string, unknown>,
): Promise<Grant> => {
    let grant: Grant | undefined;

    // Create grant or use existing one.
    if (existingGrantId) {
        const foundGrant = await oidcProvider.Grant.find(existingGrantId);
        if (foundGrant) grant = foundGrant;
    }

    // Create new grant if none exists.
    if (!grant) {
        grant = new oidcProvider.Grant({
            accountId,
            clientId: String(params['client_id']),
        });
    }

    return grant;
};
