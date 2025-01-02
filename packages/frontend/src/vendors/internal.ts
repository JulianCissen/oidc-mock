import { api } from 'src/boot/axios';

export const getClaims = async () =>
    await api.get<Record<string, unknown>[]>('/auth/claims');

export const selectClaims = async (session_id: string, claims_index: number) =>
    await api.get(
        `/auth/select-claims?session_id=${session_id}&claims_index=${claims_index}`,
    );
