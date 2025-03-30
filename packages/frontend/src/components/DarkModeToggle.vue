<template>
    <q-toggle
        v-model="darkMode"
        checked-icon="sym_o_dark_mode"
        color="dark"
        unchecked-icon="sym_o_light_mode"
    />
</template>

<script setup lang="ts">
import { useDarkMode } from 'src/composables/useDarkMode';

// Get the dark mode state from the composable
const { darkMode } = useDarkMode();
</script>
