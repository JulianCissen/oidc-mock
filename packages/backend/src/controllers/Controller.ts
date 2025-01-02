import express, {
    type Request,
    type RequestHandler,
    type Response,
    type Router,
} from 'express';
import type { z } from 'zod';

export abstract class Controller {
    protected router: Router;

    constructor() {
        this.router = express.Router();
    }

    protected createRoute<
        TParams extends z.ZodType | undefined,
        TResult,
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
        handler: (
            request: Request<
                TParams extends z.ZodType ? z.infer<TParams> : unknown,
                TResult,
                TBody extends z.ZodType ? z.infer<TBody> : unknown,
                TQuery extends z.ZodType ? z.infer<TQuery> : unknown
            >,
            response: Response<TResult>,
            next: RequestHandler,
        ) => Promise<TResult> | TResult,
    ) {
        this.router[method](
            route,
            async (req, _, next) => {
                if (validators.params) {
                    const res = validators.params.safeParse(req.params);
                    if (res.success) {
                        req.params = res.data;
                    } else {
                        next(res.error);
                    }
                }

                if (validators.body) {
                    const res = validators.body.safeParse(req.body);
                    if (res.success) {
                        req.body = res.data;
                    } else {
                        next(res.error);
                    }
                }

                if (validators.query) {
                    const res = validators.query.safeParse(req.query);
                    if (res.success) {
                        req.query = res.data;
                    } else {
                        next(res.error);
                    }
                }

                next();
            },
            // handler
            (req, res, next) => {
                Promise.resolve(
                    handler(
                        req as Request<
                            TParams extends z.ZodType
                                ? z.infer<TParams>
                                : unknown,
                            TResult,
                            TBody extends z.ZodType ? z.infer<TBody> : unknown,
                            TQuery extends z.ZodType ? z.infer<TQuery> : unknown
                        >,
                        res,
                        next,
                    ),
                )
                    .then((result) => {
                        res.json(result).status(200);
                        next();
                    })
                    .catch((err) => {
                        next(err);
                    });
            },
        );
    }

    public getRoutes(): Router {
        return this.router;
    }
}
