import { readFileSync } from 'fs';
import { z } from 'zod';

const schema = z.object({
    devHost: z.string().optional(),
});

const file = readFileSync('./src/config/development.json', 'utf-8');
export const config = schema.parse(JSON.parse(file));
