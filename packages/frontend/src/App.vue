<template>
    <router-view />
</template>

<script setup lang="ts">
import { useAuthenticationStore } from 'src/stores/authentication';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';

const quasar = useQuasar();
quasar.dark.set(window.localStorage.getItem('darkMode') === 'true');

const authenticationStore = useAuthenticationStore();
const router = useRouter();

authenticationStore.initializeSession(() => {
    // Navigate to callback if silent sign-in was successful
    // Only if we're currently on the home page to avoid disrupting other workflows
    if (router.currentRoute.value.path === '/') {
        router.push('/callback');
    }
});
</script>
