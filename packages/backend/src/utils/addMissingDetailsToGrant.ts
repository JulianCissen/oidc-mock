import type { Grant } from 'oidc-provider';
import { z } from 'zod';

const missingDetailsValidator = z.object({
    missingOIDCScope: z.array(z.string()).optional(),
    missingOIDCClaims: z.array(z.string()).optional(),
    missingResourceScopes: z.record(z.array(z.string())).optional(),
});

/**
 * Add missing details to a grant.
 * @param details An object containing missing details.
 * @param grant The grant to add the missing details to.
 * @returns The updated grant.
 */
export const addMissingDetailsToGrant = (
    details: Record<string, unknown>,
    grant: Grant,
): Grant => {
    const parsedDetails = missingDetailsValidator.parse(details);

    // Add missing scopes and claims.
    if (parsedDetails.missingOIDCScope?.length)
        grant.addOIDCScope(parsedDetails.missingOIDCScope.join(' '));
    if (parsedDetails.missingOIDCClaims?.length)
        grant.addOIDCClaims(parsedDetails.missingOIDCClaims);

    // Add resource scopes if present.
    if (parsedDetails.missingResourceScopes) {
        Object.entries(parsedDetails.missingResourceScopes).forEach(
            ([indicator, scopes]) => {
                grant.addResourceScope(indicator, scopes.join(' '));
            },
        );
    }

    return grant;
};
