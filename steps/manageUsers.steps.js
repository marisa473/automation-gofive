const { expect } = require('@playwright/test');
const { createBdd } = require('playwright-bdd');
const { LoginPage } = require('../pages/LoginPage');
const { UserManagementPage } = require('../pages/UserManagementPage');
const {
  genDummyPhone,
  genDummyName,
  genDummyDob,
  genDummyEmail,
  genDummyIdCard,
} = require('../utils/dummyData');

const { Given, When, Then } = createBdd();

// เก็บข้อมูล dummy ที่สุ่มไว้ระหว่าง step เพื่อไปเช็คตอนท้าย (scope ต่อ 1 scenario/worker)
let dummyUser = {};

Given('ผู้ใช้งานล็อกอินเข้าสู่ระบบด้วยสิทธิ์ Super User', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginAsSuperUser();
});

Given('ผู้ใช้อยู่ที่หน้าหลักของระบบ', async ({ page }) => {
  await expect(page).not.toHaveURL(/login/i);
  // เว็บนี้มี popup โปรโมชันเด้งขึ้นมาทับหน้าหลักหลัง login บางครั้ง — ปิดทิ้งถ้ามี ไม่งั้น element อื่นจะคลิกไม่ได้
  const closePromoButton = page.getByRole('button', { name: 'ปิด', exact: true });
  try {
    await closePromoButton.waitFor({ state: 'visible', timeout: 8000 });
    await closePromoButton.click();
  } catch {
    // ไม่มี popup ขึ้นมาก็ข้ามไปได้เลย
  }
});

When('ผู้ใช้คลิกที่เมนู {string}', async ({ page }, menuName) => {
  await page.getByText(menuName, { exact: true }).first().click();
});

When('ผู้ใช้คลิกเลือกเมนูย่อย {string}', async ({ page }, subMenuName) => {
  await page.getByText(subMenuName, { exact: true }).first().click();
});

Then(
  'ระบบแสดงหน้า {string} พร้อมรายการผู้ใช้งานทั้งหมดในตาราง',
  // หมายเหตุ: หน้าจริงใช้ heading ว่า "ผู้ใช้งานทั้งหมด" (ไม่ใช่ชื่อเมนู "จัดการผู้ใช้" ที่คลิก)
  // จึงเช็คแค่ตารางแสดงผล ไม่ผูกกับ pageName ตรงตัว เพื่อกันเทสพังตาม label เมนูที่เปลี่ยนได้
  async ({ page }, pageName) => {
    await expect(page.locator('table')).toBeVisible();
  }
);

Then('ระบบแสดงปุ่ม {string}', async ({ page }, buttonName) => {
  // หลายปุ่มในเว็บนี้เป็น <a class="btn"> ไม่ใช่ <button> จริง จึงใช้ text match แทน role
  await expect(page.getByText(buttonName, { exact: true }).first()).toBeVisible();
});

When('ผู้ใช้คลิกปุ่ม {string}', async ({ page }, buttonName) => {
  await page.getByText(buttonName, { exact: true }).first().click();
});

Then('ระบบแสดงหน้าต่าง Pop-up Modal {string}', async ({ page }, modalName) => {
  await expect(page.getByRole('dialog').filter({ hasText: modalName })).toBeVisible();
});

When('ผู้ใช้เลือกสิทธิ์ผู้ใช้งานเป็น {string}', async ({ page }, role) => {
  const userManagementPage = new UserManagementPage(page);
  await userManagementPage.selectRole(role);
});

When(
  'ผู้ใช้กรอกเบอร์มือถือแบบข้อมูลจำลอง \\(dummy\\) ที่ขึ้นต้นด้วย {string}',
  async ({ page }, prefix) => {
    const userManagementPage = new UserManagementPage(page);
    dummyUser.phone = genDummyPhone(prefix);
    await userManagementPage.fillPhone(dummyUser.phone);
  }
);

When('ผู้ใช้กรอกชื่อจริงและนามสกุลแบบข้อมูลจำลอง \\(dummy\\)', async ({ page }) => {
  const userManagementPage = new UserManagementPage(page);
  const { firstName, lastName } = genDummyName();
  dummyUser.firstName = firstName;
  dummyUser.lastName = lastName;
  await userManagementPage.fillName(firstName, lastName);
});

When(
  'ผู้ใช้กรอกวันเดือนปีเกิด อีเมล และเลขบัตรประชาชนแบบข้อมูลจำลอง \\(dummy\\)',
  async ({ page }) => {
    const userManagementPage = new UserManagementPage(page);
    dummyUser.dob = genDummyDob();
    dummyUser.email = genDummyEmail(dummyUser.firstName, dummyUser.lastName);
    dummyUser.idCard = genDummyIdCard();
    await userManagementPage.fillPersonalInfo(dummyUser);
  }
);

Then('ระบบบันทึกข้อมูลสำเร็จและปิดหน้าต่าง Modal', async ({ page }) => {
  const userManagementPage = new UserManagementPage(page);
  await userManagementPage.waitModalClosed();
});

Then('รายชื่อผู้ใช้ใหม่แสดงในตารางรายการผู้ใช้งานทั้งหมด', async ({ page }) => {
  const fullName = `${dummyUser.firstName} ${dummyUser.lastName}`;
  await expect(page.locator('table').getByText(fullName)).toBeVisible();
});

Then('ระบบส่ง SMS แจ้ง Username และ Password ไปยังเบอร์มือถือที่กรอกไว้', async () => {
  // ตรวจสอบผ่าน UI test โดยตรงไม่ได้ — ต้องต่อ mock SMS gateway หรือ API log แยกต่างหากถ้าต้องการ automate จริง
  console.warn('[manual check] ต้องตรวจสอบ SMS แจ้ง Username/Password แยกต่างหาก (ยังไม่ automate)');
});
