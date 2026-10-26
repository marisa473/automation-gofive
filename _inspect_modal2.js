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

  await page.screenshot({ path: 'add-user-modal.png' });

  const modal = page.locator('ngb-modal-window, [role="dialog"]').last();
  const inputs = await modal.locator('input, select, textarea').all();
  for (const input of inputs) {
    const attrs = await input.evaluate((el) => ({
      tag: el.tagName,
      type: el.type,
      name: el.name,
      id: el.id,
      placeholder: el.placeholder,
      formcontrolname: el.getAttribute('formcontrolname'),
    }));
    console.log(JSON.stringify(attrs));
  }
  console.log('--- buttons/links in modal ---');
  const clickables = await modal.locator('button, a.btn, [role="button"]').all();
  for (const c of clickables) {
    const text = (await c.innerText().catch(() => '')).trim();
    const tag = await c.evaluate((e) => e.tagName);
    if (text) console.log(tag, ':', text);
  }
  await browser.close();
})();
