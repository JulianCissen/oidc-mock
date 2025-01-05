import { type RouteLocationRaw, useRouter } from 'vue-router';
import type { AxiosResponse } from 'axios';

type SuccessResult<T> = {
    success: true;
    response: T;
};
type FailResult = {
    success: false;
    error: unknown;
};
type Result<T> = SuccessResult<T> | FailResult;

export const apiWrapper = <
    /* eslint-disable @typescript-eslint/no-explicit-any */
    Args extends any[],
    Ret extends AxiosResponse<any>,
    /* eslint-enable @typescript-eslint/no-explicit-any */
>(
    fn: (...args: Args) => Promise<Ret>,
): ((
    redirectOnFail?: RouteLocationRaw,
) => (...args: Args) => Promise<Result<Ret>>) => {
    return (redirectOnFail?: RouteLocationRaw) => {
        return async (...args: Args): Promise<Result<Ret>> => {
            const router = useRouter();

            try {
                const response = await fn(...args);
                return {
                    success: true,
                    response,
                };
            } catch (error) {
                if (redirectOnFail) router.push(redirectOnFail);
                return {
                    success: false,
                    error,
                };
            }
        };
    };
};
