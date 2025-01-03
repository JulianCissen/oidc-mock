import { api } from 'src/boot/axios';

export const getClaims = async () =>
    await api.get<Record<string, unknown>[]>('/auth/claims');

export const selectClaims = async (claims_index: number) =>
    await api
        .post(`/auth/select-claims?claims_index=${claims_index}`)
        .then((res) => {
            window.open(res.request['responseURL'], '_self');
        });

export const grantConsent = async () =>
    await api.post('/auth/consent').then((res) => {
        window.open(res.request['responseURL'], '_self');
    });
