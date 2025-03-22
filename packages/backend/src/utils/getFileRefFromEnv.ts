import { existsSync } from 'fs';

/**
 * Retrieves a file ref stored in an environment variable.
 * @param env The environment variable to check.
 * @param devDefault The default file ref to use in development.
 * @returns The file ref.
 */
export const getFileRefFromEnv = (env: string, devDefault: string): string => {
    if (process.env[env] && existsSync(process.env[env])) {
        return process.env[env];
    } else if (process.env['NODE_ENV'] === 'development') {
        return devDefault;
    }
    throw new Error(`${env} is not defined in production.`);
};
