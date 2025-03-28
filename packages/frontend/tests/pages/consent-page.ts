import { expectToBeAtUrl, waitForNavigation } from '../utils/test-helpers';
import {
    getLocalStorageValue,
    navigateToUrl,
    refreshPage,
} from '../utils/page-helpers';
import { CallbackPage } from './callback-page';
import type { Page } from '@playwright/test';
import { Routes } from '../utils/route-types';

/**
 * Page object for the consent page.
 */
export class ConsentPage {
    constructor(private page: Page) {}

    /**
     * Navigate to the consent page.
     * @returns This ConsentPage instance for method chaining.
     */
    async goto(): Promise<this> {
        await navigateToUrl(this.page, Routes.CONSENT);
        return this;
    }

    /**
     * Expect that we are on the consent page.
     * @returns This ConsentPage instance for method chaining.
     */
    async expectToBeOnConsentPage(): Promise<this> {
        await expectToBeAtUrl(this.page, /\/consent/);
        return this;
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
     * @returns This ConsentPage instance for method chaining.
     */
    async refresh(): Promise<this> {
        await refreshPage(this.page);
        return this;
    }

    /**
     * Wait for the consent page to process and redirect to the callback page.
     * @returns A CallbackPage instance representing the page after navigation.
     */
    async waitForCallbackRedirect(): Promise<CallbackPage> {
        await waitForNavigation(this.page, /\/callback/);

        // Return the callback page after navigation
        const callbackPage = new CallbackPage(this.page);
        await callbackPage.expectToBeOnCallbackPage();
        return callbackPage;
    }

    /**
     * Complete the entire consent flow from current page to callback.
     * @returns A CallbackPage instance representing the page after consent.
     */
    async completeConsentFlow(): Promise<CallbackPage> {
        // Consent is automatic in the test app, just wait for the redirect.
        return await this.waitForCallbackRedirect();
    }
}
