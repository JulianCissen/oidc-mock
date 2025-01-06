<template>
    <q-layout view="hHh lpr fFf">
        <q-header
            v-if="!errorStore.errored"
            bordered
            class="bg-primary text-white"
        >
            <q-toolbar>
                <q-toolbar-title> OIDC Mock Provider </q-toolbar-title>
                <dark-mode-toggle />
                <logout-button />
            </q-toolbar>
        </q-header>

        <q-page-container>
            <Suspense>
                <q-page class="q-pa-md">
                    <router-view v-if="!errorStore.errored" />
                    <generic-error v-else />
                </q-page>
                <template #fallback>
                    <q-page class="flex flex-center">
                        <indeterminate-circular-progress-indicator />
                    </q-page>
                </template>
            </Suspense>
        </q-page-container>
    </q-layout>
</template>

<script setup lang="ts">
import DarkModeToggle from 'src/components/DarkModeToggle.vue';
import GenericError from 'src/pages/GenericError.vue';
import IndeterminateCircularProgressIndicator from 'src/components/IndeterminateCircularProgressIndicator.vue';
import LogoutButton from 'src/components/LogoutButton.vue';
import { useErrorStore } from 'src/stores/error';

const errorStore = useErrorStore();
</script>
