import { type Page, expect, test } from '@playwright/test';

/**
 * Expect an element matching the selector to be visible.
 * @param page The Playwright page object.
 * @param selector The selector to find the element.
 * @returns A Promise that resolves when the expectation is verified.
 */
export const expectToBeVisible = async (
    page: Page,
    selector: string,
): Promise<void> => {
    await expect(page.locator(selector)).toBeVisible();
};

/**
 * Expect an element matching the selector to have specific text content.
 * @param page The Playwright page object.
 * @param selector The selector to find the element.
 * @param text The expected text content (string or RegExp).
 * @returns A Promise that resolves when the expectation is verified.
 */
export const expectToHaveText = async (
    page: Page,
    selector: string,
    text: string | RegExp,
): Promise<void> => {
    await expect(page.locator(selector)).toContainText(text);
};

/**
 * Expect the page to be at a specific URL.
 * @param page The Playwright page object.
 * @param urlPattern The expected URL pattern (string or RegExp).
 * @returns A Promise that resolves when the expectation is verified.
 */
export const expectToBeAtUrl = async (
    page: Page,
    urlPattern: RegExp | string,
): Promise<void> => {
    await expect(page).toHaveURL(urlPattern);
};

/**
 * Get text content of an element matching the selector.
 * @param page The Playwright page object.
 * @param selector The selector to find the element.
 * @returns A Promise that resolves to the text content of the element.
 */
export const getTextContent = async (
    page: Page,
    selector: string,
): Promise<string> => {
    return (await page.locator(selector).textContent()) || '';
};

/**
 * Expect at least one element matching the selector to exist on the page.
 * This is useful when you expect multiple matching elements and want to verify
 * that there's at least one present without causing strict mode violations.
 * @param page The Playwright page object.
 * @param selector The selector to find elements.
 * @returns A Promise that resolves when the expectation is verified.
 */
export const expectAtLeastOneElementToExist = async (
    page: Page,
    selector: string,
): Promise<void> => {
    const count = await page.locator(selector).count();
    expect(count).toBeGreaterThan(0);
};

/**
 * Wait for navigation to a specific URL to complete.
 * @param page The Playwright page object.
 * @param urlPattern The expected URL pattern after navigation.
 * @param options Optional configuration for the wait operation.
 * @param options.timeout The maximum time to wait for navigation (default: 30 seconds).
 * @param options.waitUntil The event to wait for before resolving (default: 'networkidle').
 * @returns A Promise that resolves when navigation completes.
 */
export const waitForNavigation = async (
    page: Page,
    urlPattern: RegExp | string,
    options?: {
        timeout?: number;
        waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
    },
): Promise<void> => {
    // Default to networkidle for SPA applications.
    const defaultOptions = {
        waitUntil: 'networkidle' as const,
        timeout: 30000,
    };
    await page.waitForURL(urlPattern, { ...defaultOptions, ...options });
};

/**
 * Setup for tests that ensures the page is ready before running tests.
 * Extends the base test fixture with custom page initialization.
 */
export const setupTest = test.extend({
    page: async ({ page }, use) => {
        // Add a longer timeout for initial page load.
        await page.goto('/', { waitUntil: 'networkidle', timeout: 45000 });

        // Verify the page is responsive by checking for a key element.
        await expectToBeVisible(page, 'div.q-toolbar__title');

        await use(page);
    },
});
