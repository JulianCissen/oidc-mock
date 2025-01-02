import { Controller } from '../Controller';
import { claimSets } from '../../config/claims';
import { oidcProvider } from '../oidc';
import { z } from 'zod';

class AuthController extends Controller {
    constructor() {
        super();
        this.createRoute('get', '/claims', {}, () => {
            return claimSets;
        });
        this.createRoute(
            'get',
            '/select-claims',
            {
                query: z.object({
                    session_id: z.string(),
                    claims_index: z.coerce.number(),
                }),
            },
            async (req, res) => {
                return await oidcProvider.interactionFinished(req, res, {
                    login: {
                        accountId: String(req.query.claims_index),
                    },
                });
            },
        );
    }
}

export const authController = new AuthController();
