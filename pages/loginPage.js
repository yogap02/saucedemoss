import { test, expect } from '@playwright/test';

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    
    this.headerTitle = 'Swag Labs'
    this.inventoryURL = 'https://www.saucedemo.com/inventory.html';

    this.header = page.locator('div[class="login_logo"]');
    this.loginButton = page.locator('input[data-test="login-button"]');
    this.usernameInput = page.locator('input[data-test="username"]');
    this.passwordInput = page.locator('input[data-test="password"]');
  }

  async goto() {
    await this.page.goto('/');
    await this.waitLoading();
    const headerText = await this.getHeaderText();
    let assetMessage = `Header text should be "${this.headerTitle}" but got "${headerText}"`;
    await test.step(assetMessage, async () => {
      expect(headerText).toBe(this.headerTitle, assetMessage);
    });
  }

  async login(username, password) {
    await this.usernameInput.fill(username);
    let assertMessage = `Username correctly filled: ${username}`;
    await test.step(assertMessage, async () => {
      expect(this.usernameInput).toHaveValue(username, assertMessage);
    });

    await this.passwordInput.fill(password);
    assertMessage = `Password correctly filled: ${password.replace(/./g, '*')}`;
    await test.step(assertMessage, async () => {
      expect(this.passwordInput).toHaveValue(password, assertMessage);
    });

    await this.loginButton.click();
    assertMessage = `Should navigate to ${this.inventoryURL} after login`
    await test.step(assertMessage, async () => {
      expect(this.page).toHaveURL(this.inventoryURL, assertMessage);
    });
  }

  async waitLoading() {
    return this.header.waitFor({ state: 'visible', timeout: 10000 });
  }

  async getHeaderText() {
    return this.header.textContent();
  }
}

module.exports = LoginPage;