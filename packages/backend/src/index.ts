import { authController, oidcProvider } from './controllers';
import express, {
    type NextFunction,
    type Request,
    type Response,
} from 'express';
import { config } from './config';
import cookieParser from 'cookie-parser';
import { errors } from 'oidc-provider';

const app = express();
const port = 3000;

app.use(express.json());
app.use(cookieParser(config.cookieKey));
app.use((req, _, next) => {
    console.log(`Request: ${req.method} ${req.url}`);
    next();
});
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

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    console.log(
        `OIDC is running on http://localhost:${port}/oidc/.well-known/openid-configuration`,
    );
});
