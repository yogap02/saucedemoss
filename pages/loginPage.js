import { expect } from '@playwright/test';

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.header = page.locator('div[class="login_logo"]');
    this.headerTitle = 'Swag Labs'
  }

  async goto() {
    await this.page.goto('/');
    await this.waitLoading();
    const headerText = await this.getHeaderText();
    expect(headerText).toBe(this.headerTitle);
  }

  async waitLoading() {
    return this.header.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getHeaderText() {
    return this.header.textContent();
  }
}

module.exports = LoginPage;