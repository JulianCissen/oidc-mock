import { api } from 'src/boot/axios';

export const getClaims = async () =>
    await api.get<Record<string, unknown>[]>('/internal/claims');
