import type { RouteRecordRaw } from 'vue-router';
import { useErrorStore } from 'src/stores/error';

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        component: () => import('layouts/MainLayout.vue'),
        children: [
            {
                path: '',
                component: () => import('pages/InternalClientLanding.vue'),
            },
            {
                path: '/callback',
                component: () =>
                    import('pages/InternalClientAuthenticated.vue'),
                meta: {
                    protected: true,
                },
            },
            {
                path: '/login',
                component: () => import('pages/ClaimsSelection.vue'),
            },
            {
                path: '/consent',
                component: () => import('pages/LoginConsent.vue'),
            },
        ],
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '/:catchAll(.*)*',
        component: () => import('pages/GenericError.vue'),
        beforeEnter: () => {
            const errorStore = useErrorStore();
            errorStore.setNotFound();
        },
    },
];

export default routes;
