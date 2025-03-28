import {
    type AppRoute,
    type PageTypeForRoute,
    Routes,
} from '../utils/route-types';
import {
    expectToBeAtUrl,
    getTextContent,
    waitForNavigation,
} from '../utils/test-helpers';
import {
    getLocalStorageValue,
    navigateToUrl,
    refreshPage,
} from '../utils/page-helpers';
import type { Page } from '@playwright/test';
import { PageFactory } from './page-factory';
import { expect } from '@playwright/test';

/**
 * Page object for the callback page that appears after successful authentication.
 */
export class CallbackPage {
    constructor(private page: Page) {}

    /**
     * Navigate to the callback page directly.
     * @returns This CallbackPage instance for method chaining.
     */
    async goto(): Promise<this> {
        await navigateToUrl(this.page, Routes.CALLBACK);
        return this;
    }

    /**
     * Expect that we are on the callback page.
     * @returns This CallbackPage instance for method chaining.
     */
    async expectToBeOnCallbackPage(): Promise<this> {
        await expectToBeAtUrl(this.page, /\/callback/);
        return this;
    }

    /**
     * Get the sub claim value from the displayed user info.
     * @returns the sub claim value.
     */
    async getSubClaim(): Promise<string> {
        // Find the sub claim in the card
        const subClaimText = await getTextContent(this.page, '.text-h6');
        // Extract just the value part after "sub: "
        return subClaimText.replace('sub: ', '').trim();
    }

    /**
     * Verify the sub claim matches the expected value.
     * @param expectedSub expected sub claim value.
     * @returns the actual sub claim value.
     */
    async verifySubClaim(expectedSub: string): Promise<string> {
        const actualSub = await this.getSubClaim();
        expect(actualSub).toBe(expectedSub);
        return actualSub;
    }

    /**
     * Refresh the page and verify the user is still logged in.
     * @param expectedSub expected sub claim value.
     * @returns the actual sub claim value.
     */
    async refreshAndVerifySession(expectedSub: string): Promise<string> {
        await refreshPage(this.page);
        await this.expectToBeOnCallbackPage();
        return await this.verifySubClaim(expectedSub);
    }

    /**
     * Check if logout button is visible.
     * @returns true if the logout button is visible.
     */
    async hasLogoutButton(): Promise<boolean> {
        return await this.page
            .locator('button:has(:text("logout"))')
            .isVisible();
    }

    /**
     * Get a value from localStorage.
     * @param key The key to retrieve from localStorage.
     * @returns The value from localStorage or null if not found.
     */
    async getLocalStorageValue(key: string): Promise<string | null> {
        return getLocalStorageValue(this.page, key);
    }

    /**
     * Refresh the current page and wait for it to load.
     * @returns This CallbackPage instance for method chaining.
     */
    async refresh(): Promise<this> {
        await refreshPage(this.page);
        return this;
    }

    /**
     * Navigate to a URL and get the appropriate page object.
     * @param url The route to navigate to.
     * @returns The page object representing the new page.
     */
    async navigateTo<T extends AppRoute>(url: T): Promise<PageTypeForRoute<T>> {
        await navigateToUrl(this.page, url);
        return PageFactory.createPage(this.page, url);
    }

    /**
     * Click the logout button and wait for redirect to landing page.
     * @returns A LandingPage instance representing the page after logout.
     */
    async logoutAndVerifyRedirect(): Promise<
        PageTypeForRoute<typeof Routes.HOME>
    > {
        expect(await this.hasLogoutButton()).toBeTruthy();
        await this.page.locator('button:has(:text("logout"))').click();
        await waitForNavigation(this.page, /^https?:\/\/[^/]+\/?$/);

        // Return landing page since we've navigated there
        return PageFactory.createPage(this.page, Routes.HOME);
    }

    /**
     * Try to access the protected callback page and verify redirect to home when logged out.
     * @returns A LandingPage instance representing the landing page after redirect.
     */
    async verifyProtectedRouteRedirectsWhenLoggedOut(): Promise<
        PageTypeForRoute<typeof Routes.HOME>
    > {
        await navigateToUrl(this.page, Routes.CALLBACK);
        await waitForNavigation(this.page, /^https?:\/\/[^/]+\/?$/);

        // Return landing page and verify it's correct
        const landingPage = await PageFactory.createPage(
            this.page,
            Routes.HOME,
        );

        // Verify we're on the home page and login button is visible.
        await landingPage.expectLoginButtonToBeVisible();

        // Verify logout button is not visible.
        expect(
            await this.page.locator('button:has(:text("logout"))').isVisible(),
        ).toBeFalsy();

        return landingPage;
    }
}
