const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { RegisterEmpeoPage } = require('../pages/RegisterEmpeoPage');
const { genUniqueDomainEmail, genCompanyName } = require('../utils/dummyData');

const { Given, When, Then } = createBdd();

// เก็บค่าระหว่าง step ภายใน 1 scenario (reset ทุกครั้งที่เปิดหน้าลงทะเบียนใน Background)
let ctx = {};

// error บางตัวยังค้างอยู่ใน DOM แบบซ่อน จึงนับเฉพาะตัวที่มองเห็น
const visibleError = (registerPage, message) =>
  registerPage.fieldError(message).filter({ visible: true });

async function fillValidForm(registerPage, phone) {
  ctx.email = genUniqueDomainEmail();
  ctx.companyName = genCompanyName();
  await registerPage.chooseCompanyCategory('อื่นๆ');
  await registerPage.fillCompanyName(ctx.companyName);
  await registerPage.selectCompanyType('เทคโนโลยี');
  await registerPage.selectUserAmount('1-20');
  await registerPage.fillContact({
    email: ctx.email,
    firstName: 'ทดสอบ',
    lastName: 'ออโตเมชัน',
    phone,
  });
}

async function waitForOtpModal(registerPage) {
  await expect(registerPage.otpModalTitle).toBeVisible({ timeout: 30000 });
  ctx.otpRef = (await registerPage.otpRefText.textContent()).trim();
}

// ---------------------------------------------------------------- ฟอร์ม

Given('ผู้ใช้เปิดหน้าลงทะเบียน empeo', async ({ page }) => {
  ctx = {};
  await new RegisterEmpeoPage(page).goto();
});

When('ผู้ใช้กรอกฟอร์มลงทะเบียนด้วยข้อมูลถูกต้อง เบอร์ {string}', async ({ page }, phone) => {
  await fillValidForm(new RegisterEmpeoPage(page), phone);
});

When('ผู้ใช้กรอกฟอร์มลงทะเบียนครบและกดทดลองใช้ฟรี เบอร์ {string}', async ({ page }, phone) => {
  const registerPage = new RegisterEmpeoPage(page);
  await fillValidForm(registerPage, phone);
  await registerPage.acceptConsent();
  await registerPage.submit();
  await waitForOtpModal(registerPage);
});

When('ผู้ใช้ติ๊กยอมรับนโยบายและเงื่อนไข', async ({ page }) => {
  await new RegisterEmpeoPage(page).acceptConsent();
});

When('ผู้ใช้กดปุ่ม ทดลองใช้ฟรี', async ({ page }) => {
  await new RegisterEmpeoPage(page).submit();
});

When('ผู้ใช้กรอกชื่อ {string} และนามสกุล {string}', async ({ page }, firstName, lastName) => {
  await new RegisterEmpeoPage(page).fillContact({ firstName, lastName });
});

When('ผู้ใช้กรอกเบอร์มือถือ {string}', async ({ page }, phone) => {
  await new RegisterEmpeoPage(page).fillContact({ phone });
});

When('ผู้ใช้กรอกอีเมล {string}', async ({ page }, email) => {
  await new RegisterEmpeoPage(page).fillContact({ email });
});

When('ผู้ใช้เลือกประเภทบริษัท {string}', async ({ page }, category) => {
  await new RegisterEmpeoPage(page).chooseCompanyCategory(category);
});

When('ผู้ใช้ค้นหาและเลือกบริษัทด้วยคำค้น {string}', async ({ page }, keyword) => {
  await new RegisterEmpeoPage(page).searchAndPickTaxCompany(keyword);
});

Then('ระบบแสดงข้อความ error {string}', async ({ page }, message) => {
  await expect(visibleError(new RegisterEmpeoPage(page), message).first()).toBeVisible();
});

Then('ระบบไม่แสดงข้อความ error {string}', async ({ page }, message) => {
  await expect(visibleError(new RegisterEmpeoPage(page), message)).toHaveCount(0);
});

Then('ระบบแสดงข้อความ error ดังนี้', async ({ page }, dataTable) => {
  const registerPage = new RegisterEmpeoPage(page);
  for (const { message } of dataTable.hashes()) {
    await expect(visibleError(registerPage, message.trim()).first()).toBeVisible();
  }
});

