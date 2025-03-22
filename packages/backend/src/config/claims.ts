import { existsSync, readFileSync } from 'fs';
import { z } from 'zod';

const claimsSchema = z.array(
    z.object({
        sub: z.string(),
    }),
);

const claimsFilePath =
    process.env['CUSTOM_CLAIMS_PATH'] &&
    existsSync(process.env['CUSTOM_CLAIMS_PATH'])
        ? process.env['CUSTOM_CLAIMS_PATH']
        : process.env['NODE_ENV'] === 'development'
          ? './src/config/claims.json'
          : (() => {
                throw new Error(
                    'CUSTOM_CLAIMS_PATH is not defined in production.',
                );
            })();

const file = readFileSync(claimsFilePath, 'utf-8');
export const claimSets = claimsSchema.parse(JSON.parse(file));
