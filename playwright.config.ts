import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 60000,
  expect: { timeout: 10000 },
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:6213',
    headless: false,
    video: 'on', // 🎥 Record video for every test
    screenshot: 'off', // disable screenshots
    trace: 'on-first-retry',
    viewport: { width: 1280, height: 720 },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