Then('ระบบไม่แสดงหน้าต่างยืนยัน OTP', async ({ page }) => {
  // รอให้ request ตรวจซ้ำ (DuplicateEmail/duplicateInfo) ทำงานเสร็จก่อนสรุปว่า modal ไม่ขึ้น
  await page.waitForLoadState('networkidle');
  await expect(new RegisterEmpeoPage(page).otpModalTitle).toBeHidden();
});

// ---------------------------------------------------------------- โค้ดส่วนลด

When('ผู้ใช้ใช้โค้ดส่วนลด {string}', async ({ page }, code) => {
  await new RegisterEmpeoPage(page).applyCoupon(code);
});

When('ผู้ใช้ใช้โค้ดส่วนลด {string} โดยมีช่องว่างหน้าและหลัง', async ({ page }, code) => {
  await new RegisterEmpeoPage(page).applyCoupon(` ${code} `);
});

When('ผู้ใช้กดลบโค้ดส่วนลด', async ({ page }) => {
  await new RegisterEmpeoPage(page).removeCoupon();
});

Then('ระบบแสดงโค้ดส่วนลด {string} ที่ใช้แล้ว', async ({ page }, code) => {
  const registerPage = new RegisterEmpeoPage(page);
  await expect(registerPage.couponChip).toBeVisible();
  await expect(registerPage.couponChip).toContainText(code);
});

Then('ระบบไม่แสดงโค้ดส่วนลดที่ใช้แล้ว', async ({ page }) => {
  await expect(new RegisterEmpeoPage(page).couponChip).toBeHidden();
});

Then('ระบบแสดงช่องกรอกโค้ดส่วนลดอีกครั้ง', async ({ page }) => {
  const registerPage = new RegisterEmpeoPage(page);
  await expect(registerPage.couponChip).toBeHidden();
  await expect(registerPage.couponInput).toBeVisible();
});

Given(
  'มีการลงทะเบียนสำเร็จด้วยโค้ด {string} และเบอร์ {string} ไปแล้ว',
  async ({ page }, code, phone) => {
    const registerPage = new RegisterEmpeoPage(page);
    await fillValidForm(registerPage, phone);
    await registerPage.applyCoupon(code);
    await expect(registerPage.couponChip).toBeVisible();
    await registerPage.acceptConsent();
    await registerPage.submit();
    await waitForOtpModal(registerPage);
    await registerPage.enterOtp(process.env.TEST_OTP || '123456');
    await registerPage.verifyOtp();
    await page.waitForURL(/create-password/, { timeout: 45000 });
    await registerPage.setPassword('Qa@123456');
    await registerPage.setPasswordButton.click();
    await expect(page.getByText('empeo พร้อมใช้งานแล้ว!')).toBeVisible({ timeout: 30000 });
  }
);

// ---------------------------------------------------------------- OTP

Then('ระบบแสดงหน้าต่างยืนยัน OTP ที่ส่งไปยัง {string}', async ({ page }, maskedPhone) => {
  const registerPage = new RegisterEmpeoPage(page);
  await waitForOtpModal(registerPage);
  await expect(page.getByText(`โปรดกรอกรหัส OTP ที่ถูกส่งไปยัง ${maskedPhone}`)).toBeVisible();
});

Then('ระบบแสดงเลขอ้างอิง OTP \\(ref)', async ({ page }) => {
  await expect(new RegisterEmpeoPage(page).otpRefText).toHaveText(/ref:\s*\d{4}/);
});

Then('ระบบแสดงตัวนับถอยหลังและยังไม่แสดงปุ่มส่ง OTP ใหม่', async ({ page }) => {
  const registerPage = new RegisterEmpeoPage(page);
  await expect(registerPage.otpCountdownText).toBeVisible();
  await expect(registerPage.otpResendButton).toBeHidden();
});

When('ผู้ใช้พิมพ์ {string} ลงในช่อง OTP', async ({ page }, text) => {
  await new RegisterEmpeoPage(page).enterOtp(text);
});

When('ผู้ใช้กรอก OTP {string} และกดยืนยัน', async ({ page }, otp) => {
  const registerPage = new RegisterEmpeoPage(page);
  await registerPage.enterOtp(otp);
  await registerPage.verifyOtp();
});

Then('ช่อง OTP ยังว่างอยู่', async ({ page }) => {
  expect(await new RegisterEmpeoPage(page).otpValue()).toBe('');
});

Then('ช่อง OTP ถูกล้างค่า', async ({ page }) => {
  const registerPage = new RegisterEmpeoPage(page);
  await expect.poll(() => registerPage.otpValue()).toBe('');
});

