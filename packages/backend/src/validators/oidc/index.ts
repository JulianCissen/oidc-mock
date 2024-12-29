import { z } from 'zod';

export const authenticationRequestQueryParams = z.object({
    // required
    scope: z
        .string()
        .transform((val) => val.split(' '))
        .pipe(
            z
                .array(z.string())
                .refine(
                    (val): val is ['openid', ...string[]] =>
                        val.includes('openid'),
                    'openid scope is required',
                ),
        ),
    response_type: z.literal('code'),
    client_id: z.string(),
    redirect_uri: z.string(),
    // optional
    state: z.string().optional(),
    response_mode: z.string().optional(),
    nonce: z.string().optional(),
    display: z.enum(['page', 'popup', 'touch', 'wap']).optional(),
    prompt: z.enum(['none', 'login', 'consent', 'select_account']).optional(),
    max_age: z.coerce.number().optional(),
    ui_locales: z.string().optional(),
    id_token_hint: z.string().optional(),
    login_hint: z.string().optional(),
    acr_values: z.string().optional(),
});
export type AuthenticationRequestQueryParams = z.output<
    typeof authenticationRequestQueryParams
>;
