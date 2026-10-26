// Page Object: หน้า Login
// TODO: selector เดาจาก pattern ทั่วไป — ต้องเปิดเว็บจริงแล้วปรับให้ตรงกับ DOM จริง

class LoginPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.passwordTabButton = page.getByRole('button', { name: 'โดยใช้รหัสผ่าน', exact: true });
    this.usernameInput = page.locator('#username');
    this.passwordInput = page.locator('#password');
    this.loginButton = page.getByRole('button', { name: 'เข้าสู่ระบบ', exact: true });
  }

  async goto() {
    await this.page.goto('/');
  }

  async loginAsSuperUser() {
    const username = process.env.TEST_SUPERUSER_USERNAME;
    const password = process.env.TEST_SUPERUSER_PASSWORD;
    if (!username || !password) {
      throw new Error(
        'ต้องตั้งค่า env var TEST_SUPERUSER_USERNAME และ TEST_SUPERUSER_PASSWORD ก่อนรันเทสนี้ (ดู README)'
      );
    }
    await this.passwordTabButton.click();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}

module.exports = { LoginPage };
