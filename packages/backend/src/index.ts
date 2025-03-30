import express, {
    type NextFunction,
    type Request,
    type RequestHandler,
    type Response,
} from 'express';
import { httpLogger, logger } from './utils/logger';
import { URL } from 'url';
import { authController } from './controllers';
import { config } from './config';
import cookieParser from 'cookie-parser';
import { initializeProvider } from './controllers/oidc';

// Create Express application
const app = express();

// Configure middleware.
app.use(express.json());
app.use(cookieParser(config.cookies.keys) as unknown as RequestHandler); // Somehow the typing provided by cookie-parser is incorrect.
app.use(httpLogger);

// Trust proxy
app.set('trust proxy', true);

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

    if (err instanceof Error) {
        res.err = err;
    } else {
        res.err = new Error(String(err));
    }

    res.status(500).send('Internal server error');
};

// Display startup information.
const displayStartupInfo = () => {
    const issUrl = new URL(config.provider.iss);
    logger.info(`Server is running on ${issUrl.href}`);
    logger.info(
        `OIDC is running on ${issUrl.href}oidc/.well-known/openid-configuration`,
    );
};

/**
 * Initialize the server and all required components
 */
const initializeServer = async () => {
    try {
        // Initialize the OIDC provider
        logger.info('Initializing OIDC provider...');
        const oidcProvider = await initializeProvider();

        // Set up routes after provider is initialized
        app.use('/oidc', oidcProvider.callback());
        app.use('/auth', authController.getRoutes());

        // Add error handler after routes
        app.use(errorHandler);

        // Start the server
        app.listen(3000, displayStartupInfo);
    } catch (error) {
        console.log(error);
        logger.error('Failed to initialize server:', error);
        process.exit(1);
    }
};

// Start the initialization process
initializeServer();
