import {
    type AppRoute,
    type PageTypeForRoute,
    Routes,
} from '../utils/route-types';
import { CallbackPage } from './callback-page';
import { ClaimsSelectionPage } from './claims-selection-page';
import { ConsentPage } from './consent-page';
import { LandingPage } from './landing-page';
import type { Page } from '@playwright/test';

/**
 * Factory class for creating page objects based on URLs.
 */
export class PageFactory {
    /**
     * Create a page object based on the URL.
     * @param page The Playwright page object.
     * @param url The URL to check.
     * @returns A Promise that resolves to the appropriate page object.
     */
    static async createPage<T extends AppRoute>(
        page: Page,
        url: T,
    ): Promise<PageTypeForRoute<T>> {
        // Initialize the appropriate page object based on the URL.
        let pageObject;

        if (url === Routes.HOME) {
            pageObject = new LandingPage(page);
            await pageObject.expectToBeOnLandingPage();
        } else if (url === Routes.CALLBACK) {
            pageObject = new CallbackPage(page);
            await pageObject.expectToBeOnCallbackPage();
        } else if (url === Routes.LOGIN) {
            pageObject = new ClaimsSelectionPage(page);
            await pageObject.expectToBeOnClaimsSelectionPage();
        } else if (url === Routes.CONSENT) {
            pageObject = new ConsentPage(page);
            await pageObject.expectToBeOnConsentPage();
        } else {
            pageObject = new LandingPage(page);
            await pageObject.expectToBeOnLandingPage();
        }

        // Cast the page object to the correct type based on the URL.
        return pageObject as PageTypeForRoute<T>;
    }
}
