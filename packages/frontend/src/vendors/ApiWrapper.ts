import { type RouteLocationRaw, useRouter } from 'vue-router';
import type { AxiosResponse } from 'axios';
import { useErrorStore } from 'src/stores/error';

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
): ((setErrorState?: boolean) => (...args: Args) => Promise<Result<Ret>>) => {
    return (setErrorState?: boolean) => {
        return async (...args: Args): Promise<Result<Ret>> => {
            const errorStore = useErrorStore();

            try {
                const response = await fn(...args);
                return {
                    success: true,
                    response,
                };
            } catch (error) {
                if (setErrorState) errorStore.setGenericError();
                return {
                    success: false,
                    error,
                };
            }
        };
    };
};
