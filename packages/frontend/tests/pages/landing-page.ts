import type { Page } from '@playwright/test';

/**
 * Page object for the landing page
 */
export class LandingPage {
    constructor(private page: Page) {}

    /**
     * Navigate to the landing page
     */
    async goto() {
        await this.page.goto('/');
    }

    /**
     * Click the login button
     */
    async clickLoginButton() {
        await this.page.getByText('Login').click();
    }

    /**
     * Check if toolbar title is visible
     * @returns true if toolbar title is visible
     */
    async hasToolbarTitle() {
        return await this.page
            .locator('div.q-toolbar__title:has-text("OIDC Mock Provider")')
            .isVisible();
    }
}
