<template>
    <q-card bordered class="custom-card" flat>
        <q-card-section>
            <div class="text-h6">sub: {{ claims['sub'] }}</div>
        </q-card-section>
        <q-card-section>
            <q-list>
                <q-item
                    v-for="[key, value] in Object.entries(claims)"
                    :key="key"
                >
                    <q-item-section>
                        <q-item-label>{{ key }}</q-item-label>
                        <q-item-label caption>{{
                            JSON.stringify(value, null, 2)
                        }}</q-item-label>
                    </q-item-section>
                </q-item>
            </q-list>
        </q-card-section>
        <q-card-actions v-if="!readonly" align="right">
            <filled-button label="Use claims" @click="useClaims" />
        </q-card-actions>
    </q-card>
</template>

<script setup lang="ts">
import FilledButton from './FilledButton.vue';
import { defineProps } from 'vue';

type Props = {
    claims: Record<string, unknown>;
    readonly?: boolean;
};
withDefaults(defineProps<Props>(), {
    readonly: false,
});

const emit = defineEmits(['use-claims']);
const useClaims = () => {
    emit('use-claims');
};
</script>

<style scoped lang="scss">
.custom-card {
    width: 100%;
}
</style>
