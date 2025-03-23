<template>
    <span class="timestamp-value">
        <q-tooltip
            anchor="top middle"
            class="text-caption"
            self="bottom middle"
        >
            {{ formattedTime }} </q-tooltip
        >{{ displayValue }}
    </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Props = {
    value: number;
};

const props = defineProps<Props>();

/**
 * Format the timestamp to a human-readable ISO string
 */
const formattedTime = computed((): string => {
    // Convert Unix timestamp (seconds) to milliseconds for Date constructor
    const date = new Date(props.value * 1000);
    return date.toISOString();
});

/**
 * Value to display in the component
 */
const displayValue = computed((): string => {
    return String(props.value);
});
</script>

<style scoped>
.timestamp-value {
    text-decoration: underline;
    text-decoration-style: dotted;
    cursor: help;
}
</style>
