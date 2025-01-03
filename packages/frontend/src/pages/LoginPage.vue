<template>
    <q-page class="q-pa-md">
        <div class="q-col-gutter-md row">
            <div
                v-for="(claims, index) in claimsArray"
                :key="index"
                class="col-12 col-md-6 col-lg-4"
            >
                <claims-card
                    :claims="claims"
                    @click="handleClaimsSelected(index)"
                />
            </div>
        </div>
    </q-page>
</template>

<script setup lang="ts">
import { getClaims, selectClaims } from 'src/vendors/internal';
import ClaimsCard from '../components/ClaimsCard.vue';
import { ref } from 'vue';

const res = await getClaims();
const claimsArray = ref(res.data);

const handleClaimsSelected = (index: number) => {
    selectClaims(index);
};
</script>
