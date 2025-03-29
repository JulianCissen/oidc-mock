<template>
    <icon-button
        v-if="authenticationStore.isAuthenticated"
        icon="logout"
        tooltip-text="Logout"
        @click="authenticationStore.logout"
    />
</template>

<script setup lang="ts">
import IconButton from 'src/components/IconButton.vue';
import { useAuthenticationStore } from 'src/stores/authentication';

const authenticationStore = useAuthenticationStore();
</script>
