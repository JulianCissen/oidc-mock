import { expect, test } from '@playwright/test';
import { LandingPage } from './pages/landing-page';
import { expectToBeVisible } from './utils/test-helpers';

test.describe('Landing Page', () => {
    let landingPage: LandingPage;

    test.beforeEach(async ({ page }) => {
        landingPage = new LandingPage(page);
        await landingPage.goto();
    });

    test('should display the login button', async ({ page }) => {
        await expectToBeVisible(page, 'button:has-text("Login")');
    });

    test('should display the toolbar title', async ({ page }) => {
        await expectToBeVisible(
            page,
            'div.q-toolbar__title:has-text("OIDC Mock Provider")',
        );
    });

    test('should have dark mode toggle', async ({ page }) => {
        await expectToBeVisible(page, '.q-toggle');
    });
});
