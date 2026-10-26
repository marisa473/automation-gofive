const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://webv3-staging.360truck.co/');
  await page.getByRole('button', { name: 'โดยใช้รหัสผ่าน', exact: true }).click();
  await page.locator('#username').fill('tanakornmayai@gmail.com');
  await page.locator('#password').fill('Nine19977');
  await page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true }).click();
  await page.waitForTimeout(4000);
  const closeBtn = page.getByRole('button', { name: 'ปิด', exact: true });
  try {
    await closeBtn.waitFor({ state: 'visible', timeout: 8000 });
    await closeBtn.click();
  } catch {}
  await page.getByText('การตั้งค่า', { exact: true }).first().click();
  await page.waitForTimeout(500);
  await page.getByText('จัดการผู้ใช้', { exact: true }).first().click();
  await page.waitForTimeout(1500);
  await page.getByText('เพิ่มผู้ใช้งาน', { exact: true }).first().click();
  await page.waitForTimeout(1500);

  await page.getByRole('combobox').first().click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: 'role-dropdown-open.png' });

  const options = await page.locator('.ng-dropdown-panel .ng-option, .ng-dropdown-panel [role="option"]').all();
  console.log('option-like elements:', options.length);
  for (const o of options.slice(0, 20)) {
    const text = (await o.innerText().catch(() => '')).trim();
    const cls = await o.evaluate((e) => e.className).catch(() => '');
    if (text) console.log(JSON.stringify({ text, cls }));
  }
  await browser.close();
})();
