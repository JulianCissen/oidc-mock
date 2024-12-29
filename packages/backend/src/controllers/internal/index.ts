import { Controller } from '../Controller';
import { claims } from '../../config/claims';

class InternalController extends Controller {
    constructor() {
        super();
        this.createRoute('get', '/internal/claims', {}, (_, res) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.json(claims).status(200);
        });
    }
}

export const internalController = new InternalController();
