<template>
    <icon-button
        v-if="authenticationStore.isAuthenticated"
        icon="no_accounts"
        tooltip-text="Clear internal client session"
        @click="clearSession"
    />
</template>

<script setup lang="ts">
import IconButton from 'src/components/IconButton.vue';
import { useAuthenticationStore } from 'src/stores/authentication';

const authenticationStore = useAuthenticationStore();

// Function to clear the session state.
const clearSession = async () => {
    await authenticationStore.clearSession();
};
</script>
