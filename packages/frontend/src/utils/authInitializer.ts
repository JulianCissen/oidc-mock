import { useAuthenticationStore } from 'src/stores/authentication';
import { useRouter } from 'vue-router';

export const initializeAuthentication = () => {
    const authenticationStore = useAuthenticationStore();
    const router = useRouter();

    authenticationStore.initializeSession(() => {
        // Navigate to callback if silent sign-in was successful
        // Only if we're currently on the home page to avoid disrupting other workflows
        if (router.currentRoute.value.path === '/') {
            router.push('/callback');
        }
    });
};
