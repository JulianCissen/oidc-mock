import express, {
    type Request,
    type RequestHandler,
    type Router,
} from 'express';
import type { z } from 'zod';

/* eslint-disable @typescript-eslint/no-explicit-any */

export abstract class Controller {
    protected router: Router;

    constructor() {
        this.router = express.Router();
    }

    protected createRoute<
        TParams extends z.ZodType | undefined,
        TBody extends z.ZodType | undefined,
        TQuery extends z.ZodType | undefined,
    >(
        method: 'get' | 'post' | 'put' | 'delete',
        route: string,
        validators: {
            body?: TBody;
            query?: TQuery;
            params?: TParams;
        },
        handler: RequestHandler<
            TParams extends z.ZodType ? z.infer<TParams> : unknown,
            any,
            TBody extends z.ZodType ? z.infer<TBody> : unknown,
            TQuery extends z.ZodType ? z.infer<TQuery> : unknown
        >,
    ) {
        this.router[method](route, (req, res, next) => {
            if (validators.params) {
                const res = validators.params.parse(req.params);
                if (res.success) {
                    req.params = res.data;
                } else {
                    next(res.error);
                }
            }

            if (validators.body) {
                const res = validators.body.parse(req.body);
                if (res.success) {
                    req.body = res.data;
                } else {
                    next(res.error);
                }
            }

            if (validators.query) {
                const res = validators.query.parse(req.query);
                if (res.success) {
                    req.query = res.data;
                } else {
                    next(res.error);
                }
            }

            handler(
                req as Request<
                    TParams extends z.ZodType ? z.infer<TParams> : unknown,
                    any,
                    TBody extends z.ZodType ? z.infer<TBody> : unknown,
                    TQuery extends z.ZodType ? z.infer<TQuery> : unknown
                >,
                res,
                next,
            );
        });
    }

    public getRoutes(): Router {
        return this.router;
    }
}
