<template>
    <div class="row items-center full-height-row">
        <div class="col-6 flex justify-end">
            <q-icon left name="sym_o_warning" size="64px" />
        </div>
        <div class="col-6 justify-start">
            <div>
                An error has occurred.
                <a :href="refreshTarget">Try again.</a>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useErrorStore } from 'src/stores/error';

const errorStore = useErrorStore();

const refreshTarget = computed(() => (errorStore.isNotFoundError ? '/' : ''));
</script>

<style scoped>
.full-height-row {
    min-height: inherit;
}
</style>
