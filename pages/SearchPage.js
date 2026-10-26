// Page Object Model ตัวอย่าง
// แนวทาง: 1 ไฟล์ต่อ 1 หน้า/1 component เก็บ selector + action ไว้ที่นี่
// ไม่ควรเขียน selector ดิบๆ ปนอยู่ใน step definitions

class SearchPage {
  /** @param {import('@playwright/test').Page} page */
  constructor(page) {
    this.page = page;
    this.searchBox = page.locator('textarea[name="q"], input[name="q"]');
    this.results = page.locator('#search, [data-testid="search-results"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(keyword) {
    await this.searchBox.fill(keyword);
    await this.searchBox.press('Enter');
  }

  async resultCount() {
    return this.results.locator('a').count();
  }
}

module.exports = { SearchPage };
