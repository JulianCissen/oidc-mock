import { Controller } from '../Controller';
import { claims } from '../../config/claims';
import { sessionService } from '../../services/sessionService';
import { z } from 'zod';

class InternalController extends Controller {
    constructor() {
        super();
        this.createRoute('get', '/internal/claims', {}, (_, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(claims).status(200);
        });
        this.createRoute(
            'get',
            '/internal/resume',
            {
                query: z.object({
                    session_id: z.string(),
                    claims_index: z.coerce.number(),
                }),
            },
            (req, res) => {
                try {
                    const session = sessionService.consumeSession(
                        req.query.session_id,
                    );
                    // redirect with code
                    const redirectUrl = new URL(session.redirect_uri);
                    redirectUrl.searchParams.set('code', '1234');
                    res.redirect(redirectUrl.toString());
                } catch (error) {
                    res.sendStatus(400);
                }
            },
        );
    }
}

export const internalController = new InternalController();
