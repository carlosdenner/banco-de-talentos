import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

// Load test environment variables
dotenv.config({ path: '.env.test' });

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173/banco-de-talentos/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    // Setup project - authenticates and saves state
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    // Tests that don't need authentication
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: /.*\.(setup|auth\.spec)\.ts/,
      dependencies: [],
    },
    // Tests that need authentication
    {
      name: 'chromium-auth',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      testMatch: /.*\.auth\.spec\.ts/,
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: /.*\.(setup|auth\.spec)\.ts/,
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      testIgnore: /.*\.(setup|auth\.spec)\.ts/,
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173/banco-de-talentos/',
    reuseExistingServer: !process.env.CI,
  },
});
