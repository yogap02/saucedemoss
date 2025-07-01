import { test, expect } from '@playwright/test';
const LoginPage = require('../../pages/loginPage');

test('[TESTID] User able to checkout a product', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
});