Then('ปุ่มยืนยัน OTP กดไม่ได้', async ({ page }) => {
  await expect(new RegisterEmpeoPage(page).otpVerifyButton).toBeDisabled();
});

Then('ระบบแจ้งเตือน {string}', async ({ page }, message) => {
  await expect(page.getByText(message).first()).toBeVisible();
});

Then('ผู้ใช้ยังอยู่ที่หน้าต่างยืนยัน OTP', async ({ page }) => {
  await expect(new RegisterEmpeoPage(page).otpModalTitle).toBeVisible();
  await expect(page).not.toHaveURL(/create-password/);
});

When('ผู้ใช้รอจนปุ่มส่ง OTP ใหม่แสดง', async ({ page }) => {
  // countdown 30 วินาที
  await expect(new RegisterEmpeoPage(page).otpResendButton).toBeVisible({ timeout: 45000 });
});

When('ผู้ใช้กดส่ง OTP ใหม่', async ({ page }) => {
  const registerPage = new RegisterEmpeoPage(page);
  ctx.previousOtpRef = (await registerPage.otpRefText.textContent()).trim();
  await registerPage.otpResendButton.click();
});

Then('ระบบแสดงเลขอ้างอิง OTP ใหม่ที่ไม่ซ้ำกับเดิม', async ({ page }) => {
  const registerPage = new RegisterEmpeoPage(page);
  await expect(registerPage.otpRefText).not.toHaveText(ctx.previousOtpRef);
  await expect(registerPage.otpRefText).toHaveText(/ref:\s*\d{4}/);
});

When('ผู้ใช้รอจน OTP หมดอายุ', async ({ page, $test }) => {
  const seconds = Number(process.env.OTP_EXPIRE_SECONDS);
  $test.skip(!seconds, 'ต้องกำหนด env OTP_EXPIRE_SECONDS (อายุ OTP เป็นวินาที) จึงจะรันเคสนี้');
  $test.setTimeout((seconds + 120) * 1000);
  await page.waitForTimeout((seconds + 5) * 1000);
});

Then('ระบบไม่พาไปหน้าตั้งรหัสผ่าน', async ({ page }) => {
  await page.waitForLoadState('networkidle');
  await expect(page).not.toHaveURL(/create-password/);
});

// ---------------------------------------------------------------- ตั้งรหัสผ่าน

Then('ระบบพาไปหน้าตั้งรหัสผ่าน', async ({ page }) => {
  // verify-otp ตอบช้าได้ถึง ~20 วินาทีเมื่อรันหลาย worker พร้อมกัน
  await page.waitForURL(/\/Register\/empeo\/create-password\?token=/, { timeout: 45000 });
  await expect(new RegisterEmpeoPage(page).passwordInput).toBeVisible();
});

When('ผู้ใช้กรอกรหัสผ่าน {string} และยืนยันรหัสผ่าน {string}', async ({ page }, password, confirm) => {
  const registerPage = new RegisterEmpeoPage(page);
  await registerPage.setPassword(password, confirm);
  await registerPage.confirmPasswordInput.blur();
});

When('ผู้ใช้ตั้งรหัสผ่าน {string} และยืนยันรหัสผ่าน {string}', async ({ page }, password, confirm) => {
  const registerPage = new RegisterEmpeoPage(page);
  await registerPage.setPassword(password, confirm);
  await registerPage.setPasswordButton.click();
});

// บางกรณีปุ่มถูก disable บางกรณีปุ่มกดได้แต่ไม่ไปต่อ -> ถ้ากดได้ให้กดแล้วเช็คว่ายังอยู่หน้าเดิม
Then('ระบบไม่ยอมให้ตั้งรหัสผ่านนี้', async ({ page }) => {
  const registerPage = new RegisterEmpeoPage(page);
  if (await registerPage.setPasswordButton.isEnabled()) {
    await registerPage.setPasswordButton.click();
    await page.waitForLoadState('networkidle');
  }
  await expect(page).toHaveURL(/create-password/);
  await expect(page.getByText('empeo พร้อมใช้งานแล้ว!')).toBeHidden();
});

Then('ระบบแสดงหน้าลงทะเบียนสำเร็จ {string}', async ({ page }, title) => {
  await expect(page.getByText(title)).toBeVisible({ timeout: 30000 });
  await expect(page.getByText('Oops...')).toBeHidden();
});
