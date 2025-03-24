import { type Page, expect } from '@playwright/test';

export const expectToBeVisible = async (
    page: Page,
    selector: string,
): Promise<void> => {
    await expect(page.locator(selector)).toBeVisible();
};

export const expectToHaveText = async (
    page: Page,
    selector: string,
    text: string | RegExp,
): Promise<void> => {
    await expect(page.locator(selector)).toContainText(text);
};
