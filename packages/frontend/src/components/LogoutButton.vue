<template>
    <q-btn
        v-if="authenticationStore.isAuthenticated"
        dense
        flat
        icon="sym_o_logout"
        round
        @click="authenticationStore.logout()"
    />
</template>

<script setup lang="ts">
import { useAuthenticationStore } from 'src/stores/authentication';

const authenticationStore = useAuthenticationStore();
</script>
