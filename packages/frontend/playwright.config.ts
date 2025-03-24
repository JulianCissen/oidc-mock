import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
    // Look for test files in the "tests" directory, relative to this configuration file
    testDir: './tests',

    // Run tests in files in parallel
    fullyParallel: true,

    // Fail the build on CI if you accidentally left test.only in the source code
    forbidOnly: !!process.env.CI,

    // Retry on CI only
    retries: process.env.CI ? 2 : 0,

    // Reporter to use
    reporter: 'list',

    // Shared settings for all the projects below
    use: {
        // Base URL to use in actions like `await page.goto('/')`
        // Updated to use the default port from run_dev.sh
        baseURL: 'http://localhost:8080',

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
    // Updated to use the run_dev.sh script from the project root
    webServer: {
        command:
            process.platform === 'win32'
                ? 'bash ../../bin/run_dev.sh 8080'
                : '../../bin/run_dev.sh 8080',
        url: 'http://localhost:8080',
        reuseExistingServer: !process.env.CI,
        stdout: 'pipe',
        stderr: 'pipe',
        // Increase timeout as the full stack might take longer to start
        timeout: 60000,
    },
});
