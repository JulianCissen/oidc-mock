import { getFileRefFromEnv } from '../utils/getFileRefFromEnv';
import { readFileSync } from 'fs';
import { z } from 'zod';

const claimsSchema = z.array(
    z.object({
        sub: z.string(),
    }),
);

const claimsFilePath = getFileRefFromEnv(
    'CUSTOM_CLAIMS_PATH',
    './src/config/claims.json',
);

const file = readFileSync(claimsFilePath, 'utf-8');
export const claimSets = claimsSchema.parse(JSON.parse(file));
