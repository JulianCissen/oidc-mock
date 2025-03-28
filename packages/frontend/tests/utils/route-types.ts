import type { CallbackPage } from '../pages/callback-page';
import type { ClaimsSelectionPage } from '../pages/claims-selection-page';
import type { ConsentPage } from '../pages/consent-page';
import type { LandingPage } from '../pages/landing-page';

/**
 * Constants for application routes to ensure consistency.
 */
export const Routes = {
    HOME: '/' as const,
    CALLBACK: '/callback' as const,
    LOGIN: '/login' as const,
    CONSENT: '/consent' as const,
} as const;

/**
 * Union type for all valid routes in the application.
 */
export type AppRoute = (typeof Routes)[keyof typeof Routes];

/**
 * Map of routes to their corresponding page object types.
 */
export interface RoutePageMap {
    [Routes.HOME]: LandingPage;
    [Routes.CALLBACK]: CallbackPage;
    [Routes.LOGIN]: ClaimsSelectionPage;
    [Routes.CONSENT]: ConsentPage;
}

/**
 * Get the page type for a given route.
 */
export type PageTypeForRoute<T extends AppRoute> = RoutePageMap[T];
