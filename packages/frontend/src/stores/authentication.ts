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
        /**
         * Sets the user claims in the store.
         * @param claims User claims object to store.
         */
        setUserClaims(claims: Record<string, unknown>): void {
            this.claims = claims;
        },

        /**
         * Checks if there is a valid user session.
         * @returns Promise resolving to true if a valid session exists, false otherwise.
         */
        async checkUserSession(): Promise<boolean> {
            try {
                const user = await userManager.getUser();
                if (user && !user.expired) {
                    this.setUserClaims(user.profile);
                    return true;
                }
                return false;
            } catch (err) {
                console.error('Error checking user session:', err);
                return false;
            }
        },

        /**
         * Attempts to silently log in the user without prompting for credentials.
         * @returns Promise resolving to true if silent login was successful, false otherwise.
         */
        async silentLogin(): Promise<boolean> {
            try {
                const user = await userManager.signinSilent();
                if (user && !user.expired) {
                    this.setUserClaims(user.profile);
                    return true;
                }
                return false;
            } catch (err) {
                return false;
            }
        },

        /**
         * Logs out the user and redirects to the identity provider's logout page.
         * @returns Promise that resolves when the logout process is initiated.
         */
        async logout(): Promise<void> {
            this.claims = {};
            await userManager.signoutRedirect();
        },

        /**
         * Clears the user session locally without redirecting to the identity provider.
         * Removes the user from storage and redirects to the home page.
         * @returns Promise that resolves when the session is cleared.
         */
        async clearSession(): Promise<void> {
            // Clear the authentication store state
            this.claims = {};

            // Remove the user from userManager storage
            await userManager.removeUser();

            // Return to the home page
            window.location.href = '/';
        },

        /**
         * Processes the sign-in callback from the identity provider.
         * @param url The current URL containing the authorization response.
         * @returns Promise resolving to true if sign-in was successful, false otherwise.
         */
        async signInCallback(url: string): Promise<boolean> {
            try {
                const res = await userManager.signinCallback(url);
                if (!res) throw new Error('No response from signinCallback');
                this.setUserClaims(res.profile);
                return true;
            } catch (err) {
                console.error('Sign-in callback failed:', err);
                return false;
            }
        },

        /**
         * Initialize OIDC client and attempt a silent sign-in.
         * @param onSuccess Optional callback function to run after successful silent sign-in.
         * @returns Promise resolving to true if silent sign-in was successful, false otherwise.
         */
        async initializeSession(onSuccess?: () => void): Promise<boolean> {
            try {
                // First check if we already have a valid user
                const hasValidSession = await this.checkUserSession();
                if (hasValidSession) {
                    if (onSuccess) onSuccess();
                    return true;
                }

                // Try silent sign-in
                const silentLoginSuccess = await this.silentLogin();
                if (silentLoginSuccess) {
                    if (onSuccess) onSuccess();
                    return true;
                }

                return false;
            } catch (error) {
                console.error('Session initialization failed:', error);
                return false;
            }
        },
    },
});

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useAuthenticationStore, import.meta.hot),
    );
}
