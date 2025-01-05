<template>
    <q-page class="q-pa-md">
        <claims-card :claims="authenticationStore.userClaims" readonly />
    </q-page>
</template>

<script setup lang="ts">
import ClaimsCard from 'src/components/ClaimsCard.vue';
import { useAuthenticationStore } from 'src/stores/authentication';

const authenticationStore = useAuthenticationStore();
</script>
