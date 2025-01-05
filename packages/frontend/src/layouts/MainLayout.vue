<template>
    <q-layout view="hHh lpr fFf">
        <q-header class="bg-primary text-white" elevated>
            <q-toolbar>
                <q-toolbar-title> OIDC Mock Provider </q-toolbar-title>
                <dark-mode-toggle />
                <logout-button />
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
import DarkModeToggle from 'src/components/DarkModeToggle.vue';
import LogoutButton from 'src/components/LogoutButton.vue';
</script>
