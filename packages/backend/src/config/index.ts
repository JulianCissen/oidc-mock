import crypto from 'crypto';
import { readFileSync } from 'fs';
import { z } from 'zod';

const schema = z.object({
    server: z
        .object({
            hostname: z.string().default('localhost'),
            port: z.number().default(8080),
        })
        .default({}),
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

const file = readFileSync('./src/config/development.json', 'utf-8');
export const config = schema.parse(JSON.parse(file));
