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
import ClaimsCard from '../components/ClaimsCard.vue';
import { getClaims } from 'src/vendors/internal';
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const sessionId = route.query.session_id;

const res = await getClaims();
const claimsArray = ref(res.data);

const handleClaimsSelected = (index: number) => {
    window.open(
        `http://localhost:3000/internal/resume?session_id=${String(sessionId)}&claims_index=${String(index)}`,
        '_self',
    );
};
</script>
