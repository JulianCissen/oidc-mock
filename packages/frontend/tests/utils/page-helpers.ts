import type { Page } from '@playwright/test';

/**
 * Get a value from localStorage.
 * @param page The Playwright page object.
 * @param key The key to retrieve from localStorage.
 * @returns The value from localStorage or null if not found.
 */
export const getLocalStorageValue = async (
    page: Page,
    key: string,
): Promise<string | null> => {
    return page.evaluate((k) => window.localStorage.getItem(k), key);
};

/**
 * Refresh the current page and wait for it to load.
 * @param page The Playwright page object.
 * @returns A Promise that resolves when the page has been refreshed.
 */
export const refreshPage = async (page: Page): Promise<void> => {
    await page.reload({ waitUntil: 'networkidle' });
};

/**
 * Navigate to a URL and wait for the page to load.
 * @param page The Playwright page object.
 * @param url The URL to navigate to.
 * @returns A Promise that resolves when navigation is complete.
 */
export const navigateToUrl = async (page: Page, url: string): Promise<void> => {
    await page.goto(url, { waitUntil: 'networkidle' });
};
