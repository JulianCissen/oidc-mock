import {
    type AppRoute,
    type PageTypeForRoute,
    Routes,
} from '../utils/route-types';
import { expectToBeAtUrl, expectToBeVisible } from '../utils/test-helpers';
import {
    getLocalStorageValue,
    navigateToUrl,
    refreshPage,
} from '../utils/page-helpers';
import type { CallbackPage } from './callback-page';
import { ClaimsSelectionPage } from './claims-selection-page';
import type { Page } from '@playwright/test';
import { PageFactory } from './page-factory';

/**
 * Page object for the landing page.
 */
export class LandingPage {
    constructor(private page: Page) {}

    /**
     * Navigate to the landing page and verify we're on it.
     * @returns This LandingPage instance for method chaining.
     */
    async goto(): Promise<this> {
        await navigateToUrl(this.page, Routes.HOME);
        await this.expectToBeOnLandingPage();
        return this;
    }

    /**
     * Expect that we are on the landing page by checking URL and login button.
     * @returns This LandingPage instance for method chaining.
     */
    async expectToBeOnLandingPage(): Promise<this> {
        await expectToBeAtUrl(this.page, /^https?:\/\/[^/]+\/?$/);
        await this.expectLoginButtonToBeVisible();
        return this;
    }

    /**
     * Expect that the toolbar title is visible.
     * @returns This LandingPage instance for method chaining.
     */
    async expectToolbarTitleToBeVisible(): Promise<this> {
        await expectToBeVisible(
            this.page,
            'div.q-toolbar__title:has-text("OIDC Mock Provider")',
        );
        return this;
    }

    /**
     * Expect that the login button is visible.
     * @returns This LandingPage instance for method chaining.
     */
    async expectLoginButtonToBeVisible(): Promise<this> {
        await expectToBeVisible(this.page, 'button:has-text("Login")');
        return this;
    }

    /**
     * Expect that the dark mode toggle is visible.
     * @returns This LandingPage instance for method chaining.
     */
    async expectDarkModeToggleToBeVisible(): Promise<this> {
        await expectToBeVisible(this.page, '.q-toggle');
        return this;
    }

    /**
     * Click the login button and navigate to the claims selection page.
     * @returns A ClaimsSelectionPage instance representing the page after navigation.
     */
    async initiateLogin(): Promise<ClaimsSelectionPage> {
        await this.page.getByText('Login').click();
        // Wait for navigation to the claims page.
        await this.page.waitForURL(/\/login/, { waitUntil: 'networkidle' });

        // Return the claims selection page since we've navigated there.
        const claimsSelectionPage = new ClaimsSelectionPage(this.page);
        await claimsSelectionPage.expectToBeOnClaimsSelectionPage();
        return claimsSelectionPage;
    }

    /**
     * Click the dark mode toggle button.
     * @returns This LandingPage instance for method chaining.
     */
    async toggleDarkMode(): Promise<this> {
        await this.page.locator('.q-toggle').click();
        return this;
    }

    /**
     * Check if dark mode is currently enabled.
     * @returns True if dark mode is enabled, false otherwise.
     */
    async isDarkModeEnabled(): Promise<boolean> {
        return this.page.evaluate(() =>
            document.body.classList.contains('body--dark'),
        );
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
     * @returns This LandingPage instance for method chaining.
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
}
