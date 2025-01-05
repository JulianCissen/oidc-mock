import { acceptHMRUpdate, defineStore } from 'pinia';
import { oidcClient } from 'src/utils/internalClient';

export const useAuthenticationStore = defineStore('authentication', {
    state: () => ({
        claims: {} as Record<string, unknown>,
    }),

    getters: {
        userClaims: (state) => state.claims,
        isAuthenticated: (state) => !!state.claims['sub'],
    },

    actions: {
        setUserClaims(claims: Record<string, unknown>) {
            this.claims = claims;
        },
        async logout() {
            this.claims = {};
            const req = await oidcClient.createSignoutRequest();
            window.location.href = req.url;
        },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useAuthenticationStore, import.meta.hot),
    );
}
