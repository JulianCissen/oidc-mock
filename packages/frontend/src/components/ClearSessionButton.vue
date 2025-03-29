<template>
    <icon-button
        v-if="authenticationStore.isAuthenticated && isDevelopment"
        icon="restart_alt"
        tooltip-text="Clear session state (testing only)"
        @click="clearSession"
    />
</template>

<script setup lang="ts">
import IconButton from 'src/components/IconButton.vue';
import { computed } from 'vue';
import { useAuthenticationStore } from 'src/stores/authentication';

const authenticationStore = useAuthenticationStore();

// Function to clear the session state.
const clearSession = async () => {
    await authenticationStore.clearSession();
};
// Check if we're in development mode.
const isDevelopment = computed(() => process.env.NODE_ENV === 'development');
</script>
