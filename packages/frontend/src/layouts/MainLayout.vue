<template>
    <q-layout view="hHh lpr fFf">
        <q-header class="bg-primary text-white" elevated>
            <q-toolbar>
                <q-toolbar-title>
                    <q-avatar>
                        <img
                            src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg"
                        />
                    </q-avatar>
                    Title
                </q-toolbar-title>
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

<script setup lang="ts"></script>
