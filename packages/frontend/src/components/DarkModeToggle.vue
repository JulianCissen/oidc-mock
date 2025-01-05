<template>
    <q-toggle
        v-model="darkMode"
        checked-icon="sym_o_dark_mode"
        color="dark"
        unchecked-icon="sym_o_light_mode"
    />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useQuasar } from 'quasar';

const quasar = useQuasar();

// Initialize darkMode with the value from localStorage.
const darkMode = ref(quasar.dark.isActive);
// Update dark mode setting based on the value of darkMode.
watch(darkMode, (value) => {
    quasar.dark.set(value);
    window.localStorage.setItem('darkMode', value.toString());
});
</script>
