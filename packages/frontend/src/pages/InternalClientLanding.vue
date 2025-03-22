<template>
    <div class="column items-center">
        <filled-button label="Login" @click="login" />
    </div>
</template>

<script setup lang="ts">
import FilledButton from 'src/components/FilledButton.vue';
import { userManager } from 'src/utils/internalClient';

const login = async () => await userManager.signinRedirect();
</script>
