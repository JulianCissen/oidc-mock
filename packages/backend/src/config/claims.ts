import { readFileSync } from 'fs';
import { z } from 'zod';

const claimsSchema = z.array(z.record(z.any()));

const file = readFileSync('./src/config/claims.json', 'utf-8');
export const claims = claimsSchema.parse(JSON.parse(file));
