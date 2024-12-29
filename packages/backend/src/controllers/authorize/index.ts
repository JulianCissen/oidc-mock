import { Controller } from '../Controller';
import { authenticationRequestQueryParams } from '../../validators/oidc';
import { config } from '../../config';
import { sessionService } from '../../services/sessionService';

class AuthorizeController extends Controller {
    constructor() {
        super();
        this.createRoute(
            'get',
            '/authorize',
            {
                query: authenticationRequestQueryParams,
            },
            (req, res) => {
                const sessionId = sessionService.createSession(req.query);
                res.redirect(
                    `${config.devHost ?? ''}/login?session_id=${sessionId}`,
                );
            },
        );
    }
}

export const authorizeController = new AuthorizeController();
