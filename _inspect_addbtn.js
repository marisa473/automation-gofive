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

  const el = page.getByText('เพิ่มผู้ใช้งาน', { exact: true });
  const count = await el.count();
  console.log('count:', count);
  for (let i = 0; i < count; i++) {
    const attrs = await el.nth(i).evaluate((e) => ({
      tag: e.tagName,
      class: e.className,
      role: e.getAttribute('role'),
      outer: e.outerHTML.slice(0, 300),
    }));
    console.log(JSON.stringify(attrs));
  }
  await page.screenshot({ path: 'user-mgmt-page.png' });
  await browser.close();
})();
