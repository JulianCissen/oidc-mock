import { LandingPage } from './pages/landing-page';
import { Routes } from './utils/route-types';
import { expect } from '@playwright/test';
import { setupTest } from './utils/test-helpers';

// Use the setupTest but without serial configuration.
const test = setupTest;

test.describe('Authentication Flow', () => {
    let landingPage: LandingPage;

    test.beforeEach(async ({ page }) => {
        landingPage = new LandingPage(page);
        await landingPage.goto();
    });

    test('should navigate from landing page to claims selection', async () => {
        // Verify landing page shows correctly.
        await landingPage.expectToBeOnLandingPage();

        // Navigate to claims selection page and get the ClaimsSelectionPage instance.
        const claimsSelectionPage = await landingPage.initiateLogin();

        // Verify claims are available.
        const claimsCount = await claimsSelectionPage.getClaimCardsCount();
        expect(claimsCount).toBeGreaterThan(0);
    });

    test('should select claims and successfully authenticate', async () => {
        // Navigate to claims selection page.
        const claimsSelectionPage = await landingPage.initiateLogin();

        // Select claims and proceed to callback.
        const { callbackPage, subValue: expectedSub } =
            await claimsSelectionPage.selectClaimAndProceedToCallback(0);

        // Verify callback page shows correct claims.
        await callbackPage.verifySubClaim(expectedSub);
    });

    test('should maintain session after page refresh', async () => {
        // Complete authentication flow.
        const claimsSelectionPage = await landingPage.initiateLogin();
        const { callbackPage, subValue: expectedSub } =
            await claimsSelectionPage.selectClaimAndProceedToCallback(0);

        // Refresh page and verify session persists.
        await callbackPage.refreshAndVerifySession(expectedSub);
    });

    test('should log out successfully and protect authenticated routes', async () => {
        // Complete authentication flow.
        const claimsSelectionPage = await landingPage.initiateLogin();
        const { callbackPage } =
            await claimsSelectionPage.selectClaimAndProceedToCallback(0);

        // Log out and return to landing page.
        await callbackPage.logoutAndVerifyRedirect();

        // Verify protected route redirects when logged out.
        await callbackPage.verifyProtectedRouteRedirectsWhenLoggedOut();
    });
});
