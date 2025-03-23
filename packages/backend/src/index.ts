import { authController, oidcProvider } from './controllers';
import express, {
    type NextFunction,
    type Request,
    type RequestHandler,
    type Response,
} from 'express';
import { httpLogger, logger } from './utils/logger';
import { URL } from 'url';
import { config } from './config';
import cookieParser from 'cookie-parser';
import { errors } from 'oidc-provider';

const app = express();

// Configure middleware.
app.use(express.json());
app.use(cookieParser(config.cookies.keys) as unknown as RequestHandler); // Somehow the typing provided by cookie-parser is incorrect.
app.use(httpLogger);

// Set up routes.
app.use('/oidc', oidcProvider.callback());
app.use('/auth', authController.getRoutes());

// Generic error handler.
const errorHandler = (
    err: unknown,
    _: Request,
    res: Response,
    next: NextFunction,
) => {
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
    logger.error(err);
    res.status(500).send('Internal server error');
};

app.use(errorHandler);

// Display startup information.
const displayStartupInfo = () => {
    const issUrl = new URL(config.provider.iss);
    logger.info(`Server is running on ${issUrl.href}`);
    logger.info(
        `OIDC is running on ${issUrl.href}oidc/.well-known/openid-configuration`,
    );
};

// Start server.
app.listen(3000, displayStartupInfo);
