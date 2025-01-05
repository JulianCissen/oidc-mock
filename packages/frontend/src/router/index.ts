import {
    createMemoryHistory,
    createRouter,
    createWebHashHistory,
    createWebHistory,
} from 'vue-router';
import { defineRouter } from '#q-app/wrappers';
import { oidcClient } from 'src/utils/internalClient';
import routes from './routes';
import { useAuthenticationStore } from 'src/stores/authentication';

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default defineRouter(function (/* { store, ssrContext } */) {
    const authenticationStore = useAuthenticationStore();

    const createHistory = process.env.SERVER
        ? createMemoryHistory
        : process.env.VUE_ROUTER_MODE === 'history'
          ? createWebHistory
          : createWebHashHistory;

    const Router = createRouter({
        scrollBehavior: () => ({ left: 0, top: 0 }),
        routes,

        // Leave this as is and make changes in quasar.conf.js instead!
        // quasar.conf.js -> build -> vueRouterMode
        // quasar.conf.js -> build -> publicPath
        history: createHistory(process.env.VUE_ROUTER_BASE),
    });

    // Make sure to sign in when a user is navigating with OIDC callback parameters.
    Router.beforeEach(async (to, _, next) => {
        if (to.query['code']) {
            try {
                const authResponse = await oidcClient.processSigninResponse(
                    window.location.href,
                );
                authenticationStore.setUserClaims(authResponse.profile);
                // Clear query params.
                to.query = {};
                next(to);
                return;
            } catch (err) {
                console.error(err);
                next('/');
                return;
            }
        }
        next();
    });

    // Protect routes that require authentication.
    Router.beforeEach((to, _, next) => {
        if (to.meta.protected && !authenticationStore.isAuthenticated) {
            next('/');
            return;
        }
        next();
    });

    return Router;
});
