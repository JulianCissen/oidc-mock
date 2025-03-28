import {
    expectAtLeastOneElementToExist,
    waitForNavigation,
} from '../utils/test-helpers';
import {
    getLocalStorageValue,
    navigateToUrl,
    refreshPage,
} from '../utils/page-helpers';
import { CallbackPage } from './callback-page';
import type { Page } from '@playwright/test';
import { Routes } from '../utils/route-types';

/**
 * Page object for the claims selection page.
 */
export class ClaimsSelectionPage {
    constructor(private page: Page) {}

    /**
     * Navigate to the claims selection page.
     * @returns This ClaimsSelectionPage instance for method chaining.
     */
    async goto(): Promise<this> {
        await navigateToUrl(this.page, Routes.LOGIN);
        await this.expectToBeOnClaimsSelectionPage();
        return this;
    }

    /**
     * Expect that we are on the claims selection page.
     * @returns This ClaimsSelectionPage instance for method chaining.
     */
    async expectToBeOnClaimsSelectionPage(): Promise<this> {
        await expectAtLeastOneElementToExist(this.page, '.custom-card');
        return this;
    }

    /**
     * Get the number of claim cards.
     * @returns the number of claim cards.
     */
    async getClaimCardsCount(): Promise<number> {
        return this.page.locator('.custom-card').count();
    }

    /**
     * Get the sub value from a claim card by index.
     * @param index the index of the claim to get the sub from.
     * @returns the sub value.
     */
    async getSubValueByIndex(index: number): Promise<string> {
        const subText = await this.page
            .locator('.custom-card')
            .nth(index)
            .locator('.text-h6')
            .textContent();
        return (subText || '').replace('sub: ', '').trim();
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
     * @returns This ClaimsSelectionPage instance for method chaining.
     */
    async refresh(): Promise<this> {
        await refreshPage(this.page);
        return this;
    }

    /**
     * Select a claim by index and follow through the authentication flow to the callback page.
     * @param index the index of the claim to select.
     * @returns A CallbackPage instance and the sub value of the selected claim.
     */
    async selectClaimAndProceedToCallback(
        index: number,
    ): Promise<{ callbackPage: CallbackPage; subValue: string }> {
        // Get the sub value before clicking for later verification
        const subValue = await this.getSubValueByIndex(index);

        // Select the claim
        await this.page
            .locator('.custom-card')
            .nth(index)
            .getByText('Use claims')
            .click();

        // Wait for consent page
        await waitForNavigation(this.page, /\/consent/);

        // Wait for redirect to callback
        await waitForNavigation(this.page, /\/callback/);

        // Return the callback page and sub value
        const callbackPage = new CallbackPage(this.page);
        await callbackPage.expectToBeOnCallbackPage();

        return { callbackPage, subValue };
    }
}
