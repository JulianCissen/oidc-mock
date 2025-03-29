<template>
    <q-btn :aria-label="tooltipText" dense flat :icon="`sym_o_${icon}`" round>
        <generic-tooltip :tooltip-content="tooltipText" />
    </q-btn>
</template>

<script setup lang="ts">
import GenericTooltip from './GenericTooltip.vue';

defineProps<{
    icon: string;
    tooltipText: string;
}>();
</script>
