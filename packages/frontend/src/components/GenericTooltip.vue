<template>
    <q-tooltip :anchor="anchor" class="text-caption" :self="self">
        {{ tooltipContent }}
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
};

withDefaults(defineProps<Props>(), {
    anchor: 'top middle',
    self: 'bottom middle',
});
</script>
