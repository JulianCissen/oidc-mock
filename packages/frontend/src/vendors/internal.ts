import { api } from 'src/boot/axios';
import { apiWrapper } from './ApiWrapper';

export const getClaims = apiWrapper(
    async () => await api.get<Record<string, unknown>[]>('/auth/claims'),
);

export const selectClaims = apiWrapper(async (claims_index: number) => {
    const res = api.post(`/auth/select-claims?claims_index=${claims_index}`);
    res.then((res) => {
        window.open(res.request['responseURL'], '_self');
    });
    return await res;
});

export const grantConsent = apiWrapper(async () => {
    const res = api.post('/auth/consent');
    res.then((res) => {
        window.open(res.request['responseURL'], '_self');
    });
    return await res;
});
