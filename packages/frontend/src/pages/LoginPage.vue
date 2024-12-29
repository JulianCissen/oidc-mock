<template>
    <div>{{ claims }}</div>
</template>

<script setup lang="ts">
import { getClaims } from 'src/vendors/internal';
import { ref } from 'vue';

const res = await getClaims();
const claims = ref(res.data);
</script>
