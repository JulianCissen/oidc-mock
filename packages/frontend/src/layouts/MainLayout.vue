<template>
    <q-layout view="hHh lpr fFf">
        <q-header class="bg-primary text-white" elevated>
            <q-toolbar>
                <q-toolbar-title> OIDC Mock Provider </q-toolbar-title>
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
import { useAuthenticationStore } from 'src/stores/authentication';

const authenticationStore = useAuthenticationStore();
</script>
