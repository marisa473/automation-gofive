// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { defineBddConfig } = require('playwright-bdd');

// playwright-bdd: reads .feature files + step definitions,
// generates runnable Playwright test files into .features-gen (git-ignored)
const testDir = defineBddConfig({
  features: 'features/**/*.feature',
  steps: 'steps/**/*.js',
});

module.exports = defineConfig({
  testDir,

  // ---- แก้ตรงนี้ให้เป็น URL ของระบบที่จะเทสจริง ----
  use: {
    baseURL: process.env.BASE_URL || 'https://webv3-staging.360truck.co/today/shipper',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  fullyParallel: true,
  reporter: [['html', { open: 'never' }], ['list']],

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // เปิดใช้ browser อื่นได้ตามต้องการ
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
