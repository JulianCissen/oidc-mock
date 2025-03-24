import { expect, test } from '@playwright/test';
import { LandingPage } from './pages/landing-page';

test.describe('Dark Mode Toggle', () => {
    test('should toggle dark mode when clicked', async ({ page }) => {
        const landingPage = new LandingPage(page);
        await landingPage.goto();

        // Check initial body class (depends on localStorage, but we'll assume light mode by default)
        const initialIsDark = await page.evaluate(() =>
            document.body.classList.contains('body--dark'),
        );

        // Click toggle
        await page.locator('.q-toggle').click();

        // Check if body class toggled
        const newIsDark = await page.evaluate(() =>
            document.body.classList.contains('body--dark'),
        );
        expect(newIsDark).not.toEqual(initialIsDark);

        // Toggle back
        await page.locator('.q-toggle').click();

        // Should be back to initial state
        const finalIsDark = await page.evaluate(() =>
            document.body.classList.contains('body--dark'),
        );
        expect(finalIsDark).toEqual(initialIsDark);
    });
});
