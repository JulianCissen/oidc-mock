<template>
    <router-view />
</template>

<script setup lang="ts">
import { initializeAuthentication } from 'src/utils/authInitializer';
import { useDarkMode } from 'src/composables/useDarkMode';

// Initialize dark mode settings
const { initDarkMode } = useDarkMode();
initDarkMode();

// Initialize authentication
initializeAuthentication();
</script>
