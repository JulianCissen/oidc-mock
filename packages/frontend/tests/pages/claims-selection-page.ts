import type { Page } from '@playwright/test';

/**
 * Page object for the claims selection page.
 */
export class ClaimsSelectionPage {
    constructor(private page: Page) {}

    /**
     * Navigate to the claims selection page.
     */
    async goto() {
        await this.page.goto('/login');
    }

    /**
     * Get the number of claim cards.
     * @returns the number of claim cards.
     */
    async getClaimCardsCount() {
        return this.page.locator('.custom-card').count();
    }

    /**
     * Select a claim by index.
     * @param index the index of the claim to select.
     */
    async selectClaimByIndex(index: number) {
        await this.page
            .locator('.custom-card')
            .nth(index)
            .getByText('Use claims')
            .click();
    }
}
