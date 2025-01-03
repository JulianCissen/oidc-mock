import { Controller } from '../Controller';
import type { Grant } from 'oidc-provider';
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
                const interactionDetails =
                    await oidcProvider.interactionDetails(req, res);
                const {
                    prompt: { name, details },
                    params,
                    // @ts-expect-error test
                    session: { accountId },
                } = interactionDetails;
                if (name !== 'consent') {
                    throw new Error('Expected consent prompt');
                }

                let { grantId } = interactionDetails;
                let grant: Grant;

                if (grantId) {
                    const foundGrant = await oidcProvider.Grant.find(grantId);
                    if (!foundGrant) {
                        throw new Error('Grant not found');
                    }
                    grant = foundGrant;
                } else {
                    grant = new oidcProvider.Grant({
                        accountId,
                        clientId: String(params['client_id']),
                    });
                }

                const parsedDetails = missingDetailsValidator.parse(details);

                if (parsedDetails.missingOIDCScope) {
                    grant.addOIDCScope(
                        parsedDetails.missingOIDCScope.join(' '),
                    );
                }
                if (parsedDetails.missingOIDCClaims) {
                    grant.addOIDCClaims(parsedDetails.missingOIDCClaims);
                }
                if (parsedDetails.missingResourceScopes) {
                    for (const [indicator, scopes] of Object.entries(
                        parsedDetails.missingResourceScopes,
                    )) {
                        grant.addResourceScope(indicator, scopes.join(' '));
                    }
                }

                grantId = await grant.save();

                const consent: { grantId?: string } = {};
                if (!interactionDetails.grantId) {
                    consent.grantId = grantId;
                }

                const result = { consent };
                await oidcProvider.interactionFinished(req, res, result, {
                    mergeWithLastSubmission: true,
                });
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
