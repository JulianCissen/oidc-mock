import { expect, test } from '@playwright/test';
import { LandingPage } from './pages/landing-page';

test.describe('Dark Mode Toggle', () => {
    let landingPage: LandingPage;

    test.beforeEach(async ({ page }) => {
        landingPage = new LandingPage(page);
        await landingPage.goto();
    });

    test('should toggle dark mode when clicked', async () => {
        // Verify the dark mode toggle exists on the page.
        await landingPage.expectDarkModeToggleToBeVisible();

        // Check the initial dark mode state before testing.
        const initialIsDark = await landingPage.isDarkModeEnabled();

        // Toggle dark mode and verify it changed to the opposite state.
        await landingPage.toggleDarkMode();
        expect(await landingPage.isDarkModeEnabled()).not.toEqual(
            initialIsDark,
        );

        // Toggle dark mode back and verify it returned to the initial state.
        await landingPage.toggleDarkMode();
        expect(await landingPage.isDarkModeEnabled()).toEqual(initialIsDark);
    });

    test('should persist dark mode setting after page refresh', async () => {
        // Toggle dark mode to change the current state.
        await landingPage.toggleDarkMode();

        // Verify the localStorage value matches the new dark mode state.
        const newIsDark = await landingPage.isDarkModeEnabled();
        const localStorageValue =
            await landingPage.getLocalStorageValue('darkMode');
        expect(localStorageValue).toBe(String(newIsDark));

        // Refresh the page to verify persistence.
        await landingPage.refresh();

        // Verify dark mode state is maintained after the page refresh.
        expect(await landingPage.isDarkModeEnabled()).toBe(newIsDark);
    });
});
