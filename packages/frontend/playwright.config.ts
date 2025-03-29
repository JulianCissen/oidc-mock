import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    // Look for test files in the "tests" directory, relative to this configuration file
    testDir: './tests',

    // Fail the build on CI if you accidentally left test.only in the source code
    forbidOnly: !!process.env.CI,

    // Stop after several failures in CI to balance between early failure detection and detailed reporting
    maxFailures: process.env.CI ? 5 : 0,

    // Timeouts: Set a reasonable global timeout to prevent long-running tests
    globalTimeout: process.env.CI ? 5 * 60 * 1000 : 0, // 5 minutes total time limit on CI
    timeout: process.env.CI ? 15000 : 30000, // 15 seconds per test on CI

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
        // Use localhost for both CI and local development
        baseURL: 'http://localhost:8080',

        // Collect trace when retrying the failed test
        trace: 'retain-on-first-failure',

        // Take screenshots on test failures
        screenshot: 'on-first-failure',

        // Add a reasonable navigation timeout
        navigationTimeout: 10000, // 10 second navigation timeout
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
        url: 'http://localhost:8080',
        reuseExistingServer: true,
        stdout: 'pipe',
        stderr: 'pipe',
    },
});
