import { authController, oidcProvider } from './controllers';
import express, {
    type NextFunction,
    type Request,
    type Response,
} from 'express';
import { config } from './config';
import cookieParser from 'cookie-parser';
import { errors } from 'oidc-provider';
import { httpLogger } from './utils/logger';

const app = express();

app.use(express.json());
app.use(cookieParser(config.cookies.keys));
app.use(httpLogger);
app.use('/oidc', oidcProvider.callback());
app.use('/auth', authController.getRoutes());
// Generic error handler.
app.use((err: unknown, _: Request, res: Response, next: NextFunction) => {
    // If headers have already been sent, delegate to the default error handler.
    if (res.headersSent) {
        next(err);
        return;
    }
    // Handle oidc-provider errors.
    if (err instanceof errors.OIDCProviderError) {
        res.status(err.statusCode).json({
            error: err.error,
            error_description: err.error_description,
        });
        return;
    }
    // Handle generic errors.
    console.log(err);
    res.status(500).send('Internal server error');
    return;
});

// Run app on 3000, will only be used internally.
app.listen(3000, () => {
    console.log(
        `Server is running on http://${config.server.hostname}:${config.server.port}`,
    );
    console.log(
        `OIDC is running on http://${config.server.hostname}:${config.server.port}/oidc/.well-known/openid-configuration`,
    );
});
