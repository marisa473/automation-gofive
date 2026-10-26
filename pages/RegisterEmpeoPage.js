// Page Object: หน้าลงทะเบียนทดลองใช้ empeo (https://portal.uat.gofive.co.th/Register/empeo)
// ครอบคลุม 3 ขั้น: ฟอร์มลงทะเบียน -> modal ยืนยัน OTP -> หน้าตั้งรหัสผ่าน
// selector อิง data-testid จาก DOM จริง (ตรวจเมื่อ 2026-10-26)

const { expect } = require('@playwright/test');

const REGISTER_URL =
  process.env.REGISTER_URL || 'https://portal.uat.gofive.co.th/Register/empeo';

class RegisterEmpeoPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;

    // ---- ฟอร์มลงทะเบียน ----
    this.thaiCompanyRadio = page.getByTestId('input_radio_registration_company_thai');
    this.otherCompanyRadio = page.getByTestId('input_radio_registration_company_others');
    this.taxIdInput = page.getByTestId('input_textfield_input_registration_tax_id');
    this.companyNameInput = page.getByTestId('input_textfield_input_register_company_name');
    this.companyTypeDropdown = page.getByTestId('dropdown_selection_registration_company_type');
    this.userAmountDropdown = page.getByTestId('dropdown_selection_registration_user_amount');
    this.dropdownItems = page.locator('go5-dropdown-item');
    this.emailInput = page.getByTestId('input_textfield_input_registration_email');
    this.firstNameInput = page.getByTestId('input_textfield_input_register_first_name');
    this.lastNameInput = page.getByTestId('input_textfield_input_register_last_name');
    // ช่องเบอร์เป็น ngx-intl-tel-input — input จริงไม่มี data-testid ใช้ id แทน
    this.phoneInput = page.locator('#phone');
    this.consentCheckbox = page.getByTestId('input_checkbox_registration_checkbox');
    this.submitButton = page.getByTestId('button_submit_registration_try_for_free');

    // ---- โค้ดส่วนลด ----
    this.couponToggle = page.getByText('ใช้โค้ดส่วนลด', { exact: true });
    this.couponInput = page.getByTestId('input_text_registration_coupon_code');
    this.couponApplyButton = page.getByTestId('input_button_registration_btn_apply');
    // เมื่อใช้โค้ดสำเร็จ ช่องกรอกจะถูกแทนด้วย chip ชื่อโค้ด + ปุ่ม X
    this.couponChip = page.locator('.form-coupon-code').filter({ has: page.locator('.cursor-icon-close') });
    this.couponRemoveButton = page.locator('.form-coupon-code .cursor-icon-close');

    // ---- modal OTP ----
    this.otpModalTitle = page.getByText('กรุณาตรวจสอบข้อความ', { exact: true });
    this.otpDigits = page.locator('input.otp-input');
    this.otpVerifyButton = page.getByTestId('button_button_registration_verify');
    this.otpResendButton = page.getByTestId('button_button_registration_otp_resend');
    this.otpRefText = page.getByText(/ref:\s*\d+/);
    this.otpCountdownText = page.getByText('รับ OTP ใหม่อีกครั้งได้ใน');

    // ---- หน้าตั้งรหัสผ่าน ----
    this.passwordInput = page.getByTestId('input_textfield_input_input_password_crate_password_password');
    this.confirmPasswordInput = page.getByTestId(
      'input_textfield_input_input_password_crate_password_confirm_password'
    );
    this.setPasswordButton = page.getByTestId('button_button_create_password_btn_next');
  }

  async goto() {
    await this.page.goto(REGISTER_URL);
    await expect(this.submitButton).toBeVisible();
  }

  async chooseCompanyCategory(category) {
    const radio = category === 'อื่นๆ' ? this.otherCompanyRadio : this.thaiCompanyRadio;
    await radio.click();
  }

  async fillCompanyName(name) {
    await this.companyNameInput.fill(name);
  }

  /** ช่องเลขผู้เสียภาษีต้องเลือกจาก dropdown ที่ค้นจาก API — พิมพ์ทีละตัวเพื่อให้ search ทำงาน */
  async searchAndPickTaxCompany(keyword) {
    await this.taxIdInput.pressSequentially(keyword, { delay: 80 });
    await this.dropdownItems.first().click();
  }

  async selectDropdown(dropdown, optionText) {
    await dropdown.click();
    // ต้อง exact ไม่งั้น "1-20" จะไปชนกับ "101-200"
    await this.dropdownItems.getByText(optionText, { exact: true }).click();
  }

  async selectCompanyType(optionText) {
    await this.selectDropdown(this.companyTypeDropdown, optionText);
  }

  async selectUserAmount(optionText) {
    await this.selectDropdown(this.userAmountDropdown, optionText);
  }

  async fillContact({ email, firstName, lastName, phone }) {
    if (email !== undefined) await this.emailInput.fill(email);
    if (firstName !== undefined) await this.firstNameInput.fill(firstName);
    if (lastName !== undefined) await this.lastNameInput.fill(lastName);
    if (phone !== undefined) await this.phoneInput.fill(phone);
  }

  async acceptConsent() {
    await this.consentCheckbox.check();
  }

  async submit() {
    await this.submitButton.click();
  }

  async applyCoupon(code) {
    if (!(await this.couponInput.isVisible())) await this.couponToggle.click();
    await this.couponInput.fill(code);
    await this.couponApplyButton.click();
  }

  async removeCoupon() {
    await this.couponRemoveButton.click();
  }

  /**
   * error ใต้ช่องกรอก — มีทั้ง .e-error (ฟอร์มเก่า), .go5-error-message (go5 component)
   * และ .duplicateCompanyDetail (กรณีเลือกบริษัทที่มีบัญชีอยู่แล้ว)
   */
  fieldError(message) {
    return this.page
      .locator('.e-error, .go5-error-message, .duplicateCompanyDetail')
      .filter({ hasText: message });
  }

  async enterOtp(code) {
    await this.otpDigits.first().click();
    await this.otpDigits.first().pressSequentially(code);
  }

  async otpValue() {
    return this.otpDigits.evaluateAll((els) => els.map((e) => e.value).join(''));
  }

  async verifyOtp() {
    await this.otpVerifyButton.click();
  }

  async setPassword(password, confirmPassword = password) {
    await this.passwordInput.fill(password);
    await this.confirmPasswordInput.fill(confirmPassword);
  }
}

module.exports = { RegisterEmpeoPage, REGISTER_URL };
