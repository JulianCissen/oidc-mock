<template>
    <q-tooltip :anchor="anchor" class="text-caption" :self="self">
        <span :class="{ 'no-wrap': noWrap }">{{ tooltipContent }}</span>
    </q-tooltip>
</template>

<script setup lang="ts">
import type { QTooltipProps } from 'quasar';

type Props = {
    /**
     * Text content to display in the tooltip
     */
    tooltipContent: string;
    /**
     * Position of the tooltip relative to the target element
     * Format is "<top|center|bottom> <left|center|right>"
     * @default "top middle"
     */
    anchor?: QTooltipProps['anchor'];
    /**
     * Position of the tooltip's corner relative to itself
     * Format is "<top|center|bottom> <left|center|right>"
     * @default "bottom middle"
     */
    self?: QTooltipProps['self'];
    /**
     * Prevent line breaks in the tooltip content
     * @default true
     */
    noWrap?: boolean;
};

withDefaults(defineProps<Props>(), {
    anchor: 'top middle',
    self: 'bottom middle',
    noWrap: true,
});
</script>

<style scoped>
.no-wrap {
    white-space: nowrap;
}
</style>
