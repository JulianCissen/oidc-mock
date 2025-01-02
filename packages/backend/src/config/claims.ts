import { readFileSync } from 'fs';
import { z } from 'zod';

const claimsSchema = z.array(
    z.object({
        sub: z.string(),
    }),
);

const file = readFileSync('./src/config/claims.json', 'utf-8');
export const claimSets = claimsSchema.parse(JSON.parse(file));
