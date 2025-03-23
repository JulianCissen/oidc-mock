import { acceptHMRUpdate, defineStore } from 'pinia';
import { userManager } from 'src/utils/internalClient';

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

        async checkUserSession() {
            try {
                const user = await userManager.getUser();
                if (user && !user.expired) {
                    this.setUserClaims(user.profile);
                }
            } catch (err) {
                console.error('Error checking user session:', err);
            }
        },

        async logout() {
            this.claims = {};
            await userManager.signoutRedirect();
        },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useAuthenticationStore, import.meta.hot),
    );
}
