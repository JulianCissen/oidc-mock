<template>
    <q-card bordered class="custom-card" flat>
        <q-card-section>
            <div class="text-h6">sub: {{ claims['sub'] }}</div>
        </q-card-section>
        <q-card-section>
            <q-list>
                <q-item
                    v-for="[claimKey, claimValue] in Object.entries(claims)"
                    :key="claimKey"
                >
                    <q-item-section>
                        <q-item-label class="text-weight-medium">{{
                            claimKey
                        }}</q-item-label>
                        <q-item-label caption class="claim-value">
                            <display-value
                                :name="claimKey"
                                :value="claimValue"
                            />
                        </q-item-label>
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
import DisplayValue from './DisplayValue.vue';
import FilledButton from './FilledButton.vue';

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

.claim-value {
    font-family: monospace;
    white-space: pre-wrap;
}
</style>
