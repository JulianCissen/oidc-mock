import crypto from 'crypto';
import { getFileRefFromEnv } from '../utils/getFileRefFromEnv';
import { readFileSync } from 'fs';
import { replaceEnvVars } from '../utils/replaceEnvVars';
import { z } from 'zod';

const schema = z.object({
    provider: z.object({
        iss: z.string(),
    }),
    clients: z.array(
        z.object({
            client_id: z.string(),
            client_secret: z.string(),
            redirect_uris: z.array(z.string()),
            post_logout_redirect_uris: z.array(z.string()),
            grant_types: z
                .array(z.enum(['authorization_code']))
                .default(['authorization_code']),
            response_types: z.array(z.enum(['code'])).default(['code']),
            token_endpoint_auth_method: z
                .enum(['client_secret_basic'])
                .default('client_secret_basic'),
        }),
    ),
    cookies: z
        .object({
            keys: z
                .union([
                    z.string().transform((val) => [val]),
                    z.array(z.string()),
                ])
                .default(crypto.randomBytes(32).toString('hex')),
        })
        .default({}),
});

const configFilePath = getFileRefFromEnv(
    'CUSTOM_SERVER_CONFIG_PATH',
    './src/config/development.json',
);

const file = readFileSync(configFilePath, 'utf-8');
// Process environment variables before parsing JSON
const processedFile = replaceEnvVars(file);
export const config = schema.parse(JSON.parse(processedFile));
