// Page Object: เมนู "การตั้งค่า" > "จัดการผู้ใช้" และ modal "เพิ่มผู้ใช้งาน"
// TODO: selector เดาจาก text ในหน้าจอ (ตาม feature) — ต้องเปิดเว็บจริงแล้วปรับให้ตรงกับ DOM จริง
// โดยเฉพาะ roleSelect ถ้าเป็น custom dropdown (ไม่ใช่ <select> ปกติ) วิธี selectRole() ต้องปรับตาม component จริง

class UserManagementPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    this.settingsMenu = page.getByText('การตั้งค่า', { exact: true }).first();
    this.userManagementSubMenu = page.getByText('จัดการผู้ใช้', { exact: true }).first();

    this.userTable = page.locator('table');
    // ปุ่มนี้เป็น <a class="btn"> ไม่ใช่ <button> จริง จึง match ด้วย text
    this.addUserButton = page.getByText('เพิ่มผู้ใช้งาน', { exact: true }).first();

    this.modal = page.getByRole('dialog').filter({ hasText: 'เพิ่มผู้ใช้งาน' });
    this.roleSelect = this.modal
      .getByLabel(/สิทธิ์ผู้ใช้งาน/)
      .or(this.modal.locator('select[name="role"]'));
    this.phoneInput = this.modal
      .getByLabel(/เบอร์มือถือ/)
      .or(this.modal.locator('input[name="phone"], input[name="mobile"]'));
    this.firstNameInput = this.modal
      .getByLabel(/ชื่อจริง/)
      .or(this.modal.locator('input[name="firstName"]'));
    this.lastNameInput = this.modal
      .getByLabel(/นามสกุล/)
      .or(this.modal.locator('input[name="lastName"]'));
    this.dobInput = this.modal
      .getByLabel(/วันเดือนปีเกิด|วันเกิด/)
      .or(this.modal.locator('input[name="dob"], input[name="birthDate"]'));
    this.emailInput = this.modal.getByLabel(/อีเมล/).or(this.modal.locator('input[name="email"]'));
    this.idCardInput = this.modal
      .getByLabel(/เลขบัตรประชาชน/)
      .or(this.modal.locator('input[name="idCard"], input[name="citizenId"]'));
    this.saveButton = this.modal.getByRole('button', { name: 'บันทึกข้อมูล' });
  }

  async openSettingsMenu() {
    await this.settingsMenu.click();
  }

  async openUserManagementSubMenu() {
    await this.userManagementSubMenu.click();
  }

  async clickAddUser() {
    await this.addUserButton.click();
  }

  async selectRole(role) {
    await this.roleSelect.click();
    await this.page.getByRole('option', { name: role }).click();
  }

  async fillPhone(phone) {
    await this.phoneInput.fill(phone);
  }

  async fillName(firstName, lastName) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
  }

  async fillPersonalInfo({ dob, email, idCard }) {
    await this.dobInput.fill(dob);
    await this.emailInput.fill(email);
    await this.idCardInput.fill(idCard);
  }

  async save() {
    await this.saveButton.click();
  }

  async waitModalClosed() {
    await this.modal.waitFor({ state: 'hidden' });
  }
}

module.exports = { UserManagementPage };
