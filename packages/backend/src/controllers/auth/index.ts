import { Controller } from '../Controller';
import type { RequestHandler } from 'express';
import { claimSets } from '../../config/claims';
import { oidcProvider } from '../oidc';
import { z } from 'zod';

const missingDetailsValidator = z.object({
    missingOIDCScope: z.array(z.string()).optional(),
    missingOIDCClaims: z.array(z.string()).optional(),
    missingResourceScopes: z.record(z.array(z.string())).optional(),
});

const noCacheMiddleware: RequestHandler<unknown, unknown, unknown, unknown> = (
    _,
    res,
    next,
) => {
    res.set('cache-control', 'no-store');
    next();
};

class AuthController extends Controller {
    constructor() {
        super();
        this.createRoute({
            method: 'get',
            route: '/claims',
            middlewares: [noCacheMiddleware],
            handler: () => {
                return claimSets;
            },
        });
        this.createRoute({
            method: 'post',
            route: '/select-claims',
            validators: {
                query: z.object({
                    claims_index: z.coerce.number(),
                }),
            },
            middlewares: [noCacheMiddleware],
            handler: async (req, res) => {
                // Make sure session is in login state.
                const {
                    prompt: { name },
                } = await oidcProvider.interactionDetails(req, res);
                if (name !== 'login') {
                    res.status(400).send('Expected login prompt');
                    return;
                }

                // Finish interaction.
                return await oidcProvider.interactionFinished(req, res, {
                    login: {
                        accountId: String(req.query.claims_index),
                    },
                });
            },
        });
        this.createRoute({
            method: 'post',
            route: '/consent',
            middlewares: [noCacheMiddleware],
            handler: async (req, res) => {
                const {
                    prompt: { name, details },
                    params,
                    grantId: existingGrantId,
                    session,
                } = await oidcProvider.interactionDetails(req, res);

                if (name !== 'consent') {
                    throw new Error('Expected consent prompt');
                }
                // Ensure session exists and get accountId
                if (!session) {
                    throw new Error('No session found');
                }
                const { accountId } = session;

                // Create grant or use existing one
                let grant;
                if (existingGrantId) {
                    grant = await oidcProvider.Grant.find(existingGrantId);
                }
                // Create new grant if none exists
                if (!grant) {
                    grant = new oidcProvider.Grant({
                        accountId,
                        clientId: String(params['client_id']),
                    });
                }

                const parsedDetails = missingDetailsValidator.parse(details);

                // Add missing scopes and claims
                if (parsedDetails.missingOIDCScope?.length)
                    grant.addOIDCScope(
                        parsedDetails.missingOIDCScope.join(' '),
                    );
                if (parsedDetails.missingOIDCClaims?.length)
                    grant.addOIDCClaims(parsedDetails.missingOIDCClaims);

                // Add resource scopes if present
                if (parsedDetails.missingResourceScopes) {
                    Object.entries(parsedDetails.missingResourceScopes).forEach(
                        ([indicator, scopes]) => {
                            grant.addResourceScope(indicator, scopes.join(' '));
                        },
                    );
                }

                const grantId = await grant.save();
                const consent = !existingGrantId ? { grantId } : {};

                await oidcProvider.interactionFinished(
                    req,
                    res,
                    { consent },
                    {
                        mergeWithLastSubmission: true,
                    },
                );
            },
        });
        this.createRoute({
            method: 'get',
            route: '/abort',
            middlewares: [noCacheMiddleware],
            handler: async (req, res) => {
                await oidcProvider.interactionFinished(req, res, {
                    error: 'access_denied',
                    error_description: 'End-User aborted interaction',
                });
            },
        });
    }
}

export const authController = new AuthController();
