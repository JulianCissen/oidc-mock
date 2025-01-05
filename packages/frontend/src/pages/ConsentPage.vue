<template>
    <q-page class="flex flex-center">
        <indeterminate-circular-progress-indicator />
    </q-page>
</template>

<script setup lang="ts">
import IndeterminateCircularProgressIndicator from 'src/components/IndeterminateCircularProgressIndicator.vue';
import { grantConsent } from 'src/vendors/internal';

grantConsent();
</script>
