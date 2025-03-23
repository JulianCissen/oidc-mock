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
    >({
        method,
        route,
        validators,
        middlewares = [],
        handler,
    }: {
        method: 'get' | 'post' | 'put' | 'delete';
        route: string;
        validators?: {
            body?: TBody;
            query?: TQuery;
            params?: TParams;
        };
        middlewares?: RequestHandler<
            TParams extends z.ZodType ? z.infer<TParams> : unknown,
            TResult,
            TBody extends z.ZodType ? z.infer<TBody> : unknown,
            TQuery extends z.ZodType ? z.infer<TQuery> : unknown
        >[];
        handler: (
            request: Request<
                TParams extends z.ZodType ? z.infer<TParams> : unknown,
                TResult,
                TBody extends z.ZodType ? z.infer<TBody> : unknown,
                TQuery extends z.ZodType ? z.infer<TQuery> : unknown
            >,
            response: Response<TResult>,
            next: RequestHandler,
        ) => Promise<TResult> | TResult;
    }) {
        // Validation middleware.
        const validationMiddleware: RequestHandler<
            TParams extends z.ZodType ? z.infer<TParams> : unknown,
            TResult,
            TBody extends z.ZodType ? z.infer<TBody> : unknown,
            TQuery extends z.ZodType ? z.infer<TQuery> : unknown
        > = async (req, _, next) => {
            try {
                // Validate params if validator exists.
                if (validators?.params) {
                    const result = validators.params.safeParse(req.params);
                    if (!result.success) return next(result.error);
                    req.params = result.data;
                }

                // Validate body if validator exists.
                if (validators?.body) {
                    const result = validators.body.safeParse(req.body);
                    if (!result.success) return next(result.error);
                    req.body = result.data;
                }

                // Validate query if validator exists.
                if (validators?.query) {
                    const result = validators.query.safeParse(req.query);
                    if (!result.success) return next(result.error);
                    req.query = result.data;
                }

                next();
            } catch (error) {
                next(error);
            }
        };

        // Handler middleware.
        const routeHandler: RequestHandler = (req, res, next) => {
            Promise.resolve(
                handler(
                    req as Request<
                        TParams extends z.ZodType ? z.infer<TParams> : unknown,
                        TResult,
                        TBody extends z.ZodType ? z.infer<TBody> : unknown,
                        TQuery extends z.ZodType ? z.infer<TQuery> : unknown
                    >,
                    res,
                    next,
                ),
            )
                .then((result) => {
                    if (!res.headersSent) res.json(result).status(200);
                    next();
                })
                .catch(next);
        };

        // Register the route with all middlewares.
        this.router[method](
            route,
            validationMiddleware,
            ...middlewares,
            routeHandler,
        );
    }

    public getRoutes(): Router {
        return this.router;
    }
}
