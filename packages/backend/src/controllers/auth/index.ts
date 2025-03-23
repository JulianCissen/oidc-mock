import { Controller } from '../Controller';
import type { RequestHandler } from 'express';
import { addMissingDetailsToGrant } from '../../utils/addMissingDetailsToGrant';
import { claimSets } from '../../config/claims';
import { getGrant } from '../../utils/getGrant';
import { oidcProvider } from '../oidc';
import { z } from 'zod';

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

                let grant = await getGrant(
                    oidcProvider,
                    existingGrantId,
                    accountId,
                    params,
                );
                grant = addMissingDetailsToGrant(details, grant);

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
