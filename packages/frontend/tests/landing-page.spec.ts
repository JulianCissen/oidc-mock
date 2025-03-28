import { LandingPage } from './pages/landing-page';
import { test } from '@playwright/test';

test.describe('Landing Page', () => {
    let landingPage: LandingPage;

    test.beforeEach(async ({ page }) => {
        landingPage = new LandingPage(page);
        await landingPage.goto();
    });

    test('should display the login button', async () => {
        // Verify that the login button is visible on the page.
        await landingPage.expectLoginButtonToBeVisible();
    });

    test('should display the toolbar title', async () => {
        // Verify that the application title is displayed in the toolbar.
        await landingPage.expectToolbarTitleToBeVisible();
    });

    test('should have dark mode toggle', async () => {
        // Verify that the dark mode toggle is present and visible.
        await landingPage.expectDarkModeToggleToBeVisible();
    });
});
