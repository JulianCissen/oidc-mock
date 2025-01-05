<template>
    <q-layout view="hHh lpr fFf">
        <q-header class="bg-primary text-white" elevated>
            <q-toolbar>
                <q-toolbar-title> OIDC Mock Provider </q-toolbar-title>
                <q-toggle
                    v-model="darkMode"
                    checked-icon="sym_o_dark_mode"
                    color="dark"
                    unchecked-icon="sym_o_light_mode"
                />
                <q-btn
                    v-if="authenticationStore.isAuthenticated"
                    dense
                    flat
                    icon="sym_o_logout"
                    round
                    @click="authenticationStore.logout()"
                />
            </q-toolbar>
        </q-header>

        <q-page-container>
            <Suspense>
                <router-view />
                <template #fallback>
                    <q-page class="flex flex-center">
                        <q-spinner-gears color="primary" size="100px" />
                    </q-page>
                </template>
            </Suspense>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useAuthenticationStore } from 'src/stores/authentication';
import { useQuasar } from 'quasar';

const authenticationStore = useAuthenticationStore();
const quasar = useQuasar();

const darkMode = ref(window.localStorage.getItem('darkMode') === 'true');
quasar.dark.set(darkMode.value);
watch(darkMode, (value) => {
    quasar.dark.set(value);
    window.localStorage.setItem('darkMode', value.toString());
});
</script>
