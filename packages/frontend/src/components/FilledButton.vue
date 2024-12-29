<template>
    <q-btn class="custom-btn" color="primary" :label="props.label" unelevated />
</template>

<script setup lang="ts">
type Props = {
    label: string;
};
const props = defineProps<Props>();
</script>
