const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { SearchPage } = require('../pages/SearchPage');

// createBdd() ผูก Given/When/Then เข้ากับ fixture ของ Playwright test
// (page, context, browser ฯลฯ ใช้ได้เหมือน playwright test ปกติทุกอย่าง)
const { Given, When, Then } = createBdd();

Given('ผู้ใช้เปิดหน้าเว็บหลัก', async ({ page }) => {
  const searchPage = new SearchPage(page);
  await searchPage.goto();
});

When('ผู้ใช้ค้นหาคำว่า {string}', async ({ page }, keyword) => {
  const searchPage = new SearchPage(page);
  await searchPage.search(keyword);
});

Then('ผู้ใช้ควรเห็นผลลัพธ์การค้นหาอย่างน้อย {int} รายการ', async ({ page }, minCount) => {
  const searchPage = new SearchPage(page);
  const count = await searchPage.resultCount();
  expect(count).toBeGreaterThanOrEqual(minCount);
});
