<template>
    <div class="column items-center">
        <filled-button label="Login" @click="login" />
    </div>
</template>

<script setup lang="ts">
import FilledButton from 'src/components/FilledButton.vue';
import { oidcClient } from 'src/utils/internalClient';

const login = async () => {
    const req = await oidcClient.createSigninRequest({});
    window.location.href = req.url;
};
</script>
