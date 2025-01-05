<template>
    <router-view />
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

const quasar = useQuasar();
quasar.dark.set(window.localStorage.getItem('darkMode') === 'true');
</script>
