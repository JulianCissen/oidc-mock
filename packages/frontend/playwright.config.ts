import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    // Look for test files in the "tests" directory, relative to this configuration file
    testDir: './tests',

    // Fail the build on CI if you accidentally left test.only in the source code
    forbidOnly: !!process.env.CI,

    // Retry on CI only
    retries: process.env.CI ? 2 : 0,

    // Reporter to use - add GitHub reporter for CI
    reporter: process.env.CI
        ? [
              ['list', { printSteps: true }],
              ['html', { outputFolder: 'playwright-report' }],
              ['github'],
          ]
        : [
              ['list', { printSteps: true }],
              ['html', { open: 'never', outputFolder: 'playwright-report' }],
          ],

    // Shared settings for all the projects below
    use: {
        // Base URL to use in actions like `await page.goto('/')`
        baseURL: process.env.CI
            ? 'http://oidc-mock-prod:8080'
            : 'http://localhost:8080',

        // Collect trace when retrying the failed test
        trace: 'on-first-retry',

        // Take screenshots on test failures
        screenshot: 'only-on-failure',
    },

    // Configure projects for major browsers
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],

    // Run your local dev server before starting the tests
    // In CI, we use a dummy command that returns immediately
    webServer: {
        command: process.env.CI
            ? 'echo "Using external container for tests"'
            : process.platform === 'win32'
              ? 'bash ../../bin/run_dev.sh 8080'
              : '../../bin/run_dev.sh 8080',
        url: process.env.CI
            ? 'http://oidc-mock-prod:8080'
            : 'http://localhost:8080',
        reuseExistingServer: true,
        stdout: 'pipe',
        stderr: 'pipe',
    },
});
